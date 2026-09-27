import { supabase } from "./supabase";
import type {
  JobCategory,
  JobSource,
  RoleLevel,
} from "../types/job";

export type ImportedJobOffer = {
  title: string;
  company: string;
  companyCountryCode: string;
  companyLogoUrl: string;
  category: JobCategory;
  location: string;
  hiringRegions: string[];
  hiringCountryCodes: string[];
  workplace: "Remote" | "Hybrid" | "On-site";
  employmentType: "Full-time" | "Contract";
  roleLevel: RoleLevel | "";
  salary: string;
  tags: string[];
  sourcePlatform: JobSource;
  sourceUrl: string;
  publishedAt: string;
  description: string;
};

export async function importJobOffer(url: string): Promise<ImportedJobOffer> {
  const { data, error } = await supabase.functions.invoke("fetch-job-offer", {
    body: { url },
  });

  if (error) {
    const context = (error as { context?: unknown }).context;
    if (context instanceof Response) {
      const responseBody = (await context
        .clone()
        .json()
        .catch(() => null)) as { error?: string } | null;
      if (responseBody?.error) throw new Error(responseBody.error);
    }
    throw new Error(error.message || "Could not fetch this job offer.");
  }

  if (!data?.offer) {
    throw new Error("The page did not contain a recognizable job offer.");
  }

  return data.offer as ImportedJobOffer;
}
