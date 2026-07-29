import type { SupplierCategoryBreakdown } from '@/types'

/** Categorias fornecidas por fornecedor (secao 34) — aprofundado para Serra Alimentos. */
export const supplierCategoryBreakdowns: SupplierCategoryBreakdown[] = [
  { supplierId: 'serra-alimentos', categoria: 'carnes', valor: 68300, itens: 5, unidades: 6, participacao: 0.68, variacaoPreco: 0.091, divergencias: 3, status: 'em_atencao' },
  { supplierId: 'serra-alimentos', categoria: 'laticinios', valor: 14600, itens: 3, unidades: 5, participacao: 0.12, variacaoPreco: 0.042, divergencias: 1, status: 'ativo' },
  { supplierId: 'serra-alimentos', categoria: 'secos', valor: 3500, itens: 2, unidades: 4, participacao: 0.03, variacaoPreco: 0.0, divergencias: 0, status: 'ativo' },

  { supplierId: 'bebidas-sul', categoria: 'chope_cervejas', valor: 60900, itens: 3, unidades: 6, participacao: 0.76, variacaoPreco: 0.021, divergencias: 1, status: 'ativo' },
  { supplierId: 'bebidas-sul', categoria: 'bebidas', valor: 13900, itens: 4, unidades: 5, participacao: 0.15, variacaoPreco: 0.015, divergencias: 0, status: 'ativo' },

  { supplierId: 'sul-foodservice', categoria: 'secos', valor: 39800, itens: 6, unidades: 6, participacao: 0.24, variacaoPreco: 0.013, divergencias: 0, status: 'estrategico' },
  { supplierId: 'sul-foodservice', categoria: 'oleos_frituras', valor: 22500, itens: 3, unidades: 6, participacao: 0.19, variacaoPreco: 0.008, divergencias: 0, status: 'estrategico' },

  { supplierId: 'hortifruti-bahia', categoria: 'hortifruti', valor: 34500, itens: 9, unidades: 6, participacao: 0.54, variacaoPreco: 0.034, divergencias: 2, status: 'ativo' },
]

export function getCategoryBreakdownBySupplier(supplierId: string): SupplierCategoryBreakdown[] {
  return supplierCategoryBreakdowns.filter((c) => c.supplierId === supplierId)
}
