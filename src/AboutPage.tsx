import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import ChartBarLineIcon from "@iconify-react/majesticons/chart-bar-line";
import PlusLineIcon from "@iconify-react/majesticons/plus-line";
import UsersLineIcon from "@iconify-react/majesticons/users-line";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";
import Button from "./components/Button";
import AppLogo from "./components/AppLogo";

const principles = [
  {
    title: "Offers with context",
    description:
      "A listing is more useful when its source, location, hiring reach, and current availability stay attached to it.",
    icon: BriefcaseLineIcon,
  },
  {
    title: "Outcomes, not guesswork",
    description:
      "Anonymous application signals show whether people receive replies, reach interviews, or wait without an answer.",
    icon: ChartBarLineIcon,
  },
  {
    title: "Applicants helping applicants",
    description:
      "Each shared offer and reported outcome makes the next person’s job search a little less opaque.",
    icon: UsersLineIcon,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-[90rem] border-x border-brandgray-250 bg-white">
        <header className="grid border-b border-brandgray-250 bg-brandgray-50 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-brandgray-250 px-4 py-10 sm:px-6 sm:py-14 lg:border-b-0 lg:border-r lg:px-8 lg:py-16">
            <p className="text-sm font-semibold text-brand-500">
              About the app
            </p>
            <h1 className="mt-4">
              <span className="sr-only">MeOrHR</span>
              <AppLogo alt="" className="h-12 w-auto sm:h-14" />
            </h1>
          </div>
          <div className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
            <p className="max-w-2xl text-xl font-semibold leading-8 text-brandgray-900">
              A community job board that makes the hiring process less opaque.
            </p>
            <p className="mt-4 max-w-2xl leading-7 text-brandgray-650">
              MeOrHR brings job offers together with anonymous applicant
              outcomes, helping candidates see what happens after people apply,
              not only what a listing promises beforehand.
            </p>
          </div>
        </header>

        <section className="grid border-b border-brandgray-250 lg:grid-cols-[15rem_1fr]">
          <div className="border-b border-brandgray-250 px-4 py-7 sm:px-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
            <h2 className="mt-1 text-2xl font-semibold text-brandgray-900">
              Why it exists
            </h2>
          </div>
          <div className="max-w-3xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <p className="text-lg leading-8 text-brandgray-750">
              Getting no reply after an application is frustrating. It leaves
              you wondering whether your resume or portfolio was the problem,
              whether the role was already filled, or whether anyone reviewed
              the application at all.
            </p>
            <p className="mt-5 leading-7 text-brandgray-650">
              By sharing offers and reporting what happens next, applicants can
              distinguish an individual experience from a broader hiring
              pattern. The goal is not to score people or companies. It is to
              give candidates clearer information for deciding where to spend
              their time and energy.
            </p>
          </div>
        </section>

        <section className="grid border-b border-brandgray-250 lg:grid-cols-[15rem_1fr]">
          <div className="border-b border-brandgray-250 px-4 py-7 sm:px-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
            <p className="text-sm font-semibold text-brand-500">The approach</p>
            <h2
              id="about-principles"
              className="mt-1 text-2xl font-semibold text-brandgray-900"
            >
              Better signals through shared experience
            </h2>
          </div>
          <div className="max-w-3xl px-4 py-8 flex flex-col gap-8 sm:px-6 lg:px-10 lg:py-10">
            {principles.map((principle) => {
              // const Icon = principle.icon;
              return (
                <article key={principle.title}>
                  {/* <Icon
                    aria-hidden="true"
                    width="22"
                    height="22"
                    className="text-brand-700"
                  /> */}
                  <h3 className="mt-5 font-semibold text-brandgray-900">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-brandgray-600">
                    {principle.description}
                  </p>
                </article>
              );
            })}
            <article>
              {/* <LockLineIcon
                aria-hidden="true"
                width="22"
                height="22"
                className="text-brand-800"
              /> */}
              <h3 className="mt-5 font-semibold text-brandgray-900">
                Personal details stay personal
              </h3>
              <p className="mt-2 text-sm leading-6 text-brandgray-600">
                Private notes and detailed application timelines stay in your
                browser. Public hiring insights use aggregated stages and
                outcomes, without publishing your personal notes or attaching
                your identity to an application timeline.
              </p>
            </article>
            <article>
              {/* <ApplicationsLineIcon
                aria-hidden="true"
                width="22"
                height="22"
                className="text-brand-800"
              /> */}
              <h3 className="mt-5 font-semibold text-brandgray-900">
                Built around the applicant
              </h3>
              <p className="mt-2 text-sm leading-6 text-brandgray-600">
                Search offers, preserve their original sources, track your own
                progress, and compare community-reported hiring activity in one
                place.
              </p>
            </article>
          </div>
        </section>

        <section className="grid border-b border-brandgray-250 lg:grid-cols-[15rem_1fr]"></section>

        <section className="flex flex-col gap-5 px-4 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h2 className="text-xl font-semibold text-brandgray-900">
              Explore what the community has shared
            </h2>
            <p className="mt-1 text-brandgray-600">
              Browse current offers or contribute one you have found.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button href="/explore" variant="secondary">
              Browse offers
            </Button>
            <Button href="/offers/new">
              <PlusLineIcon aria-hidden="true" width="17" height="17" />
              Add an offer
            </Button>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
