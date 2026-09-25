import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import CodeLineIcon from "@iconify-react/majesticons/code-line";
import GlobeLineIcon from "@iconify-react/majesticons/globe-line";
import QuestionCircleLineIcon from "@iconify-react/majesticons/question-circle-line";
import SearchLineIcon from "@iconify-react/majesticons/search-line";
import GlassdoorIcon from "@iconify-react/simple-icons/glassdoor";
import IndeedIcon from "@iconify-react/simple-icons/indeed";
import LinkedinIcon from "@iconify-react/simple-icons/linkedin";
import WellfoundIcon from "@iconify-react/simple-icons/wellfound";
import WelcomeToTheJungleIcon from "@iconify-react/simple-icons/welcometothejungle";
import XingIcon from "@iconify-react/simple-icons/xing";
import type { JobSource } from "../types/job";

const sourceLabels: Record<JobSource, string> = {
  linkedin: "LinkedIn",
  indeed: "Indeed",
  stepstone: "StepStone",
  justjoinit: "Just Join IT",
  nofluffjobs: "No Fluff Jobs",
  pracuj: "Pracuj.pl",
  glassdoor: "Glassdoor",
  xing: "XING",
  welcome_to_the_jungle: "Welcome to the Jungle",
  wellfound: "Wellfound",
  eures: "EURES",
  company_career_page: "Company career page",
  other: "Other source",
};

function SourceIcon({ source }: { source: JobSource }) {
  const iconProps = { "aria-hidden": true, width: "15", height: "15" } as const;

  switch (source) {
    case "linkedin":
      return <LinkedinIcon {...iconProps} className="text-blue-650" />;
    case "indeed":
      return <IndeedIcon {...iconProps} className="text-blue-600" />;
    case "glassdoor":
      return <GlassdoorIcon {...iconProps} className="text-teal-400" />;
    case "xing":
      return <XingIcon {...iconProps} className="text-teal-700" />;
    case "welcome_to_the_jungle":
      return <WelcomeToTheJungleIcon {...iconProps} className="text-brandgray-950" />;
    case "wellfound":
      return <WellfoundIcon {...iconProps} className="text-brandgray-950" />;
    case "justjoinit":
    case "nofluffjobs":
      return <CodeLineIcon {...iconProps} className="text-brand-500" />;
    case "pracuj":
      return <SearchLineIcon {...iconProps} className="text-blue-500" />;
    case "eures":
      return <GlobeLineIcon {...iconProps} className="text-blue-500" />;
    case "company_career_page":
    case "stepstone":
      return <BriefcaseLineIcon {...iconProps} className="text-brandgray-700" />;
    default:
      return <QuestionCircleLineIcon {...iconProps} className="text-brandgray-500" />;
  }
}

export default function JobSourceBadge({ source }: { source: JobSource }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-brandgray-700" title={`Source: ${sourceLabels[source]}`}>
      <SourceIcon source={source} />
      <span>{sourceLabels[source]}</span>
    </span>
  );
}
