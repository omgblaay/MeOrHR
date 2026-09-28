grant insert on table public.job_offers to authenticated;
grant usage, select on sequence public.job_offers_id_seq to authenticated;

create policy "Users can create their own job offers"
on public.job_offers
for insert
to authenticated
with check ((select auth.uid()) = created_by);
