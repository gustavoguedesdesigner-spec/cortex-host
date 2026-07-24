import { cn } from '@/utils/cn'
import type { IndicatorStatus } from '@/types'

const fillClasses: Record<IndicatorStatus, string> = {
  success: 'bg-success',
  attention: 'bg-warning',
  critical: 'bg-danger',
  info: 'bg-info',
  neutral: 'bg-ink-tertiary',
}

export function ProgressBar({
  value,
  status = 'info',
  className,
  label,
  valueLabel,
}: {
  value: number
  status?: IndicatorStatus
  className?: string
  label?: string
  valueLabel?: string
}) {
  const clamped = Math.min(1, Math.max(0, value))
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || valueLabel) && (
        <div className="flex items-center justify-between text-caption">
          {label && <span className="text-ink-secondary">{label}</span>}
          {valueLabel && <span className="tabular text-ink-primary">{valueLabel}</span>}
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle"
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={cn('h-full rounded-full transition-all', fillClasses[status])} style={{ width: `${clamped * 100}%` }} />
      </div>
    </div>
  )
}
