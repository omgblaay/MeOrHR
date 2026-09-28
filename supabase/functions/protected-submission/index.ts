import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const allowedActions = new Set(["add_offer", "post_comment"]);
const allowedOfferFields = [
  "title",
  "company",
  "company_country_code",
  "company_logo_url",
  "category",
  "location",
  "hiring_regions",
  "hiring_country_codes",
  "workplace",
  "employment_type",
  "role_level",
  "salary",
  "tags",
  "description",
  "source_url",
  "source_platform",
  "published_at",
] as const;
const allowedSourceFields = [
  "platform",
  "url",
  "published_at",
  "first_seen_at",
  "last_seen_at",
] as const;

type RecaptchaResponse = {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const user = await getUser(request);
    const { action, token, payload } = await request.json();

    if (
      typeof action !== "string" ||
      !allowedActions.has(action) ||
      typeof token !== "string" ||
      !token
    ) {
      return json({ error: "Invalid security check request." }, 400);
    }

    await verifyRecaptcha(token, action);

    if (action === "post_comment") {
      return json({ verified: true });
    }

    const offerId = await createOffer(payload, user.id);
    return json({ verified: true, offerId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The security check failed.";
    const status = message === "Authentication required." ? 401 : 400;
    return json({ error: message }, status);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getUser(request: Request) {
  const authorization = request.headers.get("Authorization");
  if (!authorization) throw new Error("Authentication required.");

  const supabase = createClient(
    requireEnvironmentVariable("SUPABASE_URL"),
    requireEnvironmentVariable("SUPABASE_ANON_KEY"),
    { global: { headers: { Authorization: authorization } } },
  );
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) throw new Error("Authentication required.");
  return data.user;
}

async function verifyRecaptcha(token: string, expectedAction: string) {
  const form = new URLSearchParams({
    secret: requireEnvironmentVariable("RECAPTCHA_SECRET_KEY"),
    response: token,
  });
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });

  if (!response.ok) throw new Error("The security check is unavailable.");

  const result = (await response.json()) as RecaptchaResponse;
  const minimumScore = Number(Deno.env.get("RECAPTCHA_MIN_SCORE") ?? "0.5");
  const allowedHostnames = (Deno.env.get("RECAPTCHA_ALLOWED_HOSTNAMES") ?? "")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);
  const hostnameAllowed =
    allowedHostnames.length === 0 ||
    (typeof result.hostname === "string" &&
      allowedHostnames.includes(result.hostname.toLowerCase()));

  if (
    !result.success ||
    result.action !== expectedAction ||
    typeof result.score !== "number" ||
    result.score < minimumScore ||
    !hostnameAllowed
  ) {
    console.warn("reCAPTCHA rejected a submission", {
      action: expectedAction,
      returnedAction: result.action,
      score: result.score,
      hostname: result.hostname,
      errors: result["error-codes"],
    });
    throw new Error("The security check could not verify this submission.");
  }
}

async function createOffer(payload: unknown, userId: string) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Offer details are required.");
  }

  const { offer, source } = payload as {
    offer?: Record<string, unknown>;
    source?: Record<string, unknown>;
  };
  if (!offer || !source) throw new Error("Offer details are incomplete.");

  const admin = createClient(
    requireEnvironmentVariable("SUPABASE_URL"),
    requireEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY"),
  );
  const offerFields = pickFields(offer, allowedOfferFields);
  const sourceFields = pickFields(source, allowedSourceFields);
  const { data: createdOffer, error: offerError } = await admin
    .from("job_offers")
    .insert({ ...offerFields, created_by: userId })
    .select("id")
    .single();

  if (offerError || !createdOffer) {
    throw new Error(databaseErrorMessage(offerError));
  }

  const { error: sourceError } = await admin.from("job_offer_sources").insert({
    ...sourceFields,
    job_offer_id: createdOffer.id,
  });

  if (sourceError) {
    await admin.from("job_offers").delete().eq("id", createdOffer.id);
    throw new Error(databaseErrorMessage(sourceError));
  }

  return createdOffer.id as number;
}

function pickFields<const T extends readonly string[]>(
  input: Record<string, unknown>,
  fields: T,
) {
  return Object.fromEntries(
    fields
      .filter((field) => Object.hasOwn(input, field))
      .map((field) => [field, input[field]]),
  );
}

function databaseErrorMessage(error: { code?: string; message?: string } | null) {
  if (error?.code === "23505") {
    return "This source URL is already attached to an offer.";
  }
  return error?.message || "Could not create the offer.";
}

function requireEnvironmentVariable(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}
