export interface FinancialImpactCategory {
  id: string
  categoria: string
  valor: number
  tendencia: 'up' | 'down' | 'flat'
  unidadePrincipal: string
}
