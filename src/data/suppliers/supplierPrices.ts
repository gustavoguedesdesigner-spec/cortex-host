import type { SupplierPriceEntry } from '@/types'

/** Historico de precos por item (secao 43-44) — aprofundado para Serra Alimentos. */
export const supplierPrices: SupplierPriceEntry[] = [
  {
    id: 'price-carne-bovina',
    supplierId: 'serra-alimentos',
    itemId: 'sp-carne-bovina-blend',
    itemNome: 'Carne bovina — blend para hambúrguer',
    precoAtual: 37.5,
    precoMedio: 35.4,
    menor: 34.36,
    maior: 37.5,
    variacao: 0.091,
    historico: [
      { data: '2026-05-01', preco: 34.36 },
      { data: '2026-05-15', preco: 34.36 },
      { data: '2026-06-01', preco: 34.9 },
      { data: '2026-06-15', preco: 35.2 },
      { data: '2026-07-01', preco: 36.1 },
      { data: '2026-07-23', preco: 37.5 },
    ],
    pedidoRelacionadoId: 'po-4518',
    recebimentoRelacionadoId: 'rec-9821',
  },
  {
    id: 'price-cheddar',
    supplierId: 'serra-alimentos',
    itemId: 'sp-cheddar',
    itemNome: 'Queijo cheddar',
    precoAtual: 33.9,
    precoMedio: 32.7,
    menor: 32.15,
    maior: 33.9,
    variacao: 0.042,
    historico: [
      { data: '2026-05-01', preco: 32.15 },
      { data: '2026-06-01', preco: 32.4 },
      { data: '2026-06-15', preco: 32.55 },
      { data: '2026-07-15', preco: 33.9 },
    ],
    recebimentoRelacionadoId: 'rec-9642',
  },
  {
    id: 'price-bacon',
    supplierId: 'serra-alimentos',
    itemId: 'sp-bacon',
    itemNome: 'Bacon',
    precoAtual: 42.4,
    precoMedio: 41.0,
    menor: 40.15,
    maior: 42.4,
    variacao: 0.056,
    historico: [
      { data: '2026-05-01', preco: 40.15 },
      { data: '2026-06-01', preco: 40.8 },
      { data: '2026-07-01', preco: 41.6 },
      { data: '2026-07-20', preco: 42.4 },
    ],
  },
  {
    id: 'price-manteiga',
    supplierId: 'serra-alimentos',
    itemId: 'sp-manteiga',
    itemNome: 'Manteiga',
    precoAtual: 38.6,
    precoMedio: 38.6,
    menor: 38.6,
    maior: 38.6,
    variacao: 0,
    historico: [
      { data: '2026-05-01', preco: 38.6 },
      { data: '2026-06-01', preco: 38.6 },
      { data: '2026-07-01', preco: 38.6 },
    ],
  },
]

export function getPricesBySupplier(supplierId: string): SupplierPriceEntry[] {
  return supplierPrices.filter((p) => p.supplierId === supplierId)
}
