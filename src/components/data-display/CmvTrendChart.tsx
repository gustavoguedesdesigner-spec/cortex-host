import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CmvSeriesPoint } from '@/types'
import { formatDateShort, formatPercent } from '@/utils/format'

const AXIS = { fill: 'var(--chart-axis)', fontSize: 11 }

export function CmvTrendChart({ data }: { data: CmvSeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="cmvDailyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.14} />
            <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
        <XAxis dataKey="data" tickFormatter={formatDateShort} tick={AXIS} axisLine={false} tickLine={false} dy={6} />
        <YAxis tickFormatter={(v) => formatPercent(v, 0)} tick={AXIS} axisLine={false} tickLine={false} width={46} />
        <Tooltip
          formatter={(value: number, name: string) => [formatPercent(value), name]}
          labelFormatter={(l) => formatDateShort(String(l))}
          contentStyle={{ background: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: 10, fontSize: 12, color: 'var(--chart-tooltip-text)' }}
        />
        <Legend formatter={(v) => <span style={{ color: 'var(--chart-legend-text)', fontSize: 12 }}>{v}</span>} iconType="plainline" iconSize={14} />
        <Area type="monotone" dataKey="cmvTeorico" name="CMV teórico" stroke="var(--chart-navy)" strokeWidth={1.4} fill="none" dot={false} />
        <Area type="monotone" dataKey="cmvReal" name="CMV real" stroke="var(--chart-accent)" strokeWidth={2} fill="url(#cmvDailyFill)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
