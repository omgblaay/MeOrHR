alter table public.profiles
  add column country_code text;

alter table public.profiles
  add constraint profiles_country_code_valid
    check (country_code is null or country_code ~ '^[A-Z]{2}$');

alter table public.job_offers
  add column company_country_code text,
  add column hiring_regions text[] not null default '{}',
  add column hiring_country_codes text[] not null default '{}';

alter table public.job_offers
  add constraint job_offers_company_country_code_valid
    check (
      company_country_code is null
      or company_country_code ~ '^[A-Z]{2}$'
    ),
  add constraint job_offers_hiring_regions_valid
    check (
      hiring_regions <@ array[
        'worldwide',
        'europe',
        'eu',
        'emea',
        'north_america',
        'united_states',
        'latam',
        'apac',
        'asia',
        'africa',
        'middle_east'
      ]::text[]
    ),
  add constraint job_offers_hiring_country_codes_valid
    check (
      cardinality(hiring_country_codes) = 0
      or array_to_string(hiring_country_codes, ',') ~ '^([A-Z]{2})(,[A-Z]{2})*$'
    );

create table public.job_applications (
  job_offer_id bigint not null references public.job_offers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (
    status in (
      'saved',
      'applied',
      'in_review',
      'interview',
      'offer',
      'rejected',
      'withdrawn'
    )
  ),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  applied_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (job_offer_id, user_id)
);

create index job_applications_job_offer_id_idx
  on public.job_applications(job_offer_id);

create trigger job_applications_set_updated_at
before update on public.job_applications
for each row
execute function public.set_updated_at();

alter table public.job_applications enable row level security;

create policy "Users can view their own applications"
on public.job_applications
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own applications"
on public.job_applications
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and country_code = (
    select profiles.country_code
    from public.profiles
    where profiles.id = (select auth.uid())
  )
);

create policy "Users can update their own applications"
on public.job_applications
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and country_code = (
    select profiles.country_code
    from public.profiles
    where profiles.id = (select auth.uid())
  )
);

create policy "Users can remove their own applications"
on public.job_applications
for delete
to authenticated
using ((select auth.uid()) = user_id);

grant select, insert, update, delete on table public.job_applications
  to authenticated;

create or replace function public.get_job_offer_applicant_countries()
returns table (
  job_offer_id bigint,
  country_code text,
  applicant_count bigint,
  percentage numeric
)
language sql
security definer
stable
set search_path = ''
as $$
  with country_counts as (
    select
      applications.job_offer_id,
      applications.country_code,
      count(*) as applicant_count
    from public.job_applications as applications
    where applications.status <> 'saved'
    group by applications.job_offer_id, applications.country_code
  )
  select
    country_counts.job_offer_id,
    country_counts.country_code,
    country_counts.applicant_count,
    round(
      country_counts.applicant_count * 100.0
      / sum(country_counts.applicant_count) over (
        partition by country_counts.job_offer_id
      )
    ) as percentage
  from country_counts
  order by country_counts.job_offer_id, country_counts.applicant_count desc;
$$;

revoke all on function public.get_job_offer_applicant_countries() from public;
grant execute on function public.get_job_offer_applicant_countries()
  to anon, authenticated;
