import * as flags from "country-flag-icons/react/3x2";
import type { ComponentType, SVGProps } from "react";

type CountryFlagProps = {
  countryCode: string;
  className?: string;
};

export default function CountryFlag({
  countryCode,
  className = "h-3.5 w-5",
}: CountryFlagProps) {
  const Flag = flags[
    countryCode.toUpperCase() as keyof typeof flags
  ] as ComponentType<SVGProps<SVGSVGElement>> | undefined;

  if (!Flag) return null;

  return (
    <Flag
      aria-hidden="true"
      className={`shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(24,32,28,0.14)] ${className}`}
    />
  );
}
