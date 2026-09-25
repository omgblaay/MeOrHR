import type { LabelHTMLAttributes, ReactNode } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  asSpan?: boolean;
  optional?: boolean;
  children: ReactNode;
};

export default function Label({
  asSpan = false,
  optional = false,
  className = "",
  children,
  ...props
}: LabelProps) {
  const content = (
    <>
      {children}
      {optional && (
        <span className="ml-2 text-sm font-normal text-brandgray-500">
          Optional
        </span>
      )}
    </>
  );

  if (asSpan) {
    return (
      <span className={`block font-semibold text-brandgray-900 ${className}`}>
        {content}
      </span>
    );
  }

  return (
    <label
      className={`block font-semibold text-brandgray-900 ${className}`}
      {...props}
    >
      {content}
    </label>
  );
}
