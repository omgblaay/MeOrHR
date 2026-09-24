import { createContext, forwardRef, useContext } from 'react'
import type { HTMLAttributes, MouseEvent } from 'react'
import Button from './Button'
import type { ButtonProps } from './Button'

type ToggleGroupContextValue = {
  value: string
  onValueChange: (value: string) => void
  disabled: boolean
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)

export type ToggleGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
}

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ children, className = "bg-slate-100 rounded-[20px] p-0.5", disabled = false, onValueChange, value, ...props }, ref) => (
    <ToggleGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <div ref={ref} role="group" className={className} {...props}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  ),
)

ToggleGroup.displayName = 'ToggleGroup'

export type ToggleGroupItemProps = Omit<ButtonProps, 'active'> & {
  value: string
}

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ children, disabled = false, onClick, size = 'sm', value, variant = 'filter', ...props }, ref) => {
    const group = useContext(ToggleGroupContext)

    if (!group) {
      throw new Error('ToggleGroupItem must be used inside ToggleGroup')
    }

    const isActive = group.value === value

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)

      if (!event.defaultPrevented && !isActive) {
        group.onValueChange(value)
      }
    }

    return (
      <Button
        {...props}
        ref={ref}
        variant={variant}
        size={size}
        active={isActive}
        aria-pressed={isActive}
        data-state={isActive ? 'on' : 'off'}
        disabled={group.disabled || disabled}
        onClick={handleClick}
      >
        {children}
      </Button>
    )
  },
)

ToggleGroupItem.displayName = 'ToggleGroupItem'
