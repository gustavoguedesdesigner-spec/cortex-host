import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CortexLabel } from '@/components/cortex/CortexButton'
import { units } from '@/data/units'
import { networkSummary } from '@/data/network-summary'
import { formatCurrencyCompactBRL, formatPercent } from '@/utils/format'

export function NetworkSummaryBar({
  onViewCritical,
  onCompareTopBottom,
  onAskCortex,
}: {
  onViewCritical: () => void
  onCompareTopBottom: () => void
  onAskCortex: () => void
}) {
  const criticas = units.filter((u) => u.nivelAtencao === 'critico').length
  const atencao = units.filter((u) => u.nivelAtencao === 'atencao').length
  const saudaveis = units.filter((u) => u.nivelAtencao === 'saudavel').length

  const stats = [
    { label: 'Unidades', value: String(units.length), tone: 'text-ink-primary' },
    { label: 'Críticas', value: String(criticas), tone: 'text-danger' },
    { label: 'Em atenção', value: String(atencao), tone: 'text-warning' },
    { label: 'Saudáveis', value: String(saudaveis), tone: 'text-success' },
    { label: 'Alertas ativos', value: String(networkSummary.totalOcorrencias), tone: 'text-ink-primary' },
    { label: 'Impacto estimado', value: formatCurrencyCompactBRL(networkSummary.diferencaFinanceira), tone: 'text-ink-primary' },
    { label: 'CMV real', value: formatPercent(networkSummary.cmvReal), tone: 'text-ink-primary' },
    { label: 'Meta', value: formatPercent(networkSummary.cmvMeta), tone: 'text-ink-secondary' },
  ]

  return (
    <section className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border shadow-card lg:grid-cols-12">
      <div className="bg-surface p-5 lg:col-span-7 lg:p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-caption text-ink-tertiary">{s.label}</p>
              <p className={`mt-0.5 text-metric-sm tabular ${s.tone}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 bg-surface p-5 lg:col-span-5 lg:p-6">
        <CortexLabel />
        <p className="flex-1 text-support leading-relaxed text-ink-secondary">
          Duas unidades concentram 62% do impacto financeiro estimado. Moinhos apresenta a maior diferença entre CMV real e
          teórico, enquanto Serra opera mais próxima do padrão esperado.
        </p>
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Button size="sm" variant="secondary" onClick={onViewCritical}>
            Ver unidades críticas
          </Button>
          <Button size="sm" variant="secondary" onClick={onCompareTopBottom}>
            Comparar Moinhos e Serra
          </Button>
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onAskCortex}>
            Perguntar ao CORTEX
          </Button>
        </div>
      </div>
    </section>
  )
}
