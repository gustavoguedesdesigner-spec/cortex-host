import { CalendarClock, DollarSign, Percent, TrendingDown, TriangleAlert } from 'lucide-react'
import { MetricCard } from '@/components/ui/MetricCard'
import { formatCurrencyCompactBRL, formatDateShort, formatPercent, formatPercentPoints } from '@/utils/format'
import type { Unit } from '@/types'

export function UnitIndicatorsSection({ unit }: { unit: Unit }) {
  const desvio = unit.cmvReal - unit.cmvTeorico

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      <MetricCard
        titulo="CMV real"
        valor={formatPercent(unit.cmvReal)}
        icon={<Percent className="h-3.5 w-3.5" />}
        status="critical"
        variacao={formatPercentPoints(desvio)}
        direcaoVariacao="up"
        comparacao={`Meta: ${formatPercent(unit.metaCmv)}`}
      />
      <MetricCard
        titulo="Diferença financeira"
        valor={formatCurrencyCompactBRL(unit.impactoFinanceiro)}
        icon={<DollarSign className="h-3.5 w-3.5" />}
        status="critical"
        comparacao="impacto estimado no período"
      />
      <MetricCard
        titulo="Perdas"
        valor={formatCurrencyCompactBRL(unit.perdas)}
        icon={<TrendingDown className="h-3.5 w-3.5" />}
        status="attention"
        comparacao={`Estimadas: ${formatCurrencyCompactBRL(unit.perdasEstimadas)}`}
      />
      <MetricCard
        titulo="Alertas"
        valor={String(unit.numeroAlertas)}
        icon={<TriangleAlert className="h-3.5 w-3.5" />}
        status="critical"
        comparacao={`${unit.acoesAbertas} ações abertas`}
      />
      <MetricCard
        titulo="Última contagem"
        valor={formatDateShort(unit.ultimaContagem)}
        icon={<CalendarClock className="h-3.5 w-3.5" />}
        status="neutral"
        comparacao={`Próxima: ${formatDateShort(unit.proximaContagem)}`}
      />
    </div>
  )
}
