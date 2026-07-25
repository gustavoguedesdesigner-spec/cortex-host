import type { RecipeQuality } from '@/types'

export const recipeQualityLabel: Record<RecipeQuality, string> = {
  completa: 'Completa',
  revisao_recomendada: 'Revisão recomendada',
  incompleta: 'Incompleta',
  bloqueada: 'Bloqueada',
  sem_ficha: 'Sem ficha',
}

/**
 * Classifica a qualidade de uma ficha a partir de sinais objetivos —
 * nunca "completa" quando houver pendência estrutural (sem rendimento,
 * sem aprovação, sem vínculo de PDV etc.).
 */
export function classificarQualidadeFicha(sinais: {
  temIngredientes: boolean
  temRendimento: boolean
  temCustoAtualizado: boolean
  temPrecoVenda: boolean
  temAprovacao: boolean
  temVersaoVigente: boolean
  vinculadoPdv: boolean
}): RecipeQuality {
  if (!sinais.temVersaoVigente) return 'sem_ficha'
  if (!sinais.temIngredientes || !sinais.temRendimento || !sinais.vinculadoPdv) return 'incompleta'
  if (!sinais.temAprovacao) return 'bloqueada'
  if (!sinais.temCustoAtualizado || !sinais.temPrecoVenda) return 'revisao_recomendada'
  return 'completa'
}

export function classificarCustoDesatualizado(diasSemAtualizacao: number): boolean {
  return diasSemAtualizacao > 30
}
