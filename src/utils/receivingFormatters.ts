import type { QuarantineStatus, ReceiptDecisionType, ReceiptStatus } from '@/types'

export const receiptStatusLabels: Record<ReceiptStatus, string> = {
  aguardando: 'Aguardando',
  em_conferencia: 'Em conferência',
  conforme: 'Conforme',
  divergente: 'Divergente',
  quarentena: 'Em quarentena',
  concluido: 'Concluído',
  recusado: 'Recusado',
}

export const receiptDecisionLabels: Record<ReceiptDecisionType, string> = {
  aceitar_integral: 'Aceitar integralmente',
  aceitar_parcial: 'Aceitar parcialmente',
  recusar: 'Recusar',
  quarentena: 'Enviar para quarentena',
  pendente: 'Decisão pendente',
}

export const quarantineStatusLabels: Record<QuarantineStatus, string> = {
  em_analise: 'Em análise',
  liberado: 'Liberado',
  descartado: 'Descartado',
  devolvido: 'Devolvido ao fornecedor',
}
