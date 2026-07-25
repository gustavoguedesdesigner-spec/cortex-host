/**
 * Formulas do modulo de Fichas Tecnicas. Nenhum componente visual deve
 * somar custo de ingredientes, calcular CMV teorico, margem ou fator de
 * correcao diretamente — sempre via estas funcoes.
 */
import type { RecipeIngredientLine } from '@/types'

/** Fator de correção = peso bruto ÷ peso líquido. */
export function calcularFatorCorrecao(pesoBrutoG: number, pesoLiquidoG: number): number {
  return pesoLiquidoG === 0 ? 0 : pesoBrutoG / pesoLiquidoG
}

/** Perda técnica prevista, em percentual — nunca confundir com perda operacional observada. */
export function calcularPerdaTecnica(pesoBrutoG: number, pesoLiquidoG: number): number {
  return pesoBrutoG === 0 ? 0 : (pesoBrutoG - pesoLiquidoG) / pesoBrutoG
}

export function calcularCustoIngrediente(quantidade: number, custoUnitario: number): number {
  return quantidade * custoUnitario
}

export function calcularCustoReceita(ingredientes: RecipeIngredientLine[]): number {
  return ingredientes.reduce((sum, i) => sum + i.custoNaFicha, 0)
}

export function calcularCustoPorPorcao(custoReceita: number, porcoes: number): number {
  return porcoes === 0 ? 0 : custoReceita / porcoes
}

export function calcularPrecoLiquido(precoBruto: number, descontoMedioPercentual: number): number {
  return precoBruto * (1 - descontoMedioPercentual)
}

export function calcularCmvTeorico(custoPorcao: number, precoLiquido: number): number {
  return precoLiquido === 0 ? 0 : custoPorcao / precoLiquido
}

export function calcularMargemBruta(precoLiquido: number, custoPorcao: number): number {
  return precoLiquido - custoPorcao
}

export function calcularMargemPercentual(margemBruta: number, precoLiquido: number): number {
  return precoLiquido === 0 ? 0 : margemBruta / precoLiquido
}

export function calcularCustoPorKg(custoTotal: number, rendimentoG: number): number {
  return rendimentoG === 0 ? 0 : (custoTotal / rendimentoG) * 1000
}

export function calcularCustoPorGrama(custoTotal: number, rendimentoG: number): number {
  return rendimentoG === 0 ? 0 : custoTotal / rendimentoG
}

/** Consumo teórico em kg = unidades vendidas × quantidade líquida por porção (g) ÷ 1000. */
export function calcularConsumoTeoricoKg(unidadesVendidas: number, quantidadePorcaoG: number): number {
  return (unidadesVendidas * quantidadePorcaoG) / 1000
}

export function calcularDiferencaConsumo(consumoTeoricoKg: number, consumoRealKg: number): number {
  return consumoRealKg - consumoTeoricoKg
}

/** Impacto estimado de alterar o custo de um insumo em X% sobre o custo da receita. */
export function calcularImpactoAlteracaoCusto(custoAtualIngrediente: number, variacaoPercentual: number): number {
  return custoAtualIngrediente * variacaoPercentual
}

/** Impacto estimado de alterar a porção em X gramas, dado o custo por grama do insumo. */
export function calcularImpactoAlteracaoPorcao(custoPorGrama: number, deltaG: number): number {
  return custoPorGrama * deltaG
}

export interface RecipeFinancials {
  custoReceita: number
  custoPorcao: number
  custoTotalComEmbalagem: number
  precoLiquido: number
  cmvTeorico: number
  margemBruta: number
  margemPercentual: number
}

export function computeRecipeFinancials(params: {
  ingredientes: RecipeIngredientLine[]
  porcoes: number
  precoVenda: number
  descontoMedioPercentual: number
  custoEmbalagem: number
}): RecipeFinancials {
  const custoReceita = calcularCustoReceita(params.ingredientes)
  const custoPorcao = calcularCustoPorPorcao(custoReceita, params.porcoes) + params.custoEmbalagem
  const precoLiquido = calcularPrecoLiquido(params.precoVenda, params.descontoMedioPercentual)
  const cmvTeorico = calcularCmvTeorico(custoPorcao, precoLiquido)
  const margemBruta = calcularMargemBruta(precoLiquido, custoPorcao)
  const margemPercentual = calcularMargemPercentual(margemBruta, precoLiquido)
  return { custoReceita, custoPorcao, custoTotalComEmbalagem: custoPorcao, precoLiquido, cmvTeorico, margemBruta, margemPercentual }
}
