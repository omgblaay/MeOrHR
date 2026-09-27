import ChevronDownLineIcon from "@iconify-react/majesticons/chevron-down-line";
import { forwardRef, type SelectHTMLAttributes } from "react";

type SelectVariant = "default" | "compact";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: SelectVariant;
};

const variantClasses: Record<SelectVariant, string> = {
  default: "h-11 pl-3.5 pr-10",
  compact: "h-9 pl-2 pr-8 text-sm",
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => (
    <span className="relative block w-full">
      <select
        ref={ref}
        className={`w-full appearance-none cursor-pointer border rounded-xl border-brandgray-300 bg-white text-brandgray-900 outline-none transition focus:border-brand-700 focus:ring-3 focus:ring-brand-700/10 disabled:cursor-not-allowed disabled:bg-brandgray-100 disabled:text-brandgray-500 ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </select>
      <ChevronDownLineIcon
        aria-hidden="true"
        width={variant === "compact" ? "16" : "18"}
        height={variant === "compact" ? "16" : "18"}
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-brandgray-600 ${
          variant === "compact" ? "right-2" : "right-3.5"
        }`}
      />
    </span>
  ),
);

Select.displayName = "Select";

export default Select;
