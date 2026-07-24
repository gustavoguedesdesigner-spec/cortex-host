import type { Unit } from '@/types'

export interface CmvWeeklyPoint {
  semana: string
  cmvTeorico: number
  cmvReal: number
}

/**
 * Serie semanal de CMV teorico vs. real (consolidado da rede) — ultimas
 * 8 semanas. Valores fixos, coerentes com o indicador de CMV real (34,8%)
 * e CMV teorico (31,9%) da semana atual (Semana 8).
 */
export const cmvWeeklySeriesConsolidado: CmvWeeklyPoint[] = [
  { semana: 'Sem. 1', cmvTeorico: 0.311, cmvReal: 0.318 },
  { semana: 'Sem. 2', cmvTeorico: 0.313, cmvReal: 0.32 },
  { semana: 'Sem. 3', cmvTeorico: 0.315, cmvReal: 0.331 },
  { semana: 'Sem. 4', cmvTeorico: 0.314, cmvReal: 0.327 },
  { semana: 'Sem. 5', cmvTeorico: 0.316, cmvReal: 0.338 },
  { semana: 'Sem. 6', cmvTeorico: 0.318, cmvReal: 0.341 },
  { semana: 'Sem. 7', cmvTeorico: 0.317, cmvReal: 0.344 },
  { semana: 'Sem. 8', cmvTeorico: 0.319, cmvReal: 0.348 },
]

export const cmvMeta = 0.325

/**
 * Deriva uma serie semanal simulada por unidade, escalando a serie
 * consolidada de forma a terminar exatamente no CMV real atual da
 * unidade — mantém o formato da curva da rede com a magnitude de cada
 * unidade, sem exigir uma nova serie manual por unidade.
 */
export function getCmvWeeklySeriesForUnit(unit: Unit): CmvWeeklyPoint[] {
  return unit.tendenciaCmvReal.map((valor, i) => ({
    semana: cmvWeeklySeriesConsolidado[i].semana,
    cmvTeorico: unit.cmvTeorico,
    cmvReal: valor,
  }))
}
