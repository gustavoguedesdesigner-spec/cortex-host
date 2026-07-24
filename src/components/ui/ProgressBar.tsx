import { cn } from '@/utils/cn'
import type { IndicatorStatus } from '@/types'

const fillClasses: Record<IndicatorStatus, string> = {
  success: 'bg-status-success',
  attention: 'bg-status-attention',
  critical: 'bg-status-critical',
  info: 'bg-status-info',
  neutral: 'bg-status-neutral',
}

interface ProgressBarProps {
  value: number // 0 a 1
  status?: IndicatorStatus
  className?: string
  label?: string
}

export function ProgressBar({ value, status = 'info', className, label }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value))

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && <span className="text-caption text-content-tertiary">{label}</span>}
      <div className="h-1.5 w-full rounded-full bg-surface-4 overflow-hidden" role="progressbar" aria-valuenow={Math.round(clamped * 100)} aria-valuemin={0} aria-valuemax={100}>
        <div className={cn('h-full rounded-full transition-all duration-300', fillClasses[status])} style={{ width: `${clamped * 100}%` }} />
      </div>
    </div>
  )
}
