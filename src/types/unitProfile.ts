export type ConfidenceLevel = 'alta' | 'media' | 'baixa'

export interface TrendWeekPoint {
  semana: string
  cmvTeorico: number
  cmvReal: number
}

export interface TrendEventMarker {
  semanaIndex: number
  label: string
}

export interface CauseEvidenceItem {
  dadoObservado: string
  dadoEsperado: string
  diferenca: string
  origem: string
  data: string
  responsavel: string
  confianca: ConfidenceLevel
}

export interface DeviationCause {
  id: string
  categoria: string
  impacto: number
  participacao: number
  confianca: ConfidenceLevel
  justificativaConfianca: string
  evidenciasResumo: string[]
  evidencias: CauseEvidenceItem[]
}

export interface CriticalProduct {
  id: string
  nome: string
  categoria: string
  venda: number
  consumoTeorico: number
  consumoReal: number
  impacto: number
  tendencia: 'up' | 'down' | 'flat'
  confianca: ConfidenceLevel
  acaoRecomendada: string
}

export interface NetworkComparisonRow {
  metrica: string
  unidade: string
  rede: string
  unidadeMelhor: boolean
}

export interface BenchmarkRow {
  metrica: string
  moinhos: string
  serra: string
}

export interface UnitSupplierRow {
  nome: string
  totalComprado: number
  variacaoPreco?: number
  divergenciasRede: number
  divergenciasUnidade: number
  atrasoMedioDias?: number
  avaliacao: number
  status: 'critico' | 'atencao' | 'ok'
}

export interface ReceivingRecord {
  identificador: string
  fornecedor: string
  status: string
  detalhe: string
  impacto?: number
}

export interface UnitActionItem {
  id: string
  titulo: string
  responsavel: string
  prazoLabel: string
  prioridade: 'critica' | 'alta' | 'media'
  progresso?: number
  status: 'nao_iniciado' | 'em_andamento' | 'aguardando' | 'concluido'
  origem: string
  escopo: 'local' | 'global'
}

export interface UnitActivityEvent {
  tipo: string
  usuario: string
  acao: string
  horario: string
}

export interface UnitQuickQA {
  pergunta: string
  resposta: string
  links?: string[]
}

export interface IncompleteDataInfo {
  mensagem: string
  dadosDisponiveis: string[]
  dadosFaltantes: string[]
  impacto: string
  acaoNecessaria: string
  prazoLabel: string
  responsavel: string
}

export interface IndiceOperacional {
  valor: number
  classificacao: string
  composicao: { label: string; valor: number }[]
}

export interface UnitStockSummary {
  acuraciadeEstimada: number
  itensCriticos: number
  itensExcesso: number
  itensSemMovimentacao: number
  transferenciasPendentes: number
}

export interface UnitPurchasesSummary {
  pedidosEmAberto: number
  comprasEmergenciais: number
  divergencias: number
  valorDivergencias: number
  principalFornecedorAtencao: string
  registros: ReceivingRecord[]
}

export interface UnitProfile {
  unitId: string
  resumoExecutivo: string
  causasProvaveis?: string[]
  recomendacoes: string[]
  indiceOperacional?: IndiceOperacional
  tendenciaSemanal: TrendWeekPoint[]
  eventosTendencia?: TrendEventMarker[]
  causas?: DeviationCause[]
  produtosCriticos: CriticalProduct[]
  comparacaoRede: NetworkComparisonRow[]
  comparacaoRedeInsight?: string
  benchmarkInterno?: { comparadoCom: string; comparadoComNome: string; linhas: BenchmarkRow[]; insight: string }
  estoque: UnitStockSummary
  compras: UnitPurchasesSummary
  fornecedores: UnitSupplierRow[]
  acoes: UnitActionItem[]
  atividade: UnitActivityEvent[]
  perguntasRapidas: UnitQuickQA[]
  dadosIncompletos?: IncompleteDataInfo
}
