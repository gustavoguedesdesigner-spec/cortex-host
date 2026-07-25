import type { ConfidenceLevel } from './unitProfile'

/**
 * Tipos do modulo de Fichas Tecnicas, Custos e Engenharia de Cardapio.
 * Reaproveita ConfidenceLevel de unitProfile; define vocabulario proprio
 * de status/qualidade — mais granular que o generico IndicatorStatus.
 */

export type RecipeStatus = 'rascunho' | 'em_revisao' | 'aguardando_aprovacao' | 'aprovada' | 'rejeitada' | 'publicada' | 'substituida' | 'arquivada'

export type RecipeQuality = 'completa' | 'revisao_recomendada' | 'incompleta' | 'bloqueada' | 'sem_ficha'

export type IngredientType = 'insumo' | 'sub_receita' | 'embalagem'

export type YieldUnit = 'porcoes' | 'gramas' | 'quilogramas' | 'mililitros' | 'litros' | 'unidades' | 'recipientes' | 'doses'

export type CostOrigin = 'custo_medio' | 'ultimo_custo' | 'custo_contratado' | 'custo_definido_empresa'

export type ApprovalStepStatus = 'pendente' | 'aprovado' | 'rejeitado'

export type RecipeIssueType =
  | 'sem_rendimento'
  | 'sem_conversao'
  | 'custo_desatualizado'
  | 'sem_ficha'
  | 'sem_aprovacao'
  | 'subreceita_desatualizada'
  | 'unidade_diferente_estoque'
  | 'sem_preco_venda'
  | 'versao_expirada'
  | 'custo_zerado'
  | 'produto_duplicado'

export interface RecipeIngredientLine {
  id: string
  nome: string
  tipo: IngredientType
  quantidadeBruta: number
  quantidadeLiquida: number
  unidade: string
  fatorCorrecao: number
  perdaPercentual: number
  custoUnitario: number
  custoNaFicha: number
  subReceitaId?: string
  ultimaAtualizacao: string
  confianca: ConfidenceLevel
}

export interface RecipeYieldInfo {
  pesoBrutoG: number
  pesoLiquidoG: number
  porcoes: number
  pesoPorcaoG: number
  unidadeRendimento: YieldUnit
  perdaTecnicaPercentual: number
  perdaOperacionalObservadaPercentual?: number
}

/** Exemplo ilustrativo de lote de preparo de um insumo/sub-receita — não entra no cálculo financeiro da ficha (que usa `RecipeYieldInfo.porcoes`). */
export interface RecipeBatchExample {
  ingredienteNome: string
  pesoBrutoG: number
  pesoLiquidoG: number
  porcoesRendidas: number
  pesoPorcaoG: number
  perdaTecnicaPercentual: number
}

export interface RecipePrepStep {
  ordem: number
  instrucao: string
  tempoMinutos?: number
  temperaturaC?: number
  equipamento?: string
  responsavel?: string
  pontoControle?: string
}

export interface RecipeCriticalPoint {
  label: string
  valor: string
}

export interface RecipeApprovalStep {
  ordem: number
  papel: string
  responsavel?: string
  status: ApprovalStepStatus
  data?: string
}

export interface RecipeVersion {
  id: string
  recipeId: string
  versao: string
  status: RecipeStatus
  criadoPor: string
  criadoEm: string
  vigenciaInicio?: string
  vigenciaFim?: string
  unidadesAplicaveis: string[]
  ingredientes: RecipeIngredientLine[]
  rendimento: RecipeYieldInfo
  preparo: RecipePrepStep[]
  pontosCriticos: RecipeCriticalPoint[]
  precoVenda: number
  descontoMedioPercentual: number
  custoEmbalagem: number
  aprovacoes: RecipeApprovalStep[]
  justificativa?: string
  changeSummary?: string[]
  loteDePreparoExemplo?: RecipeBatchExample
}

export interface Recipe {
  id: string
  nome: string
  categoriaId: string
  categoria: string
  codigoPdv: string
  qualidade: RecipeQuality
  versaoVigenteId: string | null
  responsavel: string
  aprovadores: string[]
  unidades: string[]
  vinculadoPdv: boolean
  ultimaRevisaoIso: string
}

export interface RecipeIssue {
  id: string
  recipeId: string
  tipo: RecipeIssueType
  titulo: string
  descricao: string
  impacto?: number
  severidade: 'alta' | 'media' | 'baixa'
}

export interface SubRecipe {
  id: string
  nome: string
  rendimentoG: number
  validadeDias: number
  responsavel: string
  versao: string
  status: RecipeStatus
  ultimaAtualizacaoIso: string
  produtosRelacionados: string[]
  ingredientes: RecipeIngredientLine[]
  preparo: RecipePrepStep[]
  perdas?: string
}

export interface RecipeCostItem {
  id: string
  nome: string
  unidadeMedida: string
  custoAtual: number
  custoAnterior: number
  origem: CostOrigin
  fornecedor: string
  fichasAfetadas: string[]
  ultimaAtualizacaoIso: string
  confianca: ConfidenceLevel
  diasSemAtualizacao: number
}

export interface RecipeConsumptionComparison {
  recipeId: string
  unidadesVendidas: number
  consumoTeoricoKg: number
  consumoRealKg: number
  impacto: number
  unidadesMaisAfetadas: string[]
  confianca: ConfidenceLevel
  historicoSemanal: { semana: string; teorico: number; real: number }[]
}

export interface RecipeUnitComparisonRow {
  unitId: string
  quantidadePrevistaG: number
  consumoEstimadoG: number
  diferencaG: number
  perdasG: number
  cmvTeorico: number
  impacto: number
}

export interface RecipeCategorySummary {
  id: string
  categoria: string
  totalProdutos: number
  fichasCompletas: number
  incompletas: number
  emRevisao: number
  custoAtualizado: number
  qualidadeMedia: number
}
