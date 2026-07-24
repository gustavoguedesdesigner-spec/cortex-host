import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  label?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, label, id, className, ...props }, ref) => {
    const selectId = id ?? props.name

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-label text-content-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'h-9 w-full appearance-none rounded-md bg-surface-2 border border-border pl-3 pr-8 text-body text-content-primary',
              'transition-colors duration-150 outline-none cursor-pointer',
              'focus:border-cortex-500 focus:ring-1 focus:ring-cortex-500/40 hover:border-border-strong',
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
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary" />
        </div>
      </div>
    )
  },
)
Select.displayName = 'Select'
