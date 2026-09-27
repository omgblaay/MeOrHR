import CalendarLineIcon from "@iconify-react/majesticons/calendar-line";
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
  (
    { className = "", variant = "default", type, onClick, ...props },
    ref,
  ) => {
    const input = (
      <input
        ref={ref}
        type={type}
        onClick={(event) => {
          onClick?.(event);
          if (
            type === "date" &&
            !event.defaultPrevented &&
            typeof event.currentTarget.showPicker === "function"
          ) {
            event.currentTarget.showPicker();
          }
        }}
        className={`w-full border rounded-xl border-brandgray-300 bg-white px-3.5 text-brandgray-900 outline-none transition placeholder:text-brandgray-450 focus:border-brand-700 focus:ring-3 focus:ring-lime-400/10 disabled:cursor-not-allowed disabled:bg-brandgray-100 disabled:text-brandgray-500 ${variantClasses[variant]} ${
          type === "date"
            ? "appearance-none pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-11 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
            : ""
        } ${className}`}
        {...props}
      />
    );

    if (type !== "date") return input;

    return (
      <span className="relative block w-full">
        {input}
        <CalendarLineIcon
          aria-hidden="true"
          width="18"
          height="18"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-brandgray-600"
        />
      </span>
    );
  },
);

Input.displayName = "Input";

export default Input;
