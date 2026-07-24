interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  className?: string
  /** Quando true, sobe = ruim (CMV, perdas). Padrão do produto. */
  upIsBad?: boolean
}

/** Micrográfico discreto, sem eixos nem rótulos — apoia a leitura da métrica. */
export function Sparkline({ data, width = 68, height = 22, className, upIsBad = true }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)

  const points = data
    .map((value, i) => `${(i * step).toFixed(1)},${(height - ((value - min) / range) * height).toFixed(1)}`)
    .join(' ')

  const rising = data[data.length - 1] > data[0]
  const stroke = rising === upIsBad ? 'var(--chart-accent)' : 'var(--chart-neutral)'

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
