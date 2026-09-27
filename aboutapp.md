# MeOrHR

MeOrHR is a community-informed job board for discovering technology roles and understanding what happens after people apply. It combines conventional offer details with aggregated applicant activity, helping candidates compare opportunities using signals such as reply rates, interview progression, and follow-up actions.

## Product goals

- Make job offers easy to scan, search, and compare.
- Show transparent applicant activity alongside each offer.
- Let signed-in users privately track their own application journey.
- Preserve the original source of every imported offer.
- Grow into a shared source of practical hiring-process insights.

## Current experience

### Browse offers

The homepage shows the three most recently published job offers. A separate
Explore page provides the full Supabase-backed offer list, with search,
category filtering, pagination, and a choice of 5, 10, or 25 offers per page.
Users can search across titles, companies, locations, work arrangements,
categories, role levels, employment types, and technology tags.

A horizontally scrollable job-type selector provides filters for categories
including JavaScript, AI/ML, Python, DevOps, Data, UX/UI, Webflow, Framer, and
others. Edge controls appear when more categories are available outside the
visible area.

Each connected offer row displays:

- Company, title, company country, location, and work arrangement
- Employment type, role level, and salary, when provided
- Job category and technology tags
- Eligible hiring regions and countries
- Applicant count and response-rate progress
- Source platform and relative publication time

### Review an offer

Every offer has a detail page containing its company and source, role metadata,
role level, compensation, tags, company country, eligible hiring locations,
publication date, and last update time. A link opens the original listing on
its source platform.

The public recruitment pipeline shows anonymized applications, replies, and
interview invitations. A separate 30-day signal counts applications that did
not receive a reply, using only applications old enough to qualify. Offers
remain available as a private tracker status and are not shown as a public
company metric until enough reliable outcome data exists.

Applicant countries are shown only as anonymous per-offer totals and
percentages. Individual profiles and application timelines are never attached
to those public geography signals.

Authenticated users can independently mark a listing as talent-pool only or
gone. Each user can contribute at most one mark of each type per offer. Offers
online for at least 45 days receive a separate "might be a talent pool" caution;
this age-based hint is not presented as a confirmed community report. Gone
offers remain visible with a distinct card state and can be filtered on the
Explore page.

The page also includes an expandable role description and a prototype discussion area. Descriptions are currently generated from offer metadata, and comments are sample data that remain only for the current browser session.

### Track an application

Supabase email and password authentication is available. Before an application exists, a signed-in user sees one prominent `I applied` action. Starting an application creates a private tracker with one current stage and a dated activity timeline.

The current stage can be Saved, Applied, In review, Interview, Offer, Rejected, or Withdrawn. Repeatable activities include follow-ups, HR outreach, LinkedIn connections, replies, completed interviews, and completed tasks. Every status change and activity has a date and can include a private note. Timeline entries can be edited or removed, and rejection timing is calculated from the application date.

Detailed personal progress and private notes are stored per user and offer in
browser local storage. A minimal application record containing the current
stage, application date, and country is synchronized to Supabase so MeOrHR can
produce anonymous offer insights. The detailed timeline is still private to the
current browser.

### Application board

Signed-in users can view every tracked offer on a private Kanban board with
columns for Saved, Applied, In review, Interview, Offer, Rejected, and
Withdrawn. Offers can be moved between stages by dragging or with an accessible
stage menu on each card. A move updates the shared local tracker and adds a
dated event to the offer timeline.

### Add an offer

Signed-in users can add a job offer from the header. The submission form captures
the role, company, company country, location, category, work model, contract
type, optional role level, compensation and technology tags, eligible hiring
regions and countries, plus the original source and publication date.
Successful submissions create both the offer and its first source record before
opening the new offer page. Duplicate source URLs are rejected with an inline
message. Each new offer records its publisher. Publishers can review their
listings from the account menu and edit only their own offers.

### Profile settings

Signed-in users set their country before tracking applications and can
optionally add a public nickname, profile picture, and short About me text. The
country is used only for anonymous applicant-country totals. Profile images are
limited to image formats up to 2 MB and stored in Supabase Storage. Profile data
is stored in Supabase and the account shortcut in the header reflects saved
changes immediately. Email addresses remain part of the private authentication
account and are not stored in the public profile.

### Legal and navigation

A shared footer links to offers, offer submission, Terms of Service, and the
Privacy Policy. The legal pages describe community contributions, third-party
job links, Supabase account and profile storage, browser-local application data,
moderation, and user privacy choices.

## Job sources

The data model supports LinkedIn, Indeed, StepStone, Just Join IT, No Fluff Jobs, Pracuj.pl, Glassdoor, Xing, Welcome to the Jungle, Wellfound, EURES, company career pages, and other sources.

Offers retain their source URL and platform. The database currently includes a live offer imported from Just Join IT alongside the original seeded examples.

## Technology

- React 19 and TypeScript
- Vite
- React Router
- Tailwind CSS
- Supabase Postgres and Authentication
- Iconify icon packages

## Data model

Job offers are stored in the Supabase `job_offers` table. The current schema
includes offer identity, company information, company country, category, role
level, location, eligible hiring regions and countries, workplace mode,
employment type, salary, tags, source data, publication and update timestamps,
aggregate applicant metrics, response rate, and legacy applied/responded flags.

Private per-user application summaries are stored in `job_applications` and
protected by row-level security. A database function exposes only aggregated
applicant-country counts and percentages to public offer views.

Row-level security allows public offer reads. Creating, updating, and deleting offers requires an authenticated Supabase user.

Database changes are tracked in `supabase/migrations`.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and provide the Supabase anonymous key.
3. Start the app with `npm run dev`.
4. Create a production build with `npm run build`.

Required environment variables:

```text
VITE_SUPABASE_URL=https://mackenqcemnoodbrwbiv.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Priorytetowe funkcje

Pierwszy etap wdrożenia obejmuje wiele źródeł jednej oferty, potwierdzone
aplikacje oraz anonimową oś rekrutacji z konwersją i medianami czasu między
etapami.

| Funkcja | Co widzi lub robi użytkownik | Dlaczego jest wartościowa |
| --- | --- | --- |
| **Jedna oferta, wiele źródeł** | MeOrHR rozpoznaje tę samą rolę dodaną z LinkedIn, Just Join IT i strony firmy oraz pokazuje wszystkie linki i daty publikacji. | Kandydat nie liczy duplikatów jako nowych ofert i może wybrać źródło aplikacji. |
| **Czy ktoś już aplikował?** | Na ofercie widać liczbę osób, które potwierdziły wysłanie aplikacji, a osobno liczbę kliknięć w link. | Odpowiada na konkretne pytanie użytkownika bez mylenia kliknięcia z aplikacją. |
| **Oś rekrutacji** | Zanonimizowany widok pokazuje kolejne etapy, na przykład: 24 aplikacje, 8 odpowiedzi, 4 rozmowy i 1 oferta. Obok wyświetlane są mediany czasu oczekiwania między etapami. | Pokazuje przebieg procesu, zamiast jednej oderwanej wartości response rate. |
| **Historia ogłoszenia** | Użytkownik widzi datę pierwszego wykrycia, wznowienia i zamknięcia oferty oraz zmiany w wynagrodzeniu lub wymaganiach. | Pomaga ocenić, czy oferta jest aktualna i jak długo pozostaje otwarta. |
| **Dziennik doświadczeń kandydatów** | Kandydaci dodają krótkie, ustrukturyzowane wpisy, takie jak: „odpowiedź po 6 dniach”, „zadanie zajęło 5 godzin” lub „otrzymałem feedback”. | Dostarcza praktycznych informacji bez konieczności czytania długich, przypadkowych komentarzy. |
| **Prywatny Kanban aplikacji** | Użytkownik przenosi oferty przez etapy: Zapisane, Aplikowano, Odpowiedź, Rozmowa, Zadanie oraz Oferta lub Odrzucono. Do każdego etapu może dodać datę, notatki, kontakt i przypomnienie. | Daje powód, by regularnie wracać do MeOrHR, a aktualizacje mogą zasilać anonimowe statystyki zbiorcze. |
| **Porównanie ofert** | Użytkownik zestawia 2–3 role według pensji, trybu pracy, wymagań, etapów rekrutacji i danych od kandydatów. | Ułatwia wybór ofert, na które warto poświęcić czas. |

## Najbliższe prace techniczne

- Store imported offer descriptions and additional source metadata.
- Persist individual application activity in Supabase and update aggregate metrics from real user actions.
- Move browser-persisted, authenticated comments to Supabase for shared discussions.
