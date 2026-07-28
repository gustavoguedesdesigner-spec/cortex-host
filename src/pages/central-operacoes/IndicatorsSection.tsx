import { useState } from 'react'
import { AlertTriangle, ArrowDown, ArrowUp, Calculator, Info, Package, Percent, ShoppingCart, Wallet, type LucideIcon } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tooltip } from '@/components/ui/Tooltip'
import { MetricDetailModal, type MetricDetailConfig } from '@/components/cortex/MetricDetailModal'
import { cn } from '@/utils/cn'
import { getUnidadesOrdenadasPorCriticidade } from '@/data/units'
import { networkSummary } from '@/data/network-summary'
import { financialImpactCategories } from '@/data/financial-impact'
import { formatCurrencyBRL, formatCurrencyCompactBRL, formatPercent, formatPercentPoints } from '@/utils/format'
import type { IndicatorStatus, TrendDirection } from '@/types'

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

const statusIconClasses: Record<IndicatorStatus, string> = {
  success: 'bg-success-soft text-success',
  attention: 'bg-warning-soft text-warning',
  critical: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-surface-subtle text-ink-secondary',
}

interface ExecutiveIndicator {
  id: string
  titulo: string
  valor: string
  icon: LucideIcon
  status: IndicatorStatus
  variacao?: string
  direcaoVariacao?: TrendDirection
  comparacao: string
  tooltip?: string
}

/* Mesmos seis indicadores, valores e status de sempre — apenas recompostos como faixa executiva. */
const indicators: ExecutiveIndicator[] = [
  {
    id: 'cmv-real',
    titulo: 'CMV real',
    valor: formatPercent(networkSummary.cmvReal),
    icon: Percent,
    status: 'critical',
    variacao: formatPercentPoints(networkSummary.cmvReal - networkSummary.cmvMeta),
    direcaoVariacao: 'up',
    comparacao: `Meta: ${formatPercent(networkSummary.cmvMeta)}`,
    tooltip: 'CMV calculado com base no estoque inicial, compras, transferências e estoque final.',
  },
  {
    id: 'cmv-teorico',
    titulo: 'CMV teórico',
    valor: formatPercent(networkSummary.cmvTeorico),
    icon: Calculator,
    status: 'attention',
    variacao: formatPercentPoints(networkSummary.cmvTeoricoVariacaoAnterior),
    direcaoVariacao: 'up',
    comparacao: 'vs. período anterior',
    tooltip: 'Baseado nas fichas técnicas e vendas registradas.',
  },
  {
    id: 'diferenca',
    titulo: 'Diferença financeira',
    valor: formatCurrencyCompactBRL(networkSummary.diferencaFinanceira),
    icon: Wallet,
    status: 'critical',
    comparacao: 'impacto estimado no período',
  },
  {
    id: 'compras',
    titulo: 'Compras do período',
    valor: formatCurrencyCompactBRL(networkSummary.compras),
    icon: ShoppingCart,
    status: 'attention',
    variacao: `+${(networkSummary.comprasVariacaoAnterior * 100).toFixed(1)}%`,
    direcaoVariacao: 'up',
    comparacao: 'vs. período anterior',
  },
  {
    id: 'estoque',
    titulo: 'Valor em estoque',
    valor: formatCurrencyCompactBRL(networkSummary.valorEstoque),
    icon: Package,
    status: 'success',
    comparacao: 'consolidado das 6 unidades',
  },
  {
    id: 'perdas',
    titulo: 'Perdas registradas',
    valor: formatCurrencyCompactBRL(networkSummary.perdas),
    icon: AlertTriangle,
    status: 'critical',
    variacao: `+${(networkSummary.perdasVariacaoAnterior * 100).toFixed(1)}%`,
    direcaoVariacao: 'up',
    comparacao: 'vs. período anterior',
  },
]

export function IndicatorsSection() {
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null)

  return (
    <section>
      <SectionHeader title="Indicadores principais" description="Consolidado das 6 unidades no período selecionado" />
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {indicators.map((ind) => {
          const Icon = ind.icon
          return (
            <button
              key={ind.id}
              onClick={() => setSelectedMetricId(ind.id)}
              className="flex items-start gap-3 bg-surface px-5 py-5 text-left transition-colors hover:bg-surface-hover"
            >
              <span className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full', statusIconClasses[ind.status])}>
                <Icon className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="whitespace-nowrap text-caption text-ink-secondary">{ind.titulo}</span>
                  {ind.tooltip && (
                    <Tooltip content={ind.tooltip}>
                      <Info className="h-3 w-3 cursor-help text-ink-tertiary" />
                    </Tooltip>
                  )}
                </span>
                <span className="text-metric-sm tabular text-ink-primary">{ind.valor}</span>
                <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-caption">
                  {ind.variacao && (
                    <span className={cn('inline-flex items-center gap-0.5 font-medium tabular', ind.direcaoVariacao === 'down' ? 'text-success' : 'text-danger')}>
                      {ind.direcaoVariacao === 'down' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
                      {ind.variacao}
                    </span>
                  )}
                  <span className="text-ink-tertiary">{ind.comparacao}</span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <MetricDetailModal metric={selectedMetricId ? buildMetricConfig(selectedMetricId) : null} onClose={() => setSelectedMetricId(null)} />
    </section>
  )
}
