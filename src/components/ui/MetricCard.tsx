import type { ReactNode } from 'react'
import { ArrowUp, ArrowDown, Minus, Info } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { IndicatorStatus, TrendDirection } from '@/types'
import { Tooltip } from './Tooltip'

const statusBorder: Record<IndicatorStatus, string> = {
  success: 'border-l-status-success',
  attention: 'border-l-status-attention',
  critical: 'border-l-status-critical',
  info: 'border-l-status-info',
  neutral: 'border-l-status-neutral',
}

const trendConfig: Record<TrendDirection, { icon: ReactNode; classes: string }> = {
  up: { icon: <ArrowUp className="h-3 w-3" />, classes: 'text-status-critical' },
  down: { icon: <ArrowDown className="h-3 w-3" />, classes: 'text-status-success' },
  flat: { icon: <Minus className="h-3 w-3" />, classes: 'text-content-tertiary' },
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
  /**
   * Quando a metrica for "quanto maior, melhor" (ex.: vendas), uma variacao
   * "up" deve ser tratada como positiva. Por padrao (CMV, perdas) assume-se
   * o contrario: "up" e ruim. Ajusta apenas a cor do indicador de tendencia.
   */
  invertTrendColor?: boolean
  /** Quando definido, o card inteiro age como um gatilho (ex.: abrir detalhe). */
  onClick?: () => void
}

export function MetricCard({
  titulo,
  valor,
  unidade,
  variacao,
  direcaoVariacao,
  comparacao,
  status = 'neutral',
  icon,
  tooltip,
  action,
  invertTrendColor,
  onClick,
}: MetricCardProps) {
  const trend = direcaoVariacao ? trendConfig[direcaoVariacao] : null
  const trendClasses =
    invertTrendColor && direcaoVariacao === 'up'
      ? 'text-status-success'
      : invertTrendColor && direcaoVariacao === 'down'
        ? 'text-status-critical'
        : trend?.classes

  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'rounded-lg bg-surface-2 border border-border-subtle border-l-2 shadow-card p-4 flex flex-col gap-2.5 text-left w-full',
        onClick && 'transition-colors hover:border-border-strong hover:bg-surface-3 cursor-pointer',
        statusBorder[status],
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-content-secondary">
          {icon}
          <span className="text-label uppercase text-content-tertiary">{titulo}</span>
        </div>
        {tooltip && (
          <Tooltip content={tooltip}>
            <Info className="h-3.5 w-3.5 text-content-tertiary hover:text-content-secondary cursor-help" />
          </Tooltip>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-metric font-display text-content-primary tabular-nums">{valor}</span>
        {unidade && <span className="text-support text-content-tertiary">{unidade}</span>}
      </div>

      {(variacao || comparacao) && (
        <div className="flex items-center gap-1.5 text-support">
          {trend && (
            <span className={cn('inline-flex items-center gap-0.5 font-medium', trendClasses)}>
              {trend.icon}
              {variacao}
            </span>
          )}
          {comparacao && <span className="text-content-tertiary">{comparacao}</span>}
        </div>
      )}

      {action && <div className="pt-1">{action}</div>}
    </Wrapper>
  )
}
