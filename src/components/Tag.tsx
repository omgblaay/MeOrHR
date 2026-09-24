import type { ReactNode } from "react";

export default function Tag({
  tag,
  children,
}: {
  tag?: string;
  children?: ReactNode;
}) {
  return (
    <span className="rounded bg-[#e7eee8] px-2.5 py-1  text-font-medium text-[#294b40]">
      {children ?? tag}
    </span>
  );
}
