import type { SupplierPurchaseSummary } from '@/types'

/** Resumo de compras por fornecedor (secao 37) — ticket medio, frequencia e serie de 12 meses. */
export const supplierPurchaseSummaries: SupplierPurchaseSummary[] = [
  { supplierId: 'serra-alimentos', ticketMedio: 4800, frequenciaPedidosMes: 18, tendencia: 'crescente', serieMensal12Meses: [72000, 74500, 76800, 79200, 80100, 81600, 82900, 83700, 84500, 85200, 85800, 86400] },
  { supplierId: 'bebidas-sul', ticketMedio: 4675, frequenciaPedidosMes: 16, tendencia: 'estavel', serieMensal12Meses: [70200, 71800, 72400, 73100, 73600, 74000, 74200, 74400, 74600, 74700, 74750, 74800] },
  { supplierId: 'sul-foodservice', ticketMedio: 5663, frequenciaPedidosMes: 11, tendencia: 'estavel', serieMensal12Meses: [59800, 60200, 60600, 61000, 61300, 61600, 61800, 62000, 62100, 62200, 62250, 62300] },
  { supplierId: 'distribuidora-gaucha', ticketMedio: 4200, frequenciaPedidosMes: 13, tendencia: 'decrescente', serieMensal12Meses: [58000, 57500, 57000, 56500, 56000, 55600, 55300, 55000, 54900, 54800, 54700, 54600] },
  { supplierId: 'hortifruti-bahia', ticketMedio: 1725, frequenciaPedidosMes: 20, tendencia: 'estavel', serieMensal12Meses: [33000, 33200, 33400, 33600, 33800, 34000, 34100, 34200, 34300, 34400, 34450, 34500] },
  { supplierId: 'atacado-central', ticketMedio: 5433, frequenciaPedidosMes: 9, tendencia: 'crescente', serieMensal12Meses: [43000, 44000, 44800, 45500, 46200, 46800, 47300, 47800, 48200, 48500, 48700, 48900] },
]

export function getPurchaseSummaryBySupplier(supplierId: string): SupplierPurchaseSummary | undefined {
  return supplierPurchaseSummaries.find((p) => p.supplierId === supplierId)
}
