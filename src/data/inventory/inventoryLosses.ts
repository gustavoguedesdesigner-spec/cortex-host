import type { InventoryLoss } from '@/types'

/**
 * Perdas demonstrativas. As quatro primeiras (Moinhos — carne bovina)
 * reproduzem exatamente o exemplo de "perdas recorrentes" da seção 44:
 * 4 registros em 7 dias, 26 kg, R$ 853, motivo predominante preparo e
 * porcionamento.
 */
export const inventoryLosses: InventoryLoss[] = [
  {
    id: 'loss-001', itemId: 'carne-bovina-blend', unitId: 'moinhos', localId: 'moinhos-estoque_refrigerado',
    quantidade: 8, unidadeMedida: 'kg', custoUnitario: 32.8, valor: 262.4,
    motivo: 'preparo', descricao: 'Sobra de porcionamento acima do padrão no turno da noite',
    responsavel: 'Rafael Martins', data: '2026-07-16T22:00:00-03:00', status: 'validada',
  },
  {
    id: 'loss-002', itemId: 'carne-bovina-blend', unitId: 'moinhos', localId: 'moinhos-estoque_refrigerado',
    quantidade: 7, unidadeMedida: 'kg', custoUnitario: 32.8, valor: 229.6,
    motivo: 'rendimento', descricao: 'Rendimento abaixo do previsto no corte',
    responsavel: 'Rafael Martins', data: '2026-07-18T21:30:00-03:00', status: 'validada',
  },
  {
    id: 'loss-003', itemId: 'carne-bovina-blend', unitId: 'moinhos', localId: 'moinhos-estoque_refrigerado',
    quantidade: 6, unidadeMedida: 'kg', custoUnitario: 32.8, valor: 196.8,
    motivo: 'preparo', descricao: 'Porcionamento acima da ficha técnica',
    responsavel: 'Chef de cozinha', data: '2026-07-20T20:15:00-03:00', status: 'aguardando_validacao',
  },
  {
    id: 'loss-004', itemId: 'carne-bovina-blend', unitId: 'moinhos', localId: 'moinhos-estoque_refrigerado',
    quantidade: 5, unidadeMedida: 'kg', custoUnitario: 32.8, valor: 164,
    motivo: 'preparo', descricao: 'Porcionamento acima da ficha técnica',
    responsavel: 'Chef de cozinha', data: '2026-07-22T11:15:00-03:00', status: 'aguardando_validacao',
    acaoCorretiva: 'Revisar porcionamento com a cozinha',
  },
  {
    id: 'loss-005', itemId: 'alface-americana', unitId: 'cidade-baixa', localId: 'cidade-baixa-estoque_seco',
    quantidade: 4, unidadeMedida: 'kg', custoUnitario: 6.2, valor: 24.8,
    motivo: 'validade', descricao: 'Lote vencido antes do consumo previsto',
    responsavel: 'Diego Andrade', data: '2026-07-22T09:00:00-03:00', status: 'validada',
  },
  {
    id: 'loss-006', itemId: 'queijo-cheddar', unitId: 'caxias-centro', localId: 'caxias-centro-estoque_refrigerado',
    quantidade: 3, unidadeMedida: 'kg', custoUnitario: 38.4, valor: 115.2,
    motivo: 'armazenamento', descricao: 'Temperatura instável na câmara durante manutenção',
    responsavel: 'Juliana Prado', data: '2026-07-21T14:00:00-03:00', status: 'validada',
  },
  {
    id: 'loss-007', itemId: 'chope-ipa', unitId: 'zona-norte', localId: 'zona-norte-camara_bebidas',
    quantidade: 15, unidadeMedida: 'litro', custoUnitario: 12.4, valor: 186,
    motivo: 'avaria', descricao: 'Barril danificado no transporte interno — perda estornada após substituição',
    responsavel: 'Patrícia Lins', data: '2026-07-20T15:00:00-03:00', status: 'validada',
  },
  {
    id: 'loss-008', itemId: 'batata-congelada', unitId: 'caxias-norte', localId: 'caxias-norte-estoque_congelado',
    quantidade: 9, unidadeMedida: 'kg', custoUnitario: 8.6, valor: 77.4,
    motivo: 'causa_nao_identificada', descricao: 'Diferença identificada apenas após conferência — aguardando inventário semanal',
    responsavel: 'Bruno Teles', data: '2026-07-21T10:00:00-03:00', status: 'aguardando_validacao',
  },
]

export function getLossesByItem(itemId: string): InventoryLoss[] {
  return inventoryLosses.filter((l) => l.itemId === itemId)
}

export function getLossesByUnit(unitId: string): InventoryLoss[] {
  return inventoryLosses.filter((l) => l.unitId === unitId)
}

export const inventoryRecurringLossInsight = {
  itemId: 'carne-bovina-blend',
  unitId: 'moinhos',
  registros: 4,
  periodoDias: 7,
  totalQuantidade: 26,
  totalValor: 853,
  motivoPredominante: 'Preparo e porcionamento',
  tendencia: 'up' as const,
}
