import CheckLineIcon from "@iconify-react/majesticons/check-line";
import type { ComponentType } from "react";

type RadioCardIcon = ComponentType<{
  "aria-hidden"?: boolean | "true" | "false";
  width?: string;
  height?: string;
}>;

type RadioCardProps<Value extends string> = {
  name: string;
  value: Value;
  label: string;
  icon: RadioCardIcon;
  checked: boolean;
  onChange: (value: Value) => void;
  selectedClasses?: string;
  selectedIconClasses?: string;
  checkClasses?: string;
  focusClasses?: string;
};

const unselectedClasses =
  "border-brandgray-300 bg-white text-brandgray-750 hover:border-brandgray-400 hover:bg-brandgray-25";

export default function RadioCard<Value extends string>({
  name,
  value,
  label,
  icon: Icon,
  checked,
  onChange,
  selectedClasses = "border-lime-400 bg-lime-300 text-brand-900",
  selectedIconClasses = "text-lime-700",
  checkClasses = "text-brand-500",
  focusClasses = "focus-within:outline-lime-300",
}: RadioCardProps<Value>) {
  return (
    <label
      className={`relative flex cursor-pointer flex-row items-center gap-2 rounded-xl border py-3.5 pl-3.5 pr-10 transition focus-within:outline-2 focus-within:outline-offset-2 ${focusClasses} ${checked ? selectedClasses : unselectedClasses}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        className={`grid place-items-center rounded-md ${
          checked ? selectedIconClasses : "text-brandgray-700"
        }`}
      >
        <Icon aria-hidden="true" width="17" height="17" />
      </span>
      {checked && (
        <CheckLineIcon
          aria-hidden="true"
          width="17"
          height="17"
          className={`absolute right-3 top-3 ${checkClasses}`}
        />
      )}
      <span className="font-medium leading-5">{label}</span>
    </label>
  );
}
