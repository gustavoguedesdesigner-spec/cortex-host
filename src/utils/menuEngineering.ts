import type { MenuClassification, MenuOperationalStatus, MenuDeviation } from '@/types'

export const menuClassificationLabel: Record<MenuClassification, { executivo: string; classico: string }> = {
  estrela: { executivo: 'Alta prioridade', classico: 'Estrela' },
  cavalo_batalha: { executivo: 'Volume com margem baixa', classico: 'Cavalo de batalha' },
  quebra_cabeca: { executivo: 'Margem com baixo volume', classico: 'Quebra-cabeça' },
  cao: { executivo: 'Revisão recomendada', classico: 'Cão' },
}

/**
 * Classifica o quadrante da matriz de engenharia de cardápio a partir
 * de popularidade (0-1) e margem percentual — limiares configuráveis
 * via parâmetro, com padrão de mediana simples.
 */
export function classificarQuadrante(popularidadeIndice: number, margemPercentual: number, corteVolume = 0.5, corteMargem = 0.55): MenuClassification {
  const altoVolume = popularidadeIndice >= corteVolume
  const altaMargem = margemPercentual >= corteMargem
  if (altoVolume && altaMargem) return 'estrela'
  if (altoVolume && !altaMargem) return 'cavalo_batalha'
  if (!altoVolume && altaMargem) return 'quebra_cabeca'
  return 'cao'
}

export function classificarStatusOperacional(desvioOperacional: MenuDeviation): MenuOperationalStatus {
  if (desvioOperacional === 'alto') return 'critico'
  if (desvioOperacional === 'medio') return 'atencao'
  return 'ok'
}
