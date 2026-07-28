import { forwardRef, type InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

const fieldBase =
  'w-full rounded-md border border-border bg-surface text-body text-ink-primary placeholder:text-ink-tertiary outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, hint, error, id, className, ...props }, ref) => {
  const inputId = id ?? props.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-label text-ink-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(fieldBase, 'h-10 px-3', error && 'border-danger focus:border-danger focus:ring-danger/30', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="text-caption text-danger">
          {error}
        </span>
      ) : hint ? (
        <span id={`${inputId}-hint`} className="text-caption text-ink-tertiary">
          {hint}
        </span>
      ) : null}
    </div>
  )
})
Input.displayName = 'Input'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, wrapperClassName, placeholder = 'Buscar...', ...props }, ref) => (
    <div className={cn('relative flex items-center', wrapperClassName)}>
      <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-ink-tertiary" strokeWidth={1.7} />
      <input ref={ref} type="search" placeholder={placeholder} className={cn(fieldBase, 'h-10 rounded-full pl-10 pr-4', className)} {...props} />
    </div>
  ),
)
SearchInput.displayName = 'SearchInput'
