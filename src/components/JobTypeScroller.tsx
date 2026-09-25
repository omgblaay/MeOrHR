import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent, WheelEvent } from "react";
import ChevronLeftLineIcon from "@iconify-react/majesticons/chevron-left-line";
import ChevronRightLineIcon from "@iconify-react/majesticons/chevron-right-line";
import JobCategoryIcon from "./JobCategoryIcon";

type JobTypeOption = {
  value: string;
  label: string;
};

type JobTypeScrollerProps = {
  options: JobTypeOption[];
  value: string;
  onValueChange: (value: string) => void;
};

export default function JobTypeScroller({
  options,
  value,
  onValueChange,
}: JobTypeScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    active: false,
    moved: false,
    scrollLeft: 0,
    startX: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: true });

  const updateScrollEdges = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    const nextEdges = {
      left: scroller.scrollLeft > 2,
      right: scroller.scrollLeft < maxScrollLeft - 2,
    };

    setScrollEdges((currentEdges) =>
      currentEdges.left === nextEdges.left &&
      currentEdges.right === nextEdges.right
        ? currentEdges
        : nextEdges,
    );
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const resizeObserver = new ResizeObserver(updateScrollEdges);
    resizeObserver.observe(scroller);
    const frame = window.requestAnimationFrame(updateScrollEdges);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [options.length, updateScrollEdges]);

  const scrollByPage = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      behavior: "smooth",
      left: direction * Math.max(96, scroller.clientWidth - 104),
    });
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (
      !scrollerRef.current ||
      Math.abs(event.deltaY) <= Math.abs(event.deltaX)
    )
      return;

    event.preventDefault();
    scrollerRef.current.scrollLeft += event.deltaY;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      !scrollerRef.current
    )
      return;

    dragState.current = {
      active: true,
      moved: false,
      scrollLeft: scrollerRef.current.scrollLeft,
      startX: event.clientX,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || !scrollerRef.current) return;

    const distance = event.clientX - dragState.current.startX;
    if (Math.abs(distance) > 4 && !dragState.current.moved) {
      dragState.current.moved = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    scrollerRef.current.scrollLeft = dragState.current.scrollLeft - distance;
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    const moved = dragState.current.moved;
    dragState.current.active = false;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (moved) {
      window.setTimeout(() => {
        dragState.current.moved = false;
      }, 0);
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className={`job-type-scrollbar overflow-x-auto border-y border-brandgray-250 select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        role="group"
        aria-label="Filter job offers by category"
        onScroll={updateScrollEdges}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
      >
        <div className="flex min-w-max">
          {options.map((option) => {
            const isActive = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={`flex cursor-pointer transition-all duration-300 hover:scale-95 h-24 w-20 shrink-0 flex-col items-center justify-center gap-2 border-r border-brandgray-250 px-2 text-center text-xs font-semibold leading-tight focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-brand-900 sm:h-26 sm:w-26 ${
                  isActive
                    ? "bg-brand-900 text-white"
                    : "bg-white text-brandgray-750 hover:bg-brandgray-100 hover:text-brand-900"
                }`}
                aria-pressed={isActive}
                onClick={(event) => {
                  if (dragState.current.moved) {
                    event.preventDefault();
                    dragState.current.moved = false;
                    return;
                  }

                  onValueChange(option.value);
                }}
              >
                <JobCategoryIcon category={option.value} />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {scrollEdges.left && (
        <button
          type="button"
          className="absolute left-2 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-brandgray-300 bg-white text-brand-900 shadow-[0_3px_12px_rgba(23,63,53,0.16)] transition hover:bg-brandgray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
          aria-label="Show previous job types"
          onClick={() => scrollByPage(-1)}
        >
          <ChevronLeftLineIcon aria-hidden="true" width="20" height="20" />
        </button>
      )}

      {scrollEdges.right && (
        <button
          type="button"
          className="absolute right-2 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-brandgray-300 bg-white text-brand-900 shadow-[0_3px_12px_rgba(23,63,53,0.16)] transition hover:bg-brandgray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-900"
          aria-label="Show more job types"
          onClick={() => scrollByPage(1)}
        >
          <ChevronRightLineIcon aria-hidden="true" width="20" height="20" />
        </button>
      )}
    </div>
  );
}
