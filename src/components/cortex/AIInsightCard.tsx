import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import type { AIInsight, InsightPriority } from '@/types'
import { CortexMark } from './CortexMark'

const priorityConfig: Record<InsightPriority, { label: string; classes: string }> = {
  alta: { label: 'Prioridade alta', classes: 'bg-status-criticalBg text-status-critical border-status-critical/30' },
  media: { label: 'Prioridade média', classes: 'bg-status-attentionBg text-status-attention border-status-attention/30' },
  baixa: { label: 'Prioridade baixa', classes: 'bg-status-infoBg text-status-info border-status-info/30' },
}

interface AIInsightCardProps {
  insight: AIInsight
  onAnalyze?: () => void
  onViewDetails?: () => void
}

export function AIInsightCard({ insight, onAnalyze, onViewDetails }: AIInsightCardProps) {
  const priority = priorityConfig[insight.prioridade]

  return (
    <div className="rounded-lg bg-surface-2 border border-border-subtle p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cortex-900/60 text-cortex-400">
            <CortexMark className="h-4 w-4" />
          </span>
          <span className="text-caption text-content-tertiary font-semibold uppercase tracking-wide">CORTEX Insight</span>
        </div>
        <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-badge shrink-0', priority.classes)}>
          {priority.label}
        </span>
      </div>

      <div>
        <h3 className="text-card-title text-content-primary">{insight.titulo}</h3>
        <p className="text-support text-content-secondary mt-1">{insight.texto}</p>
      </div>

      {insight.unidadesAfetadas && (
        <div className="flex flex-wrap gap-1.5">
          {insight.unidadesAfetadas.map((u) => (
            <span key={u} className="rounded-full bg-surface-3 border border-border-subtle px-2 py-0.5 text-caption text-content-tertiary">
              {u}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 rounded-md bg-surface-3/60 p-3 sm:grid-cols-2">
        <div>
          <p className="text-caption text-content-tertiary">Impacto financeiro estimado</p>
          <p className="text-support font-semibold text-status-critical mt-0.5">{insight.impactoFinanceiro}</p>
        </div>
        <div>
          <p className="text-caption text-content-tertiary">Ação recomendada</p>
          <p className="text-support text-content-primary mt-0.5">{insight.acaoRecomendada}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
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
