import { cn } from '@/utils/cn'
import type { PurchaseUrgency } from '@/types'

const config: Record<PurchaseUrgency, { label: string; classes: string; dot: string }> = {
  critica: { label: 'Crítica', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  alta: { label: 'Alta', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  media: { label: 'Média', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  baixa: { label: 'Baixa', classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
}

export function UrgencyBadge({ urgencia, className }: { urgencia: PurchaseUrgency; className?: string }) {
  const c = config[urgencia]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap', c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}
