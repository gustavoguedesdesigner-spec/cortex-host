import type { SupplierSummary } from '@/types'

/**
 * Resumo de fornecedores usado pelas conexões de Compras (cotações, pedidos,
 * requisições). O cadastro completo de Fornecedores permanece estrutural
 * nesta etapa — aqui vive apenas o suficiente para decisões de compra.
 */
export const suppliers: SupplierSummary[] = [
  { id: 'distribuidora-gaucha', nome: 'Distribuidora Gaúcha', categoriaPrincipal: 'Óleos e frituras', scoreResumo: 0.81, pontualidade: 0.86, conformidade: 0.78, divergenciasRecentes: 2, comprasRecentes: 14, homologado: true },
  { id: 'serra-alimentos', nome: 'Serra Alimentos', categoriaPrincipal: 'Carnes', scoreResumo: 0.74, pontualidade: 0.8, conformidade: 0.72, divergenciasRecentes: 4, comprasRecentes: 22, homologado: true },
  { id: 'sul-foodservice', nome: 'Sul Foodservice', categoriaPrincipal: 'Óleos e frituras', scoreResumo: 0.89, pontualidade: 0.94, conformidade: 0.92, divergenciasRecentes: 1, comprasRecentes: 18, homologado: true },
  { id: 'atacado-central', nome: 'Atacado Central', categoriaPrincipal: 'Secos', scoreResumo: 0.83, pontualidade: 0.97, conformidade: 0.85, divergenciasRecentes: 2, comprasRecentes: 11, homologado: true },
  { id: 'bebidas-sul', nome: 'Bebidas Sul', categoriaPrincipal: 'Chope e cervejas', scoreResumo: 0.79, pontualidade: 0.83, conformidade: 0.88, divergenciasRecentes: 2, comprasRecentes: 27, homologado: true },
  { id: 'hortifruti-bahia', nome: 'Hortifruti Bahia', categoriaPrincipal: 'Hortifrúti', scoreResumo: 0.85, pontualidade: 0.91, conformidade: 0.9, divergenciasRecentes: 1, comprasRecentes: 31, homologado: true },
  { id: 'laticinios-do-vale', nome: 'Laticínios do Vale', categoriaPrincipal: 'Laticínios', scoreResumo: 0.88, pontualidade: 0.95, conformidade: 0.93, divergenciasRecentes: 0, comprasRecentes: 19, homologado: true },
  { id: 'embalagens-bahia', nome: 'Embalagens Bahia', categoriaPrincipal: 'Embalagens', scoreResumo: 0.72, pontualidade: 0.79, conformidade: 0.75, divergenciasRecentes: 3, comprasRecentes: 9, homologado: false },
]

export function getSupplierById(id: string): SupplierSummary | undefined {
  return suppliers.find((s) => s.id === id)
}
