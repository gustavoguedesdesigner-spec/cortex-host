import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export function DataList({ items, className }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={cn('divide-y divide-border', className)}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
          <dt className="text-support text-ink-secondary">{item.label}</dt>
          <dd className="text-support font-medium tabular text-ink-primary">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
