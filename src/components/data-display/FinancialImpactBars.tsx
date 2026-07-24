import type { FinancialImpactCategory } from '@/types'
import { formatCurrencyBRL } from '@/utils/format'
import { cn } from '@/utils/cn'

/** Barras horizontais neutras; apenas a categoria de maior peso recebe o acento. */
export function FinancialImpactBars({ categories, total }: { categories: FinancialImpactCategory[]; total: number }) {
  const max = Math.max(...categories.map((c) => c.valor))

  return (
    <div className="flex flex-col divide-y divide-border">
      {categories.map((cat, i) => (
        <div key={cat.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
          <div className="flex items-baseline justify-between gap-3 text-support">
            <span className="font-medium text-ink-primary">{cat.categoria}</span>
            <span className="tabular text-ink-secondary">
              {formatCurrencyBRL(cat.valor)}
              <span className="ml-1.5 text-ink-tertiary">{((cat.valor / total) * 100).toFixed(0)}%</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-subtle">
              <div className={cn('h-full rounded-full', i === 0 ? 'bg-accent' : 'bg-navy/35')} style={{ width: `${(cat.valor / max) * 100}%` }} />
            </div>
            <span className="w-40 shrink-0 truncate text-caption text-ink-tertiary">{cat.unidadePrincipal}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
