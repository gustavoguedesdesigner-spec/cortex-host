import { SectionHeader } from '@/components/ui/SectionHeader'
import { formatPercent } from '@/utils/format'
import { recipeCategorySummaries } from '@/data/recipes/recipeSummary'
import { cn } from '@/utils/cn'

/** Cobertura das fichas por categoria (seção 16). */
export function RecipeCategoryCoverageSection({ onSelectCategory }: { onSelectCategory: (id: string) => void }) {
  return (
    <section>
      <SectionHeader title="Cobertura das fichas" description="Total de produtos, status das fichas e qualidade por categoria" />
      <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface px-4">
        {recipeCategorySummaries.map((cat) => (
          <button key={cat.id} onClick={() => onSelectCategory(cat.id)} className="flex flex-col gap-2 py-3 text-left transition-colors hover:bg-surface-hover sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-support font-medium text-ink-primary">{cat.categoria}</p>
              <p className="text-caption text-ink-tertiary">
                {cat.totalProdutos} produtos · {cat.fichasCompletas} completas · {cat.incompletas} incompletas · {cat.emRevisao} em revisão · {cat.custoAtualizado} com custo atualizado
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-subtle">
                <div
                  className={cn('h-full rounded-full', cat.qualidadeMedia >= 0.9 ? 'bg-success' : cat.qualidadeMedia >= 0.8 ? 'bg-accent' : 'bg-warning')}
                  style={{ width: `${cat.qualidadeMedia * 100}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-caption tabular text-ink-tertiary">{formatPercent(cat.qualidadeMedia, 0)}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
