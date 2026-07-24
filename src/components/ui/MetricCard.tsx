import type { ReactNode } from 'react'
import { ArrowUp, ArrowDown, Minus, Info } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { IndicatorStatus, TrendDirection } from '@/types'
import { Tooltip } from './Tooltip'

const statusDot: Record<IndicatorStatus, string> = {
  success: 'bg-success',
  attention: 'bg-warning',
  critical: 'bg-danger',
  info: 'bg-info',
  neutral: 'bg-ink-tertiary',
}

const trendConfig: Record<TrendDirection, { icon: ReactNode; classes: string }> = {
  up: { icon: <ArrowUp className="h-3 w-3" />, classes: 'text-danger' },
  down: { icon: <ArrowDown className="h-3 w-3" />, classes: 'text-success' },
  flat: { icon: <Minus className="h-3 w-3" />, classes: 'text-ink-tertiary' },
}

/**
 * Faixa de indicadores: superfície única dividida por separadores sutis,
 * em vez de vários cards volumosos repetidos. No mobile, empilha.
 */
export function MetricStrip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 divide-border overflow-hidden rounded-lg border border-border bg-surface',
        'sm:grid-cols-3 sm:divide-x xl:grid-cols-6',
        'divide-y sm:divide-y-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface MetricCardProps {
  titulo: string
  valor: string
  unidade?: string
  variacao?: string
  direcaoVariacao?: TrendDirection
  comparacao?: string
  status?: IndicatorStatus
  icon?: ReactNode
  tooltip?: string
  action?: ReactNode
  invertTrendColor?: boolean
  onClick?: () => void
  /** 'strip' remove borda própria (vive dentro de MetricStrip); 'card' é autônomo */
  variant?: 'strip' | 'card'
}

export function MetricCard({
  titulo,
  valor,
  unidade,
  variacao,
  direcaoVariacao,
  comparacao,
  status = 'neutral',
  tooltip,
  action,
  invertTrendColor,
  onClick,
  variant = 'strip',
}: MetricCardProps) {
  const trend = direcaoVariacao ? trendConfig[direcaoVariacao] : null
  const trendClasses =
    invertTrendColor && direcaoVariacao === 'up'
      ? 'text-success'
      : invertTrendColor && direcaoVariacao === 'down'
        ? 'text-danger'
        : trend?.classes

  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-1.5 p-4 text-left transition-colors',
        variant === 'card' && 'rounded-lg border border-border bg-surface',
        onClick && 'hover:bg-surface-hover',
      )}
    >
      <div className="flex items-center gap-1.5">
        {status !== 'neutral' && <span className={cn('h-1.5 w-1.5 rounded-full', statusDot[status])} aria-hidden="true" />}
        <span className="text-label text-ink-secondary">{titulo}</span>
        {tooltip && (
          <Tooltip content={tooltip}>
            <Info className="h-3.5 w-3.5 cursor-help text-ink-tertiary" />
          </Tooltip>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-metric tabular text-ink-primary">{valor}</span>
        {unidade && <span className="text-support text-ink-tertiary">{unidade}</span>}
      </div>

      {(variacao || comparacao) && (
        <div className="flex flex-wrap items-center gap-1.5 text-caption">
          {trend && variacao && (
            <span className={cn('inline-flex items-center gap-0.5 font-medium tabular', trendClasses)}>
              {trend.icon}
              {variacao}
            </span>
          )}
          {comparacao && <span className="text-ink-tertiary">{comparacao}</span>}
        </div>
      )}

      {action && <div className="pt-0.5">{action}</div>}
    </Wrapper>
  )
}
