/**
 * Formulas do modulo de CMV. Nenhum componente visual deve somar,
 * dividir ou multiplicar esses valores diretamente — sempre via estas
 * funcoes, para manter uma unica fonte de verdade para o calculo.
 */
import type { CmvNetworkPeriod } from '@/types'

export function calcularVendasLiquidas(vendasBrutas: number, deducoes: number): number {
  return vendasBrutas - deducoes
}

export function calcularComprasLiquidas(comprasBrutas: number, devolucoesFornecedores: number): number {
  return comprasBrutas - devolucoesFornecedores
}

export function calcularCustoRealConsumido(period: {
  estoqueInicial: number
  comprasBrutas: number
  devolucoesFornecedores: number
  transferenciasRecebidas: number
  transferenciasEnviadas: number
  estoqueFinal: number
  ajustesAutorizados: number
}): number {
  const comprasLiquidas = calcularComprasLiquidas(period.comprasBrutas, period.devolucoesFornecedores)
  return (
    period.estoqueInicial +
    comprasLiquidas +
    period.transferenciasRecebidas -
    period.transferenciasEnviadas -
    period.estoqueFinal +
    period.ajustesAutorizados
  )
}

export function calcularCmv(custo: number, vendasLiquidas: number): number {
  return vendasLiquidas === 0 ? 0 : custo / vendasLiquidas
}

export function calcularDiferencaPontos(cmvA: number, cmvB: number): number {
  return cmvA - cmvB
}

export function calcularImpactoFinanceiro(cmvA: number, cmvB: number, vendasLiquidas: number): number {
  return (cmvA - cmvB) * vendasLiquidas
}

export function calcularParticipacao(valor: number, total: number): number {
  return total === 0 ? 0 : valor / total
}

export function calcularRecuperacaoPotencial(desvioTotal: number, percentual: number): number {
  return desvioTotal * percentual
}

export interface CmvNetworkComputed {
  vendasLiquidas: number
  comprasLiquidas: number
  custoRealConsumido: number
  cmvReal: number
  cmvTeorico: number
  desvioOperacional: number
  diferencaVsTeoricoPP: number
  impactoVsTeorico: number
  diferencaVsMetaPP: number
  impactoVsMeta: number
  custoCorrespondenteMeta: number
}

/** Deriva todos os valores do periodo consolidado a partir dos dados brutos. */
export function computeNetworkPeriod(period: CmvNetworkPeriod): CmvNetworkComputed {
  const vendasLiquidas = calcularVendasLiquidas(period.vendasBrutas, period.deducoes)
  const comprasLiquidas = calcularComprasLiquidas(period.comprasBrutas, period.devolucoesFornecedores)
  const custoRealConsumido = calcularCustoRealConsumido(period)
  const cmvReal = calcularCmv(custoRealConsumido, vendasLiquidas)
  const cmvTeorico = calcularCmv(period.custoTeorico, vendasLiquidas)
  const desvioOperacional = custoRealConsumido - period.custoTeorico
  const diferencaVsTeoricoPP = calcularDiferencaPontos(cmvReal, cmvTeorico)
  const impactoVsTeorico = calcularImpactoFinanceiro(cmvReal, cmvTeorico, vendasLiquidas)
  const diferencaVsMetaPP = calcularDiferencaPontos(cmvReal, period.metaCmv)
  const impactoVsMeta = calcularImpactoFinanceiro(cmvReal, period.metaCmv, vendasLiquidas)
  const custoCorrespondenteMeta = period.metaCmv * vendasLiquidas

  return {
    vendasLiquidas,
    comprasLiquidas,
    custoRealConsumido,
    cmvReal,
    cmvTeorico,
    desvioOperacional,
    diferencaVsTeoricoPP,
    impactoVsTeorico,
    diferencaVsMetaPP,
    impactoVsMeta,
    custoCorrespondenteMeta,
  }
}

/** Agrega um total simples por chave (ex.: soma de impacto por categoria). */
export function agregarPorChave<T>(items: T[], chave: (item: T) => string, valor: (item: T) => number): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const k = chave(item)
    acc[k] = (acc[k] ?? 0) + valor(item)
    return acc
  }, {})
}
