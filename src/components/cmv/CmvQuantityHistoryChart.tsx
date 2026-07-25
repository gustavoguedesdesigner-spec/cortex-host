import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const AXIS = { fill: 'var(--chart-axis)', fontSize: 11 }

export interface QuantityHistoryPoint {
  semana: string
  teorico: number
  real: number
}

/**
 * Mesmo tratamento visual do CmvWeeklyChart (teórico em azul-marinho,
 * real em laranja com preenchimento), mas para séries de quantidade
 * (kg, unidades) em vez de percentual — usado no histórico de consumo
 * de produtos e insumos.
 */
export function CmvQuantityHistoryChart({ data, unidade, height = 220 }: { data: QuantityHistoryPoint[]; unidade: string; height?: number }) {
  const formatQty = (v: number) => `${v.toLocaleString('pt-BR')} ${unidade}`

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="qtyRealFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity={0.14} />
            <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
        <XAxis dataKey="semana" tick={AXIS} axisLine={false} tickLine={false} dy={6} />
        <YAxis tickFormatter={(v: number) => v.toLocaleString('pt-BR')} tick={AXIS} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          formatter={(value: number, name: string) => [formatQty(value), name]}
          contentStyle={{ background: '#FFFFFF', border: '1px solid #E4E7EB', borderRadius: 10, fontSize: 12, color: '#171A1F' }}
        />
        <Legend formatter={(v) => <span style={{ color: '#656B75', fontSize: 12 }}>{v}</span>} iconType="plainline" iconSize={14} />
        <Area type="monotone" dataKey="teorico" name="Consumo teórico" stroke="var(--chart-navy)" strokeWidth={1.4} fill="none" dot={false} />
        <Area type="monotone" dataKey="real" name="Consumo real" stroke="var(--chart-accent)" strokeWidth={2} fill="url(#qtyRealFill)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
