import { Area, AreaChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CmvWeeklyPoint } from '@/data/cmv-weekly-series'
import { formatPercent } from '@/utils/format'

const AXIS = { fill: 'var(--chart-axis)', fontSize: 11 }

export function CmvWeeklyChart({ data, meta, height = 260 }: { data: CmvWeeklyPoint[]; meta: number; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="cmvRealFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.14} />
            <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
        <XAxis dataKey="semana" tick={AXIS} axisLine={false} tickLine={false} dy={6} />
        <YAxis
          tickFormatter={(v) => formatPercent(v, 0)}
          tick={AXIS}
          axisLine={false}
          tickLine={false}
          width={46}
          domain={['dataMin - 0.012', 'dataMax + 0.008']}
        />
        <Tooltip
          formatter={(value: number, name: string) => [formatPercent(value), name]}
          contentStyle={{
            background: 'var(--chart-tooltip-bg)',
            border: '1px solid var(--chart-tooltip-border)',
            borderRadius: 10,
            fontSize: 12,
            color: 'var(--chart-tooltip-text)',
            boxShadow: 'var(--shadow-raised)',
          }}
        />
        <Legend formatter={(v) => <span style={{ color: 'var(--chart-legend-text)', fontSize: 12 }}>{v}</span>} iconType="plainline" iconSize={14} />
        <ReferenceLine
          y={meta}
          stroke="var(--chart-neutral)"
          strokeDasharray="4 4"
          label={{ value: 'Meta', position: 'insideTopRight', fill: 'var(--chart-neutral)', fontSize: 11 }}
        />
        <Area type="monotone" dataKey="cmvTeorico" name="CMV teórico" stroke="var(--chart-navy)" strokeWidth={1.4} fill="none" dot={false} />
        <Area type="monotone" dataKey="cmvReal" name="CMV real" stroke="var(--chart-accent)" strokeWidth={2} fill="url(#cmvRealFill)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
