import type { FinancialImpactCategory } from '@/types'
import { formatCurrencyBRL } from '@/utils/format'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { cn } from '@/utils/cn'

const trendIcon = { up: ArrowUp, down: ArrowDown, flat: Minus }
const trendColor = { up: 'text-status-critical', down: 'text-status-success', flat: 'text-content-tertiary' }

export function FinancialImpactBars({ categories, total }: { categories: FinancialImpactCategory[]; total: number }) {
  const max = Math.max(...categories.map((c) => c.valor))

  return (
    <div className="flex flex-col gap-3.5">
      {categories.map((cat) => {
        const TrendIcon = trendIcon[cat.tendencia]
        const pct = cat.valor / total

        return (
          <div key={cat.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-support">
              <span className="font-medium text-content-primary">{cat.categoria}</span>
              <span className="flex items-center gap-2 text-content-secondary shrink-0">
                <TrendIcon className={cn('h-3 w-3', trendColor[cat.tendencia])} />
                {formatCurrencyBRL(cat.valor)}
                <span className="text-content-tertiary">({(pct * 100).toFixed(0)}%)</span>
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-4 overflow-hidden">
              <div className="h-full rounded-full bg-cortex-500" style={{ width: `${(cat.valor / max) * 100}%` }} />
            </div>
            <span className="text-caption text-content-tertiary">Maior contribuição: {cat.unidadePrincipal}</span>
          </div>
        )
      })}
    </div>
  )
}
