import { useNavigate } from 'react-router-dom'
import { RecipeBreadcrumb } from '@/components/recipes/RecipeBreadcrumb'
import { RecipeInternalNav } from '@/components/recipes/RecipeInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { RecipeInconsistenciesSection } from './recipes/RecipeInconsistenciesSection'
import { recipeIssues } from '@/data/recipes/recipeIssues'
import { formatCurrencyBRL } from '@/utils/format'
import { useAppState } from '@/context/AppStateContext'

export default function RecipeInconsistencies() {
  const navigate = useNavigate()
  const { askCortex } = useAppState()

  const impactoTotal = recipeIssues.reduce((sum, i) => sum + (i.impacto ?? 0), 0)
  const criticas = recipeIssues.filter((i) => i.severidade === 'alta').length
  const receitasAfetadas = new Set(recipeIssues.map((i) => i.recipeId)).size

  return (
    <div className="flex flex-col gap-6">
      <RecipeBreadcrumb trail={[{ label: 'Inconsistências' }]} />

      <PageHeader
        eyebrow="Conhecimento"
        title="Inconsistências"
        description="Conversões, rendimentos, custos e aprovações pendentes que comprometem a confiabilidade do CMV teórico."
      />

      <RecipeInternalNav active="inconsistencias" />

      <MetricStrip className="sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard titulo="Inconsistências abertas" valor={String(recipeIssues.length)} status="attention" />
        <MetricCard titulo="Críticas" valor={String(criticas)} status="critical" />
        <MetricCard titulo="Fichas afetadas" valor={String(receitasAfetadas)} status="neutral" />
        <MetricCard titulo="Impacto potencial" valor={formatCurrencyBRL(impactoTotal)} status="critical" />
      </MetricStrip>

      <RecipeInconsistenciesSection />

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <span className="text-caption text-ink-tertiary">Precisa de ajuda para priorizar?</span>
        <button className="text-caption font-medium text-accent hover:underline" onClick={() => askCortex('Quais inconsistências devo resolver primeiro?', 'Inconsistências de fichas técnicas')}>
          Perguntar ao CORTEX
        </button>
        <button className="text-caption font-medium text-accent hover:underline" onClick={() => navigate('/fichas-tecnicas/revisoes')}>
          Ver revisões pendentes
        </button>
      </div>
    </div>
  )
}
