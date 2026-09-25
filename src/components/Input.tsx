import { forwardRef, type InputHTMLAttributes } from "react";

type InputVariant = "default" | "compact" | "search";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: InputVariant;
};

const variantClasses: Record<InputVariant, string> = {
  default: "h-11 ",
  compact: "h-10 text-sm",
  search: "h-13 border-transparent ",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", variant = "default", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full border rounded-xl border-brandgray-300 bg-white px-3.5 text-brandgray-900 outline-none transition placeholder:text-brandgray-450 focus:border-brand-700 focus:ring-3 focus:ring-lime-400/10 disabled:cursor-not-allowed disabled:bg-brandgray-100 disabled:text-brandgray-500 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  ),
);

Input.displayName = "Input";

export default Input;
