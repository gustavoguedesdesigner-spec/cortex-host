import type { SupplierReceipt } from '@/types'

/**
 * Recebimentos por fornecedor (secao 40). O modulo de Recebimentos ainda e
 * estrutural nesta etapa — os registros abaixo sao a leitura do lado do
 * fornecedor, sem duplicar o pedido de origem (ver purchasing/orders.ts).
 */
export const supplierReceipts: SupplierReceipt[] = [
  { id: 'rec-9821', supplierId: 'serra-alimentos', orderId: 'po-4518', unitId: 'moinhos', data: '2026-07-23T10:20:00-03:00', valor: 18900, prazoStatus: 'no_prazo', quantidadeStatus: 'divergente', precoStatus: 'divergente', qualidadeStatus: 'conforme', status: 'divergente' },
  { id: 'rec-9764', supplierId: 'serra-alimentos', unitId: 'caxias-centro', data: '2026-07-10T09:40:00-03:00', valor: 12400, prazoStatus: 'no_prazo', quantidadeStatus: 'divergente', precoStatus: 'conforme', qualidadeStatus: 'conforme', status: 'divergente' },
  { id: 'rec-9698', supplierId: 'serra-alimentos', unitId: 'zona-norte', data: '2026-06-28T14:10:00-03:00', valor: 9800, prazoStatus: 'atrasado', quantidadeStatus: 'conforme', precoStatus: 'conforme', qualidadeStatus: 'conforme', status: 'divergente' },
  { id: 'rec-9642', supplierId: 'serra-alimentos', unitId: 'cidade-baixa', data: '2026-06-15T11:30:00-03:00', valor: 11200, prazoStatus: 'no_prazo', quantidadeStatus: 'conforme', precoStatus: 'divergente', qualidadeStatus: 'conforme', status: 'divergente' },
  { id: 'rec-9855', supplierId: 'serra-alimentos', unitId: 'serra', data: '2026-07-24T09:00:00-03:00', valor: 6400, prazoStatus: 'no_prazo', quantidadeStatus: 'conforme', precoStatus: 'conforme', qualidadeStatus: 'conforme', status: 'conforme' },
  { id: 'rec-9856', supplierId: 'serra-alimentos', unitId: 'caxias-norte', data: '2026-07-22T10:15:00-03:00', valor: 5200, prazoStatus: 'no_prazo', quantidadeStatus: 'conforme', precoStatus: 'conforme', qualidadeStatus: 'conforme', status: 'conforme' },

  { id: 'rec-9860', supplierId: 'bebidas-sul', orderId: 'po-4532', unitId: 'moinhos', data: '2026-07-25T11:45:00-03:00', valor: 10112, prazoStatus: 'atrasado', quantidadeStatus: 'divergente', precoStatus: 'conforme', qualidadeStatus: 'conforme', status: 'divergente' },
  { id: 'rec-9700', supplierId: 'distribuidora-gaucha', unitId: 'zona-norte', data: '2026-07-09T10:00:00-03:00', valor: 7200, prazoStatus: 'no_prazo', quantidadeStatus: 'conforme', precoStatus: 'divergente', qualidadeStatus: 'conforme', status: 'divergente' },
]

export function getReceiptsBySupplier(supplierId: string): SupplierReceipt[] {
  return supplierReceipts.filter((r) => r.supplierId === supplierId)
}
