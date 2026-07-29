import { cn } from '@/utils/cn'
import type { DocumentConfidenceLevel, QuarantineStatus, ReceiptFieldStatus, ReceiptStatus } from '@/types'

const base = 'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap'

/* Status nunca comunicado so por cor — sempre ponto + texto. */

const statusConfig: Record<ReceiptStatus, { label: string; classes: string; dot: string }> = {
  aguardando: { label: 'Aguardando', classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
  em_conferencia: { label: 'Em conferência', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  conforme: { label: 'Conforme', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  divergente: { label: 'Divergente', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  quarentena: { label: 'Em quarentena', classes: 'bg-steel-soft text-steel', dot: 'bg-steel' },
  concluido: { label: 'Concluído', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  recusado: { label: 'Recusado', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
}

export function ReceiptStatusBadge({ status, className }: { status: ReceiptStatus; className?: string }) {
  const c = statusConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const fieldConfig: Record<ReceiptFieldStatus, { label: string; classes: string; dot: string }> = {
  conforme: { label: 'Conforme', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  divergente: { label: 'Divergente', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  nao_aplicavel: { label: 'Não avaliado', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
}

export function ReceiptFieldBadge({ status, className }: { status: ReceiptFieldStatus; className?: string }) {
  const c = fieldConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const confidenceConfig: Record<DocumentConfidenceLevel, { label: string; classes: string; dot: string }> = {
  alta: { label: 'Confiança alta', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  media: { label: 'Confiança média', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  baixa: { label: 'Confiança baixa', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
}

export function DocumentConfidenceBadge({ nivel, className }: { nivel: DocumentConfidenceLevel; className?: string }) {
  const c = confidenceConfig[nivel]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const quarantineConfig: Record<QuarantineStatus, { label: string; classes: string; dot: string }> = {
  em_analise: { label: 'Em análise', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  liberado: { label: 'Liberado', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  descartado: { label: 'Descartado', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  devolvido: { label: 'Devolvido ao fornecedor', classes: 'bg-steel-soft text-steel', dot: 'bg-steel' },
}

export function QuarantineStatusBadge({ status, className }: { status: QuarantineStatus; className?: string }) {
  const c = quarantineConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}
