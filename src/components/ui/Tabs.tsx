import { useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface TabItem {
  id: string
  label: string
  badge?: ReactNode
}

interface TabsProps {
  items: TabItem[]
  defaultTabId?: string
  onChange?: (id: string) => void
  className?: string
}

export function Tabs({ items, defaultTabId, onChange, className }: TabsProps) {
  const [active, setActive] = useState(defaultTabId ?? items[0]?.id)

  function handleSelect(id: string) {
    setActive(id)
    onChange?.(id)
  }

  return (
    <div className={cn('flex items-center gap-1 border-b border-border-subtle', className)} role="tablist">
      {items.map((item) => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(item.id)}
            className={cn(
              'relative flex items-center gap-2 px-3.5 py-2.5 text-support font-medium transition-colors',
              isActive ? 'text-content-primary' : 'text-content-tertiary hover:text-content-secondary',
            )}
          >
            {item.label}
            {item.badge}
            {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cortex-500 rounded-full" />}
          </button>
        )
      })}
    </div>
  )
}
