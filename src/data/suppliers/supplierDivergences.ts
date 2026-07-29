import type { SupplierDivergence } from '@/types'

/**
 * Divergencias por fornecedor (secao 41). REC-9821 e a mesma divergencia do
 * pedido PO-4518 ja usada em Compras — mesmo valor (R$ 3.780), sem duplicar
 * com numero diferente.
 */
export const supplierDivergences: SupplierDivergence[] = [
  { id: 'div-9821', supplierId: 'serra-alimentos', receiptId: 'rec-9821', orderId: 'po-4518', unitId: 'moinhos', tipo: 'quantidade_e_preco', descricao: 'Recebidos 520 kg (30 kg a menos que o pedido) a R$ 37,50/kg — R$ 3,14 acima do preço acordado (R$ 34,36/kg).', valorEnvolvido: 3780, status: 'aberta', data: '2026-07-23T10:35:00-03:00' },
  { id: 'div-9764', supplierId: 'serra-alimentos', receiptId: 'rec-9764', unitId: 'caxias-centro', tipo: 'quantidade', descricao: 'Recebidos 360 kg de blend bovino, 40 kg a menos que o pedido de 400 kg.', valorEnvolvido: 1940, status: 'em_negociacao', data: '2026-07-10T09:55:00-03:00' },
  { id: 'div-9698', supplierId: 'serra-alimentos', receiptId: 'rec-9698', unitId: 'zona-norte', tipo: 'atraso', descricao: 'Entrega realizada com 2 dias de atraso sobre a previsão — impacto estimado em ruptura parcial de cardápio.', valorEnvolvido: 1100, status: 'resolvida', data: '2026-06-28T14:30:00-03:00' },
  { id: 'div-9642', supplierId: 'serra-alimentos', receiptId: 'rec-9642', unitId: 'cidade-baixa', tipo: 'preco', descricao: 'Recebimento de queijo cheddar 5,3% acima do preço acordado na tabela vigente.', valorEnvolvido: 1600, status: 'credito_solicitado', data: '2026-06-15T11:50:00-03:00' },

  { id: 'div-9860', supplierId: 'bebidas-sul', receiptId: 'rec-9860', orderId: 'po-4532', unitId: 'moinhos', tipo: 'quantidade', descricao: '320L recebidos de 400L pedidos — saldo de 80L previsto para o mesmo dia.', valorEnvolvido: 2528, status: 'em_negociacao', data: '2026-07-25T11:50:00-03:00' },
  { id: 'div-9700', supplierId: 'distribuidora-gaucha', receiptId: 'rec-9700', unitId: 'zona-norte', tipo: 'preco', descricao: 'Óleo de soja recebido acima da tabela vigente após comunicado de reajuste não confirmado.', valorEnvolvido: 940, status: 'aberta', data: '2026-07-09T10:20:00-03:00' },
]

export function getDivergencesBySupplier(supplierId: string): SupplierDivergence[] {
  return supplierDivergences.filter((d) => d.supplierId === supplierId)
}

export function getOpenDivergences(): SupplierDivergence[] {
  return supplierDivergences.filter((d) => d.status === 'aberta' || d.status === 'em_negociacao' || d.status === 'credito_solicitado')
}
