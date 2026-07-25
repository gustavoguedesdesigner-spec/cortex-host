import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RotateCcw, ListPlus } from 'lucide-react'
import { InventoryBreadcrumb } from '@/components/inventory/InventoryBreadcrumb'
import { InventoryInternalNav } from '@/components/inventory/InventoryInternalNav'
import { RegisterMovementModal } from '@/components/inventory/RegisterMovementModal'
import { PageHeader } from '@/components/ui/PageHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { inventoryMovements } from '@/data/inventory/inventoryMovements'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { movementTypeLabel } from '@/data/inventory/inventoryMovementLabels'
import { units } from '@/data/units'
import { useCreatedMovements } from '@/hooks/useCreatedMovements'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'
import type { InventoryMovement } from '@/types'

const typeOptions = [{ value: 'todos', label: 'Todos os tipos' }, ...Object.entries(movementTypeLabel).map(([value, label]) => ({ value, label }))]

export default function InventoryMovements() {
  const [searchParams] = useSearchParams()
  const { movements: createdMovements, createMovement, estornarMovement } = useCreatedMovements()
  const [modalOpen, setModalOpen] = useState(searchParams.get('novo') === '1')
  const [tipoFiltro, setTipoFiltro] = useState('todos')

  const allMovements = useMemo(
    () => [...createdMovements, ...inventoryMovements].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
    [createdMovements],
  )

  const filtered = tipoFiltro === 'todos' ? allMovements : allMovements.filter((m) => m.tipo === tipoFiltro)

  const columns: TableColumn<InventoryMovement>[] = [
    { key: 'data', header: 'Data e horário', render: (m) => formatDateFull(m.data) },
    { key: 'item', header: 'Item', render: (m) => <span className="font-medium">{getInventoryItemById(m.itemId)?.nome ?? m.itemId}</span> },
    { key: 'tipo', header: 'Tipo', render: (m) => movementTypeLabel[m.tipo] },
    { key: 'quantidade', header: 'Quantidade', align: 'right', render: (m) => `${m.quantidade.toLocaleString('pt-BR')} ${m.unidadeMedida}` },
    { key: 'valor', header: 'Valor', align: 'right', render: (m) => formatCurrencyBRL(m.valorTotal) },
    { key: 'unidade', header: 'Unidade', render: (m) => units.find((u) => u.id === m.unitId)?.nomeCurto ?? m.unitId },
    { key: 'origem', header: 'Origem', render: (m) => m.origem },
    { key: 'usuario', header: 'Usuário', render: (m) => m.usuario },
    {
      key: 'status',
      header: 'Status',
      render: (m) => (m.status === 'estornado' ? <span className="text-ink-tertiary line-through">Estornado</span> : m.status === 'pendente' ? 'Pendente' : m.status === 'aguardando_aprovacao' ? 'Aguardando aprovação' : 'Confirmado'),
    },
    {
      key: 'acao',
      header: '',
      align: 'right',
      render: (m) =>
        m.status === 'confirmado' && m.tipo !== 'estorno' ? (
          <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => estornarMovement(m, 'Leo', 'Estorno solicitado manualmente')}>
            Estornar
          </Button>
        ) : null,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <InventoryBreadcrumb trail={[{ label: 'Movimentações' }]} />
      <PageHeader
        eyebrow="Operação"
        title="Movimentações"
        description="Histórico completo — nunca apagado. Estornos criam uma movimentação inversa vinculada à original."
        actions={
          <Button size="sm" variant="navy" leftIcon={<ListPlus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setModalOpen(true)}>
            Registrar movimentação
          </Button>
        }
      />
      <InventoryInternalNav active="movimentacoes" />
      <Select aria-label="Filtrar por tipo" value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} options={typeOptions} className="w-56" />
      <Table columns={columns} data={filtered} getRowId={(m) => m.id} />
      <RegisterMovementModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={createMovement} />
    </div>
  )
}
