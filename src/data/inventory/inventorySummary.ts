import type { InventoryCategorySummary, UnitConversion } from '@/types'

/**
 * Valor total em estoque da rede — identico a networkSummary.valorEstoque
 * e ao total ja usado em toda a aplicacao (R$ 312.850). A distribuicao
 * por categoria abaixo soma exatamente a esse total.
 */
export const inventoryTotalValue = 312850

export const inventoryCategorySummaries: InventoryCategorySummary[] = [
  { id: 'carnes', categoria: 'Carnes', valor: 72400, itens: 4, tendencia: 'flat', giroMedio: 4.8, alertas: 3 },
  { id: 'chope-cervejas', categoria: 'Chope e cervejas', valor: 68250, itens: 5, tendencia: 'down', giroMedio: 6.1, alertas: 4 },
  { id: 'bebidas', categoria: 'Bebidas', valor: 42800, itens: 6, tendencia: 'flat', giroMedio: 3.2, alertas: 1 },
  { id: 'secos', categoria: 'Secos', valor: 38600, itens: 7, tendencia: 'up', giroMedio: 2.1, alertas: 2 },
  { id: 'laticinios', categoria: 'Laticínios', valor: 28300, itens: 4, tendencia: 'flat', giroMedio: 3.6, alertas: 1 },
  { id: 'hortifruti', categoria: 'Hortifrúti', valor: 21750, itens: 5, tendencia: 'flat', giroMedio: 5.4, alertas: 1 },
  { id: 'oleos-frituras', categoria: 'Óleos e frituras', valor: 15900, itens: 2, tendencia: 'up', giroMedio: 2.8, alertas: 2 },
  { id: 'embalagens', categoria: 'Embalagens', valor: 13650, itens: 5, tendencia: 'up', giroMedio: 1.4, alertas: 1 },
  { id: 'limpeza', categoria: 'Limpeza', valor: 7900, itens: 3, tendencia: 'flat', giroMedio: 1.1, alertas: 0 },
  { id: 'outros', categoria: 'Outros', valor: 3300, itens: 2, tendencia: 'flat', giroMedio: 0.8, alertas: 0 },
]

export const inventoryCategoryTotal = inventoryCategorySummaries.reduce((sum, c) => sum + c.valor, 0)

/**
 * Situacao consolidada da rede — constantes de referencia (como
 * "18 ocorrencias" na Central de Operacoes): o catalogo de itens
 * demonstrativos cobre uma amostra representativa, nao a enumeracao
 * completa de cada contagem.
 */
export const inventorySituation = {
  abaixoDoMinimo: 23,
  riscoDeRuptura: 11,
  emExcesso: 18,
  semMovimentacaoRelevante: 9,
  inventariosPendentesOuAtrasados: 7,
  transferenciasEmTransito: 4,
  transferenciasDivergentes: 2,
  perdasRegistradas: 18320,
  divergenciasNaoJustificadas: 8740,
}

export const inventoryAccuracy = {
  percentual: 0.934,
  classificacao: 'boa' as const,
  meta: 0.97,
}

export const inventoryLastUpdate = '2026-07-23T14:20:00-03:00'

export const inventoryExecutiveSummaryText =
  'O estoque consolidado está avaliado em R$ 312.850. Existem 11 itens com risco de ruptura e 18 com excesso. A acuracidade consolidada está em 93,4%, abaixo da meta de 97%. As principais divergências estão concentradas no estoque refrigerado de Moinhos, em chope IPA nas unidades Zona Norte e Cidade Baixa e no inventário pendente de Caxias Norte.'

export const inventoryExecutiveRecommendations: string[] = [
  'Concluir o inventário de Caxias Norte',
  'Conferir o estoque refrigerado de Moinhos',
  'Conciliar duas transferências de chope',
  'Revisar itens em excesso',
  'Validar perdas ainda sem justificativa',
]

export const inventoryOverstockInsight = 'R$ 21.600 estão concentrados em itens com cobertura superior a 45 dias.'
export const inventoryOverstockDisclaimer =
  'Cobertura elevada não significa necessariamente excesso. Considere sazonalidade, acordos comerciais e planejamento de eventos.'

/** Conversoes de unidade cadastradas — nunca genericas, sempre explicitas por produto. */
export const unitConversions: UnitConversion[] = [
  { de: 'kg', para: 'g', fator: 1000 },
  { de: 'litro', para: 'ml', fator: 1000 },
  { de: 'caixa', para: 'unidade', fator: 12, observacao: 'Caixa de óleo — 12 unidades' },
  { de: 'barril', para: 'litro', fator: 50, observacao: 'Barril de chope — 50 litros (ver cadastro do item para variação de 30 L)' },
  { de: 'fardo', para: 'unidade', fator: 24, observacao: 'Fardo de refrigerante — 24 unidades' },
]
