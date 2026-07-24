interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  className?: string
}

/** Mini-grafico de tendencia inline, sem eixos — usado em cards compactos. */
export function Sparkline({ data, width = 72, height = 24, color = '#C2793D', className }: SparklineProps) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const step = width / (data.length - 1)

  const points = data
    .map((value, i) => {
      const x = i * step
      const y = height - ((value - min) / range) * height
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  const isUp = data[data.length - 1] > data[0]

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
      <polyline points={points} fill="none" stroke={isUp ? '#CF5C4E' : color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
