import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "filter"
  | "icon";
type ButtonSize = "sm" | "md" | "icon";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  href?: string;
  link?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-lime-300 text-brand-900 hover:bg-lime-400",
  secondary:
    "border border-brandgray-300 bg-white text-brandgray-750 hover:border-brandgray-450",
  danger:
    "border border-red-200 bg-white text-red-700 hover:border-red-400 hover:bg-red-50",
  filter: "rounded-full border",
  icon: "border  border-brandgray-250 bg-white text-brandgray-700 hover:border-brand-900 hover:bg-brandgray-100 hover:text-brand-900",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 ",
  md: "px-4 py-2 ",
  icon: "size-9 p-0",
};
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      active = false,
      children,
      className = "",
      size = "md",
      variant = "primary",
      href,
      link,
      ...props
    },
    ref,
  ) => {
    const filterClasses =
      variant === "filter"
        ? active
          ? "bg-brand-900 text-white "
          : "border-none text-brandgray-750 hover:bg-brandgray-100"
        : "";

    const classes = `inline-flex rounded-lg shrink-0 cursor-pointer items-center justify-center gap-2 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${filterClasses} ${className}`;

    const destination = href ?? link;
    if (destination) {
      return (
        <Link to={destination} className={classes} title={props.title}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
