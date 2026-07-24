import { CalendarClock, DollarSign, Percent, TrendingDown, TriangleAlert } from 'lucide-react'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { formatCurrencyCompactBRL, formatDateShort, formatPercent, formatPercentPoints } from '@/utils/format'
import type { Unit } from '@/types'

export function UnitIndicatorsSection({ unit }: { unit: Unit }) {
  const desvio = unit.cmvReal - unit.cmvTeorico

  return (
    <MetricStrip className="xl:grid-cols-5">
      <MetricCard
        titulo="CMV real"
        valor={formatPercent(unit.cmvReal)}
        status="critical"
        variacao={formatPercentPoints(desvio)}
        direcaoVariacao="up"
        comparacao={`Meta: ${formatPercent(unit.metaCmv)}`}
      />
      <MetricCard
        titulo="Diferença financeira"
        valor={formatCurrencyCompactBRL(unit.impactoFinanceiro)}
        status="critical"
        comparacao="impacto estimado no período"
      />
      <MetricCard
        titulo="Perdas"
        valor={formatCurrencyCompactBRL(unit.perdas)}
        status="attention"
        comparacao={`Estimadas: ${formatCurrencyCompactBRL(unit.perdasEstimadas)}`}
      />
      <MetricCard
        titulo="Alertas"
        valor={String(unit.numeroAlertas)}
        status="critical"
        comparacao={`${unit.acoesAbertas} ações abertas`}
      />
      <MetricCard
        titulo="Última contagem"
        valor={formatDateShort(unit.ultimaContagem)}
        status="neutral"
        comparacao={`Próxima: ${formatDateShort(unit.proximaContagem)}`}
      />
    </MetricStrip>
  )
}
