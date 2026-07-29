import { purchaseOrders } from '@/data/purchasing/orders'
import type { PurchaseOrder } from '@/types'

/**
 * Pedidos por fornecedor — reaproveita purchasing/orders.ts (mesma fonte
 * usada em Compras) em vez de duplicar os registros aqui.
 */
export function getOrdersBySupplier(supplierId: string): PurchaseOrder[] {
  return purchaseOrders.filter((o) => o.fornecedorId === supplierId)
}
