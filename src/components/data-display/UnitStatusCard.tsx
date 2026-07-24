import { ChevronRight, OctagonAlert } from 'lucide-react'
import { cn } from '@/utils/cn'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { AlertBadge } from '@/components/ui/AlertBadge'
import { Sparkline } from '@/components/ui/Sparkline'
import { formatCurrencyCompactBRL, formatPercent, formatPercentPoints, formatDateShort } from '@/utils/format'
import type { Unit } from '@/types'

export function UnitStatusCard({ unit, onClick }: { unit: Unit; onClick?: () => void }) {
  const desvio = unit.cmvReal - unit.cmvTeorico
  const desvioRuim = desvio > 0

  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col gap-3 rounded-lg bg-surface-2 border border-border-subtle p-4 text-left transition-colors hover:border-border-strong hover:bg-surface-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-card-title text-content-primary truncate">{unit.nome}</p>
          <p className="text-support text-content-tertiary mt-0.5">{unit.gerente}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AlertBadge count={unit.numeroAlertas} />
          <ChevronRight className="h-4 w-4 text-content-tertiary" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <StatusBadge level={unit.nivelAtencao} />
        <Sparkline data={unit.tendenciaCmvReal} />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border-subtle">
        <div>
          <p className="text-caption text-content-tertiary">CMV real</p>
          <p className="text-card-title text-content-primary tabular-nums mt-0.5">{formatPercent(unit.cmvReal)}</p>
        </div>
        <div>
          <p className="text-caption text-content-tertiary">Desvio vs. teórico</p>
          <p className={cn('text-card-title tabular-nums mt-0.5 flex items-center gap-1', desvioRuim ? 'text-status-critical' : 'text-status-success')}>
            {desvioRuim && <OctagonAlert className="h-3.5 w-3.5" />}
            {formatPercentPoints(desvio)}
          </p>
        </div>
        <div>
          <p className="text-caption text-content-tertiary">Vendas no período</p>
          <p className="text-support text-content-primary mt-0.5">{formatCurrencyCompactBRL(unit.vendas)}</p>
        </div>
        <div>
          <p className="text-caption text-content-tertiary">Perdas</p>
          <p className="text-support text-content-primary mt-0.5">{formatCurrencyCompactBRL(unit.perdas)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-caption text-content-tertiary">
        <span>Última contagem: {formatDateShort(unit.ultimaContagem)}</span>
        <span className="font-medium text-cortex-500">Ver unidade</span>
      </div>
    </button>
  )
}
