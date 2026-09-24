import DockerOriginal from "devicons-react/icons/DockerOriginal";
import FigmaOriginal from "devicons-react/icons/FigmaOriginal";
import GrafanaOriginal from "devicons-react/icons/GrafanaOriginal";
import JavascriptOriginal from "devicons-react/icons/JavascriptOriginal";
import NextjsOriginal from "devicons-react/icons/NextjsOriginal";
import NodejsOriginal from "devicons-react/icons/NodejsOriginal";
import PostgresqlOriginal from "devicons-react/icons/PostgresqlOriginal";
import PythonOriginal from "devicons-react/icons/PythonOriginal";
import ReactOriginal from "devicons-react/icons/ReactOriginal";
import SupabaseOriginal from "devicons-react/icons/SupabaseOriginal";
import TailwindcssOriginal from "devicons-react/icons/TailwindcssOriginal";
import TensorflowOriginal from "devicons-react/icons/TensorflowOriginal";
import TypescriptOriginal from "devicons-react/icons/TypescriptOriginal";
import type { ComponentType, SVGProps } from "react";
import {
  FaAws,
  FaCode,
} from "react-icons/fa6";
import { SiLooker } from "react-icons/si";

type TechnologyIcon = ComponentType<
  SVGProps<SVGElement> & { size?: number | string }
>;

type TechnologyPresentation = {
  icon: TechnologyIcon;
  color?: string;
};

const technologyPresentations: Record<string, TechnologyPresentation> = {
  react: { icon: ReactOriginal },
  typescript: { icon: TypescriptOriginal },
  javascript: { icon: JavascriptOriginal },
  "node.js": { icon: NodejsOriginal },
  python: { icon: PythonOriginal },
  postgresql: { icon: PostgresqlOriginal },
  sql: { icon: PostgresqlOriginal },
  aws: { icon: FaAws, color: "#e87900" },
  figma: { icon: FigmaOriginal },
  "next.js": { icon: NextjsOriginal },
  supabase: { icon: SupabaseOriginal },
  tailwind: { icon: TailwindcssOriginal },
  looker: { icon: SiLooker, color: "#4285f4" },
  ai: { icon: TensorflowOriginal },
  "machine learning": { icon: TensorflowOriginal },
  backend: { icon: DockerOriginal },
  analytics: { icon: GrafanaOriginal },
  "design systems": { icon: FigmaOriginal },
};

export default function TechnologyTag({ technology }: { technology: string }) {
  const presentation = technologyPresentations[technology.toLowerCase()] ?? {
    icon: FaCode,
    color: "#526058",
  };
  const Icon = presentation.icon;

  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-full border border-[#e2e8e3] bg-[#f7f9f7] px-3 text-sm text-[#294b40]">
      <Icon
        aria-hidden="true"
        className="size-3.5 shrink-0"
        style={presentation.color ? { color: presentation.color } : undefined}
      />
      {technology}
    </span>
  );
}
