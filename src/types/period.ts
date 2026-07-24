export type PeriodOptionId =
  | 'hoje'
  | 'ultimos_7_dias'
  | 'ultimos_30_dias'
  | 'este_mes'
  | 'mes_anterior'
  | 'personalizado'

export interface PeriodOption {
  id: PeriodOptionId
  label: string
}
