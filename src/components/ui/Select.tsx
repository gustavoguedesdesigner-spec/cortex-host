import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ options, label, id, className, ...props }, ref) => {
  const selectId = id ?? props.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-label text-ink-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-10 w-full cursor-pointer appearance-none rounded-md border border-border bg-surface pl-3.5 pr-8 text-support text-ink-primary',
            'outline-none transition-colors hover:border-border-strong focus:border-accent focus:ring-1 focus:ring-accent/30',
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-tertiary" strokeWidth={1.7} />
      </div>
    </div>
  )
})
Select.displayName = 'Select'
