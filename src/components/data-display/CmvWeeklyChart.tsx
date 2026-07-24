import { Area, AreaChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CmvWeeklyPoint } from '@/data/cmv-weekly-series'
import { formatPercent } from '@/utils/format'

interface CmvWeeklyChartProps {
  data: CmvWeeklyPoint[]
  meta: number
  height?: number
}

export function CmvWeeklyChart({ data, meta, height = 260 }: CmvWeeklyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="cmvWeeklyRealFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C2793D" stopOpacity={0.32} />
            <stop offset="100%" stopColor="#C2793D" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#232B31" vertical={false} />
        <XAxis dataKey="semana" tick={{ fill: '#6C7880', fontSize: 11 }} axisLine={{ stroke: '#232B31' }} tickLine={false} />
        <YAxis
          tickFormatter={(v) => formatPercent(v, 0)}
          tick={{ fill: '#6C7880', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={44}
          domain={['dataMin - 0.01', 'dataMax + 0.01']}
        />
        <Tooltip
          formatter={(value: number, name: string) => [formatPercent(value), name]}
          contentStyle={{ background: '#1B2329', border: '1px solid #3A444C', borderRadius: 8, fontSize: 12, color: '#EDEFF0' }}
        />
        <Legend formatter={(value) => <span style={{ color: '#9CA8AE', fontSize: 12 }}>{value}</span>} iconType="circle" iconSize={8} />
        <ReferenceLine y={meta} stroke="#4E88C4" strokeDasharray="3 3" strokeWidth={1.3} label={{ value: 'Meta', position: 'insideTopRight', fill: '#4E88C4', fontSize: 11 }} />
        <Area type="monotone" dataKey="cmvTeorico" name="CMV teórico" stroke="#6C7880" strokeWidth={1.5} strokeDasharray="4 3" fill="none" />
        <Area type="monotone" dataKey="cmvReal" name="CMV real" stroke="#C2793D" strokeWidth={2.2} fill="url(#cmvWeeklyRealFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
