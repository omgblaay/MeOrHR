import BriefcaseLineIcon from "@iconify-react/majesticons/briefcase-line";
import ShieldLineIcon from "@iconify-react/majesticons/shield-line";
import AndroidOriginal from "devicons-react/icons/AndroidOriginal";
import COriginal from "devicons-react/icons/COriginal";
import DatagripOriginal from "devicons-react/icons/DatagripOriginal";
import DockerOriginal from "devicons-react/icons/DockerOriginal";
import DotnetcoreOriginal from "devicons-react/icons/DotnetcoreOriginal";
import FigmaOriginal from "devicons-react/icons/FigmaOriginal";
import GitOriginal from "devicons-react/icons/GitOriginal";
import GoOriginal from "devicons-react/icons/GoOriginal";
import GrafanaOriginal from "devicons-react/icons/GrafanaOriginal";
import Html5Original from "devicons-react/icons/Html5Original";
import JavaOriginal from "devicons-react/icons/JavaOriginal";
import JavascriptOriginal from "devicons-react/icons/JavascriptOriginal";
import JestPlain from "devicons-react/icons/JestPlain";
import JiraOriginal from "devicons-react/icons/JiraOriginal";
import KubernetesOriginal from "devicons-react/icons/KubernetesOriginal";
import LinuxOriginal from "devicons-react/icons/LinuxOriginal";
import PhpOriginal from "devicons-react/icons/PhpOriginal";
import PythonOriginal from "devicons-react/icons/PythonOriginal";
import RubyOriginal from "devicons-react/icons/RubyOriginal";
import SalesforceOriginal from "devicons-react/icons/SalesforceOriginal";
import ScalaOriginal from "devicons-react/icons/ScalaOriginal";
import TensorflowOriginal from "devicons-react/icons/TensorflowOriginal";
import UnityOriginal from "devicons-react/icons/UnityOriginal";
import type { ComponentType } from "react";

type CategoryIconComponent = ComponentType<{
  "aria-hidden"?: boolean | "true" | "false";
  className?: string;
  height?: string;
  width?: string;
}>;

const categoryIcons: Record<string, CategoryIconComponent> = {
  "AI/ML": TensorflowOriginal,
  JavaScript: JavascriptOriginal,
  HTML: Html5Original,
  PHP: PhpOriginal,
  Ruby: RubyOriginal,
  Python: PythonOriginal,
  Java: JavaOriginal,
  ".NET": DotnetcoreOriginal,
  Scala: ScalaOriginal,
  C: COriginal,
  Mobile: AndroidOriginal,
  Testing: JestPlain,
  DevOps: DockerOriginal,
  Admin: LinuxOriginal,
  "UX/UI": FigmaOriginal,
  PM: JiraOriginal,
  Game: UnityOriginal,
  Analytics: GrafanaOriginal,
  Security: ShieldLineIcon,
  Data: DatagripOriginal,
  Go: GoOriginal,
  Support: SalesforceOriginal,
  ERP: SalesforceOriginal,
  Architecture: KubernetesOriginal,
  Other: GitOriginal,
};

export default function JobCategoryIcon({
  category,
  size = 22,
  className = "size-15",
}: {
  category: string;
  size?: number;
  className?: string;
}) {
  const Icon = categoryIcons[category] ?? BriefcaseLineIcon;

  return (
    <span className={`place-items-center  ${className}`} aria-hidden="true">
      <Icon
        aria-hidden="true"
        className="text-brand-900"
        width={String(size)}
        height={String(size)}
      />
    </span>
  );
}
