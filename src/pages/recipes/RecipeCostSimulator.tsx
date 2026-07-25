import { useMemo, useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Input } from '@/components/ui/Input'
import { formatCurrencyPreciseBRL, formatPercent, formatPercentPoints } from '@/utils/format'
import {
  calcularCmvTeorico,
  calcularCustoPorPorcao,
  calcularCustoReceita,
  calcularMargemBruta,
  calcularMargemPercentual,
  calcularPrecoLiquido,
} from '@/utils/recipeCalculations'
import { cn } from '@/utils/cn'
import type { RecipeVersion } from '@/types'

/** Simulador de custo e margem (seção 33) — recalcula CMV teórico e margem a partir de variações hipotéticas, sem alterar a ficha vigente. */
export function RecipeCostSimulator({ version }: { version: RecipeVersion }) {
  const custoReceitaBase = calcularCustoReceita(version.ingredientes)

  const [variacaoCustoPercentual, setVariacaoCustoPercentual] = useState(0)
  const [precoVendaSimulado, setPrecoVendaSimulado] = useState(version.precoVenda)

  const base = useMemo(() => {
    const custoPorcao = calcularCustoPorPorcao(custoReceitaBase, version.rendimento.porcoes) + version.custoEmbalagem
    const precoLiquido = calcularPrecoLiquido(version.precoVenda, version.descontoMedioPercentual)
    const cmvTeorico = calcularCmvTeorico(custoPorcao, precoLiquido)
    const margemBruta = calcularMargemBruta(precoLiquido, custoPorcao)
    return { custoPorcao, precoLiquido, cmvTeorico, margemBruta, margemPercentual: calcularMargemPercentual(margemBruta, precoLiquido) }
  }, [custoReceitaBase, version])

  const simulado = useMemo(() => {
    const custoReceitaSimulado = custoReceitaBase * (1 + variacaoCustoPercentual / 100)
    const custoPorcao = calcularCustoPorPorcao(custoReceitaSimulado, version.rendimento.porcoes) + version.custoEmbalagem
    const precoLiquido = calcularPrecoLiquido(precoVendaSimulado, version.descontoMedioPercentual)
    const cmvTeorico = calcularCmvTeorico(custoPorcao, precoLiquido)
    const margemBruta = calcularMargemBruta(precoLiquido, custoPorcao)
    return { custoPorcao, precoLiquido, cmvTeorico, margemBruta, margemPercentual: calcularMargemPercentual(margemBruta, precoLiquido) }
  }, [custoReceitaBase, precoVendaSimulado, variacaoCustoPercentual, version])

  const cmvDelta = simulado.cmvTeorico - base.cmvTeorico
  const margemDelta = simulado.margemPercentual - base.margemPercentual

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Simulador de custo e margem"
        description="Ajuste hipóteses de variação de custo e preço — não altera a ficha vigente, apenas projeta o impacto"
      />

      <div className="grid grid-cols-1 gap-6 rounded-lg border border-border bg-surface p-5 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Input
            type="number"
            label="Variação no custo dos insumos"
            hint="Percentual aplicado sobre o custo total da receita atual"
            value={variacaoCustoPercentual}
            onChange={(e) => setVariacaoCustoPercentual(Number(e.target.value))}
            step={1}
          />
          <Input
            type="number"
            label="Novo preço de venda"
            hint={`Preço vigente: ${formatCurrencyPreciseBRL(version.precoVenda)}`}
            value={precoVendaSimulado}
            onChange={(e) => setPrecoVendaSimulado(Number(e.target.value))}
            step={0.5}
            min={0}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="flex items-center justify-between">
            <span className="text-support text-ink-secondary">Custo por porção</span>
            <span className="tabular text-support font-medium text-ink-primary">
              {formatCurrencyPreciseBRL(simulado.custoPorcao)}
              {simulado.custoPorcao !== base.custoPorcao && (
                <span className="ml-1.5 text-caption text-ink-tertiary">(era {formatCurrencyPreciseBRL(base.custoPorcao)})</span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-support text-ink-secondary">CMV teórico</span>
            <span className={cn('tabular text-support font-medium', cmvDelta > 0.0005 ? 'text-danger' : cmvDelta < -0.0005 ? 'text-success' : 'text-ink-primary')}>
              {formatPercent(simulado.cmvTeorico, 1)}
              {Math.abs(cmvDelta) > 0.0005 && <span className="ml-1.5 text-caption">({formatPercentPoints(cmvDelta)})</span>}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-support text-ink-secondary">Margem bruta</span>
            <span className="tabular text-support font-medium text-ink-primary">{formatCurrencyPreciseBRL(simulado.margemBruta)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-support text-ink-secondary">Margem percentual</span>
            <span className={cn('tabular text-support font-medium', margemDelta < -0.0005 ? 'text-danger' : margemDelta > 0.0005 ? 'text-success' : 'text-ink-primary')}>
              {formatPercent(simulado.margemPercentual, 1)}
              {Math.abs(margemDelta) > 0.0005 && <span className="ml-1.5 text-caption">({formatPercentPoints(margemDelta)})</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
