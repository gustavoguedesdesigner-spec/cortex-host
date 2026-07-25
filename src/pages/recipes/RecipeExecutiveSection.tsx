import { Eye, Search } from 'lucide-react'
import { ExecutiveSummaryCard } from '@/components/cortex/ExecutiveSummaryCard'
import { Button } from '@/components/ui/Button'
import { formatPercent } from '@/utils/format'
import { recipeExecutiveRecommendations, recipeExecutiveSummaryText, recipeQualityOverall, recipeSituation } from '@/data/recipes/recipeSummary'

export function RecipeExecutiveSection({
  onVerInconsistencias,
  onAbrirCriticos,
  onCriarRevisao,
  onAskCortex,
}: {
  onVerInconsistencias: () => void
  onAbrirCriticos: () => void
  onCriarRevisao: () => void
  onAskCortex: () => void
}) {
  return (
    <ExecutiveSummaryCard
      text={recipeExecutiveSummaryText}
      recommendations={recipeExecutiveRecommendations}
      onAnalyzeCauses={onAbrirCriticos}
      onViewActionPlan={onCriarRevisao}
      onAskCortex={onAskCortex}
      aside={
        <div className="flex h-full flex-col gap-4">
          <div>
            <p className="text-caption text-ink-tertiary">Qualidade geral das fichas</p>
            <p className="mt-1 text-metric-sm tabular text-ink-primary">{formatPercent(recipeQualityOverall.percentual, 0)}</p>
            <p className="mt-0.5 text-caption text-ink-tertiary">Meta: {formatPercent(recipeQualityOverall.meta, 0)}</p>
          </div>
          <div>
            <p className="mb-1 text-label text-ink-tertiary">Aprovações</p>
            <ul className="flex flex-col gap-1 text-support text-ink-secondary">
              <li>{recipeSituation.revisoesAguardandoAprovacao} revisões aguardando aprovação</li>
              <li>{recipeSituation.emRevisao} fichas em revisão</li>
              <li>{recipeSituation.semFichaCompleta} produtos sem ficha completa</li>
            </ul>
          </div>
          <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-3">
            <Button size="sm" variant="secondary" leftIcon={<Eye className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onVerInconsistencias}>
              Ver inconsistências
            </Button>
            <Button size="sm" variant="ghost" leftIcon={<Search className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onAbrirCriticos}>
              Abrir produtos críticos
            </Button>
          </div>
        </div>
      }
    />
  )
}
