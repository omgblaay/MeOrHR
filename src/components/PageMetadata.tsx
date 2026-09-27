import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import type { JobOffer } from "../types/job";

const siteName = "MeOrHR";
const siteUrl = "https://meorhr.com";
const defaultDescription =
  "Discover community-posted technology jobs, compare real hiring signals, and track what happens after you apply.";

type Metadata = {
  title: string;
  description: string;
  canonicalPath: string;
  robots?: string;
  type?: "website" | "article";
};

export default function PageMetadata({ jobOffers }: { jobOffers: JobOffer[] }) {
  const { pathname } = useLocation();
  const metadata = useMemo(
    () => getMetadata(pathname, jobOffers),
    [jobOffers, pathname],
  );

  useEffect(() => {
    const canonicalUrl = `${siteUrl}${metadata.canonicalPath}`;

    document.title = metadata.title;
    setMeta("name", "description", metadata.description);
    setMeta("name", "robots", metadata.robots ?? "index, follow");
    setMeta("name", "application-name", siteName);
    setMeta("name", "theme-color", "#173f35");
    setMeta("property", "og:title", metadata.title);
    setMeta("property", "og:description", metadata.description);
    setMeta("property", "og:type", metadata.type ?? "website");
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:site_name", siteName);
    setMeta("property", "og:locale", "en_US");
    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", metadata.title);
    setMeta("name", "twitter:description", metadata.description);
    setCanonicalUrl(canonicalUrl);
  }, [metadata]);

  return null;
}

function getMetadata(pathname: string, jobOffers: JobOffer[]): Metadata {
  if (pathname === "/") {
    return {
      title: "MeOrHR | Community Job Offers and Hiring Signals",
      description: defaultDescription,
      canonicalPath: "/",
    };
  }

  if (pathname === "/explore") {
    return {
      title: "Explore Technology Job Offers | MeOrHR",
      description:
        "Search technology job offers by role, company, location, work model, category, technology, or original source link.",
      canonicalPath: "/explore",
    };
  }

  const jobRoute = pathname.match(/^\/jobs\/(\d+)(\/edit)?$/);
  if (jobRoute) {
    const job = jobOffers.find((offer) => offer.id === Number(jobRoute[1]));
    const isEditing = Boolean(jobRoute[2]);

    if (isEditing) {
      return {
        title: `Edit Job Offer | ${siteName}`,
        description: "Update the details and source of your published job offer.",
        canonicalPath: `/jobs/${jobRoute[1]}`,
        robots: "noindex, nofollow",
      };
    }

    if (job) {
      return {
        title: `${job.title} at ${job.company} | ${siteName}`,
        description: `${job.title} at ${job.company} in ${job.location}. ${job.workplace}, ${job.type}. Review applicant activity and community hiring signals.`,
        canonicalPath: `/jobs/${job.id}`,
        type: "article",
      };
    }

    return {
      title: `Job Offer | ${siteName}`,
      description:
        "Review this job offer, its original source, and community hiring signals.",
      canonicalPath: pathname,
    };
  }

  const routes: Record<string, Metadata> = {
    "/login": {
      title: `Log In | ${siteName}`,
      description: "Log in to track applications and contribute to MeOrHR.",
      canonicalPath: "/login",
      robots: "noindex, nofollow",
    },
    "/offers/new": {
      title: `Add a Job Offer | ${siteName}`,
      description: "Share a job offer with the MeOrHR community.",
      canonicalPath: "/offers/new",
      robots: "noindex, nofollow",
    },
    "/applications": {
      title: `My Application Board | ${siteName}`,
      description: "Manage your private job application stages and activity.",
      canonicalPath: "/applications",
      robots: "noindex, nofollow",
    },
    "/my-offers": {
      title: `My Published Job Offers | ${siteName}`,
      description: "Review and edit the job offers you published.",
      canonicalPath: "/my-offers",
      robots: "noindex, nofollow",
    },
    "/settings": {
      title: `Profile Settings | ${siteName}`,
      description: "Manage your MeOrHR profile settings.",
      canonicalPath: "/settings",
      robots: "noindex, nofollow",
    },
    "/terms": {
      title: `Terms of Service | ${siteName}`,
      description: "Read the MeOrHR terms of service.",
      canonicalPath: "/terms",
    },
    "/privacy": {
      title: `Privacy Policy | ${siteName}`,
      description: "Read how MeOrHR handles account and application data.",
      canonicalPath: "/privacy",
    },
  };

  return (
    routes[pathname] ?? {
      title: `Page Not Found | ${siteName}`,
      description: defaultDescription,
      canonicalPath: pathname,
      robots: "noindex, nofollow",
    }
  );
}

function setMeta(attribute: "name" | "property", key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.append(element);
  }

  element.content = value;
}

function setCanonicalUrl(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.append(element);
  }

  element.href = url;
}
