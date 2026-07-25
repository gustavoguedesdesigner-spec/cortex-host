import { cn } from '@/utils/cn'
import type { RecipeStatus } from '@/types'

const config: Record<RecipeStatus, { label: string; classes: string; dot: string }> = {
  rascunho: { label: 'Rascunho', classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
  em_revisao: { label: 'Em revisão', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  aguardando_aprovacao: { label: 'Aguardando aprovação', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  aprovada: { label: 'Aprovada', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  rejeitada: { label: 'Rejeitada', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  publicada: { label: 'Publicada', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  substituida: { label: 'Substituída', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
  arquivada: { label: 'Arquivada', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
}

export function RecipeStatusBadge({ status, className }: { status: RecipeStatus; className?: string }) {
  const c = config[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap', c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}
