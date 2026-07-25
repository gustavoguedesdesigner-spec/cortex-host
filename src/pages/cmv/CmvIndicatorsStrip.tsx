import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { formatCurrencyBRL, formatCurrencyCompactBRL, formatPercent, formatPercentPoints } from '@/utils/format'
import { dataQualityLabel } from '@/utils/cmvConfidence'
import type { CmvNetworkComputed } from '@/utils/cmvCalculations'
import type { DataQualityInfo } from '@/types'

export function CmvIndicatorsStrip({
  computed,
  meta,
  quality,
  onOpenCalculation,
}: {
  computed: CmvNetworkComputed
  meta: number
  quality: DataQualityInfo
  onOpenCalculation: () => void
}) {
  return (
    <MetricStrip className="xl:grid-cols-7">
      <MetricCard
        titulo="CMV real"
        valor={formatPercent(computed.cmvReal)}
        status="critical"
        variacao={formatPercentPoints(computed.diferencaVsMetaPP)}
        direcaoVariacao="up"
        comparacao={`versus meta · ${formatPercentPoints(computed.diferencaVsTeoricoPP)} versus teórico`}
        onClick={onOpenCalculation}
      />
      <MetricCard titulo="CMV teórico" valor={formatPercent(computed.cmvTeorico)} status="neutral" comparacao="+0,4 ponto versus período anterior" />
      <MetricCard titulo="Meta" valor={formatPercent(meta)} status="info" />
      <MetricCard
        titulo="Impacto vs. teórico"
        valor={formatCurrencyCompactBRL(computed.impactoVsTeorico)}
        status="critical"
        tooltip={`Valor completo: ${formatCurrencyBRL(computed.impactoVsTeorico)}`}
      />
      <MetricCard
        titulo="Impacto vs. meta"
        valor={formatCurrencyCompactBRL(computed.impactoVsMeta)}
        status="attention"
        tooltip={`Valor completo: ${formatCurrencyBRL(computed.impactoVsMeta)}`}
      />
      <MetricCard titulo="Vendas líquidas" valor={formatCurrencyCompactBRL(computed.vendasLiquidas)} status="neutral" />
      <MetricCard
        titulo="Qualidade dos dados"
        valor={formatPercent(quality.percentual, 0)}
        status={quality.classificacao === 'boa' || quality.classificacao === 'excelente' ? 'success' : 'attention'}
        comparacao={dataQualityLabel[quality.classificacao]}
        tooltip="A qualidade dos dados influencia a precisão e o nível de confiança das análises."
      />
    </MetricStrip>
  )
}
