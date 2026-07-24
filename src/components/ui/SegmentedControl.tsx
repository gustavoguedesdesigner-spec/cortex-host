import { cn } from '@/utils/cn'

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div className={cn('inline-flex flex-wrap items-center gap-0.5 rounded-md border border-border bg-surface p-0.5', className)} role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'rounded px-2.5 py-1.5 text-support font-medium transition-colors',
            value === opt.value ? 'bg-surface-subtle text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
