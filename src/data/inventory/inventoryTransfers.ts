import type { InventoryTransfer } from '@/types'

/** TR-2041 e TR-2038 reproduzem exatamente os exemplos da seção 39 do briefing. */
export const inventoryTransfers: InventoryTransfer[] = [
  {
    id: 'TR-2041',
    itemId: 'chope-ipa',
    origemUnitId: 'serra',
    destinoUnitId: 'zona-norte',
    quantidadeEnviada: 120,
    quantidadeRecebida: null,
    unidadeMedida: 'litro',
    valor: 1488,
    solicitante: 'Patrícia Lins',
    prioridade: 'critica',
    prazoLabel: 'Hoje',
    status: 'em_transito',
    motivo: 'Risco de ruptura na Zona Norte — cobertura de 1,7 dia',
    criadaEm: '2026-07-22T15:30:00-03:00',
  },
  {
    id: 'TR-2038',
    itemId: 'chope-ipa',
    origemUnitId: 'cidade-baixa',
    destinoUnitId: 'moinhos',
    quantidadeEnviada: 80,
    quantidadeRecebida: 72,
    unidadeMedida: 'litro',
    valor: 992,
    solicitante: 'Rafael Martins',
    prioridade: 'alta',
    prazoLabel: 'Concluída',
    status: 'divergente',
    motivo: 'Reforço de estoque para o fim de semana',
    observacao: 'Recebida com 8 litros a menos — investigação aberta',
    criadaEm: '2026-07-19T13:00:00-03:00',
  },
  {
    id: 'TR-2035',
    itemId: 'carne-bovina-blend',
    origemUnitId: 'serra',
    destinoUnitId: 'caxias-norte',
    quantidadeEnviada: 30,
    quantidadeRecebida: 30,
    unidadeMedida: 'kg',
    valor: 984,
    solicitante: 'Bruno Teles',
    prioridade: 'media',
    prazoLabel: 'Concluída',
    status: 'concluida',
    motivo: 'Reposição pontual',
    criadaEm: '2026-07-16T10:00:00-03:00',
  },
  {
    id: 'TR-2029',
    itemId: 'chope-pilsen',
    origemUnitId: 'moinhos',
    destinoUnitId: 'caxias-centro',
    quantidadeEnviada: 60,
    quantidadeRecebida: null,
    unidadeMedida: 'litro',
    valor: 588,
    solicitante: 'Juliana Prado',
    prioridade: 'media',
    prazoLabel: 'Amanhã',
    status: 'aprovada',
    motivo: 'Ajuste de sazonalidade',
    criadaEm: '2026-07-23T09:00:00-03:00',
  },
]

export function getTransferById(id: string): InventoryTransfer | undefined {
  return inventoryTransfers.find((t) => t.id === id)
}

export function getTransfersByUnit(unitId: string): InventoryTransfer[] {
  return inventoryTransfers.filter((t) => t.origemUnitId === unitId || t.destinoUnitId === unitId)
}
