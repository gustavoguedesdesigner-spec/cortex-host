import type { SupplierPerformanceTrend } from '@/types'

/** Tendencia semanal de desempenho (secao 23) — meta e periodo anterior por metrica. */
export const supplierPerformanceTrends: SupplierPerformanceTrend[] = [
  { supplierId: 'serra-alimentos', metrica: 'pontualidade', meta: 0.95, periodoAnterior: 0.85, serieSemanal: [0.88, 0.87, 0.86, 0.85, 0.84, 0.83, 0.82, 0.82], tendencia: 'piorando' },
  { supplierId: 'serra-alimentos', metrica: 'conformidadeQuantidade', meta: 0.97, periodoAnterior: 0.92, serieSemanal: [0.93, 0.92, 0.91, 0.9, 0.9, 0.89, 0.89, 0.89], tendencia: 'piorando' },
  { supplierId: 'serra-alimentos', metrica: 'conformidadePreco', meta: 0.97, periodoAnterior: 0.9, serieSemanal: [0.91, 0.9, 0.89, 0.88, 0.87, 0.87, 0.86, 0.86], tendencia: 'piorando' },
  { supplierId: 'serra-alimentos', metrica: 'conformidadeQualidade', meta: 0.97, periodoAnterior: 0.95, serieSemanal: [0.95, 0.95, 0.96, 0.95, 0.95, 0.95, 0.95, 0.95], tendencia: 'estavel' },

  { supplierId: 'sul-foodservice', metrica: 'pontualidade', meta: 0.95, periodoAnterior: 0.94, serieSemanal: [0.94, 0.94, 0.95, 0.95, 0.96, 0.96, 0.96, 0.96], tendencia: 'melhorando' },
  { supplierId: 'sul-foodservice', metrica: 'conformidadeQuantidade', meta: 0.95, periodoAnterior: 0.96, serieSemanal: [0.96, 0.96, 0.97, 0.97, 0.97, 0.97, 0.97, 0.97], tendencia: 'estavel' },
]

export function getPerformanceTrendsBySupplier(supplierId: string) {
  return supplierPerformanceTrends.filter((t) => t.supplierId === supplierId)
}

/** Media da rede por metrica (usada no bloco "Desempenho geral" da pagina inicial). */
export const networkPerformanceOverview = {
  pontualidade: { atual: 0.886, meta: 0.95, periodoAnterior: 0.87, tendencia: 'melhorando' as const },
  conformidadeQuantidade: { atual: 0.942, meta: 0.97, periodoAnterior: 0.935, tendencia: 'melhorando' as const },
  conformidadePreco: { atual: 0.928, meta: 0.96, periodoAnterior: 0.921, tendencia: 'estavel' as const },
  conformidadeQualidade: { atual: 0.961, meta: 0.98, periodoAnterior: 0.958, tendencia: 'estavel' as const },
}
