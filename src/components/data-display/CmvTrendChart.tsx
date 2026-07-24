import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CmvSeriesPoint } from '@/types'
import { formatDateShort, formatPercent } from '@/utils/format'

/**
 * Grafico estrutural de CMV teorico vs. real.
 * Nesta etapa apresenta apenas a leitura visual da serie consolidada —
 * interacoes de drill-down por unidade serao construidas na etapa
 * dedicada ao modulo de CMV.
 */
export function CmvTrendChart({ data }: { data: CmvSeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="cmvRealFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C2793D" stopOpacity={0.32} />
            <stop offset="100%" stopColor="#C2793D" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#232B31" vertical={false} />
        <XAxis
          dataKey="data"
          tickFormatter={formatDateShort}
          tick={{ fill: '#6C7880', fontSize: 11 }}
          axisLine={{ stroke: '#232B31' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatPercent(v, 0)}
          tick={{ fill: '#6C7880', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          formatter={(value: number, name: string) => [formatPercent(value), name]}
          labelFormatter={(label) => formatDateShort(String(label))}
          contentStyle={{
            background: '#1B2329',
            border: '1px solid #3A444C',
            borderRadius: 8,
            fontSize: 12,
            color: '#EDEFF0',
          }}
        />
        <Legend
          formatter={(value) => <span style={{ color: '#9CA8AE', fontSize: 12 }}>{value}</span>}
          iconType="circle"
          iconSize={8}
        />
        <Area
          type="monotone"
          dataKey="cmvTeorico"
          name="CMV teórico"
          stroke="#6C7880"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          fill="none"
        />
        <Area
          type="monotone"
          dataKey="cmvReal"
          name="CMV real"
          stroke="#C2793D"
          strokeWidth={2}
          fill="url(#cmvRealFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
