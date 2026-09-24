import { useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentType, PointerEvent, WheelEvent } from 'react'
import AcademicCapLineIcon from '@iconify-react/majesticons/academic-cap-line'
import AnalyticsLineIcon from '@iconify-react/majesticons/analytics-line'
import ApplicationsLineIcon from '@iconify-react/majesticons/applications-line'
import BeakerLineIcon from '@iconify-react/majesticons/beaker-line'
import BriefcaseLineIcon from '@iconify-react/majesticons/briefcase-line'
import BugLineIcon from '@iconify-react/majesticons/bug-2-line'
import ChevronLeftLineIcon from '@iconify-react/majesticons/chevron-left-line'
import ChevronRightLineIcon from '@iconify-react/majesticons/chevron-right-line'
import CodeBlockLineIcon from '@iconify-react/majesticons/code-block-line'
import CodeLineIcon from '@iconify-react/majesticons/code-line'
import ColorSwatchLineIcon from '@iconify-react/majesticons/color-swatch-line'
import CpuLineIcon from '@iconify-react/majesticons/cpu-line'
import DataLineIcon from '@iconify-react/majesticons/data-line'
import DatabaseLineIcon from '@iconify-react/majesticons/database-line'
import DesktopComputerLineIcon from '@iconify-react/majesticons/desktop-computer-line'
import DeviceMobileLineIcon from '@iconify-react/majesticons/device-mobile-line'
import GlobeGridLineIcon from '@iconify-react/majesticons/globe-grid-line'
import PresentationChartLineIcon from '@iconify-react/majesticons/presentation-chart-line'
import RobotLineIcon from '@iconify-react/majesticons/robot-line'
import ServerLineIcon from '@iconify-react/majesticons/server-line'
import SettingsCogLineIcon from '@iconify-react/majesticons/settings-cog-line'
import ShieldLineIcon from '@iconify-react/majesticons/shield-line'
import SupportLineIcon from '@iconify-react/majesticons/support-line'
import TerminalLineIcon from '@iconify-react/majesticons/terminal-line'

type IconComponent = ComponentType<{ 'aria-hidden'?: boolean | 'true' | 'false'; height?: string; width?: string }>

type JobTypeOption = {
  value: string
  label: string
}

type JobTypeScrollerProps = {
  options: JobTypeOption[]
  value: string
  onValueChange: (value: string) => void
}

const categoryIcons: Record<string, IconComponent> = {
  all: ApplicationsLineIcon,
  'AI/ML': RobotLineIcon,
  JavaScript: CodeLineIcon,
  HTML: CodeBlockLineIcon,
  PHP: TerminalLineIcon,
  Ruby: BeakerLineIcon,
  Python: TerminalLineIcon,
  Java: CodeBlockLineIcon,
  '.NET': DesktopComputerLineIcon,
  Scala: CodeLineIcon,
  C: CpuLineIcon,
  Mobile: DeviceMobileLineIcon,
  Testing: BugLineIcon,
  DevOps: ServerLineIcon,
  Admin: SettingsCogLineIcon,
  'UX/UI': ColorSwatchLineIcon,
  PM: PresentationChartLineIcon,
  Game: CpuLineIcon,
  Analytics: AnalyticsLineIcon,
  Security: ShieldLineIcon,
  Data: DataLineIcon,
  Go: GlobeGridLineIcon,
  Support: SupportLineIcon,
  ERP: DatabaseLineIcon,
  Architecture: BriefcaseLineIcon,
  Other: AcademicCapLineIcon,
}

export default function JobTypeScroller({ options, value, onValueChange }: JobTypeScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ active: false, moved: false, scrollLeft: 0, startX: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: true })

  const updateScrollEdges = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth
    const nextEdges = {
      left: scroller.scrollLeft > 2,
      right: scroller.scrollLeft < maxScrollLeft - 2,
    }

    setScrollEdges((currentEdges) =>
      currentEdges.left === nextEdges.left && currentEdges.right === nextEdges.right ? currentEdges : nextEdges,
    )
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const resizeObserver = new ResizeObserver(updateScrollEdges)
    resizeObserver.observe(scroller)
    const frame = window.requestAnimationFrame(updateScrollEdges)

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [options.length, updateScrollEdges])

  const scrollByPage = (direction: -1 | 1) => {
    const scroller = scrollerRef.current
    if (!scroller) return

    scroller.scrollBy({
      behavior: 'smooth',
      left: direction * Math.max(96, scroller.clientWidth - 104),
    })
  }

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!scrollerRef.current || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

    event.preventDefault()
    scrollerRef.current.scrollLeft += event.deltaY
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !scrollerRef.current) return

    dragState.current = {
      active: true,
      moved: false,
      scrollLeft: scrollerRef.current.scrollLeft,
      startX: event.clientX,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || !scrollerRef.current) return

    const distance = event.clientX - dragState.current.startX
    if (Math.abs(distance) > 4 && !dragState.current.moved) {
      dragState.current.moved = true
      setIsDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    scrollerRef.current.scrollLeft = dragState.current.scrollLeft - distance
  }

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return

    const moved = dragState.current.moved
    dragState.current.active = false
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (moved) {
      window.setTimeout(() => {
        dragState.current.moved = false
      }, 0)
    }
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className={`job-type-scrollbar overflow-x-auto border-y border-[#dfe3dd] select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
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
            const Icon = categoryIcons[option.value] ?? BriefcaseLineIcon
            const isActive = value === option.value

            return (
              <button
                key={option.value}
                type="button"
                className={`flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-2 border-r border-[#dfe3dd] px-2 text-center text-xs font-semibold leading-tight transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#173f35] sm:h-26 sm:w-26 ${
                  isActive
                    ? 'bg-[#173f35] text-white'
                    : 'bg-white text-[#465149] hover:bg-[#f2f5f1] hover:text-[#173f35]'
                }`}
                aria-pressed={isActive}
                onClick={(event) => {
                  if (dragState.current.moved) {
                    event.preventDefault()
                    dragState.current.moved = false
                    return
                  }

                  onValueChange(option.value)
                }}
              >
                <Icon aria-hidden="true" width="22" height="22" />
                <span className="line-clamp-2 min-h-8">{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {scrollEdges.left && (
        <button
          type="button"
          className="absolute left-2 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-[#cfd5cf] bg-white text-[#173f35] shadow-[0_3px_12px_rgba(23,63,53,0.16)] transition hover:bg-[#f2f5f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173f35]"
          aria-label="Show previous job types"
          onClick={() => scrollByPage(-1)}
        >
          <ChevronLeftLineIcon aria-hidden="true" width="20" height="20" />
        </button>
      )}

      {scrollEdges.right && (
        <button
          type="button"
          className="absolute right-2 top-1/2 z-20 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-[#cfd5cf] bg-white text-[#173f35] shadow-[0_3px_12px_rgba(23,63,53,0.16)] transition hover:bg-[#f2f5f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173f35]"
          aria-label="Show more job types"
          onClick={() => scrollByPage(1)}
        >
          <ChevronRightLineIcon aria-hidden="true" width="20" height="20" />
        </button>
      )}
    </div>
  )
}
