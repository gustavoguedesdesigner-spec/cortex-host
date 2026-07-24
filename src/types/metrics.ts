/**
 * Tipos de apoio para indicadores (MetricCard) e series de graficos.
 */

export type TrendDirection = 'up' | 'down' | 'flat'

export type IndicatorStatus = 'success' | 'attention' | 'critical' | 'info' | 'neutral'

export interface MetricDefinition {
  id: string
  titulo: string
  valor: string
  unidade?: string
  variacao?: string
  direcaoVariacao?: TrendDirection
  /** Ex.: "versus meta", "versus periodo anterior" */
  comparacao?: string
  status: IndicatorStatus
  tooltip?: string
}

export interface CmvSeriesPoint {
  data: string
  cmvTeorico: number
  cmvReal: number
}
