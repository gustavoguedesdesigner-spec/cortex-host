import type { Supplier, SupplierDivergence } from '@/types'

export function calcularTaxaDivergencia(divergenciasAbertas: number, recebimentosNoPeriodo: number): number {
  if (recebimentosNoPeriodo === 0) return 0
  return divergenciasAbertas / recebimentosNoPeriodo
}

export function calcularValorDivergencias(divergencias: SupplierDivergence[]): number {
  return divergencias.reduce((sum, d) => sum + d.valorEnvolvido, 0)
}

export function calcularParticipacaoCompras(supplier: Supplier, totalCompradoRede: number): number {
  if (totalCompradoRede === 0) return 0
  return supplier.valorCompradoPeriodo / totalCompradoRede
}

/** Ordena fornecedores por um criterio de comparacao (secao 20). */
export type SupplierSortKey = 'valor' | 'score' | 'pontualidade' | 'divergencias' | 'conformidade' | 'nome'

export function ordenarFornecedores(suppliers: Supplier[], criterio: SupplierSortKey): Supplier[] {
  const copy = [...suppliers]
  switch (criterio) {
    case 'valor':
      return copy.sort((a, b) => b.valorCompradoPeriodo - a.valorCompradoPeriodo)
    case 'score':
      return copy.sort((a, b) => b.scoreGeral - a.scoreGeral)
    case 'pontualidade':
      return copy.sort((a, b) => b.pontualidade - a.pontualidade)
    case 'divergencias':
      return copy.sort((a, b) => a.divergenciasAbertas - b.divergenciasAbertas)
    case 'conformidade':
      return copy.sort((a, b) => b.conformidadeQuantidade + b.conformidadePreco - (a.conformidadeQuantidade + a.conformidadePreco))
    case 'nome':
      return copy.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    default:
      return copy
  }
}
