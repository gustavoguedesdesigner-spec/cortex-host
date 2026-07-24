import { forwardRef, type InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const inputId = id ?? props.name

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-label text-content-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full rounded-md bg-surface-2 border border-border px-3 text-body text-content-primary placeholder:text-content-tertiary',
            'transition-colors duration-150 outline-none',
            'focus:border-cortex-500 focus:ring-1 focus:ring-cortex-500/40',
            error && 'border-status-critical focus:border-status-critical focus:ring-status-critical/40',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error ? (
          <span id={`${inputId}-error`} className="text-support text-status-critical">
            {error}
          </span>
        ) : hint ? (
          <span id={`${inputId}-hint`} className="text-support text-content-tertiary">
            {hint}
          </span>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, wrapperClassName, placeholder = 'Buscar...', ...props }, ref) => {
    return (
      <div className={cn('relative flex items-center', wrapperClassName)}>
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-content-tertiary" />
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          className={cn(
            'h-9 w-full rounded-md bg-surface-2 border border-border pl-9 pr-3 text-body text-content-primary placeholder:text-content-tertiary',
            'transition-colors duration-150 outline-none focus:border-cortex-500 focus:ring-1 focus:ring-cortex-500/40',
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)
SearchInput.displayName = 'SearchInput'
