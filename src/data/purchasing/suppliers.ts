import type { SupplierSummary } from '@/types'

/**
 * Resumo de fornecedores usado pelas conexões de Compras (cotações, pedidos,
 * requisições). O cadastro completo agora vive em src/data/suppliers/ (módulo
 * Fornecedores) — scoreResumo/pontualidade/conformidade/divergenciasRecentes
 * abaixo são a mesma leitura dessa base, só que resumida para o que Compras
 * precisa exibir.
 */
export const suppliers: SupplierSummary[] = [
  { id: 'distribuidora-gaucha', nome: 'Distribuidora Gaúcha', categoriaPrincipal: 'Óleos e frituras', scoreResumo: 0.78, pontualidade: 0.84, conformidade: 0.82, divergenciasRecentes: 2, comprasRecentes: 14, homologado: true },
  { id: 'serra-alimentos', nome: 'Serra Alimentos', categoriaPrincipal: 'Carnes', scoreResumo: 0.71, pontualidade: 0.82, conformidade: 0.86, divergenciasRecentes: 4, comprasRecentes: 22, homologado: true },
  { id: 'sul-foodservice', nome: 'Sul Foodservice', categoriaPrincipal: 'Óleos e frituras', scoreResumo: 0.91, pontualidade: 0.96, conformidade: 0.95, divergenciasRecentes: 0, comprasRecentes: 18, homologado: true },
  { id: 'atacado-central', nome: 'Atacado Central', categoriaPrincipal: 'Secos', scoreResumo: 0.86, pontualidade: 0.91, conformidade: 0.89, divergenciasRecentes: 1, comprasRecentes: 11, homologado: true },
  { id: 'bebidas-sul', nome: 'Bebidas Sul', categoriaPrincipal: 'Chope e cervejas', scoreResumo: 0.84, pontualidade: 0.89, conformidade: 0.92, divergenciasRecentes: 1, comprasRecentes: 27, homologado: true },
  { id: 'hortifruti-bahia', nome: 'Hortifruti Bahia', categoriaPrincipal: 'Hortifrúti', scoreResumo: 0.82, pontualidade: 0.86, conformidade: 0.85, divergenciasRecentes: 2, comprasRecentes: 31, homologado: true },
  { id: 'laticinios-do-vale', nome: 'Laticínios do Vale', categoriaPrincipal: 'Laticínios', scoreResumo: 0.91, pontualidade: 0.95, conformidade: 0.91, divergenciasRecentes: 0, comprasRecentes: 19, homologado: true },
  { id: 'embalagens-bahia', nome: 'Embalagens Bahia', categoriaPrincipal: 'Embalagens', scoreResumo: 0.72, pontualidade: 0.79, conformidade: 0.75, divergenciasRecentes: 3, comprasRecentes: 9, homologado: false },
]

export function getSupplierById(id: string): SupplierSummary | undefined {
  return suppliers.find((s) => s.id === id)
}
