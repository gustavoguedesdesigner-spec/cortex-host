import type { ReactNode } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/utils/cn'

export function FilterBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2.5 rounded-md bg-surface-2 border border-border-subtle p-2.5', className)}>
      <span className="flex items-center gap-1.5 text-label text-content-tertiary pl-1.5 pr-1">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filtros
      </span>
      {children}
    </div>
  )
}
