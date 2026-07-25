import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrencyBRL } from '@/utils/format'
import type { InventoryCategorySummary } from '@/types'

const trendIcon = { up: ArrowUp, down: ArrowDown, flat: Minus }
const trendColor = { up: 'text-danger', down: 'text-success', flat: 'text-ink-tertiary' }

/** Composição do estoque por categoria — barras horizontais, tons neutros + laranja na seleção. */
export function InventoryCategoryComposition({
  categories,
  total,
  onSelectCategory,
}: {
  categories: InventoryCategorySummary[]
  total: number
  onSelectCategory: (id: string) => void
}) {
  const max = Math.max(...categories.map((c) => c.valor))

  return (
    <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface px-4">
      {categories.map((cat, i) => {
        const Icon = trendIcon[cat.tendencia]
        return (
          <button key={cat.id} onClick={() => onSelectCategory(cat.id)} className="flex flex-col gap-2 py-3 text-left transition-colors hover:bg-surface-hover">
            <div className="flex items-baseline justify-between gap-3 text-support">
              <span className="font-medium text-ink-primary">{cat.categoria}</span>
              <span className="flex items-center gap-2 tabular text-ink-secondary">
                {formatCurrencyBRL(cat.valor)}
                <span className="text-ink-tertiary">{((cat.valor / total) * 100).toFixed(0)}%</span>
                <Icon className={cn('h-3.5 w-3.5', trendColor[cat.tendencia])} strokeWidth={1.7} />
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-subtle">
                <div className={cn('h-full rounded-full', i === 0 ? 'bg-accent' : 'bg-navy/35')} style={{ width: `${(cat.valor / max) * 100}%` }} />
              </div>
              <span className="w-40 shrink-0 truncate text-caption text-ink-tertiary">
                {cat.itens} itens · giro {cat.giroMedio.toFixed(1)}x {cat.alertas > 0 && `· ${cat.alertas} alertas`}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
