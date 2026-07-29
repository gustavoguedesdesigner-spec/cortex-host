import { cn } from '@/utils/cn'
import type {
  ChecklistRunStatus,
  KnowledgeObligation,
  KnowledgeStatus,
  NonConformityCriticality,
  NonConformityStatus,
  TrainingProgressStatus,
} from '@/types'

const base = 'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap'

/* Status nunca comunicado so por cor — sempre ponto + texto. */

const statusConfig: Record<KnowledgeStatus, { label: string; classes: string; dot: string }> = {
  rascunho: { label: 'Rascunho', classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
  em_revisao: { label: 'Em revisão', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  aguardando_aprovacao: { label: 'Aguardando aprovação', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  aprovado: { label: 'Aprovado', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  publicado: { label: 'Publicado', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  revisao_recomendada: { label: 'Revisão recomendada', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  expirado: { label: 'Expirado', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  substituido: { label: 'Substituído', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
  arquivado: { label: 'Arquivado', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
  bloqueado: { label: 'Bloqueado', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
}

export function KnowledgeStatusBadge({ status, className }: { status: KnowledgeStatus; className?: string }) {
  const c = statusConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const obligationConfig: Record<KnowledgeObligation, { label: string; classes: string; dot: string }> = {
  obrigatorio: { label: 'Obrigatório', classes: 'bg-accent-soft text-accent', dot: 'bg-accent' },
  recomendado: { label: 'Recomendado', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  referencia: { label: 'Referência', classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
  restrito: { label: 'Restrito', classes: 'bg-steel-soft text-steel', dot: 'bg-steel' },
}

export function ObligationBadge({ obrigatoriedade, className }: { obrigatoriedade: KnowledgeObligation; className?: string }) {
  const c = obligationConfig[obrigatoriedade]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const trainingConfig: Record<TrainingProgressStatus, { label: string; classes: string; dot: string }> = {
  nao_iniciado: { label: 'Não iniciado', classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
  em_andamento: { label: 'Em andamento', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  concluido: { label: 'Concluído', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  reprovado: { label: 'Reprovado', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  vencido: { label: 'Vencido', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
}

export function TrainingStatusBadge({ status, className }: { status: TrainingProgressStatus; className?: string }) {
  const c = trainingConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const runConfig: Record<ChecklistRunStatus, { label: string; classes: string; dot: string }> = {
  planejado: { label: 'Planejado', classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
  em_execucao: { label: 'Em execução', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  pausado: { label: 'Pausado', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  incompleto: { label: 'Incompleto', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  concluido: { label: 'Concluído', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  atrasado: { label: 'Atrasado', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
}

export function ChecklistRunBadge({ status, className }: { status: ChecklistRunStatus; className?: string }) {
  const c = runConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const ncStatusConfig: Record<NonConformityStatus, { label: string; classes: string; dot: string }> = {
  aberta: { label: 'Aberta', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  em_analise: { label: 'Em análise', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  acao_definida: { label: 'Ação definida', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  em_correcao: { label: 'Em correção', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  aguardando_validacao: { label: 'Aguardando validação', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  resolvida: { label: 'Resolvida', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  reaberta: { label: 'Reaberta', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
}

export function NonConformityStatusBadge({ status, className }: { status: NonConformityStatus; className?: string }) {
  const c = ncStatusConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

const criticalityConfig: Record<NonConformityCriticality, { label: string; classes: string; dot: string }> = {
  alta: { label: 'Alta', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  media: { label: 'Média', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  baixa: { label: 'Baixa', classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
}

export function CriticalityBadge({ criticidade, className }: { criticidade: NonConformityCriticality; className?: string }) {
  const c = criticalityConfig[criticidade]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}
