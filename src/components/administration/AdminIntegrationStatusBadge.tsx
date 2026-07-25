import { cn } from '@/utils/cn'
import type { IntegrationStatus } from '@/types'

const config: Record<IntegrationStatus, { label: string; classes: string; dot: string }> = {
  ativa: { label: 'Ativa', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  atualizando: { label: 'Atualizando', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  atencao: { label: 'Atenção', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  erro: { label: 'Erro', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  pausada: { label: 'Pausada', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
  nao_configurada: { label: 'Não configurada', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
  expirada: { label: 'Expirada', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  desconectada: { label: 'Desconectada', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
}

export function AdminIntegrationStatusBadge({ status, className }: { status: IntegrationStatus; className?: string }) {
  const c = config[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap', c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}
