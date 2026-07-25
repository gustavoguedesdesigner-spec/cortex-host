import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts'
import { Tooltip } from '@/components/ui/Tooltip'
import { formatCurrencyBRL, formatCurrencyCompactBRL } from '@/utils/format'
import type { CmvBridgeStep } from '@/types'

interface BridgeBar {
  label: string
  base: number
  delta: number
  isTotal: boolean
  tooltip?: string
}

const AXIS = { fill: 'var(--chart-axis)', fontSize: 11 }

/**
 * "Do CMV teórico ao CMV real" — waterfall construído com barras
 * empilhadas (base invisível + delta visível). Decomposição analítica,
 * não contabilização definitiva — ver tooltip por etapa.
 */
export function CmvBridgeChart({
  steps,
  custoTeorico,
  custoReal,
}: {
  steps: CmvBridgeStep[]
  custoTeorico: number
  custoReal: number
}) {
  let cumulative = custoTeorico
  const bars: BridgeBar[] = [
    { label: 'CMV teórico', base: 0, delta: custoTeorico, isTotal: true, tooltip: 'Custo teórico esperado no período.' },
    ...steps.map((step) => {
      const bar: BridgeBar = { label: step.label, base: cumulative, delta: step.valor, isTotal: false, tooltip: step.tooltip }
      cumulative += step.valor
      return bar
    }),
    { label: 'CMV real', base: 0, delta: custoReal, isTotal: true, tooltip: 'Custo real consumido apurado no período.' },
  ]

  return (
    <div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={bars} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} dy={6} interval={0} angle={-12} textAnchor="end" height={54} />
          <YAxis tickFormatter={(v) => formatCurrencyCompactBRL(v)} tick={AXIS} axisLine={false} tickLine={false} width={54} />
          <RechartsTooltip
            cursor={{ fill: 'var(--chart-grid)', opacity: 0.4 }}
            formatter={(value: number, _name: string, item: { payload?: BridgeBar }) => [
              formatCurrencyBRL(item.payload?.isTotal ? item.payload.delta : value),
              item.payload?.isTotal ? 'Custo' : 'Diferença',
            ]}
            contentStyle={{ background: '#FFFFFF', border: '1px solid #E4E7EB', borderRadius: 10, fontSize: 12, color: '#171A1F' }}
          />
          <Bar dataKey="base" stackId="bridge" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="delta" stackId="bridge" radius={[4, 4, 0, 0]} isAnimationActive={false} minPointSize={4}>
            {bars.map((bar, i) => (
              <Cell key={i} fill={bar.isTotal ? 'var(--chart-navy)' : 'var(--chart-accent)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-ink-tertiary">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-navy" /> Custo total
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-accent" /> Componente do desvio
        </span>
        <Tooltip content="A decomposição é uma estimativa analítica baseada nos dados disponíveis, não uma contabilização definitiva.">
          <span className="cursor-help underline decoration-dotted underline-offset-2">Como essa decomposição é calculada?</span>
        </Tooltip>
      </div>
    </div>
  )
}
