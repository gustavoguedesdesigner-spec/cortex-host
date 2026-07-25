import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { InventoryStatusBadge } from '@/components/inventory/InventoryStatusBadge'
import { InventoryConfidenceBadge } from '@/components/inventory/InventoryConfidenceBadge'
import { inventoryPositions } from '@/data/inventory/inventoryPositions'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { units } from '@/data/units'
import { computeInventoryPosition } from '@/utils/inventoryCalculations'
import { formatCurrencyBRL, formatDateShort } from '@/utils/format'
import { SlidersHorizontal } from 'lucide-react'
import type { InventoryItemStatus, InventoryPosition, UnitOfMeasureId } from '@/types'

const quickFilters: { value: InventoryItemStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'risco_ruptura', label: 'Risco de ruptura' },
  { value: 'abaixo_minimo', label: 'Abaixo do mínimo' },
  { value: 'excesso', label: 'Excesso' },
  { value: 'sem_movimentacao', label: 'Sem movimentação' },
  { value: 'divergente', label: 'Divergentes' },
  { value: 'dados_insuficientes', label: 'Dados insuficientes' },
]

interface PositionRow {
  position: InventoryPosition
  itemNome: string
  categoria: string
  unitNome: string
  unidadeMedida: UnitOfMeasureId
  custoMedio: number
}

export function InventoryPositionTab({ search }: { search: string }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const statusParam = searchParams.get('status') as InventoryItemStatus | 'todos' | null

  const [statusFiltro, setStatusFiltro] = useState<InventoryItemStatus | 'todos'>(statusParam && statusParam !== 'todos' ? statusParam : 'todos')

  const rows: PositionRow[] = useMemo(
    () =>
      inventoryPositions
        .map((position) => {
          const item = getInventoryItemById(position.itemId)
          const unit = units.find((u) => u.id === position.unitId)
          if (!item || !unit) return null
          return { position, itemNome: item.nome, categoria: item.categoria, unitNome: unit.nomeCurto, unidadeMedida: item.unidadeMedida, custoMedio: item.custoMedio }
        })
        .filter((r): r is PositionRow => r !== null),
    [],
  )

  const filtered = rows.filter((r) => {
    if (statusFiltro !== 'todos' && r.position.status !== statusFiltro) return false
    if (search && !r.itemNome.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const columns: TableColumn<PositionRow>[] = [
    { key: 'item', header: 'Item', render: (r) => <span className="font-medium">{r.itemNome}</span> },
    { key: 'categoria', header: 'Categoria', render: (r) => r.categoria },
    { key: 'unidade', header: 'Unidade', render: (r) => r.unitNome },
    {
      key: 'sistemico',
      header: 'Saldo sistêmico',
      align: 'right',
      render: (r) => `${r.position.saldoSistemico.toLocaleString('pt-BR')} ${r.unidadeMedida}`,
    },
    {
      key: 'contado',
      header: 'Saldo contado',
      align: 'right',
      render: (r) => (r.position.saldoContado !== null ? `${r.position.saldoContado.toLocaleString('pt-BR')} ${r.unidadeMedida}` : '—'),
    },
    {
      key: 'disponivel',
      header: 'Saldo disponível',
      align: 'right',
      render: (r) => `${computeInventoryPosition(r.position, r.custoMedio).saldoDisponivel.toLocaleString('pt-BR')} ${r.unidadeMedida}`,
    },
    {
      key: 'cobertura',
      header: 'Cobertura',
      align: 'right',
      render: (r) => {
        const c = computeInventoryPosition(r.position, r.custoMedio).cobertura
        return c !== null ? `${c.toFixed(1)} dias` : '—'
      },
    },
    { key: 'valor', header: 'Valor total', align: 'right', render: (r) => formatCurrencyBRL(computeInventoryPosition(r.position, r.custoMedio).valorSistemico) },
    { key: 'ultimaContagem', header: 'Última contagem', align: 'right', render: (r) => (r.position.ultimaContagem ? formatDateShort(r.position.ultimaContagem) : '—') },
    { key: 'confianca', header: 'Confiança', render: (r) => <InventoryConfidenceBadge nivel={r.position.confianca} motivos={r.position.motivosConfianca} /> },
    { key: 'status', header: 'Status', render: (r) => <InventoryStatusBadge status={r.position.status} /> },
    {
      key: 'acao',
      header: '',
      align: 'right',
      render: (r) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/estoque/itens/${r.position.itemId}?unit=${r.position.unitId}`)}>
          Abrir
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Posição de estoque"
        description="Saldo sistêmico, contado e disponível por item e unidade"
        actions={<SegmentedControl value={statusFiltro} onChange={setStatusFiltro} options={quickFilters} />}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<SlidersHorizontal className="h-5 w-5" />}
          title="Nenhum item encontrado"
          description="Ajuste os filtros ou a busca para ver outros itens do estoque."
          action={
            <Button variant="secondary" onClick={() => setStatusFiltro('todos')}>
              Limpar filtros
            </Button>
          }
        />
      ) : (
        <Table columns={columns} data={filtered} getRowId={(r) => `${r.position.itemId}-${r.position.unitId}`} onRowClick={(r) => navigate(`/estoque/itens/${r.position.itemId}?unit=${r.position.unitId}`)} />
      )}
    </div>
  )
}
