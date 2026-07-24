import { cn } from '@/utils/cn'

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({ options, value, onChange, className }: SegmentedControlProps<T>) {
  return (
    <div className={cn('inline-flex flex-wrap items-center gap-0.5 rounded-md bg-surface-2 border border-border p-0.5', className)} role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded px-3 py-1.5 text-support font-medium transition-colors',
            value === opt.value ? 'bg-surface-4 text-content-primary' : 'text-content-tertiary hover:text-content-secondary',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
