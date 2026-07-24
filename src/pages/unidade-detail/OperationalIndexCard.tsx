import { Info } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Tooltip } from '@/components/ui/Tooltip'
import type { IndiceOperacional } from '@/types'

function statusFromScore(v: number): 'success' | 'attention' | 'critical' {
  if (v >= 80) return 'success'
  if (v >= 60) return 'attention'
  return 'critical'
}

export function OperationalIndexCard({ indice }: { indice: IndiceOperacional }) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-card-title text-content-primary">Índice operacional</p>
          <Tooltip content="Indicador demonstrativo composto por métricas operacionais ponderadas. A metodologia definitiva será validada durante a implantação.">
            <Info className="h-3.5 w-3.5 text-content-tertiary cursor-help" />
          </Tooltip>
        </div>
        <span className="text-metric-sm font-display text-content-primary tabular-nums">{indice.valor}<span className="text-support text-content-tertiary">/100</span></span>
      </div>
      <div className="flex flex-col gap-3">
        {indice.composicao.map((c) => (
          <ProgressBar key={c.label} label={`${c.label} · ${c.valor}`} value={c.valor / 100} status={statusFromScore(c.valor)} />
        ))}
      </div>
    </Card>
  )
}
