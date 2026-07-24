import { useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface TabItem {
  id: string
  label: string
  badge?: ReactNode
}

export function Tabs({
  items,
  defaultTabId,
  onChange,
  className,
}: {
  items: TabItem[]
  defaultTabId?: string
  onChange?: (id: string) => void
  className?: string
}) {
  const [active, setActive] = useState(defaultTabId ?? items[0]?.id)

  return (
    <div className={cn('flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-border', className)} role="tablist">
      {items.map((item) => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              setActive(item.id)
              onChange?.(item.id)
            }}
            className={cn(
              'relative flex shrink-0 items-center gap-2 px-3 py-2.5 text-support font-medium transition-colors',
              isActive ? 'text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary',
            )}
          >
            {item.label}
            {item.badge}
            {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />}
          </button>
        )
      })}
    </div>
  )
}
