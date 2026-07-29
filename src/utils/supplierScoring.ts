import type { SupplierScoreBreakdown, SupplierScorePenalty, SupplierScoreWeights } from '@/types'

/**
 * Score geral = composicao ponderada dos sete indicadores, com deducoes
 * nomeadas para riscos que a media ponderada nao capta sozinha
 * (divergencias recorrentes, dependencia, documentos vencidos, bloqueios).
 * Nunca calcular isso dentro de um componente — os dados de fornecedores
 * armazenam breakdown/pesos/penalidades; a nota final e sempre derivada.
 */
export function calcularScoreComposto(breakdown: SupplierScoreBreakdown, pesos: SupplierScoreWeights): number {
  const composto =
    breakdown.precoCompetitivo * pesos.preco +
    breakdown.pontualidade * pesos.prazo +
    breakdown.quantidade * pesos.quantidade +
    breakdown.precoConformePedido * pesos.precoConforme +
    breakdown.qualidade * pesos.qualidade +
    breakdown.capacidadeResposta * pesos.resposta +
    breakdown.documentacao * pesos.documentacao
  return Math.round(composto)
}

export function calcularScoreGeral(breakdown: SupplierScoreBreakdown, pesos: SupplierScoreWeights, penalidades: SupplierScorePenalty[]): number {
  const composto = calcularScoreComposto(breakdown, pesos)
  const totalPenalidades = penalidades.reduce((sum, p) => sum + p.pontos, 0)
  return Math.max(0, Math.min(100, composto - totalPenalidades))
}

export function classificarScore(score: number): 'excelente' | 'bom' | 'atencao' | 'critico' {
  if (score >= 85) return 'excelente'
  if (score >= 70) return 'bom'
  if (score >= 55) return 'atencao'
  return 'critico'
}
