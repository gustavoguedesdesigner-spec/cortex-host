import type { SupplierRiskLevel } from '@/types'

/**
 * Classificacao de risco de dependencia por participacao de categoria
 * (secao 25) — limiares demonstrativos, nao um calculo estatistico real.
 */
export function classificarRiscoDependencia(participacao: number): SupplierRiskLevel {
  if (participacao >= 0.65) return 'alto'
  if (participacao >= 0.4) return 'medio'
  return 'baixo'
}

const riskWeight: Record<SupplierRiskLevel, number> = { baixo: 1, medio: 2, alto: 3 }

/** Combina probabilidade x impacto na matriz de risco (secao 54). */
export function combinarRisco(probabilidade: SupplierRiskLevel, impacto: SupplierRiskLevel): SupplierRiskLevel {
  const pontuacao = riskWeight[probabilidade] * riskWeight[impacto]
  if (pontuacao >= 6) return 'alto'
  if (pontuacao >= 3) return 'medio'
  return 'baixo'
}

export const riskLevelLabels: Record<SupplierRiskLevel, string> = {
  baixo: 'Baixo',
  medio: 'Médio',
  alto: 'Alto',
}
