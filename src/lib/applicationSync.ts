import type { ApplicationStatus } from "./applicationStatus";
import { supabase } from "./supabase";

export async function loadProfileCountry(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("country_code")
    .eq("id", userId)
    .maybeSingle<{ country_code: string | null }>();

  return data?.country_code ?? null;
}

export async function syncApplicationRecord({
  userId,
  jobId,
  status,
  countryCode,
  appliedAt,
}: {
  userId: string;
  jobId: number;
  status: ApplicationStatus;
  countryCode: string;
  appliedAt?: string | null;
}) {
  return supabase.from("job_applications").upsert(
    {
      user_id: userId,
      job_offer_id: jobId,
      status,
      country_code: countryCode,
      applied_at: appliedAt ?? null,
    },
    { onConflict: "job_offer_id,user_id" },
  );
}

export async function removeApplicationRecord(userId: string, jobId: number) {
  return supabase
    .from("job_applications")
    .delete()
    .eq("user_id", userId)
    .eq("job_offer_id", jobId);
}
