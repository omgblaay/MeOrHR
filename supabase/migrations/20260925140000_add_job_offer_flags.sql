create table public.job_offer_flags (
  job_offer_id bigint not null references public.job_offers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  flag text not null check (flag in ('talent_pool', 'gone')),
  created_at timestamptz not null default now(),
  primary key (job_offer_id, user_id, flag)
);

create index job_offer_flags_job_offer_id_flag_idx
  on public.job_offer_flags(job_offer_id, flag);

alter table public.job_offer_flags enable row level security;

create policy "Anyone can view job offer flags"
on public.job_offer_flags
for select
to anon, authenticated
using (true);

create policy "Users can add their own job offer flags"
on public.job_offer_flags
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can remove their own job offer flags"
on public.job_offer_flags
for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select on table public.job_offer_flags to anon;
grant select, insert, delete on table public.job_offer_flags to authenticated;
