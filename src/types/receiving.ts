import type { UnitOfMeasureId } from './inventory'

/**
 * Recebimentos — prova de que o sistema nunca aceita uma entrega "so porque
 * chegou": todo recebimento passa por conferencia pedido x documento x
 * fisico x preco x qualidade x lote x validade antes de qualquer entrada em
 * estoque. Espelha o checklist ja descrito no procedimento POP-REC-002
 * (src/data/knowledge/procedures.ts) — nao reescrever essas regras aqui,
 * apenas aplica-las nos dados e componentes deste modulo.
 */
export type ReceiptStatus = 'aguardando' | 'em_conferencia' | 'conforme' | 'divergente' | 'quarentena' | 'concluido' | 'recusado'

export type ReceiptFieldStatus = 'conforme' | 'divergente' | 'nao_aplicavel'

export type DocumentConfidenceLevel = 'alta' | 'media' | 'baixa'

/** Leitura assistida da nota fiscal — simulada, nunca um OCR real. */
export interface DocumentReading {
  confianca: DocumentConfidenceLevel
  camposLidos: string[]
  camposDivergentes: string[]
  observacao?: string
}

export type ReceiptItemDecision = 'aceito' | 'aceito_parcial' | 'rejeitado' | 'quarentena'

export interface ReceiptItem {
  itemId: string
  nome: string
  unidadeMedida: UnitOfMeasureId
  quantidadePedida: number
  quantidadeDocumento: number
  quantidadeFisica: number
  precoAcordado: number
  precoDocumento: number
  lote?: string
  validade?: string
  temperaturaC?: number
  temperaturaStatus?: ReceiptFieldStatus
  loteValidadeStatus: ReceiptFieldStatus
  quantidadeStatus: ReceiptFieldStatus
  precoStatus: ReceiptFieldStatus
  qualidadeStatus: ReceiptFieldStatus
  decisao: ReceiptItemDecision
  observacao?: string
}

export type ReceiptEventType =
  | 'agendado'
  | 'chegada_registrada'
  | 'leitura_documento'
  | 'conferencia_documento'
  | 'conferencia_fisica'
  | 'conferencia_qualidade'
  | 'divergencia_registrada'
  | 'enviado_quarentena'
  | 'liberado_quarentena'
  | 'decisao_registrada'
  | 'estoque_atualizado'
  | 'fornecedor_notificado'
  | 'concluido'

export interface ReceiptEvent {
  tipo: ReceiptEventType
  data: string
  responsavel: string
  descricao: string
  link?: { label: string; path: string }
}

export type ReceiptDecisionType = 'aceitar_integral' | 'aceitar_parcial' | 'recusar' | 'quarentena' | 'pendente'

export interface Receipt {
  id: string
  nfNumero: string
  orderId?: string
  supplierId: string
  unitId: string
  dataAgendada: string
  dataChegada?: string
  responsavel: string
  status: ReceiptStatus
  leituraDocumento?: DocumentReading
  itens: ReceiptItem[]
  valorPedido: number
  valorDocumento: number
  valorFisico: number
  impactoFinanceiro: number
  decisao: ReceiptDecisionType
  motivoDecisao?: string
  timeline: ReceiptEvent[]
}

export type QuarantineStatus = 'em_analise' | 'liberado' | 'descartado' | 'devolvido'

export interface QuarantineRecord {
  id: string
  receiptId: string
  itemId: string
  itemNome: string
  motivo: string
  dataInicio: string
  responsavel: string
  status: QuarantineStatus
  decisaoFinal?: string
  dataDecisao?: string
}

export interface ReceivingSummary {
  agendadosHoje: number
  aguardandoConferencia: number
  emConferencia: number
  divergenciasAbertas: number
  emQuarentena: number
  concluidosNoPeriodo: number
  valorRecebidoPeriodo: number
  valorEmDivergencia: number
  taxaConformidade: number
  tempoMedioConferenciaMin: number
}
