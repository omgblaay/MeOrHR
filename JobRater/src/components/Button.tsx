import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'filter' | 'icon'
type ButtonSize = 'sm' | 'md' | 'icon'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  active?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'rounded-md bg-[#eaff6a] text-[#173f35] hover:bg-[#def258]',
  secondary: 'rounded-md border border-[#cfd5cf] bg-white text-[#465149] hover:border-[#8f9b93]',
  filter: 'rounded-full border',
  icon:
    'rounded-md border  border-[#dfe3dd] bg-white text-[#536058] hover:border-[#173f35] hover:bg-[#f1f5f1] hover:text-[#173f35]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  icon: 'size-9 p-0',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ active = false, children, className = '', size = 'md', variant = 'primary', ...props }, ref) => {
    const filterClasses =
      variant === 'filter'
        ? active
          ? 'bg-[#173f35] text-white '
          : 'border-none text-[#465149] hover:bg-red'
        : ''

    return (
      <button
        ref={ref}
        type="button"
        className={`cursor-pointer inline-flex shrink-0 items-center justify-center font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 gap-2 focus-visible:outline-[#173f35] disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${filterClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
