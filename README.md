# MeOrHR

Community-powered job offers and recruitment insights.

[Open the live app](https://meorhr.com/)

MeOrHR helps candidates understand whether silence after an application is
personal or part of a wider company pattern. People can share job offers, track
their own applications, and compare aggregate signals about replies, interviews,
and long periods without a response.

## Features

- Browse and search technology job offers by title, company, location, work
  model, contract type, category, and technology.
- Review applicant activity, response rates, interview progression, and the
  number of applications unanswered after 30 days.
- Follow one offer across multiple sources, including LinkedIn, Indeed,
  StepStone, Just Join IT, company career pages, and other European job boards.
- Track a private application status: Saved, Applied, In review, Interview,
  Offer, Rejected, or Withdrawn.
- Record dated application activities and optional private notes.
- Manage tracked offers in a draggable Kanban board or compact list grouped by
  status.
- Add new offers as an authenticated user.
- Create an optional profile with a nickname, short bio, and profile image.
- Use the browser-local offer discussion prototype and remove your own comments.
- Use responsive job cards, offer pages, modals, and mobile drawers.

## Recruitment Signals

The public recruitment summary focuses on signals candidates are likely to keep
up to date:

```text
Confirmed applications -> Replies -> Interview invitations
```

MeOrHR also shows applications with no reply after 30 days. Newer
applications are excluded from this metric so they are not incorrectly treated
as ignored.

An offer remains available as a private tracker status, but it is not currently
used as a public company metric because outcomes are rare and easy to
under-report.

## Technology

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS 4
- Supabase Postgres, Authentication, and Storage
- Iconify and Devicons
- Vercel

## Local Development

### Prerequisites

- Node.js 20 or newer
- npm
- A Supabase project

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the local environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Add your Supabase and reCAPTCHA v3 credentials to `.env.local`:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_RECAPTCHA_SITE_KEY=your-recaptcha-v3-site-key
   ```

4. Configure the matching reCAPTCHA secret and deploy the Edge Function:

   ```bash
   npx supabase secrets set RECAPTCHA_SECRET_KEY=your-recaptcha-v3-secret
   npx supabase functions deploy protected-submission
   ```

   You can optionally configure `RECAPTCHA_ALLOWED_HOSTNAMES` as a
   comma-separated list and `RECAPTCHA_MIN_SCORE` (defaults to `0.5`).

5. Apply the SQL files from [`supabase/migrations`](supabase/migrations) to the
   Supabase project in timestamp order. You can use the Supabase CLI or the SQL
   editor in the Supabase dashboard.

6. Start the development server:

   ```bash
   npm run dev
   ```

Vite prints the local URL when the server starts.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## Supabase

Database changes are versioned in [`supabase/migrations`](supabase/migrations).
The current schema includes:

- `job_offers` for offer details and aggregate recruitment metrics
- `job_offer_sources` for source URLs and offer history
- `profiles` for optional public account information
- A profile-image storage bucket with image-only upload policies
- Row-level security for public reads and authenticated writes

Never commit a Supabase service-role key. The frontend should only receive the
public project URL and anonymous key through `VITE_` environment variables.

## Current Data Boundaries

Job offers, sources, authentication, and profiles use Supabase. Personal
application progress and comments are currently stored in the browser and are
not synchronized between devices. The next backend milestone is moving those
records to Supabase and deriving community statistics from authenticated,
anonymized activity.

## Deployment

The application is available at [meorhr.com](https://meorhr.com/).

For another Vercel deployment, configure these project environment variables
for every required environment:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Then deploy the repository with the standard Vite build command:

```text
npm run build
```

The generated output directory is `dist`.

## Product Notes

See [`aboutapp.md`](aboutapp.md) for the fuller product direction, feature
rationale, data-model notes, and planned work.
