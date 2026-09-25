import { forwardRef, type SelectHTMLAttributes } from "react";

type SelectVariant = "default" | "compact";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: SelectVariant;
};

const variantClasses: Record<SelectVariant, string> = {
  default: "h-11 px-3.5",
  compact: "h-9 px-2 text-sm",
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-full cursor-pointer border rounded-xl border-brandgray-300 bg-white text-brandgray-900 outline-none transition focus:border-brand-700 focus:ring-3 focus:ring-brand-700/10 disabled:cursor-not-allowed disabled:bg-brandgray-100 disabled:text-brandgray-500 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";

export default Select;
