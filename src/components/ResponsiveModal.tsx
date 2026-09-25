import CloseLineIcon from "@iconify-react/majesticons/close-line";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ResponsiveModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function ResponsiveModal({
  title,
  onClose,
  children,
}: ResponsiveModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]",
        ),
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end bg-brand-950/55 sm:items-center sm:justify-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-2xl bg-red-500 shadow-[0_20px_60px_rgba(24,32,28,0.28)] outline-none sm:max-w-3xl sm:rounded-md"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-brandgray-200 bg-white px-4 py-4 sm:px-6">
          <h2 id={titleId} className="text-lg font-semibold text-brandgray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            aria-label="Close dialog"
            className="grid size-9 cursor-pointer place-items-center rounded- text-brandgray-600 transition hover:bg-brandgray-100 hover:text-brandgray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
          >
            <CloseLineIcon aria-hidden="true" width="20" height="20" />
          </button>
        </header>
        {children}
      </div>
    </div>,
    document.body,
  );
}
