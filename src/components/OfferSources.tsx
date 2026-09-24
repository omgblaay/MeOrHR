import ExternalLinkLineIcon from "@iconify-react/majesticons/external-link-line";
import LinkLineIcon from "@iconify-react/majesticons/link-line";
import { recordSourceClick } from "../lib/sourceTracking";
import type { JobOfferSource } from "../types/job";
import JobSourceBadge from "./JobSourceBadge";

function formatSourceDate(value: string | null) {
  if (!value) return "Publication date unknown";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function OfferSources({
  sources,
}: {
  sources: JobOfferSource[];
}) {
  if (sources.length === 0) return null;

  const gridColumns =
    sources.length === 1
      ? "max-w-md grid-cols-1"
      : sources.length === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      className="border-b border-[#dfe3dd]"
      aria-labelledby="offer-sources-heading"
    >
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <LinkLineIcon
            aria-hidden="true"
            width="18"
            height="18"
            className="text-[#526058]"
          />
          <h2
            id="offer-sources-heading"
            className="font-semibold uppercase text-[#667069]"
          >
            Available from {sources.length}{" "}
            {sources.length === 1 ? "source" : "sources"}
          </h2>
        </div>

        <div
          className={`mt-5 grid gap-px overflow-hidden rounded-xl border border-[#dfe3dd] bg-[#dfe3dd] ${gridColumns}`}
        >
          {sources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => recordSourceClick(source.id)}
              className="group flex min-h-24 items-center justify-between gap-4 bg-white p-4 transition hover:bg-[#f7faf7] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[#173f35]"
            >
              <span className="min-w-0">
                <JobSourceBadge source={source.platform} />
                <span className="mt-2 block text-xs text-[#7a847e]">
                  Published {formatSourceDate(source.publishedAt)}
                </span>
                <span className="mt-1 block text-xs text-[#7a847e]">
                  {source.clickCount}{" "}
                  {source.clickCount === 1 ? "click" : "clicks"}
                </span>
              </span>
              <ExternalLinkLineIcon
                aria-hidden="true"
                width="18"
                height="18"
                className="shrink-0 text-[#7a847e] transition group-hover:text-[#173f35]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
