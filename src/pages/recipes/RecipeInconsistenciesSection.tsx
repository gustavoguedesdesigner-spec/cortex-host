import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { formatCurrencyBRL } from '@/utils/format'
import { recipeIssues } from '@/data/recipes/recipeIssues'
import { getRecipeById } from '@/data/recipes/recipes'
import type { RecipeIssueType } from '@/types'

const tipoLabel: Record<RecipeIssueType, string> = {
  sem_rendimento: 'Sem rendimento',
  sem_conversao: 'Sem conversão',
  custo_desatualizado: 'Custo desatualizado',
  sem_ficha: 'Sem ficha',
  sem_aprovacao: 'Sem aprovação',
  subreceita_desatualizada: 'Sub-receita desatualizada',
  unidade_diferente_estoque: 'Unidade divergente do estoque',
  sem_preco_venda: 'Sem preço de venda',
  versao_expirada: 'Versão expirada',
  custo_zerado: 'Custo zerado',
  produto_duplicado: 'Produto duplicado',
}

const severidadeStatus = { alta: 'critical', media: 'attention', baixa: 'neutral' } as const

/** Bloco de inconsistências (seção 18) — largura total, lista completa com severidade e impacto. */
export function RecipeInconsistenciesSection() {
  const navigate = useNavigate()
  const rows = [...recipeIssues].sort((a, b) => (b.impacto ?? 0) - (a.impacto ?? 0))

  return (
    <section>
      <SectionHeader title="Inconsistências identificadas" description="Conversões, rendimentos, custos e aprovações que exigem atenção" />
      <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
        {rows.map((issue) => {
          const recipe = getRecipeById(issue.recipeId)
          return (
            <button
              key={issue.id}
              onClick={() => navigate(`/fichas-tecnicas/${issue.recipeId}`)}
              className="flex flex-col gap-2 px-4 py-3 text-left transition-colors hover:bg-surface-hover sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-support font-medium text-ink-primary">{issue.titulo}</p>
                  <IndicatorBadge status={severidadeStatus[issue.severidade]}>{tipoLabel[issue.tipo]}</IndicatorBadge>
                </div>
                <p className="mt-0.5 text-caption text-ink-tertiary">
                  {recipe?.nome ?? issue.recipeId} · {issue.descricao}
                </p>
              </div>
              {issue.impacto !== undefined && (
                <span className="shrink-0 tabular text-support font-medium text-danger">{formatCurrencyBRL(issue.impacto)}</span>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}
