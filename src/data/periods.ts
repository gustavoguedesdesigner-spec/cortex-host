import type { PeriodOption } from '@/types'

export const periodOptions: PeriodOption[] = [
  { id: 'hoje', label: 'Hoje' },
  { id: 'ultimos_7_dias', label: 'Últimos 7 dias' },
  { id: 'ultimos_30_dias', label: 'Últimos 30 dias' },
  { id: 'este_mes', label: 'Este mês' },
  { id: 'mes_anterior', label: 'Mês anterior' },
  { id: 'personalizado', label: 'Personalizado' },
]
