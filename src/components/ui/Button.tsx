import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-cortex-500 text-[#181009] hover:bg-cortex-400 active:bg-cortex-600 shadow-subtle',
  secondary: 'bg-surface-3 text-content-primary border border-border hover:bg-surface-4',
  ghost: 'bg-transparent text-content-secondary hover:bg-surface-3 hover:text-content-primary',
  danger: 'bg-status-critical/90 text-white hover:bg-status-critical',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-support gap-1.5 rounded',
  md: 'h-9 px-4 text-body gap-2 rounded-md',
  lg: 'h-11 px-5 text-body gap-2 rounded-md',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  },
)
Button.displayName = 'Button'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  variant?: Variant
  size?: Size
  active?: boolean
}

const iconSizeClasses: Record<Size, string> = {
  sm: 'h-7 w-7 rounded',
  md: 'h-9 w-9 rounded-md',
  lg: 'h-11 w-11 rounded-md',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant = 'ghost', size = 'md', active, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex items-center justify-center transition-colors duration-150 shrink-0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          active ? 'bg-surface-3 text-cortex-500' : variantClasses[variant],
          iconSizeClasses[size],
          className,
        )}
        {...props}
      >
        {icon}
      </button>
    )
  },
)
IconButton.displayName = 'IconButton'
