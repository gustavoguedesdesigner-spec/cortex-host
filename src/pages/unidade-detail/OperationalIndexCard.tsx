import { Info } from 'lucide-react'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Tooltip } from '@/components/ui/Tooltip'
import type { IndicatorStatus, IndiceOperacional } from '@/types'

const statusFromScore = (v: number): IndicatorStatus => (v >= 80 ? 'success' : v >= 60 ? 'attention' : 'critical')

export function OperationalIndexCard({ indice }: { indice: IndiceOperacional }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-card-title">Índice operacional</p>
            <Tooltip content="Indicador demonstrativo composto por métricas operacionais ponderadas. A metodologia definitiva será validada durante a implantação.">
              <Info className="h-3.5 w-3.5 cursor-help text-ink-tertiary" strokeWidth={1.7} />
            </Tooltip>
          </div>
          <p className="mt-0.5 text-caption text-ink-tertiary">{indice.classificacao}</p>
        </div>
        <span className="text-metric tabular text-ink-primary">
          {indice.valor}
          <span className="text-support text-ink-tertiary">/100</span>
        </span>
      </div>
      <div className="flex flex-col gap-3 border-t border-border pt-4">
        {indice.composicao.map((c) => (
          <ProgressBar key={c.label} label={c.label} valueLabel={String(c.valor)} value={c.valor / 100} status={statusFromScore(c.valor)} />
        ))}
      </div>
    </div>
  )
}
