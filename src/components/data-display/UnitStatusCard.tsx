import { ArrowRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Sparkline } from '@/components/ui/Sparkline'
import { formatCurrencyCompactBRL, formatPercent, formatPercentPoints } from '@/utils/format'
import type { Unit } from '@/types'

/** Card compacto: apenas o essencial para priorizar; o resto vive no detalhe. */
export function UnitStatusCard({ unit, onClick }: { unit: Unit; onClick?: () => void }) {
  const desvio = unit.cmvReal - unit.cmvTeorico

  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col gap-4 rounded-lg border border-border bg-surface p-5 text-left transition-all hover:border-border-strong hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-card-title">{unit.nome}</p>
          <p className="mt-0.5 truncate text-caption text-ink-tertiary">
            {unit.regiao} · {unit.gerente}
          </p>
        </div>
        <StatusBadge level={unit.nivelAtencao} />
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-caption text-ink-tertiary">CMV real</p>
          <p className="text-metric-sm tabular text-ink-primary">{formatPercent(unit.cmvReal)}</p>
          <p className={cn('text-caption tabular', desvio > 0 ? 'text-danger' : 'text-success')}>
            {formatPercentPoints(desvio)} vs. teórico
          </p>
        </div>
        <Sparkline data={unit.tendenciaCmvReal} />
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-border pt-3 text-caption">
        <div>
          <p className="text-ink-tertiary">Impacto</p>
          <p className="mt-0.5 tabular text-ink-primary">{formatCurrencyCompactBRL(unit.impactoFinanceiro)}</p>
        </div>
        <div>
          <p className="text-ink-tertiary">Vendas</p>
          <p className="mt-0.5 tabular text-ink-primary">{formatCurrencyCompactBRL(unit.vendas)}</p>
        </div>
        <div>
          <p className="text-ink-tertiary">Alertas</p>
          <p className="mt-0.5 tabular text-ink-primary">{unit.numeroAlertas}</p>
        </div>
      </div>

      {unit.principalOcorrencia && (
        <p className="truncate border-t border-border pt-3 text-caption text-ink-secondary">{unit.principalOcorrencia}</p>
      )}

      <span className="flex items-center gap-1 text-caption font-medium text-accent">
        Ver unidade
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.7} />
      </span>
    </button>
  )
}
