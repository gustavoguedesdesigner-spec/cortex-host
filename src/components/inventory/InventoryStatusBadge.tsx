import { cn } from '@/utils/cn'
import { inventoryStatusLabel } from '@/utils/inventoryConfidence'
import type { InventoryItemStatus } from '@/types'

const classesByStatus: Record<InventoryItemStatus, { classes: string; dot: string }> = {
  normal: { classes: 'bg-success-soft text-success', dot: 'bg-success' },
  abaixo_minimo: { classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  risco_ruptura: { classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  excesso: { classes: 'bg-info-soft text-info', dot: 'bg-info' },
  sem_movimentacao: { classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
  divergente: { classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  dados_insuficientes: { classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
}

export function InventoryStatusBadge({ status, className }: { status: InventoryItemStatus; className?: string }) {
  const c = classesByStatus[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap', c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {inventoryStatusLabel[status]}
    </span>
  )
}
