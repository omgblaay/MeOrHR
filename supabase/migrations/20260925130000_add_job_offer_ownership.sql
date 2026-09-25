alter table public.job_offers
  add column created_by uuid references auth.users(id) on delete set null;

create index job_offers_created_by_idx
  on public.job_offers(created_by);

drop policy if exists "Authenticated users can create job offers"
  on public.job_offers;
drop policy if exists "Authenticated users can update job offers"
  on public.job_offers;
drop policy if exists "Authenticated users can delete job offers"
  on public.job_offers;

create policy "Users can create their own job offers"
on public.job_offers
for insert
to authenticated
with check ((select auth.uid()) = created_by);

create policy "Users can update their own job offers"
on public.job_offers
for update
to authenticated
using ((select auth.uid()) = created_by)
with check ((select auth.uid()) = created_by);

create policy "Users can delete their own job offers"
on public.job_offers
for delete
to authenticated
using ((select auth.uid()) = created_by);

drop policy if exists "Authenticated users can create job offer sources"
  on public.job_offer_sources;
drop policy if exists "Authenticated users can update job offer sources"
  on public.job_offer_sources;
drop policy if exists "Authenticated users can delete job offer sources"
  on public.job_offer_sources;

create policy "Offer owners can create job offer sources"
on public.job_offer_sources
for insert
to authenticated
with check (
  exists (
    select 1
    from public.job_offers
    where job_offers.id = job_offer_sources.job_offer_id
      and job_offers.created_by = (select auth.uid())
  )
);

create policy "Offer owners can update job offer sources"
on public.job_offer_sources
for update
to authenticated
using (
  exists (
    select 1
    from public.job_offers
    where job_offers.id = job_offer_sources.job_offer_id
      and job_offers.created_by = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.job_offers
    where job_offers.id = job_offer_sources.job_offer_id
      and job_offers.created_by = (select auth.uid())
  )
);

create policy "Offer owners can delete job offer sources"
on public.job_offer_sources
for delete
to authenticated
using (
  exists (
    select 1
    from public.job_offers
    where job_offers.id = job_offer_sources.job_offer_id
      and job_offers.created_by = (select auth.uid())
  )
);
