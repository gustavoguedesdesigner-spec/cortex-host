import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { InventoryConfidenceBadge } from '@/components/inventory/InventoryConfidenceBadge'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { getPosition } from '@/data/inventory/inventoryPositions'
import { inventoryCmvImpactRows, type InventoryCmvImpactRow } from '@/data/inventory/inventoryCmvImpact'
import { units } from '@/data/units'
import { formatCurrencyBRL } from '@/utils/format'

export function InventoryCmvImpactSection() {
  const navigate = useNavigate()

  const columns: TableColumn<InventoryCmvImpactRow>[] = [
    { key: 'unidade', header: 'Unidade', render: (r) => units.find((u) => u.id === r.unitId)?.nomeCurto ?? r.unitId },
    { key: 'item', header: 'Item', render: (r) => <span className="font-medium">{getInventoryItemById(r.itemId)?.nome ?? r.itemId}</span> },
    {
      key: 'esperado',
      header: 'Saldo esperado',
      align: 'right',
      render: (r) => {
        const pos = getPosition(r.itemId, r.unitId)
        return pos ? `${pos.saldoSistemico.toLocaleString('pt-BR')} ${r.unidadeMedida}` : '—'
      },
    },
    {
      key: 'contado',
      header: 'Saldo contado',
      align: 'right',
      render: (r) => {
        const pos = getPosition(r.itemId, r.unitId)
        return pos?.saldoContado !== null && pos?.saldoContado !== undefined ? `${pos.saldoContado.toLocaleString('pt-BR')} ${r.unidadeMedida}` : '—'
      },
    },
    { key: 'diferenca', header: 'Diferença', align: 'right', render: (r) => <span className="font-medium text-danger">{r.diferenca} {r.unidadeMedida}</span> },
    { key: 'impacto', header: 'Impacto', align: 'right', render: (r) => <span className="font-medium text-danger">{formatCurrencyBRL(r.impacto)}</span> },
    { key: 'confianca', header: 'Confiança', render: (r) => <InventoryConfidenceBadge nivel={r.confianca} /> },
    { key: 'causa', header: 'Causa provável', className: 'max-w-xs whitespace-normal', render: (r) => <span className="text-caption text-ink-secondary">{r.causaProvavel}</span> },
  ]

  return (
    <section>
      <SectionHeader title="Divergências com impacto no CMV" description="Clique em uma linha para abrir a análise completa no módulo de CMV" />
      <Table columns={columns} data={inventoryCmvImpactRows} getRowId={(r) => r.id} onRowClick={() => navigate('/cmv?tab=causas')} />
    </section>
  )
}
