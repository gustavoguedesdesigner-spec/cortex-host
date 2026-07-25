import type { CmvConfidenceLevel, DataQualityLevel } from '@/types'

/** Classifica a qualidade dos dados (0-1) nas quatro faixas do produto. */
export function classificarQualidadeDados(percentual: number): DataQualityLevel {
  if (percentual >= 0.95) return 'excelente'
  if (percentual >= 0.85) return 'boa'
  if (percentual >= 0.6) return 'parcial'
  return 'insuficiente'
}

export const dataQualityLabel: Record<DataQualityLevel, string> = {
  excelente: 'Excelente',
  boa: 'Boa',
  parcial: 'Parcial',
  insuficiente: 'Insuficiente',
}

export const confidenceLabel: Record<CmvConfidenceLevel, string> = {
  alta: 'Confiança alta',
  media: 'Confiança média',
  baixa: 'Confiança baixa',
  insuficiente: 'Dados insuficientes',
}

/**
 * Frases-padrao para nunca comunicar certeza quando os dados sao
 * incompletos ("hipotese mais provavel" em vez de "causa definitiva").
 */
export const confidenceHedge: Record<CmvConfidenceLevel, string> = {
  alta: 'Os dados indicam com consistência',
  media: 'A hipótese mais provável é',
  baixa: 'Pode estar relacionado a',
  insuficiente: 'Não é possível concluir até que os dados pendentes sejam resolvidos —',
}
