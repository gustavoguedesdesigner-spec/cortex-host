import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { InventoryStatusBadge } from '@/components/inventory/InventoryStatusBadge'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { getPosition } from '@/data/inventory/inventoryPositions'
import { units } from '@/data/units'
import { calcularSaldoDisponivel, calcularCobertura } from '@/utils/inventoryCalculations'
import type { InventoryItemStatus, UnitOfMeasureId } from '@/types'

/** Principais itens críticos — seção 16 do briefing. */
const featuredCoverage: { itemId: string; unitId: string }[] = [
  { itemId: 'chope-ipa', unitId: 'zona-norte' },
  { itemId: 'carne-bovina-blend', unitId: 'moinhos' },
  { itemId: 'oleo-soja', unitId: 'cidade-baixa' },
  { itemId: 'batata-congelada', unitId: 'caxias-centro' },
  { itemId: 'queijo-cheddar', unitId: 'moinhos' },
  { itemId: 'lupulo-demonstrativo', unitId: 'serra' },
  { itemId: 'embalagem-delivery', unitId: 'cidade-baixa' },
  { itemId: 'refrigerante-cola', unitId: 'moinhos' },
]

interface CoverageRow {
  itemId: string
  itemNome: string
  unitId: string
  unitNome: string
  saldoDisponivel: number
  unidadeMedida: UnitOfMeasureId
  consumoMedioDiario: number
  cobertura: number | null
  prazoMedioReposicaoDias: number
  status: InventoryItemStatus
}

export function InventoryCoverageSection() {
  const navigate = useNavigate()

  const rows: CoverageRow[] = featuredCoverage
    .map(({ itemId, unitId }) => {
      const item = getInventoryItemById(itemId)
      const unit = units.find((u) => u.id === unitId)
      const position = getPosition(itemId, unitId)
      if (!item || !unit || !position) return null
      const saldoDisponivel = calcularSaldoDisponivel(position.saldoSistemico, position.quantidadeReservada, position.quantidadeBloqueada)
      const cobertura = calcularCobertura(saldoDisponivel, position.consumoMedioDiario)
      return {
        itemId, itemNome: item.nome, unitId, unitNome: unit.nomeCurto, saldoDisponivel,
        unidadeMedida: item.unidadeMedida, consumoMedioDiario: position.consumoMedioDiario, cobertura,
        prazoMedioReposicaoDias: position.prazoMedioReposicaoDias, status: position.status,
      }
    })
    .filter((r): r is CoverageRow => r !== null)

  const columns: TableColumn<CoverageRow>[] = [
    { key: 'item', header: 'Item', render: (r) => <span className="font-medium">{r.itemNome}</span> },
    { key: 'unidade', header: 'Unidade', render: (r) => r.unitNome },
    { key: 'saldo', header: 'Saldo disponível', align: 'right', render: (r) => `${r.saldoDisponivel.toLocaleString('pt-BR')} ${r.unidadeMedida}` },
    { key: 'consumo', header: 'Consumo médio/dia', align: 'right', render: (r) => `${r.consumoMedioDiario.toLocaleString('pt-BR')} ${r.unidadeMedida}` },
    { key: 'cobertura', header: 'Cobertura', align: 'right', render: (r) => (r.cobertura !== null ? `${r.cobertura.toFixed(1)} dias` : '—') },
    { key: 'reposicao', header: 'Prazo de reposição', align: 'right', render: (r) => `${r.prazoMedioReposicaoDias} dias` },
    { key: 'status', header: 'Status', render: (r) => <InventoryStatusBadge status={r.status} /> },
    {
      key: 'acao',
      header: '',
      align: 'right',
      render: (r) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/estoque/itens/${r.itemId}?unit=${r.unitId}`)}>
          Ver histórico
        </Button>
      ),
    },
  ]

  return (
    <section>
      <SectionHeader title="Cobertura dos itens críticos" description="Saldo disponível frente ao consumo médio e ao prazo de reposição" />
      <Table columns={columns} data={rows} getRowId={(r) => `${r.itemId}-${r.unitId}`} onRowClick={(r) => navigate(`/estoque/itens/${r.itemId}?unit=${r.unitId}`)} />
    </section>
  )
}
