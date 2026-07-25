import type { CmvIngredientData } from '@/types'

/**
 * Insumos — apenas "Carne bovina — blend para hambúrguer" recebe
 * profundidade total (acessível a partir do Burger Costela), conectando
 * CMV, estoque, compras e fichas técnicas conforme o briefing.
 */
export const cmvIngredients: Record<string, CmvIngredientData> = {
  'carne-bovina-blend': {
    id: 'carne-bovina-blend',
    nome: 'Carne bovina — blend para hambúrguer',
    unidadeMedida: 'kg',
    estoqueInicial: 420,
    entradas: 2380,
    transferencias: 0,
    perdas: 38,
    consumoTeorico: 2210,
    consumoReal: 2540,
    estoqueFinal: 222,
    precoMedio: 32.4,
    fornecedores: ['Serra Alimentos', 'Distribuidora Gaúcha'],
    unidades: ['Moinhos', 'Caxias Centro', 'Zona Norte'],
    produtosQueUtilizam: ['Burger Costela', 'Tomahawk Burger', 'Burger Bacon', 'Burger Clássico'],
  },
}

export function getCmvIngredientById(id: string): CmvIngredientData | undefined {
  return cmvIngredients[id]
}
