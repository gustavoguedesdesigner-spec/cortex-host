import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface DataListItem {
  label: string
  value: ReactNode
}

export function DataList({ items, className }: { items: DataListItem[]; className?: string }) {
  return (
    <dl className={cn('divide-y divide-border-subtle', className)}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
          <dt className="text-support text-content-tertiary">{item.label}</dt>
          <dd className="text-body text-content-primary font-medium text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
