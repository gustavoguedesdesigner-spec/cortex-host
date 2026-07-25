import type { InventoryMovement } from '@/types'

/**
 * Movimentações demonstrativas — nunca apagadas; estornos criam uma
 * movimentação inversa vinculada (ver "reversaoDeId" e mov-014/mov-015).
 */
export const inventoryMovements: InventoryMovement[] = [
  {
    id: 'mov-001', itemId: 'carne-bovina-blend', quantidade: 180, unidadeMedida: 'kg', custoUnitario: 32.8, valorTotal: 5904,
    tipo: 'entrada_recebimento', unitId: 'moinhos', localId: 'moinhos-estoque_refrigerado', data: '2026-07-20T09:10:00-03:00',
    usuario: 'Rafael Martins', origem: 'Recebimento', documentoRelacionado: 'NF 9821', status: 'confirmado',
  },
  {
    id: 'mov-002', itemId: 'carne-bovina-blend', quantidade: 42, unidadeMedida: 'kg', custoUnitario: 32.8, valorTotal: 1377.6,
    tipo: 'saida_venda_teorica', unitId: 'moinhos', localId: 'moinhos-estoque_refrigerado', data: '2026-07-21T21:30:00-03:00',
    usuario: 'CORTEX', origem: 'PDV — vendas do dia', status: 'confirmado',
  },
  {
    id: 'mov-003', itemId: 'carne-bovina-blend', quantidade: 8, unidadeMedida: 'kg', custoUnitario: 32.8, valorTotal: 262.4,
    tipo: 'perda', unitId: 'moinhos', localId: 'moinhos-estoque_refrigerado', data: '2026-07-22T11:15:00-03:00',
    usuario: 'Rafael Martins', origem: 'Registro de perda', motivo: 'Preparo e porcionamento', status: 'confirmado',
  },
  {
    id: 'mov-004', itemId: 'chope-ipa', quantidade: 120, unidadeMedida: 'litro', custoUnitario: 12.4, valorTotal: 1488,
    tipo: 'transferencia_enviada', unitId: 'serra', localId: 'serra-camara_bebidas', data: '2026-07-22T16:00:00-03:00',
    usuario: 'Rafael Nunes', origem: 'Transferência TR-2041', documentoRelacionado: 'TR-2041', status: 'confirmado',
  },
  {
    id: 'mov-005', itemId: 'chope-ipa', quantidade: 80, unidadeMedida: 'litro', custoUnitario: 12.4, valorTotal: 992,
    tipo: 'transferencia_enviada', unitId: 'cidade-baixa', localId: 'cidade-baixa-camara_bebidas', data: '2026-07-19T14:00:00-03:00',
    usuario: 'Diego Andrade', origem: 'Transferência TR-2038', documentoRelacionado: 'TR-2038', status: 'confirmado',
  },
  {
    id: 'mov-006', itemId: 'chope-ipa', quantidade: 72, unidadeMedida: 'litro', custoUnitario: 12.4, valorTotal: 892.8,
    tipo: 'transferencia_recebida', unitId: 'moinhos', localId: 'moinhos-camara_bebidas', data: '2026-07-19T17:30:00-03:00',
    usuario: 'Rafael Martins', origem: 'Transferência TR-2038', documentoRelacionado: 'TR-2038', status: 'pendente',
    motivo: 'Recebido com divergência de 8 litros — aguardando investigação',
  },
  {
    id: 'mov-007', itemId: 'oleo-soja', quantidade: 24, unidadeMedida: 'unidade', custoUnitario: 33.9, valorTotal: 813.6,
    tipo: 'entrada_recebimento', unitId: 'moinhos', localId: 'moinhos-estoque_seco', data: '2026-07-15T10:00:00-03:00',
    usuario: 'Rafael Martins', origem: 'Recebimento', documentoRelacionado: 'NF 9788', status: 'confirmado',
  },
  {
    id: 'mov-008', itemId: 'oleo-soja', quantidade: 6, unidadeMedida: 'unidade', custoUnitario: 33.9, valorTotal: 203.4,
    tipo: 'saida_consumo', unitId: 'moinhos', localId: 'moinhos-estoque_seco', data: '2026-07-21T20:00:00-03:00',
    usuario: 'Cozinha — Moinhos', origem: 'Consumo de fritura', status: 'confirmado',
  },
  {
    id: 'mov-009', itemId: 'queijo-cheddar', quantidade: 12, unidadeMedida: 'kg', custoUnitario: 38.4, valorTotal: 460.8,
    tipo: 'entrada_recebimento', unitId: 'moinhos', localId: 'moinhos-estoque_refrigerado', data: '2026-07-20T09:30:00-03:00',
    usuario: 'Rafael Martins', origem: 'Recebimento', documentoRelacionado: 'NF 9821', status: 'confirmado',
  },
  {
    id: 'mov-010', itemId: 'embalagem-delivery', quantidade: 800, unidadeMedida: 'unidade', custoUnitario: 1.8, valorTotal: 1440,
    tipo: 'entrada_recebimento', unitId: 'cidade-baixa', localId: 'cidade-baixa-estoque_embalagens', data: '2026-07-21T11:00:00-03:00',
    usuario: 'Diego Andrade', origem: 'Recebimento', documentoRelacionado: 'Pedido 4610', status: 'confirmado',
  },
  {
    id: 'mov-011', itemId: 'batata-congelada', quantidade: 60, unidadeMedida: 'kg', custoUnitario: 8.6, valorTotal: 516,
    tipo: 'saida_venda_teorica', unitId: 'caxias-centro', localId: 'caxias-centro-estoque_congelado', data: '2026-07-22T21:00:00-03:00',
    usuario: 'CORTEX', origem: 'PDV — vendas do dia', status: 'confirmado',
  },
  {
    id: 'mov-012', itemId: 'alface-americana', quantidade: 4, unidadeMedida: 'kg', custoUnitario: 6.2, valorTotal: 24.8,
    tipo: 'perda', unitId: 'cidade-baixa', localId: 'cidade-baixa-estoque_seco', data: '2026-07-22T09:00:00-03:00',
    usuario: 'Diego Andrade', origem: 'Registro de perda', motivo: 'Validade', status: 'confirmado',
  },
  {
    id: 'mov-013', itemId: 'carne-bovina-blend', quantidade: 6, unidadeMedida: 'kg', custoUnitario: 32.8, valorTotal: 196.8,
    tipo: 'ajuste_negativo', unitId: 'caxias-centro', localId: 'caxias-centro-estoque_refrigerado', data: '2026-07-19T18:20:00-03:00',
    usuario: 'Juliana Prado', origem: 'Ajuste de inventário', motivo: 'Divergência dentro da tolerância', status: 'confirmado',
  },
  {
    id: 'mov-014', itemId: 'chope-ipa', quantidade: 15, unidadeMedida: 'litro', custoUnitario: 12.4, valorTotal: 186,
    tipo: 'perda', unitId: 'zona-norte', localId: 'zona-norte-camara_bebidas', data: '2026-07-20T15:00:00-03:00',
    usuario: 'Patrícia Lins', origem: 'Registro de perda', motivo: 'Avaria no barril', status: 'estornado',
  },
  {
    id: 'mov-015', itemId: 'chope-ipa', quantidade: 15, unidadeMedida: 'litro', custoUnitario: 12.4, valorTotal: 186,
    tipo: 'estorno', unitId: 'zona-norte', localId: 'zona-norte-camara_bebidas', data: '2026-07-20T16:40:00-03:00',
    usuario: 'Patrícia Lins', origem: 'Estorno de perda', motivo: 'Barril substituído — perda registrada em duplicidade', status: 'confirmado',
    reversaoDeId: 'mov-014',
  },
  {
    id: 'mov-016', itemId: 'produto-limpeza-especifico', quantidade: 62, unidadeMedida: 'litro', custoUnitario: 14.5, valorTotal: 899,
    tipo: 'entrada_recebimento', unitId: 'cidade-baixa', localId: 'cidade-baixa-deposito_limpeza', data: '2026-06-05T10:00:00-03:00',
    usuario: 'Diego Andrade', origem: 'Recebimento', documentoRelacionado: 'Pedido 4201', status: 'confirmado',
  },
]

export function getMovementsByItem(itemId: string): InventoryMovement[] {
  return inventoryMovements.filter((m) => m.itemId === itemId).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
}

export function getMovementsByUnit(unitId: string): InventoryMovement[] {
  return inventoryMovements.filter((m) => m.unitId === unitId).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
}

export function getMovementById(id: string): InventoryMovement | undefined {
  return inventoryMovements.find((m) => m.id === id)
}
