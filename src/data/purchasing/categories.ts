import type { PurchaseCategorySummary } from '@/types'
import { purchasingSituation } from './situation'

/**
 * Composição de compras por categoria (seção 11) — soma exatamente aos
 * R$ 428.700 de purchasingSituation.comprasLiquidas, que por sua vez é a
 * mesma constante já usada em networkSummary.compras na Central de
 * Operações. Fonte independente de units.ts (cujo somatório de `compras`
 * por unidade não deve ser alterado nesta etapa).
 */
const raw: Omit<PurchaseCategorySummary, 'participacao'>[] = [
  { id: 'carnes', categoria: 'Carnes', valor: 96800, variacao: 0.052, fornecedores: 3, unidades: 6, alertas: 2 },
  { id: 'chope-cervejas', categoria: 'Chope e cervejas', valor: 82400, variacao: 0.031, fornecedores: 2, unidades: 6, alertas: 1 },
  { id: 'bebidas', categoria: 'Bebidas', valor: 61700, variacao: 0.018, fornecedores: 4, unidades: 6, alertas: 0 },
  { id: 'secos', categoria: 'Secos', valor: 53200, variacao: 0.024, fornecedores: 3, unidades: 6, alertas: 0 },
  { id: 'laticinios', categoria: 'Laticínios', valor: 39600, variacao: -0.012, fornecedores: 2, unidades: 6, alertas: 0 },
  { id: 'hortifruti', categoria: 'Hortifrúti', valor: 34500, variacao: 0.041, fornecedores: 2, unidades: 6, alertas: 1 },
  { id: 'oleos-frituras', categoria: 'Óleos e frituras', valor: 22900, variacao: 0.094, fornecedores: 4, unidades: 6, alertas: 1 },
  { id: 'embalagens', categoria: 'Embalagens', valor: 18400, variacao: 0.067, fornecedores: 2, unidades: 6, alertas: 1 },
  { id: 'limpeza', categoria: 'Limpeza', valor: 11600, variacao: 0.008, fornecedores: 1, unidades: 6, alertas: 0 },
  { id: 'outros', categoria: 'Outros', valor: 7600, variacao: -0.021, fornecedores: 2, unidades: 6, alertas: 0 },
]

export const purchaseCategories: PurchaseCategorySummary[] = raw.map((c) => ({
  ...c,
  participacao: c.valor / purchasingSituation.comprasLiquidas,
}))

export function getPurchaseCategoryById(id: string): PurchaseCategorySummary | undefined {
  return purchaseCategories.find((c) => c.id === id)
}
