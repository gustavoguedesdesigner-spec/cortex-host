import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import type { AIInsight, InsightPriority } from '@/types'
import { CortexLabel } from './CortexButton'

const priorityConfig: Record<InsightPriority, { label: string; classes: string; dot: string }> = {
  alta: { label: 'Prioridade alta', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  media: { label: 'Prioridade média', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  baixa: { label: 'Prioridade baixa', classes: 'bg-info-soft text-info', dot: 'bg-info' },
}

export function AIInsightCard({
  insight,
  onAnalyze,
  onViewDetails,
}: {
  insight: AIInsight
  onAnalyze?: () => void
  onViewDetails?: () => void
}) {
  const priority = priorityConfig[insight.prioridade]

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <CortexLabel />
        <span className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-badge', priority.classes)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', priority.dot)} aria-hidden="true" />
          {priority.label}
        </span>
      </div>

      <div>
        <h3 className="text-card-title">{insight.titulo}</h3>
        <p className="mt-1 text-support leading-relaxed text-ink-secondary">{insight.texto}</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-3">
        <div>
          <p className="text-caption text-ink-tertiary">Impacto estimado</p>
          <p className="text-support font-medium tabular text-danger">{insight.impactoFinanceiro}</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-caption text-ink-tertiary">Ação recomendada</p>
          <p className="text-support text-ink-primary">{insight.acaoRecomendada}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="primary" onClick={onAnalyze}>
          Analisar
        </Button>
        <Button size="sm" variant="secondary" onClick={onViewDetails}>
          Ver detalhes
        </Button>
      </div>
    </div>
  )
}
