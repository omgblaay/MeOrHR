alter table public.job_offers
  add column source_platform text not null default 'company_career_page';

alter table public.job_offers
  add constraint job_offers_source_platform_valid
    check (
      source_platform in (
        'linkedin',
        'indeed',
        'stepstone',
        'justjoinit',
        'nofluffjobs',
        'pracuj',
        'glassdoor',
        'xing',
        'welcome_to_the_jungle',
        'wellfound',
        'eures',
        'company_career_page',
        'other'
      )
    );

update public.job_offers
set source_platform = (array[
  'linkedin',
  'indeed',
  'stepstone',
  'justjoinit',
  'nofluffjobs',
  'pracuj',
  'glassdoor',
  'xing',
  'welcome_to_the_jungle',
  'wellfound',
  'eures',
  'company_career_page',
  'other'
])[1 + floor(random() * 13)::integer];
