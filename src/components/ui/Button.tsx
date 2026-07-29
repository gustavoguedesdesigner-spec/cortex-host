import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'navy' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary: 'bg-surface-raised text-ink-primary border border-border hover:border-border-strong hover:bg-surface-hover',
  ghost: 'bg-transparent text-ink-secondary hover:bg-surface-subtle hover:text-ink-primary',
  navy: 'bg-navy text-white hover:bg-navy-hover',
  danger: 'bg-danger-solid text-white hover:opacity-90',
}

/* Botões em formato pill — ações destacadas com boa área de toque. */
const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-support gap-1.5 rounded-full',
  md: 'h-10 px-5 text-support gap-2 rounded-full',
  lg: 'h-11 px-6 text-body gap-2 rounded-full',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors',
        'disabled:opacity-40 disabled:cursor-not-allowed',
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
  ),
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
  sm: 'h-8 w-8 rounded-full',
  md: 'h-10 w-10 rounded-full',
  lg: 'h-11 w-11 rounded-full',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, variant = 'ghost', size = 'md', active, className, ...props }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center transition-colors disabled:opacity-40',
        active ? 'bg-accent-soft text-accent' : variantClasses[variant],
        iconSizeClasses[size],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  ),
)
IconButton.displayName = 'IconButton'
