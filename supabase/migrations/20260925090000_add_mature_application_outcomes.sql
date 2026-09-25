alter table public.job_offers
  add column applicants_older_than_30_days integer not null default 0,
  add column no_reply_after_30_days_applicants integer not null default 0;

alter table public.job_offers
  add constraint job_offers_applicants_older_than_30_days_valid
    check (
      applicants_older_than_30_days between 0 and confirmed_applicants
    ),
  add constraint job_offers_no_reply_after_30_days_valid
    check (
      no_reply_after_30_days_applicants between 0
      and applicants_older_than_30_days
    );

-- Seed only offers old enough to have mature applications. Recent offers stay
-- at zero until real application events are aggregated.
update public.job_offers
set
  applicants_older_than_30_days = confirmed_applicants,
  no_reply_after_30_days_applicants = greatest(
    0,
    confirmed_applicants - replied_applicants
  )
where published_at <= now() - interval '30 days';
