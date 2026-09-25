import ChevronDownLineIcon from "@iconify-react/majesticons/chevron-down-line";
import ChevronUpLineIcon from "@iconify-react/majesticons/chevron-up-line";
import { useState } from "react";
import type { JobOffer } from "../types/job";

export default function OfferDescription({ job }: { job: JobOffer }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div
        id="offer-description"
        className={`mt-5 max-w-3xl space-y-4 overflow-hidden  leading-7 text-brandgray-750 transition-[max-height] duration-300 ${
          isExpanded ? "max-h-[60rem]" : "max-h-40"
        }`}
      >
        <p>
          {job.company} is looking for a {job.title} to join its team in{" "}
          {job.location}. You will work in a {job.workplace.toLowerCase()} setup
          and help shape reliable, thoughtful products used by customers every
          day.
        </p>
        <p>
          In this role, you will take ownership of projects from discovery
          through delivery, collaborate closely with product and design, and
          turn ambiguous requirements into maintainable solutions. The team
          values clear communication, pragmatic decisions, and steady
          improvements over unnecessary complexity.
        </p>
        <p>
          You should be comfortable working with {job.tags.join(", ")} and
          sharing context with people across different disciplines. Experience
          mentoring teammates, reviewing work, and improving team practices will
          be useful.
        </p>
        <p>
          {job.company} offers a {job.type.toLowerCase()} position with room to
          influence both the product and the way the team works. The hiring
          process includes an introductory conversation, a practical discussion,
          and a final meeting with the people you would work with most closely.
        </p>
      </div>
      <button
        type="button"
        aria-controls="offer-description"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className="mt-4 inline-flex items-center gap-1.5  font-semibold text-brand-900 transition hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-900"
      >
        {isExpanded ? (
          <>
            Show less
            <ChevronUpLineIcon aria-hidden="true" width="17" height="17" />
          </>
        ) : (
          <>
            Show all
            <ChevronDownLineIcon aria-hidden="true" width="17" height="17" />
          </>
        )}
      </button>
    </>
  );
}
