export type OccurrencePriority = 'critica' | 'alta' | 'media'
export type OccurrenceStatus = 'pendente' | 'analisada'

export interface Occurrence {
  id: string
  prioridade: OccurrencePriority
  titulo: string
  descricao: string
  unidades: string[]
  categoria: string
  impactoFinanceiro?: number
  impactoDescricao?: string
  prazo?: string
  responsavel?: string
  acaoRecomendada: string
  botaoPrimario: string
  botaoSecundario: string
}
