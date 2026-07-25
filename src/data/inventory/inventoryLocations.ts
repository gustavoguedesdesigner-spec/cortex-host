import type { InventoryLocation, InventoryLocationType } from '@/types'
import { units } from '@/data/units'

const locationLabel: Record<InventoryLocationType, string> = {
  estoque_seco: 'Estoque seco',
  estoque_refrigerado: 'Estoque refrigerado',
  estoque_congelado: 'Estoque congelado',
  camara_bebidas: 'Câmara de bebidas',
  bar: 'Bar',
  cozinha: 'Cozinha',
  deposito_limpeza: 'Depósito de limpeza',
  estoque_embalagens: 'Estoque de embalagens',
}

/** Participação típica de cada local no valor total da unidade — soma 100%. */
const locationShare: { tipo: InventoryLocationType; pct: number; itens: number }[] = [
  { tipo: 'estoque_refrigerado', pct: 0.24, itens: 14 },
  { tipo: 'camara_bebidas', pct: 0.2, itens: 9 },
  { tipo: 'estoque_seco', pct: 0.22, itens: 18 },
  { tipo: 'estoque_congelado', pct: 0.12, itens: 8 },
  { tipo: 'bar', pct: 0.1, itens: 12 },
  { tipo: 'cozinha', pct: 0.06, itens: 10 },
  { tipo: 'estoque_embalagens', pct: 0.03, itens: 6 },
  { tipo: 'deposito_limpeza', pct: 0.03, itens: 5 },
]

/**
 * Local de demonstração principal — Moinhos, estoque refrigerado —
 * espelha exatamente o exemplo do briefing (seção 6): confiança média,
 * última contagem há 6 dias, uma transferência pendente, duas perdas
 * aguardando validação.
 */
const moinhosRefrigerado: InventoryLocation = {
  id: 'moinhos-estoque_refrigerado',
  unitId: 'moinhos',
  tipo: 'estoque_refrigerado',
  nome: 'Estoque refrigerado',
  valor: Math.round(58600 * 0.24),
  itens: 14,
  ultimaContagem: '2026-07-17T18:00:00-03:00',
  responsavel: 'Rafael Martins',
  confianca: 'media',
  divergencias: 2,
  temperaturaSimulada: '3,8 °C',
}

function buildLocationsForUnit(unitId: string, valorEstoque: number): InventoryLocation[] {
  return locationShare.map(({ tipo, pct, itens }) => {
    if (unitId === 'moinhos' && tipo === 'estoque_refrigerado') return moinhosRefrigerado
    const isCaxiasNorte = unitId === 'caxias-norte'
    return {
      id: `${unitId}-${tipo}`,
      unitId,
      tipo,
      nome: locationLabel[tipo],
      valor: Math.round(valorEstoque * pct),
      itens,
      ultimaContagem: isCaxiasNorte ? '2026-07-09T18:00:00-03:00' : '2026-07-21T18:00:00-03:00',
      responsavel: units.find((u) => u.id === unitId)?.gerente ?? '—',
      confianca: isCaxiasNorte ? 'baixa' : tipo === 'estoque_congelado' || tipo === 'camara_bebidas' ? 'media' : 'alta',
      divergencias: isCaxiasNorte ? 1 : tipo === 'camara_bebidas' ? 1 : 0,
      temperaturaSimulada: tipo === 'estoque_refrigerado' ? '4,1 °C' : tipo === 'estoque_congelado' ? '-18,2 °C' : undefined,
    }
  })
}

export const inventoryLocations: InventoryLocation[] = units.flatMap((u) => buildLocationsForUnit(u.id, u.valorEstoque))

export function getInventoryLocationsByUnit(unitId: string): InventoryLocation[] {
  return inventoryLocations.filter((l) => l.unitId === unitId)
}

export function getInventoryLocationById(id: string): InventoryLocation | undefined {
  return inventoryLocations.find((l) => l.id === id)
}
