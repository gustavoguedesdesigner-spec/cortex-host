import { cn } from '@/utils/cn'
import type {
  SupplierDivergenceStatus,
  SupplierDocumentStatus,
  SupplierNegotiationStatus,
  SupplierOperationalStatus,
  SupplierRegistrationStatus,
  SupplierRiskLevel,
} from '@/types'

const base = 'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap'

/* Status nunca comunicado so por cor — sempre ponto + texto. */

const registrationConfig: Record<SupplierRegistrationStatus, { label: string; classes: string; dot: string }> = {
  ativo: { label: 'Ativo', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  em_homologacao: { label: 'Em homologação', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  restrito: { label: 'Restrito', classes: 'bg-steel-soft text-steel', dot: 'bg-steel' },
  bloqueado: { label: 'Bloqueado', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  inativo: { label: 'Inativo', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
  arquivado: { label: 'Arquivado', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
}

export function SupplierRegistrationBadge({ status, className }: { status: SupplierRegistrationStatus; className?: string }) {
  const c = registrationConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const operationalConfig: Record<SupplierOperationalStatus, { label: string; classes: string; dot: string }> = {
  estrategico: { label: 'Estratégico', classes: 'bg-accent-soft text-accent', dot: 'bg-accent' },
  ativo: { label: 'Ativo', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  em_atencao: { label: 'Em atenção', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
}

export function SupplierOperationalBadge({ status, className }: { status: SupplierOperationalStatus; className?: string }) {
  const c = operationalConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const riskConfig: Record<SupplierRiskLevel, { label: string; classes: string; dot: string }> = {
  baixo: { label: 'Risco baixo', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  medio: { label: 'Risco médio', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  alto: { label: 'Risco alto', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
}

export function SupplierRiskBadge({ nivel, className }: { nivel: SupplierRiskLevel; className?: string }) {
  const c = riskConfig[nivel]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const divergenceConfig: Record<SupplierDivergenceStatus, { label: string; classes: string; dot: string }> = {
  aberta: { label: 'Aberta', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  em_negociacao: { label: 'Em negociação', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  credito_solicitado: { label: 'Crédito solicitado', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  resolvida: { label: 'Resolvida', classes: 'bg-success-soft text-success', dot: 'bg-success' },
}

export function SupplierDivergenceBadge({ status, className }: { status: SupplierDivergenceStatus; className?: string }) {
  const c = divergenceConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const documentConfig: Record<SupplierDocumentStatus, { label: string; classes: string; dot: string }> = {
  valido: { label: 'Válido', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  proximo_vencimento: { label: 'Próximo do vencimento', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  vencido: { label: 'Vencido', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  pendente: { label: 'Pendente', classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
}

export function SupplierDocumentBadge({ status, className }: { status: SupplierDocumentStatus; className?: string }) {
  const c = documentConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const negotiationConfig: Record<SupplierNegotiationStatus, { label: string; classes: string; dot: string }> = {
  aberta: { label: 'Aberta', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  em_andamento: { label: 'Em andamento', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  concluida: { label: 'Concluída', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  cancelada: { label: 'Cancelada', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
}

export function SupplierNegotiationBadge({ status, className }: { status: SupplierNegotiationStatus; className?: string }) {
  const c = negotiationConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

/** Selo numerico de score — cor por faixa, sem depender so da cor para o significado. */
export function SupplierScorePill({ score, className }: { score: number; className?: string }) {
  const tone = score >= 85 ? 'bg-success-soft text-success' : score >= 70 ? 'bg-info-soft text-info' : score >= 55 ? 'bg-warning-soft text-warning' : 'bg-danger-soft text-danger'
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-support font-semibold tabular', tone, className)}>
      {score}
      <span className="font-normal opacity-70">/100</span>
    </span>
  )
}
