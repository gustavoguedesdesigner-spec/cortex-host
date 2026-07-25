import type { MovementType, TransferStatus, LossReason, InventoryCountStatus, CountItemStatus } from '@/types'

export const movementTypeLabel: Record<MovementType, string> = {
  entrada_recebimento: 'Entrada — recebimento',
  saida_consumo: 'Saída — consumo',
  saida_venda_teorica: 'Saída — venda teórica',
  perda: 'Perda',
  transferencia_enviada: 'Transferência enviada',
  transferencia_recebida: 'Transferência recebida',
  ajuste_positivo: 'Ajuste positivo',
  ajuste_negativo: 'Ajuste negativo',
  devolucao_fornecedor: 'Devolução a fornecedor',
  producao: 'Produção',
  consumo_interno: 'Consumo interno',
  bloqueio: 'Bloqueio',
  desbloqueio: 'Desbloqueio',
  inventario: 'Inventário',
  estorno: 'Estorno',
}

export const transferStatusLabel: Record<TransferStatus, string> = {
  solicitada: 'Solicitada',
  aprovada: 'Aprovada',
  separada: 'Separada',
  enviada: 'Enviada',
  em_transito: 'Em trânsito',
  recebida: 'Recebida',
  conferida: 'Conferida',
  concluida: 'Concluída',
  divergente: 'Divergente',
}

export const lossReasonLabel: Record<LossReason, string> = {
  validade: 'Validade',
  quebra: 'Quebra',
  armazenamento: 'Armazenamento',
  preparo: 'Preparo',
  rendimento: 'Rendimento',
  descarte: 'Descarte',
  avaria: 'Avaria',
  erro_operacional: 'Erro operacional',
  consumo_interno: 'Consumo interno',
  causa_nao_identificada: 'Causa não identificada',
}

export const countStatusLabel: Record<InventoryCountStatus, string> = {
  planejado: 'Planejado',
  preparado: 'Preparado',
  em_contagem: 'Em contagem',
  em_conferencia: 'Em conferência',
  com_divergencias: 'Com divergências',
  aprovado: 'Aprovado',
  fechado: 'Fechado',
  interrompido: 'Interrompido',
}

export const countItemStatusLabel: Record<CountItemStatus, string> = {
  pendente: 'Pendente',
  contado: 'Contado',
  recontagem_solicitada: 'Recontagem solicitada',
  nao_encontrado: 'Não encontrado',
  inacessivel: 'Inacessível',
  justificado: 'Justificado',
  aprovado: 'Aprovado',
}
