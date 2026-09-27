const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_RESPONSE_BYTES = 2_000_000;
const FETCH_TIMEOUT_MS = 12_000;

const sourceByHost: Array<[string, string]> = [
  ["linkedin.com", "linkedin"],
  ["indeed.com", "indeed"],
  ["stepstone.", "stepstone"],
  ["justjoin.it", "justjoinit"],
  ["nofluffjobs.com", "nofluffjobs"],
  ["pracuj.pl", "pracuj"],
  ["glassdoor.", "glassdoor"],
  ["xing.com", "xing"],
  ["welcometothejungle.com", "welcome_to_the_jungle"],
  ["wellfound.com", "wellfound"],
  ["eures.europa.eu", "eures"],
];

const categorySignals: Array<[string, string[]]> = [
  ["AI/ML", ["machine learning", "artificial intelligence", "pytorch", "tensorflow", "llm"]],
  ["JavaScript", ["javascript", "typescript", "react", "vue", "angular", "node.js", "nodejs"]],
  ["Python", ["python", "django", "flask", "fastapi"]],
  ["Java", ["java", "spring boot", "spring"]],
  [".NET", [".net", "c#", "asp.net"]],
  ["PHP", ["php", "laravel", "symfony"]],
  ["Ruby", ["ruby", "rails"]],
  ["Go", ["golang", "go developer"]],
  ["Mobile", ["ios", "android", "swift", "kotlin", "react native", "flutter"]],
  ["DevOps", ["devops", "kubernetes", "terraform", "aws", "azure", "gcp"]],
  ["Data", ["data engineer", "data scientist", "snowflake", "databricks"]],
  ["Security", ["security", "cybersecurity", "soc analyst"]],
  ["Testing", ["qa engineer", "quality assurance", "test automation", "playwright", "cypress"]],
  ["UX/UI", ["ux designer", "ui designer", "product designer", "figma"]],
  ["PM", ["product manager", "project manager", "product owner"]],
  ["Analytics", ["analyst", "analytics", "business intelligence", "power bi", "tableau"]],
  ["Support", ["customer support", "technical support", "customer success"]],
];

const technologySignals = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Java",
  "Kotlin",
  "Swift",
  "PHP",
  "Ruby",
  "Go",
  "C#",
  ".NET",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "Terraform",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "Figma",
  "Webflow",
  "Framer",
];

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const { url } = await request.json();
    const requestedUrl = parsePublicUrl(url);
    await assertPublicHostname(requestedUrl);
    const { html, finalUrl } = await fetchHtml(requestedUrl);
    const jobPosting = findJobPosting(html);
    const metadata = readMetadata(html);
    const offer = buildOffer(jobPosting, metadata, finalUrl);

    if (!offer.title && !offer.company && !offer.description) {
      return json(
        { error: "The page did not expose recognizable job offer details." },
        422,
      );
    }

    return json({ offer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not fetch this job offer.";
    return json({ error: message }, 400);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function parsePublicUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Enter a job offer URL.");
  }

  const url = new URL(value.trim());
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  const hostname = url.hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "");
  if (
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    hostname === "0.0.0.0" ||
    hostname === "::1" ||
    isPrivateIpv4(hostname) ||
    isPrivateIpv6(hostname)
  ) {
    throw new Error("Private network URLs are not supported.");
  }

  return url;
}

async function assertPublicHostname(url: URL) {
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (isPrivateIpv4(hostname) || isPrivateIpv6(hostname)) {
    throw new Error("Private network URLs are not supported.");
  }

  const resolved = await Promise.allSettled([
    Deno.resolveDns(hostname, "A"),
    Deno.resolveDns(hostname, "AAAA"),
  ]);
  const addresses = resolved.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  if (
    addresses.some(
      (address) => isPrivateIpv4(address) || isPrivateIpv6(address),
    )
  ) {
    throw new Error("Private network URLs are not supported.");
  }
}

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  return (
    parts[0] === 0 ||
    parts[0] === 10 ||
    parts[0] === 127 ||
    (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) ||
    (parts[0] === 169 && parts[1] === 254) ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    (parts[0] === 198 && (parts[1] === 18 || parts[1] === 19)) ||
    parts[0] >= 224
  );
}

function isPrivateIpv6(hostname: string) {
  const address = hostname.toLowerCase();
  if (!address.includes(":")) return false;
  if (address === "::" || address === "::1") return true;
  if (address.startsWith("fc") || address.startsWith("fd")) return true;
  if (/^fe[89ab]/.test(address)) return true;

  const mappedIpv4 = address.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  return mappedIpv4 ? isPrivateIpv4(mappedIpv4) : false;
}

async function fetchHtml(initialUrl: URL) {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= 4; redirectCount += 1) {
    await assertPublicHostname(currentUrl);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const response = await fetch(currentUrl, {
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MeorHR/1.0; +https://meorhr.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    }).finally(() => clearTimeout(timeout));

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("The job page returned an invalid redirect.");
      currentUrl = parsePublicUrl(new URL(location, currentUrl).toString());
      continue;
    }

    if (!response.ok) {
      throw new Error(`The job page returned HTTP ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error("The URL does not point to an HTML page.");
    }

    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_RESPONSE_BYTES) {
      throw new Error("The job page is too large to import.");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("The job page returned an empty response.");

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw new Error("The job page is too large to import.");
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    return { html: new TextDecoder().decode(bytes), finalUrl: currentUrl };
  }

  throw new Error("The job page redirected too many times.");
}

function findJobPosting(html: string): Record<string, unknown> | null {
  const scripts = html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );

  for (const match of scripts) {
    try {
      const source = match[1].trim().replace(/^<!--|-->$/g, "");
      let parsed: unknown;
      try {
        parsed = JSON.parse(source);
      } catch {
        parsed = JSON.parse(decodeEntities(source));
      }
      const candidates = Array.isArray(parsed)
        ? parsed
        : Array.isArray(objectValue(parsed)?.["@graph"])
          ? (objectValue(parsed)?.["@graph"] as unknown[])
          : [parsed];
      const posting = candidates.find((candidate) => {
        const type = objectValue(candidate)?.["@type"];
        return type === "JobPosting" || (Array.isArray(type) && type.includes("JobPosting"));
      });
      if (posting) return objectValue(posting);
    } catch {
      // Continue through malformed JSON-LD blocks; many sites emit more than one.
    }
  }

  return null;
}

function readMetadata(html: string) {
  const metadata = new Map<string, string>();
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attributes = Object.fromEntries(
      [...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map((match) => [
        match[1].toLowerCase(),
        decodeEntities(match[2]),
      ]),
    );
    const key = attributes.property ?? attributes.name;
    if (key && attributes.content) metadata.set(key.toLowerCase(), attributes.content);
  }

  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (title) metadata.set("title", stripHtml(title));
  return metadata;
}

function buildOffer(
  posting: Record<string, unknown> | null,
  metadata: Map<string, string>,
  sourceUrl: URL,
) {
  const title = stringValue(posting?.title) || metadata.get("og:title") || metadata.get("title") || "";
  const organization = objectValue(posting?.hiringOrganization);
  const company = stringValue(organization?.name) || metadata.get("og:site_name") || "";
  const description = stripHtml(
    stringValue(posting?.description) || metadata.get("og:description") || metadata.get("description") || "",
  );
  const location = readLocation(posting);
  const workplace = readWorkplace(posting, `${title} ${description}`);
  const employmentType = readEmploymentType(posting?.employmentType);
  const salary = readSalary(posting?.baseSalary);
  const suppliedSkills = [posting?.skills, posting?.qualifications, posting?.keywords]
    .flatMap(stringList)
    .flatMap((value) => value.split(/[,;|]/))
    .map((value) => value.trim())
    .filter(Boolean);
  const searchable = `${title} ${description} ${suppliedSkills.join(" ")}`.toLowerCase();
  const detectedSkills = technologySignals.filter((technology) =>
    searchable.includes(technology.toLowerCase()),
  );
  const tags = [...new Set([...suppliedSkills, ...detectedSkills])].slice(0, 12);

  return {
    title,
    company,
    companyCountryCode: "",
    companyLogoUrl: absoluteUrl(stringValue(organization?.logo) || metadata.get("og:image") || "", sourceUrl),
    category: inferCategory(searchable),
    location,
    hiringRegions: [],
    hiringCountryCodes: [],
    workplace,
    employmentType,
    roleLevel: inferRoleLevel(title),
    salary,
    tags,
    sourcePlatform: inferSource(sourceUrl.hostname),
    sourceUrl: sourceUrl.toString(),
    publishedAt: dateValue(posting?.datePosted),
    description,
  };
}

function readLocation(posting: Record<string, unknown> | null) {
  const rawLocations = Array.isArray(posting?.jobLocation)
    ? posting.jobLocation
    : posting?.jobLocation
      ? [posting.jobLocation]
      : [];
  const labels = rawLocations.flatMap((location) => {
    const address = objectValue(objectValue(location)?.address);
    const parts = [address?.addressLocality, address?.addressRegion, address?.addressCountry]
      .map(stringValue)
      .filter(Boolean);
    return parts.length ? [parts.join(", ")] : [];
  });
  return labels.join(" / ") || (stringValue(posting?.jobLocationType).includes("TELECOMMUTE") ? "Remote" : "");
}

function readWorkplace(posting: Record<string, unknown> | null, searchable: string) {
  if (stringValue(posting?.jobLocationType).toUpperCase().includes("TELECOMMUTE")) return "Remote";
  if (/\bhybrid\b/i.test(searchable)) return "Hybrid";
  if (/\bremote\b/i.test(searchable)) return "Remote";
  return "On-site";
}

function readEmploymentType(value: unknown) {
  const text = stringList(value).join(" ").toUpperCase();
  return text.includes("CONTRACT") || text.includes("TEMPORARY") ? "Contract" : "Full-time";
}

function readSalary(value: unknown) {
  const salary = objectValue(value);
  if (!salary) return "";
  const currency = stringValue(salary.currency);
  const salaryValue = objectValue(salary.value);
  const min = stringValue(salaryValue?.minValue ?? salary.value);
  const max = stringValue(salaryValue?.maxValue);
  const unit = stringValue(salaryValue?.unitText);
  return [currency, min && max ? `${min}-${max}` : min || max, unit && `per ${unit.toLowerCase()}`]
    .filter(Boolean)
    .join(" ");
}

function inferCategory(searchable: string) {
  return categorySignals.find(([, signals]) => signals.some((signal) => searchable.includes(signal)))?.[0] ?? "Other";
}

function inferRoleLevel(title: string) {
  const value = title.toLowerCase();
  if (/\bintern(ship)?\b/.test(value)) return "Intern";
  if (/\bjunior\b|\bjr\.?\b/.test(value)) return "Junior";
  if (/\bprincipal\b/.test(value)) return "Principal";
  if (/\bdirector\b|\bhead of\b/.test(value)) return "Director";
  if (/\bmanager\b/.test(value)) return "Manager";
  if (/\blead\b/.test(value)) return "Lead";
  if (/\bsenior\b|\bsr\.?\b/.test(value)) return "Senior";
  if (/\bmid\b|\bmiddle\b/.test(value)) return "Mid";
  return "";
}

function inferSource(hostname: string) {
  const normalized = hostname.toLowerCase();
  return sourceByHost.find(([host]) => normalized.includes(host))?.[1] ?? "company_career_page";
}

function absoluteUrl(value: string, baseUrl: URL) {
  if (!value) return "";
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return "";
  }
}

function dateValue(value: unknown) {
  const raw = stringValue(value);
  const date = raw ? new Date(raw) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : "";
}

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function stringValue(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(stringValue).filter(Boolean);
  const single = stringValue(value);
  return single ? [single] : [];
}

function stripHtml(value: string) {
  return decodeEntities(
    value
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6])>/gi, "\n\n")
      .replace(/<li\b[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function decodeEntities(value: string) {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity: string) => {
    if (entity.startsWith("#x")) return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    if (entity.startsWith("#")) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    return named[entity.toLowerCase()] ?? `&${entity};`;
  });
}
