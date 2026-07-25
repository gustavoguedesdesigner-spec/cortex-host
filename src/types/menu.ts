/** Tipos da Engenharia de Cardápio — classificação interna (BCG-like) exposta com terminologia executiva. */
export type MenuClassification = 'estrela' | 'cavalo_batalha' | 'quebra_cabeca' | 'cao'

export type MenuComplexity = 'baixa' | 'media' | 'alta'
export type MenuDeviation = 'baixo' | 'medio' | 'alto'
export type MenuOperationalStatus = 'ok' | 'atencao' | 'critico'

export interface MenuEngineeringProduct {
  id: string
  recipeId: string
  nome: string
  categoria: string
  unidadesVendidas: number
  receita: number
  custoTeorico: number
  custoRealEstimado: number
  margemTeorica: number
  margemObservada: number
  popularidadeIndice: number
  complexidade: MenuComplexity
  desvioOperacional: MenuDeviation
  classificacaoComercial: MenuClassification
  classificacaoOperacional: MenuOperationalStatus
  tendencia: 'up' | 'down' | 'flat'
}

export interface MenuScenario {
  id: string
  label: string
  descricao: string
}
