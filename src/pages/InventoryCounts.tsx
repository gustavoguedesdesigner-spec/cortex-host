import { useNavigate } from 'react-router-dom'
import { InventoryBreadcrumb } from '@/components/inventory/InventoryBreadcrumb'
import { InventoryInternalNav } from '@/components/inventory/InventoryInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { inventoryCounts } from '@/data/inventory/inventoryCounts'
import { countStatusLabel } from '@/data/inventory/inventoryMovementLabels'
import { units } from '@/data/units'
import { getInventoryLocationById } from '@/data/inventory/inventoryLocations'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'
import type { InventoryCount, InventoryCountStatus } from '@/types'

const statusVariant: Record<InventoryCountStatus, 'success' | 'attention' | 'critical' | 'info' | 'neutral'> = {
  planejado: 'neutral',
  preparado: 'info',
  em_contagem: 'attention',
  em_conferencia: 'attention',
  com_divergencias: 'critical',
  aprovado: 'info',
  fechado: 'success',
  interrompido: 'critical',
}

export default function InventoryCounts() {
  const navigate = useNavigate()

  const columns: TableColumn<InventoryCount>[] = [
    { key: 'titulo', header: 'Inventário', render: (c) => <span className="font-medium">{c.titulo}</span> },
    { key: 'unidade', header: 'Unidade', render: (c) => units.find((u) => u.id === c.unitId)?.nomeCurto ?? c.unitId },
    { key: 'local', header: 'Local', render: (c) => getInventoryLocationById(c.localId)?.nome ?? '—' },
    { key: 'tipo', header: 'Tipo', render: (c) => c.tipo.replace(/_/g, ' ') },
    { key: 'previsto', header: 'Data prevista', render: (c) => formatDateFull(c.dataPrevista) },
    { key: 'responsavel', header: 'Responsável', render: (c) => c.responsavel },
    {
      key: 'progresso',
      header: 'Progresso',
      render: (c) => <ProgressBar value={c.itensPrevistos > 0 ? c.itensContados / c.itensPrevistos : 0} valueLabel={`${c.itensContados}/${c.itensPrevistos}`} status="info" className="w-32" />,
    },
    { key: 'divergencia', header: 'Divergência', align: 'right', render: (c) => (c.divergenciaProvisoria > 0 ? formatCurrencyBRL(c.divergenciaProvisoria) : '—') },
    { key: 'status', header: 'Status', render: (c) => <IndicatorBadge status={statusVariant[c.status]}>{countStatusLabel[c.status]}</IndicatorBadge> },
    {
      key: 'acao',
      header: '',
      align: 'right',
      render: (c) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/estoque/inventarios/${c.id}`)}>
          {c.status === 'em_contagem' ? 'Continuar' : 'Abrir'}
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <InventoryBreadcrumb trail={[{ label: 'Inventários' }]} />
      <PageHeader eyebrow="Operação" title="Inventários" description="Fluxo guiado: planejado → preparado → em contagem → em conferência → com divergências → aprovado → fechado." />
      <InventoryInternalNav active="inventarios" />
      <Table columns={columns} data={inventoryCounts} getRowId={(c) => c.id} onRowClick={(c) => navigate(`/estoque/inventarios/${c.id}`)} />
    </div>
  )
}
