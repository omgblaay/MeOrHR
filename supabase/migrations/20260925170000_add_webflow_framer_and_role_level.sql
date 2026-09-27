alter table public.job_offers
  drop constraint if exists job_offers_category_check;

alter table public.job_offers
  drop constraint if exists job_offers_category_valid;

alter table public.job_offers
  add constraint job_offers_category_valid
  check (
    category in (
      'AI/ML',
      'JavaScript',
      'HTML',
      'PHP',
      'Ruby',
      'Python',
      'Java',
      '.NET',
      'Scala',
      'C',
      'Mobile',
      'Testing',
      'DevOps',
      'Admin',
      'UX/UI',
      'PM',
      'Game',
      'Analytics',
      'Security',
      'Data',
      'Go',
      'Webflow',
      'Framer',
      'Support',
      'ERP',
      'Architecture',
      'Other'
    )
  );

alter table public.job_offers
  add column if not exists role_level text;

alter table public.job_offers
  drop constraint if exists job_offers_role_level_valid;

alter table public.job_offers
  add constraint job_offers_role_level_valid
  check (
    role_level is null
    or role_level in (
      'Intern',
      'Junior',
      'Mid',
      'Senior',
      'Lead',
      'Principal',
      'Manager',
      'Director'
    )
  );
