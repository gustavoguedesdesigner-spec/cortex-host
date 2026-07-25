import type { InventoryConfidenceLevel } from '@/types'

export const inventoryConfidenceLabel: Record<InventoryConfidenceLevel, string> = {
  alta: 'Alta confiança',
  media: 'Média confiança',
  baixa: 'Baixa confiança',
  insuficiente: 'Dados insuficientes',
}

export const inventoryStatusLabel: Record<string, string> = {
  normal: 'Normal',
  abaixo_minimo: 'Abaixo do mínimo',
  risco_ruptura: 'Risco de ruptura',
  excesso: 'Excesso',
  sem_movimentacao: 'Sem movimentação',
  divergente: 'Divergente',
  dados_insuficientes: 'Dados insuficientes',
}

/** Classifica a confianca com base em sinais objetivos — nunca "alta" quando houver pendencia relevante. */
export function classificarConfianca(sinais: {
  diasDesdeUltimaContagem: number | null
  transferenciaPendente: boolean
  perdaAguardandoValidacao: boolean
  conversaoAusente: boolean
}): InventoryConfidenceLevel {
  if (sinais.diasDesdeUltimaContagem === null) return 'insuficiente'
  if (sinais.conversaoAusente) return 'insuficiente'
  const pendencias = [sinais.transferenciaPendente, sinais.perdaAguardandoValidacao].filter(Boolean).length
  if (sinais.diasDesdeUltimaContagem > 14 || pendencias >= 2) return 'baixa'
  if (sinais.diasDesdeUltimaContagem > 5 || pendencias === 1) return 'media'
  return 'alta'
}
