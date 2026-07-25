import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { formatCurrencyBRL } from '@/utils/format'
import { recipeIssues } from '@/data/recipes/recipeIssues'
import { getRecipeById } from '@/data/recipes/recipes'

interface PriorityRow {
  recipeId: string
  nome: string
  categoria: string
  impacto: number
  ocorrencias: number
}

/** Prioridades de revisão (seção 17) — fichas com maior impacto financeiro agregado das inconsistências. */
export function RecipePrioritiesSection() {
  const navigate = useNavigate()

  const rows = Object.values(
    recipeIssues.reduce<Record<string, PriorityRow>>((acc, issue) => {
      if (!issue.impacto) return acc
      const recipe = getRecipeById(issue.recipeId)
      if (!recipe) return acc
      if (!acc[issue.recipeId]) {
        acc[issue.recipeId] = { recipeId: issue.recipeId, nome: recipe.nome, categoria: recipe.categoria, impacto: 0, ocorrencias: 0 }
      }
      acc[issue.recipeId].impacto += issue.impacto
      acc[issue.recipeId].ocorrencias += 1
      return acc
    }, {}),
  ).sort((a, b) => b.impacto - a.impacto)

  return (
    <section>
      <SectionHeader title="Prioridades de revisão" description="Fichas com maior impacto financeiro associado a inconsistências" />
      <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
        {rows.map((r) => (
          <button
            key={r.recipeId}
            onClick={() => navigate(`/fichas-tecnicas/${r.recipeId}`)}
            className="flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
          >
            <div className="min-w-0">
              <p className="truncate text-support font-medium text-ink-primary">{r.nome}</p>
              <p className="mt-0.5 text-caption text-ink-tertiary">
                {r.categoria} · {r.ocorrencias} {r.ocorrencias === 1 ? 'ocorrência' : 'ocorrências'}
              </p>
            </div>
            <span className="shrink-0 tabular text-support font-medium text-danger">{formatCurrencyBRL(r.impacto)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
