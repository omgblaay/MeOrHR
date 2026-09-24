import type { ReactNode } from "react";

export default function Tag({
  tag,
  children,
}: {
  tag?: string;
  children?: ReactNode;
}) {
  return (
    <span className="rounded-2xl bg-[#f2f6f2] px-3 h-8 items-center flex text-[#294b40]">
      {children ?? tag}
    </span>
  );
}
