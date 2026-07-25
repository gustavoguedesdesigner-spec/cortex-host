import { SectionHeader } from '@/components/ui/SectionHeader'
import { formatPercent } from '@/utils/format'
import { administrativeHealth } from '@/data/administration/situation'
import { cn } from '@/utils/cn'

export function AdminHealthSection() {
  return (
    <section>
      <SectionHeader title="Saúde administrativa" description="Indicador demonstrativo composto por controles administrativos configuráveis" />
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-baseline gap-2">
          <span className="text-metric tabular text-ink-primary">{administrativeHealth.indice}</span>
          <span className="text-support text-ink-tertiary">de {administrativeHealth.maximo}</span>
        </div>
        <p className="mt-1 text-support text-ink-secondary">{administrativeHealth.classificacao}</p>

        <div className="mt-4 flex flex-col gap-2.5">
          {administrativeHealth.componentes.map((c) => (
            <div key={c.label} className="flex items-center gap-3">
              <span className="w-44 shrink-0 text-caption text-ink-tertiary">{c.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-subtle">
                <div
                  className={cn('h-full rounded-full', c.valor >= 0.9 ? 'bg-success' : c.valor >= 0.8 ? 'bg-accent' : 'bg-warning')}
                  style={{ width: `${c.valor * 100}%` }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-caption tabular text-ink-tertiary">{formatPercent(c.valor, 0)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
