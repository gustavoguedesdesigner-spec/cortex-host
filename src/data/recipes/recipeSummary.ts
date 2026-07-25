import type { RecipeCategorySummary } from '@/types'

/**
 * Situação consolidada das fichas técnicas — constantes de referência
 * (mesmo padrão de "18 ocorrências" na Central de Operações): o
 * catálogo demonstrativo cobre uma amostra representativa, não a
 * enumeração completa dos 40 produtos.
 */
export const recipeSituation = {
  produtosVendaveis: 40,
  fichasVigentes: 34,
  emRevisao: 3,
  semFichaCompleta: 3,
  custosDesatualizados: 7,
  conversoesInconsistentes: 4,
  desviosRelevantes: 6,
  subReceitas: 12,
  revisoesAguardandoAprovacao: 5,
}

export const recipeQualityOverall = {
  percentual: 0.88,
  meta: 0.97,
}

export const recipeLastUpdate = '2026-07-23T13:45:00-03:00'

export const recipeExecutiveSummaryText =
  'A base possui 40 produtos vendáveis. Trinta e quatro possuem ficha vigente, três estão em revisão e três ainda não possuem estrutura completa. Sete fichas utilizam custos desatualizados e quatro apresentam inconsistências de conversão. Os maiores impactos potenciais estão em Burger Costela, Tomahawk Burger, Porção de Entrecot e Batata com Cheddar.'

export const recipeExecutiveRecommendations: string[] = [
  'Revisar os produtos com maior impacto no CMV',
  'Validar conversões de unidade',
  'Aprovar as revisões pendentes',
  'Atualizar custos de carnes e óleo',
  'Completar as fichas ausentes',
]

/**
 * Cobertura por categoria — os totais de produtos somam exatamente aos
 * 40 produtos vendáveis da rede.
 */
export const recipeCategorySummaries: RecipeCategorySummary[] = [
  { id: 'hamburgueres', categoria: 'Hambúrgueres', totalProdutos: 8, fichasCompletas: 6, incompletas: 1, emRevisao: 1, custoAtualizado: 5, qualidadeMedia: 0.86 },
  { id: 'porcoes', categoria: 'Porções', totalProdutos: 6, fichasCompletas: 5, incompletas: 0, emRevisao: 1, custoAtualizado: 5, qualidadeMedia: 0.88 },
  { id: 'pratos', categoria: 'Pratos', totalProdutos: 5, fichasCompletas: 4, incompletas: 1, emRevisao: 0, custoAtualizado: 5, qualidadeMedia: 0.85 },
  { id: 'chopes', categoria: 'Chopes', totalProdutos: 4, fichasCompletas: 4, incompletas: 0, emRevisao: 0, custoAtualizado: 3, qualidadeMedia: 0.92 },
  { id: 'bebidas', categoria: 'Bebidas', totalProdutos: 6, fichasCompletas: 6, incompletas: 0, emRevisao: 0, custoAtualizado: 6, qualidadeMedia: 0.95 },
  { id: 'sobremesas', categoria: 'Sobremesas', totalProdutos: 4, fichasCompletas: 3, incompletas: 1, emRevisao: 0, custoAtualizado: 4, qualidadeMedia: 0.83 },
  { id: 'acompanhamentos', categoria: 'Acompanhamentos', totalProdutos: 3, fichasCompletas: 3, incompletas: 0, emRevisao: 1, custoAtualizado: 2, qualidadeMedia: 0.87 },
  { id: 'molhos', categoria: 'Molhos', totalProdutos: 2, fichasCompletas: 2, incompletas: 0, emRevisao: 0, custoAtualizado: 2, qualidadeMedia: 0.94 },
  { id: 'combos', categoria: 'Combos', totalProdutos: 2, fichasCompletas: 1, incompletas: 0, emRevisao: 0, custoAtualizado: 1, qualidadeMedia: 0.79 },
]

export const recipeCategoryTotalProdutos = recipeCategorySummaries.reduce((sum, c) => sum + c.totalProdutos, 0)
