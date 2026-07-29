import type { SupplierProduct } from '@/types'

const ALL_UNITS = ['moinhos', 'caxias-centro', 'zona-norte', 'cidade-baixa', 'serra', 'caxias-norte']

/**
 * Itens fornecidos (secao 35-36). Aprofundado para Serra Alimentos — os
 * demais fornecedores tem ao menos o item mais relevante para as conexoes
 * com Compras, Estoque e CMV (ex.: chope IPA da Bebidas Sul).
 */
export const supplierProducts: SupplierProduct[] = [
  { id: 'sp-carne-bovina-blend', supplierId: 'serra-alimentos', nome: 'Carne bovina — blend para hambúrguer', codigo: 'CAR-001', categoria: 'carnes', unidadeMedida: 'kg', precoAtual: 37.5, precoAnterior: 34.36, prazoEntregaDias: 4, pedidoMinimo: 100, unidadesAtendidas: ALL_UNITS, comprasNoPeriodo: 18900, divergencias: 1, status: 'ativo' },
  { id: 'sp-entrecot', supplierId: 'serra-alimentos', nome: 'Entrecot', codigo: 'CAR-014', categoria: 'carnes', unidadeMedida: 'kg', precoAtual: 68.9, precoAnterior: 66.2, prazoEntregaDias: 4, pedidoMinimo: 30, unidadesAtendidas: ['moinhos', 'caxias-centro', 'serra'], comprasNoPeriodo: 8200, divergencias: 0, status: 'ativo' },
  { id: 'sp-bacon', supplierId: 'serra-alimentos', nome: 'Bacon', codigo: 'CAR-022', categoria: 'carnes', unidadeMedida: 'kg', precoAtual: 42.4, precoAnterior: 40.15, prazoEntregaDias: 4, pedidoMinimo: 20, unidadesAtendidas: ALL_UNITS, comprasNoPeriodo: 6100, divergencias: 1, status: 'ativo' },
  { id: 'sp-cheddar', supplierId: 'serra-alimentos', nome: 'Queijo cheddar', codigo: 'LAT-007', categoria: 'laticinios', unidadeMedida: 'kg', precoAtual: 33.9, precoAnterior: 32.55, prazoEntregaDias: 4, pedidoMinimo: 15, unidadesAtendidas: ALL_UNITS, comprasNoPeriodo: 7400, divergencias: 1, status: 'ativo' },
  { id: 'sp-queijo-prato', supplierId: 'serra-alimentos', nome: 'Queijo prato', codigo: 'LAT-009', categoria: 'laticinios', unidadeMedida: 'kg', precoAtual: 29.8, precoAnterior: 29.8, prazoEntregaDias: 4, pedidoMinimo: 15, unidadesAtendidas: ['moinhos', 'caxias-centro', 'zona-norte', 'cidade-baixa'], comprasNoPeriodo: 4100, divergencias: 0, status: 'ativo' },
  { id: 'sp-creme-de-leite', supplierId: 'serra-alimentos', nome: 'Creme de leite', codigo: 'LAT-012', categoria: 'laticinios', unidadeMedida: 'litro', precoAtual: 11.2, precoAnterior: 11.2, prazoEntregaDias: 4, pedidoMinimo: 20, unidadesAtendidas: ALL_UNITS, comprasNoPeriodo: 1900, divergencias: 0, status: 'ativo' },
  { id: 'sp-manteiga', supplierId: 'serra-alimentos', nome: 'Manteiga', codigo: 'LAT-015', categoria: 'laticinios', unidadeMedida: 'kg', precoAtual: 38.6, precoAnterior: 38.6, prazoEntregaDias: 4, pedidoMinimo: 10, unidadesAtendidas: ALL_UNITS, comprasNoPeriodo: 1200, divergencias: 0, status: 'ativo' },

  { id: 'sp-chope-ipa', supplierId: 'bebidas-sul', nome: 'Chope IPA', codigo: 'BEB-004', categoria: 'chope_cervejas', unidadeMedida: 'litro', precoAtual: 31.6, precoAnterior: 30.95, prazoEntregaDias: 3, pedidoMinimo: 200, unidadesAtendidas: ALL_UNITS, comprasNoPeriodo: 12640, divergencias: 0, status: 'ativo' },
  { id: 'sp-chope-pilsen', supplierId: 'bebidas-sul', nome: 'Chope Pilsen', codigo: 'BEB-002', categoria: 'chope_cervejas', unidadeMedida: 'litro', precoAtual: 24.9, precoAnterior: 24.9, prazoEntregaDias: 3, pedidoMinimo: 200, unidadesAtendidas: ALL_UNITS, comprasNoPeriodo: 9800, divergencias: 0, status: 'ativo' },

  { id: 'sp-oleo-soja', supplierId: 'sul-foodservice', nome: 'Óleo de soja', codigo: 'OLE-001', categoria: 'oleos_frituras', unidadeMedida: 'litro', precoAtual: 9.8, precoAnterior: 8.95, prazoEntregaDias: 5, pedidoMinimo: 50, unidadesAtendidas: ALL_UNITS, comprasNoPeriodo: 5600, divergencias: 0, status: 'ativo' },

  { id: 'sp-alface-americana', supplierId: 'hortifruti-bahia', nome: 'Alface americana', codigo: 'HOR-003', categoria: 'hortifruti', unidadeMedida: 'kg', precoAtual: 6.2, precoAnterior: 6.2, prazoEntregaDias: 2, pedidoMinimo: 20, unidadesAtendidas: ALL_UNITS, comprasNoPeriodo: 2400, divergencias: 0, status: 'ativo' },

  { id: 'sp-embalagem-delivery', supplierId: 'atacado-central', nome: 'Embalagem delivery', codigo: 'EMB-011', categoria: 'embalagens', unidadeMedida: 'unidade', precoAtual: 1.8, precoAnterior: 1.8, prazoEntregaDias: 3, pedidoMinimo: 500, unidadesAtendidas: ['moinhos', 'caxias-centro', 'zona-norte', 'caxias-norte'], comprasNoPeriodo: 3600, divergencias: 0, status: 'ativo' },
]

export function getProductsBySupplier(supplierId: string): SupplierProduct[] {
  return supplierProducts.filter((p) => p.supplierId === supplierId)
}
