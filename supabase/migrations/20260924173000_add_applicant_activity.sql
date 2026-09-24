alter table public.job_offers
  add column replied_applicants integer not null default 0,
  add column next_interview_applicants integer not null default 0,
  add column contacted_hr_applicants integer not null default 0,
  add column linkedin_connection_applicants integer not null default 0,
  add column additional_email_applicants integer not null default 0;

alter table public.job_offers
  add constraint job_offers_replied_applicants_valid
    check (replied_applicants between 0 and applicants),
  add constraint job_offers_next_interview_applicants_valid
    check (next_interview_applicants between 0 and replied_applicants),
  add constraint job_offers_contacted_hr_applicants_valid
    check (contacted_hr_applicants between 0 and applicants),
  add constraint job_offers_linkedin_connection_applicants_valid
    check (linkedin_connection_applicants between 0 and applicants),
  add constraint job_offers_additional_email_applicants_valid
    check (additional_email_applicants between 0 and applicants);

with randomized as (
  select
    id,
    applicants,
    least(applicants, floor(applicants * (0.25 + random() * 0.35))::integer) as replied,
    least(applicants, floor(applicants * (0.12 + random() * 0.33))::integer) as contacted_hr,
    least(applicants, floor(applicants * (0.10 + random() * 0.25))::integer) as linkedin_connection,
    least(applicants, floor(applicants * (0.15 + random() * 0.25))::integer) as additional_email
  from public.job_offers
), activity as (
  select
    id,
    applicants,
    replied,
    least(replied, floor(replied * (0.25 + random() * 0.40))::integer) as next_interview,
    contacted_hr,
    linkedin_connection,
    additional_email
  from randomized
)
update public.job_offers as job
set
  replied_applicants = activity.replied,
  next_interview_applicants = activity.next_interview,
  contacted_hr_applicants = activity.contacted_hr,
  linkedin_connection_applicants = activity.linkedin_connection,
  additional_email_applicants = activity.additional_email,
  response_rate = case
    when activity.applicants = 0 then 0
    else round(activity.replied * 100.0 / activity.applicants)::smallint
  end
from activity
where job.id = activity.id;
