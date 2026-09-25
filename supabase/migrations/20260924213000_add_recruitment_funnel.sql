alter table public.job_offers
  add column offer_applicants integer not null default 0,
  add column median_days_to_reply smallint,
  add column median_days_reply_to_interview smallint,
  add column median_days_interview_to_offer smallint;

alter table public.job_offers
  add constraint job_offers_offer_applicants_valid
    check (offer_applicants between 0 and next_interview_applicants),
  add constraint job_offers_median_days_to_reply_valid
    check (median_days_to_reply is null or median_days_to_reply >= 0),
  add constraint job_offers_median_days_reply_to_interview_valid
    check (
      median_days_reply_to_interview is null
      or median_days_reply_to_interview >= 0
    ),
  add constraint job_offers_median_days_interview_to_offer_valid
    check (
      median_days_interview_to_offer is null
      or median_days_interview_to_offer >= 0
    );

update public.job_offers
set
  offer_applicants = case
    when next_interview_applicants = 0 then 0
    else least(
      next_interview_applicants,
      greatest(1, floor(next_interview_applicants * (0.15 + random() * 0.25))::integer)
    )
  end,
  median_days_to_reply = case
    when replied_applicants = 0 then null
    else 2 + floor(random() * 11)::smallint
  end,
  median_days_reply_to_interview = case
    when next_interview_applicants = 0 then null
    else 2 + floor(random() * 9)::smallint
  end,
  median_days_interview_to_offer = case
    when next_interview_applicants = 0 then null
    else 2 + floor(random() * 8)::smallint
  end;
