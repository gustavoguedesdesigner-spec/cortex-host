import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-14 px-6', className)}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-3 text-content-tertiary">
        {icon}
      </div>
      <h3 className="text-card-title text-content-primary mb-1.5">{title}</h3>
      {description && <p className="text-support text-content-tertiary max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
