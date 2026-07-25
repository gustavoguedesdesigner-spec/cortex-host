import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { CmvWeeklyChart } from '@/components/data-display/CmvWeeklyChart'
import { cmvWeeklySeriesConsolidado, cmvMeta } from '@/data/cmv-weekly-series'
import { cmvTrendEvents, cmvWhatChanged, cmvWhatChangedInsight } from '@/data/cmv/cmvPeriod'

export function CmvEvolutionSection({
  onCompararPeriodos,
  onVerUnidades,
  onVerCategorias,
}: {
  onCompararPeriodos: () => void
  onVerUnidades: () => void
  onVerCategorias: () => void
}) {
  return (
    <section>
      <SectionHeader title="Evolução do CMV" description="CMV real, CMV teórico e meta — últimas 8 semanas" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-lg border border-border bg-surface p-5 lg:col-span-8">
          <CmvWeeklyChart data={cmvWeeklySeriesConsolidado} meta={cmvMeta} />
          {cmvTrendEvents.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
              {cmvTrendEvents.map((e, i) => (
                <Tooltip
                  key={i}
                  content={`${cmvWeeklySeriesConsolidado[e.semanaIndex]?.semana ?? ''}: pode estar relacionado ao aumento do CMV — exige validação.`}
                >
                  <span className="cursor-help rounded-full border border-border bg-surface-subtle px-2.5 py-1 text-caption text-ink-tertiary">
                    {cmvWeeklySeriesConsolidado[e.semanaIndex]?.semana} · {e.label}
                  </span>
                </Tooltip>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <p className="text-card-title text-ink-primary">O que mudou</p>
          <ul className="flex flex-col divide-y divide-border border-t border-border">
            {cmvWhatChanged.map((item, i) => (
              <li key={i} className="py-2.5 text-support">
                <span className="text-ink-primary font-medium">{item.label}</span>
                <span className="text-ink-tertiary"> — {item.detalhe}</span>
              </li>
            ))}
          </ul>
          <p className="text-support text-ink-secondary leading-relaxed">{cmvWhatChangedInsight}</p>
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
            <Button size="sm" variant="ghost" onClick={onCompararPeriodos}>
              Comparar períodos
            </Button>
            <Button size="sm" variant="ghost" onClick={onVerUnidades}>
              Ver unidades
            </Button>
            <Button size="sm" variant="ghost" onClick={onVerCategorias}>
              Ver categorias
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
