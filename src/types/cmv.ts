import type { ConfidenceLevel } from './unitProfile'

/**
 * Tipos do modulo de CMV. Reaproveita ConfidenceLevel/AttentionLevel/
 * IndicatorStatus ja existentes onde possivel; define apenas o que e
 * genuinamente novo para diagnostico de CMV (periodo, categorias,
 * produtos, insumos, causas, evidencias e fechamento).
 */

export type CmvConfidenceLevel = ConfidenceLevel | 'insuficiente'

export type DataQualityLevel = 'excelente' | 'boa' | 'parcial' | 'insuficiente'

export type ClosingStatus = 'aberto' | 'em_revisao' | 'aguardando_dados' | 'pronto_para_fechar' | 'fechado' | 'reaberto'

export type CauseGroupKey =
  | 'preco'
  | 'consumo_producao'
  | 'perdas'
  | 'estoque'
  | 'recebimento'
  | 'transferencias'
  | 'fichas_tecnicas'
  | 'dados'

/** Dados brutos do periodo — todo valor derivado deve vir de src/utils/cmvCalculations.ts */
export interface CmvNetworkPeriod {
  periodId: string
  periodoLabel: string
  vendasBrutas: number
  deducoes: number
  estoqueInicial: number
  comprasBrutas: number
  devolucoesFornecedores: number
  transferenciasRecebidas: number
  transferenciasEnviadas: number
  ajustesAutorizados: number
  estoqueFinal: number
  /** Custo teorico esperado (soma de qtd. vendida x custo padrao por item) */
  custoTeorico: number
  metaCmv: number
  ultimoFechamentoLabel: string
  ultimaAtualizacao: string
}

export interface DataQualityChecklistItem {
  label: string
  completo: boolean
}

export interface DataQualityInfo {
  percentual: number
  classificacao: DataQualityLevel
  checklist: DataQualityChecklistItem[]
  pendencias: string[]
}

export interface CmvBridgeStep {
  id: string
  label: string
  valor: number
  tooltip?: string
}

export interface CmvTrendEvent {
  semanaIndex: number
  label: string
}

export interface CmvWhatChangedItem {
  label: string
  detalhe: string
}

export interface CmvCategoryData {
  id: string
  categoria: string
  custoTeorico: number
  custoReal: number
  impacto: number
  unidadesAfetadas: string[]
  tendencia: 'up' | 'down' | 'flat'
  confianca: CmvConfidenceLevel
  resumo: string
  explicacoesProvaveis: string[]
  /** false para categorias sem desvio relevante no periodo (ainda assim navegaveis) */
  destacada: boolean
}

export interface CmvProductData {
  id: string
  nome: string
  categoriaId: string
  categoria: string
  unidadesVendidas: number
  vendas: number
  custoTeorico: number
  custoRealEstimado: number
  impacto: number
  tendencia: 'up' | 'down' | 'flat'
  confianca: CmvConfidenceLevel
  fichaTecnicaVersao: string
}

export interface CmvProductHistoryPoint {
  semana: string
  consumoTeorico: number
  consumoReal: number
}

export interface CmvProductDetail extends CmvProductData {
  custoPadrao: number
  precoVenda: number
  consumoTeoricoLabel: string
  consumoRealLabel: string
  perdas: string
  unidadesMaisAfetadas: string[]
  historico: CmvProductHistoryPoint[]
  insumoId?: string
  explicacao: string
}

export interface CmvIngredientData {
  id: string
  nome: string
  unidadeMedida: string
  estoqueInicial: number
  entradas: number
  transferencias: number
  perdas: number
  consumoTeorico: number
  consumoReal: number
  estoqueFinal: number
  precoMedio: number
  fornecedores: string[]
  unidades: string[]
  produtosQueUtilizam: string[]
}

export interface CmvMatrixCell {
  unitId: string
  categoriaId: string
  impacto: number
  tendencia: 'up' | 'down' | 'flat'
  confianca: CmvConfidenceLevel
}

export interface CmvEvidence {
  id: string
  titulo: string
  descricao: string
  valorObservado: string
  valorEsperado: string
  diferenca: string
  origem: string
  data: string
  unidade?: string
  categoria?: string
  produto?: string
  responsavel: string
  confianca: CmvConfidenceLevel
}

export interface CmvCauseTaxonomyGroup {
  id: CauseGroupKey
  label: string
  itens: string[]
}

export interface CmvCause {
  id: string
  grupo: CauseGroupKey
  titulo: string
  impacto: number
  confianca: CmvConfidenceLevel
  unidades: string[]
  categorias: string[]
  evidenciaIds: string[]
  pendencias: string[]
  tendencia: 'up' | 'down' | 'flat'
  status: 'em_investigacao' | 'confirmada' | 'descartada'
  acaoRecomendada: string
  /** Sequência observado → hipótese, no estilo da seção "Cadeia de evidências". Só as causas com exemplo aprofundado a definem. */
  cadeiaEvidencias?: string[]
}

export interface CmvClosingChecklistItem {
  id: string
  ordem: number
  titulo: string
  status: 'concluido' | 'pendente' | 'bloqueado'
  responsavel: string
  prazoLabel: string
  pendencias: string[]
  impacto?: string
}

export interface CmvClosingRecord {
  periodId: string
  periodoLabel: string
  cmvReal: number
  cmvTeorico: number
  meta: number
  impacto: number
  qualidadeDados: number
  status: ClosingStatus
  fechadoPor?: string
  dataFechamento?: string
  observacao?: string
}

export interface CmvQuickAnswer {
  pergunta: string
  resposta: string
  links?: { label: string; path?: string }[]
}
