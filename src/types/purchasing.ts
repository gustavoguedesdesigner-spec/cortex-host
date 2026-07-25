/**
 * Tipos do modulo de Compras (Necessidades, Requisicoes, Aprovacoes,
 * Cotacoes e Pedidos). Recebimentos e Fornecedores permanecem estruturais
 * nesta etapa — os tipos aqui cobrem apenas o que Compras precisa
 * referenciar deles (resumo de fornecedor, nunca o cadastro completo).
 */
import type { UnitOfMeasureId } from './inventory'

export type PurchaseUrgency = 'critica' | 'alta' | 'media' | 'baixa'

export type PurchaseNeedStatus = 'pendente' | 'em_requisicao' | 'ignorada' | 'resolvida'

export interface PurchaseNeed {
  id: string
  itemId: string
  nome: string
  categoria: string
  unitId: string
  saldoDisponivel: number
  estoqueMinimo: number
  pontoReposicao: number
  consumoMedioDiario: number
  previsaoConsumoAteEntrega: number
  cobertura: number | null
  prazoMedioReposicaoDias: number
  pedidosEmAbertoQuantidade: number
  estoqueEmTransito: number
  transferenciaPossivelUnitId?: string
  transferenciaPossivelQuantidade?: number
  sazonalidade?: string
  eventoDemonstrativo?: string
  unidadeMedida: UnitOfMeasureId
  urgencia: PurchaseUrgency
  status: PurchaseNeedStatus
  requisicaoGeradaId?: string
}

export type RequisitionStatus =
  | 'rascunho'
  | 'aguardando_aprovacao'
  | 'aprovada'
  | 'rejeitada'
  | 'devolvida'
  | 'em_cotacao'
  | 'convertida_pedido'
  | 'cancelada'

export type RequisitionAlertType =
  | 'risco_ruptura'
  | 'sem_cotacao'
  | 'acima_alcada'
  | 'fornecedor_nao_homologado'
  | 'variacao_preco'
  | 'possivel_duplicidade'
  | 'transferencia_disponivel'
  | 'compra_emergencial'
  | 'abaixo_minimo'
  | 'sem_estoque_alternativo'

export interface RequisitionItem {
  itemId: string
  nome: string
  quantidade: number
  unidadeMedida: UnitOfMeasureId
  custoEstimadoUnitario: number
}

export interface RequisitionScenario {
  id: string
  titulo: string
  descricao: string
  custo: number
  coberturaResultante: string
  riscoResultante: string
  recomendado?: boolean
}

export interface RequisitionHistoryEntry {
  data: string
  usuario: string
  acao: string
  observacao?: string
}

export interface PurchaseRequisition {
  id: string
  unitId: string
  solicitante: string
  categoria: string
  itens: RequisitionItem[]
  motivo: string
  prioridade: PurchaseUrgency
  dataCriacao: string
  dataNecessaria: string
  valorEstimado: number
  status: RequisitionStatus
  alertas: RequisitionAlertType[]
  necessidadeOrigemId?: string
  cenarios?: RequisitionScenario[]
  recomendacaoCortex?: string
  historico: RequisitionHistoryEntry[]
  cotacaoId?: string
  pedidoId?: string
  aprovador?: string
  alcadaExigida?: string
}

export type QuotationStatus = 'em_andamento' | 'aguardando_respostas' | 'pronta_para_decisao' | 'decidida' | 'convertida_pedido' | 'cancelada'

export interface QuotationSupplierResponse {
  fornecedorId: string
  fornecedorNome: string
  valorTotal: number
  prazoEntregaDias: number
  pontualidadeHistorica: number
  conformidadeHistorica: number
  divergenciasHistoricas: number
  formaPagamento: string
  prazoPagamentoDias: number
  respondeu: boolean
}

export interface QuotationScoreWeights {
  preco: number
  prazo: number
  conformidade: number
  qualidade: number
  divergencias: number
  pagamento: number
}

export type QuotationDecisionType = 'menor_preco' | 'melhor_equilibrio' | 'entrega_mais_rapida' | 'menor_risco' | 'personalizada'

export interface Quotation {
  id: string
  categoria: string
  escopo: string
  itens: RequisitionItem[]
  fornecedoresConvidados: string[]
  respostas: QuotationSupplierResponse[]
  status: QuotationStatus
  valorEstimado: number
  economiaPotencial: number
  prazoResposta: string
  requisicaoOrigemId?: string
  decisao?: {
    tipo: QuotationDecisionType
    fornecedorId: string
    justificativa: string
    dividida?: { fornecedorId: string; itens: string[] }[]
  }
  pedidoId?: string
}

export type PurchaseOrderStatus =
  | 'emitido'
  | 'confirmado'
  | 'aguardando_entrega'
  | 'parcialmente_recebido'
  | 'divergente'
  | 'atrasado'
  | 'concluido'
  | 'cancelado'

export type OrderTimelineEventType =
  | 'emitido'
  | 'confirmado_fornecedor'
  | 'em_transporte'
  | 'entrega_prevista_atualizada'
  | 'recebimento_parcial'
  | 'divergencia_registrada'
  | 'cobranca_fornecedor'
  | 'concluido'

export interface OrderTimelineEvent {
  tipo: OrderTimelineEventType
  data: string
  responsavel: string
  status: string
  descricao: string
  link?: { label: string; path: string }
}

export interface PurchaseOrderItem {
  itemId: string
  nome: string
  unidadeMedida: UnitOfMeasureId
  quantidadePedida: number
  quantidadeRecebida: number
  custoUnitarioAcordado: number
  custoUnitarioRecebido?: number
}

export interface PurchaseOrderDivergence {
  tipo: 'quantidade' | 'preco' | 'quantidade_e_preco' | 'qualidade'
  descricao: string
  valorEnvolvido: number
}

export interface PurchaseOrder {
  id: string
  fornecedorId: string
  fornecedorNome: string
  unitId: string
  itens: PurchaseOrderItem[]
  valorTotal: number
  status: PurchaseOrderStatus
  dataEmissao: string
  previsaoEntrega: string
  requisicaoOrigemId?: string
  cotacaoOrigemId?: string
  divergencia?: PurchaseOrderDivergence
  timeline: OrderTimelineEvent[]
}

export interface PurchaseCategorySummary {
  id: string
  categoria: string
  valor: number
  participacao: number
  variacao: number
  fornecedores: number
  unidades: number
  alertas: number
}

export interface SavingsOpportunity {
  id: string
  titulo: string
  descricao: string
  valor: number
  categoria: string
}

export interface SupplierSummary {
  id: string
  nome: string
  categoriaPrincipal: string
  scoreResumo: number
  pontualidade: number
  conformidade: number
  divergenciasRecentes: number
  comprasRecentes: number
  homologado: boolean
}
