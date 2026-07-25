import { cn } from '@/utils/cn'
import type { QuotationStatus } from '@/types'

const config: Record<QuotationStatus, { label: string; classes: string; dot: string }> = {
  em_andamento: { label: 'Em andamento', classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
  aguardando_respostas: { label: 'Aguardando respostas', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  pronta_para_decisao: { label: 'Pronta para decisão', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  decidida: { label: 'Decidida', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  convertida_pedido: { label: 'Convertida em pedido', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  cancelada: { label: 'Cancelada', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
}

export function QuotationStatusBadge({ status, className }: { status: QuotationStatus; className?: string }) {
  const c = config[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap', c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}
