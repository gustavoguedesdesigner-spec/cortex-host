/** Classifica um índice de segurança/saúde administrativa (0-100) — indicadores demonstrativos compostos por controles configuráveis. */
export function classifyScore(indice: number): { label: string; status: 'success' | 'attention' | 'critical' } {
  if (indice >= 90) return { label: 'Boa', status: 'success' }
  if (indice >= 75) return { label: 'Boa, com pontos de atenção', status: 'attention' }
  return { label: 'Requer atenção imediata', status: 'critical' }
}

export function twoFactorCoverage(comDoisFatores: number, total: number): number {
  return total === 0 ? 0 : comDoisFatores / total
}
