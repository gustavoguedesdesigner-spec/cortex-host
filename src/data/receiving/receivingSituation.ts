import type { ReceivingSummary } from '@/types'

/**
 * Situacao consolidada de Recebimentos — mesmo padrao de constantes de
 * referencia usado em purchasingSituation/supplierSummary. valorEmDivergencia
 * reaproveita o mesmo numero ja usado em Compras e na Central de Operacoes
 * (src/data/suppliers.ts) — nao duplicar com valor diferente.
 */
export const receivingSummary: ReceivingSummary = {
  agendadosHoje: 6,
  aguardandoConferencia: 3,
  emConferencia: 1,
  divergenciasAbertas: 5,
  emQuarentena: 1,
  concluidosNoPeriodo: 18,
  valorRecebidoPeriodo: 398600,
  valorEmDivergencia: 18400,
  taxaConformidade: 0.91,
  tempoMedioConferenciaMin: 14,
}

export const receivingExecutiveSummaryText =
  'Seis entregas estão agendadas para hoje. Cinco recebimentos têm divergência aberta, com destaque para a NF 9821 (Serra Alimentos, Moinhos) e o saldo pendente do pedido PO-4532. Um item está em quarentena em Zona Norte por temperatura acima do padrão. Nenhuma entrega entra em estoque sem conferência completa.'

export const receivingExecutiveRecommendations: string[] = [
  'Concluir a decisão sobre a NF 9821 — Serra Alimentos',
  'Confirmar o saldo de 80L do pedido PO-4532 com a Bebidas Sul',
  'Decidir o destino do item em quarentena em Zona Norte',
  'Cobrar retorno da Distribuidora Gaúcha sobre a NF 9700',
  'Revisar o tempo médio de conferência em Caxias Centro',
]
