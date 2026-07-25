import { cn } from '@/utils/cn'
import type { PurchaseOrderStatus } from '@/types'

const config: Record<PurchaseOrderStatus, { label: string; classes: string; dot: string }> = {
  emitido: { label: 'Emitido', classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
  confirmado: { label: 'Confirmado', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  aguardando_entrega: { label: 'Aguardando entrega', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  parcialmente_recebido: { label: 'Parcialmente recebido', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  divergente: { label: 'Divergente', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  atrasado: { label: 'Atrasado', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  concluido: { label: 'Concluído', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  cancelado: { label: 'Cancelado', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
}

export function OrderStatusBadge({ status, className }: { status: PurchaseOrderStatus; className?: string }) {
  const c = config[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap', c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}
