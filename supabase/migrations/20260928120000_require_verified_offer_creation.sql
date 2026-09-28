drop policy if exists "Users can create their own job offers"
  on public.job_offers;

revoke insert on table public.job_offers from authenticated;
revoke usage, select on sequence public.job_offers_id_seq from authenticated;
