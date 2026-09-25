import type { JobCategory } from "../types/job";
import JobCategoryIcon from "./JobCategoryIcon";

const categoryClasses: Record<JobCategory, string> = {
  "AI/ML": "border-amber-200 bg-amber-100 text-amber-900",
  JavaScript: "border-amber-200 bg-amber-100 text-amber-900",
  HTML: "border-red-200 bg-red-100 text-red-800",
  PHP: "border-purple-200 bg-purple-100 text-purple-700",
  Ruby: "border-red-200 bg-red-100 text-red-800",
  Python: "border-blue-200 bg-blue-100 text-blue-800",
  Java: "border-red-200 bg-red-100 text-red-800",
  ".NET": "border-purple-200 bg-purple-100 text-purple-700",
  Scala: "border-red-200 bg-red-100 text-red-800",
  C: "border-blue-200 bg-blue-100 text-blue-800",
  Mobile: "border-brand-200 bg-brand-100 text-brand-800",
  Testing: "border-red-200 bg-red-50 text-red-700",
  DevOps: "border-blue-200 bg-blue-100 text-blue-800",
  Admin: "border-amber-200 bg-amber-100 text-amber-900",
  "UX/UI": "border-purple-200 bg-purple-100 text-purple-700",
  PM: "border-blue-200 bg-blue-100 text-blue-800",
  Game: "border-purple-200 bg-purple-100 text-purple-700",
  Analytics: "border-amber-200 bg-amber-100 text-amber-900",
  Security: "border-red-200 bg-red-100 text-red-800",
  Data: "border-blue-200 bg-blue-100 text-blue-800",
  Go: "border-blue-200 bg-blue-100 text-blue-800",
  Support: "border-blue-200 bg-blue-100 text-blue-800",
  ERP: "border-blue-200 bg-blue-100 text-blue-800",
  Architecture: "border-blue-200 bg-blue-100 text-blue-800",
  Other: "border-brandgray-250 bg-brandgray-100 text-brandgray-750",
};

export default function JobCategoryBadge({
  category,
  className = "",
}: {
  category: JobCategory;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-2xl px-2 text-xs font-semibold ${categoryClasses[category]} ${className}`}
    >
      <JobCategoryIcon category={category} size={14} className="size-5" />
      {category}
    </span>
  );
}
