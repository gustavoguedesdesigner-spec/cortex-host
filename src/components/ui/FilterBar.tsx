import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

/** Barra de filtros sem superfície pesada — apoia, não compete com os dados. */
export function FilterBar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap items-center gap-2', className)}>{children}</div>
}
