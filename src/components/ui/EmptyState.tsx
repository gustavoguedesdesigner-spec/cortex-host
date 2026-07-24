import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-subtle text-ink-tertiary">{icon}</div>
      <h3 className="text-card-title text-ink-primary">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-support text-ink-tertiary">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
