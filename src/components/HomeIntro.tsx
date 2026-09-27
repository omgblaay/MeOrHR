import ChevronRightLineIcon from "@iconify-react/majesticons/chevron-right-line";
import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import ChartBarLineIcon from "@iconify-react/majesticons/chart-bar-line";
import PlusLineIcon from "@iconify-react/majesticons/plus-line";
import UsersLineIcon from "@iconify-react/majesticons/users-line";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import HomeOfferSearch from "./HomeOfferSearch";
import type { JobOffer } from "../types/job";

const communitySteps = [
  {
    title: "Post an offer",
    description: "Share a role you found so the community can find it too.",
    icon: BriefcaseLineIcon,
    accent: "bg-lime-300 text-brand-900",
  },
  {
    title: "Report what happened",
    description: "Log replies, interviews, follow-ups, or hiring silence.",
    icon: ChartBarLineIcon,
    accent: "bg-red-100 text-red-800",
  },
  {
    title: "Help the next person",
    description: "Turn individual experiences into useful hiring signals.",
    icon: UsersLineIcon,
    accent: "bg-blue-100 text-blue-700",
  },
];

export default function HomeHero({
  jobOffers,
  isLoading,
}: {
  jobOffers: JobOffer[];
  isLoading: boolean;
}) {
  const navigate = useNavigate();

  return (
    <>
      <section className="border-b border-brandgray-250 bg-brandgray-50 px-4 pb-0 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-semibold text-brand-500">
            Built by applicants, for applicants
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-[1.08] text-brand-950 sm:text-5xl">
            A community job board that shows what happens after you apply.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-brandgray-650 sm:text-lg">
            Post job offers, share how companies respond, and help other
            candidates understand whether an experience is personal or part of a
            wider hiring pattern.
          </p>
          <HomeOfferSearch jobOffers={jobOffers} isLoading={isLoading} />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/offers/new")}>
              <PlusLineIcon aria-hidden="true" width="18" height="18" />
              Add an offer
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/explore")}
            >
              Browse offers
              <ChevronRightLineIcon
                aria-hidden="true"
                width="17"
                height="17"
              />
            </Button>
          </div>
        </div>

        <ol className="mt-10 grid border-x border-t border-brandgray-250 bg-white sm:grid-cols-3">
          {communitySteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="flex min-h-36 gap-4 border-b border-brandgray-250 p-5 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-md ${step.accent}`}
                >
                  <Icon aria-hidden="true" width="20" height="20" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-brandgray-450">
                    0{index + 1}
                  </p>
                  <h2 className="mt-1 font-semibold text-brandgray-900">
                    {step.title}
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-brandgray-600">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}

export function AboutMeOrHR() {
  return (
    <section
      aria-labelledby="about-jobrater"
      className="grid border-t border-brandgray-250 bg-brand-950 text-white md:grid-cols-[0.7fr_1.3fr]"
    >
      <div className="border-b border-white/15 px-4 py-8 sm:px-6 md:border-b-0 md:border-r lg:px-8 lg:py-10">
        <p className="text-sm font-semibold text-brand-300">About the app</p>
        <h2 id="about-jobrater" className="mt-2 text-2xl font-semibold">
          Why I made MeOrHR
        </h2>
      </div>
      <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <p className="max-w-2xl text-base leading-7 text-brandgray-250">
          I made MeOrHR because getting no reply after an application is
          frustrating, and it leaves you wondering whether your resume or
          portfolio was the problem, or whether anyone even looked at it. By
          sharing what happens after we apply, we can see whether an experience
          is just ours or reflects how a company generally runs its hiring
          process.
        </p>
      </div>
    </section>
  );
}
