import { useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { MetricDetailModal, type MetricDetailConfig } from '@/components/cortex/MetricDetailModal'
import { getUnidadesOrdenadasPorCriticidade } from '@/data/units'
import { networkSummary } from '@/data/network-summary'
import { financialImpactCategories } from '@/data/financial-impact'
import { formatCurrencyBRL, formatCurrencyCompactBRL, formatPercent, formatPercentPoints } from '@/utils/format'

const unitsByRelevance = getUnidadesOrdenadasPorCriticidade()

function buildMetricConfig(id: string): MetricDetailConfig | null {
  switch (id) {
    case 'cmv-real':
      return {
        id,
        titulo: 'CMV real',
        explicacao:
          'Calculado com base no estoque inicial, compras, transferências e estoque final do período. Está 2,3 pontos acima da meta de 32,5% e 2,9 pontos acima do CMV teórico.',
        tendencia: [0.318, 0.32, 0.331, 0.327, 0.338, 0.341, 0.344, 0.348],
        composicao: unitsByRelevance.map((u) => ({ label: u.nome, value: formatPercent(u.cmvReal), critical: u.cmvReal > u.cmvTeorico })),
        moduloPath: '/cmv',
        moduloLabel: 'Abrir módulo de CMV',
      }
    case 'cmv-teorico':
      return {
        id,
        titulo: 'CMV teórico',
        explicacao: 'Baseado nas fichas técnicas cadastradas e nas vendas registradas no período. Subiu 0,4 ponto em relação ao período anterior.',
        tendencia: [0.311, 0.313, 0.315, 0.314, 0.316, 0.318, 0.317, 0.319],
        composicao: unitsByRelevance.map((u) => ({ label: u.nome, value: formatPercent(u.cmvTeorico) })),
        moduloPath: '/cmv',
        moduloLabel: 'Abrir módulo de CMV',
      }
    case 'diferenca':
      return {
        id,
        titulo: 'Diferença financeira',
        explicacao: 'Impacto estimado da diferença entre CMV real e teórico no período, distribuído entre as categorias de insumo abaixo.',
        composicaoTitulo: 'Composição por categoria',
        composicao: financialImpactCategories.map((c) => ({
          label: c.categoria,
          value: formatCurrencyBRL(c.valor),
          critical: c.tendencia === 'up',
        })),
        moduloPath: '/cmv',
        moduloLabel: 'Ver análise de CMV',
      }
    case 'compras':
      return {
        id,
        titulo: 'Compras do período',
        explicacao: 'Total comprado pela rede no período selecionado, 6,8% acima do período anterior.',
        composicao: unitsByRelevance.map((u) => ({ label: u.nome, value: formatCurrencyCompactBRL(u.compras) })),
        moduloPath: '/compras',
        moduloLabel: 'Abrir módulo de Compras',
      }
    case 'estoque':
      return {
        id,
        titulo: 'Valor em estoque',
        explicacao: 'Estoque consolidado das seis unidades ao final do período.',
        composicao: unitsByRelevance.map((u) => ({ label: u.nome, value: formatCurrencyCompactBRL(u.valorEstoque) })),
        moduloPath: '/estoque',
        moduloLabel: 'Abrir módulo de Estoque',
      }
    case 'perdas':
      return {
        id,
        titulo: 'Perdas registradas',
        explicacao: 'Perdas registradas no período, 14,2% acima do período anterior.',
        composicao: unitsByRelevance.map((u) => ({ label: u.nome, value: formatCurrencyCompactBRL(u.perdas), critical: u.perdas > 3000 })),
        moduloPath: '/estoque',
        moduloLabel: 'Abrir módulo de Estoque',
      }
    default:
      return null
  }
}

export function IndicatorsSection() {
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null)

  return (
    <section>
      <SectionHeader title="Indicadores principais" description="Consolidado das 6 unidades no período selecionado" />
      <MetricStrip>
        <MetricCard
          titulo="CMV real"
          valor={formatPercent(networkSummary.cmvReal)}
          status="critical"
          variacao={formatPercentPoints(networkSummary.cmvReal - networkSummary.cmvMeta)}
          direcaoVariacao="up"
          comparacao={`Meta: ${formatPercent(networkSummary.cmvMeta)}`}
          tooltip="CMV calculado com base no estoque inicial, compras, transferências e estoque final."
          onClick={() => setSelectedMetricId('cmv-real')}
        />
        <MetricCard
          titulo="CMV teórico"
          valor={formatPercent(networkSummary.cmvTeorico)}
          status="attention"
          variacao={formatPercentPoints(networkSummary.cmvTeoricoVariacaoAnterior)}
          direcaoVariacao="up"
          comparacao="vs. período anterior"
          tooltip="Baseado nas fichas técnicas e vendas registradas."
          onClick={() => setSelectedMetricId('cmv-teorico')}
        />
        <MetricCard
          titulo="Diferença financeira"
          valor={formatCurrencyCompactBRL(networkSummary.diferencaFinanceira)}
          status="critical"
          comparacao="impacto estimado no período"
          onClick={() => setSelectedMetricId('diferenca')}
        />
        <MetricCard
          titulo="Compras do período"
          valor={formatCurrencyCompactBRL(networkSummary.compras)}
          status="attention"
          variacao={`+${(networkSummary.comprasVariacaoAnterior * 100).toFixed(1)}%`}
          direcaoVariacao="up"
          comparacao="vs. período anterior"
          onClick={() => setSelectedMetricId('compras')}
        />
        <MetricCard
          titulo="Valor em estoque"
          valor={formatCurrencyCompactBRL(networkSummary.valorEstoque)}
          status="success"
          comparacao="consolidado das 6 unidades"
          onClick={() => setSelectedMetricId('estoque')}
        />
        <MetricCard
          titulo="Perdas registradas"
          valor={formatCurrencyCompactBRL(networkSummary.perdas)}
          status="critical"
          variacao={`+${(networkSummary.perdasVariacaoAnterior * 100).toFixed(1)}%`}
          direcaoVariacao="up"
          comparacao="vs. período anterior"
          onClick={() => setSelectedMetricId('perdas')}
        />
      </MetricStrip>

      <MetricDetailModal metric={selectedMetricId ? buildMetricConfig(selectedMetricId) : null} onClose={() => setSelectedMetricId(null)} />
    </section>
  )
}
