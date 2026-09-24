import { supabase } from "./supabase";

export function recordSourceClick(sourceId: number) {
  void supabase.rpc("record_job_offer_source_click", { source_id: sourceId });
}
