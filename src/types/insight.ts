export type InsightPriority = 'alta' | 'media' | 'baixa'

export interface AIInsight {
  id: string
  titulo: string
  texto: string
  prioridade: InsightPriority
  impactoFinanceiro: string
  acaoRecomendada: string
  unidadesAfetadas?: string[]
}
