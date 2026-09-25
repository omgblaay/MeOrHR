import type { ReactNode } from "react";

export default function Tag({
  tag,
  children,
}: {
  tag?: string;
  children?: ReactNode;
}) {
  return (
    <span className="rounded-2xl bg-brandgray-100 px-3 h-8 items-center flex text-brand-850">
      {children ?? tag}
    </span>
  );
}
