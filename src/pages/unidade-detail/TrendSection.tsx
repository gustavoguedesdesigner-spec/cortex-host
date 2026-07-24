import { Card } from '@/components/ui/Card'
import { Tooltip } from '@/components/ui/Tooltip'
import { CmvWeeklyChart } from '@/components/data-display/CmvWeeklyChart'
import type { TrendEventMarker, TrendWeekPoint } from '@/types'

interface TrendSectionProps {
  data: TrendWeekPoint[]
  meta: number
  eventos?: TrendEventMarker[]
}

export function TrendSection({ data, meta, eventos }: TrendSectionProps) {
  return (
    <Card>
      <p className="text-card-title text-ink-primary mb-1">Tendência das últimas 8 semanas</p>
      <p className="text-support text-ink-tertiary mb-3">CMV teórico, CMV real e meta — eventos observados no período</p>
      <CmvWeeklyChart data={data} meta={meta} height={220} />
      {eventos && eventos.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          {eventos.map((e, i) => (
            <Tooltip key={i} content={`${data[e.semanaIndex]?.semana ?? ''}: pode estar relacionado ao aumento do CMV — exige validação.`}>
              <span className="rounded-full bg-surface-subtle border border-border px-2.5 py-1 text-caption text-ink-tertiary cursor-help">
                {data[e.semanaIndex]?.semana} · {e.label}
              </span>
            </Tooltip>
          ))}
        </div>
      )}
    </Card>
  )
}
