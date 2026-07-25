import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, TriangleAlert, Plus } from 'lucide-react'
import { InventoryBreadcrumb } from '@/components/inventory/InventoryBreadcrumb'
import { InventoryInternalNav } from '@/components/inventory/InventoryInternalNav'
import { RegisterLossModal } from '@/components/inventory/RegisterLossModal'
import { PageHeader } from '@/components/ui/PageHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CreateActionModal, type CreateActionDefaults } from '@/components/cortex/CreateActionModal'
import { inventoryLosses, inventoryRecurringLossInsight } from '@/data/inventory/inventoryLosses'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { lossReasonLabel } from '@/data/inventory/inventoryMovementLabels'
import { units } from '@/data/units'
import { useCreatedLosses } from '@/hooks/useCreatedLosses'
import { useCreatedActions } from '@/hooks/useCreatedActions'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'
import type { InventoryLoss, LossStatus } from '@/types'

const statusVariant: Record<LossStatus, 'success' | 'attention' | 'neutral'> = {
  registrada: 'neutral',
  aguardando_validacao: 'attention',
  validada: 'success',
}

const statusLabel: Record<LossStatus, string> = { registrada: 'Registrada', aguardando_validacao: 'Aguardando validação', validada: 'Validada' }

export default function InventoryLosses() {
  const navigate = useNavigate()
  const { losses: createdLosses, createLoss } = useCreatedLosses()
  const { createAction } = useCreatedActions()
  const [modalOpen, setModalOpen] = useState(false)
  const [actionDefaults, setActionDefaults] = useState<CreateActionDefaults | null>(null)

  const allLosses = useMemo(() => [...createdLosses, ...inventoryLosses].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()), [createdLosses])
  const totalValor = allLosses.reduce((sum, l) => sum + l.valor, 0)

  const columns: TableColumn<InventoryLoss>[] = [
    { key: 'data', header: 'Data', render: (l) => formatDateFull(l.data) },
    { key: 'item', header: 'Item', render: (l) => <span className="font-medium">{getInventoryItemById(l.itemId)?.nome ?? l.itemId}</span> },
    { key: 'unidade', header: 'Unidade', render: (l) => units.find((u) => u.id === l.unitId)?.nomeCurto ?? l.unitId },
    { key: 'quantidade', header: 'Quantidade', align: 'right', render: (l) => `${l.quantidade} ${l.unidadeMedida}` },
    { key: 'valor', header: 'Valor', align: 'right', render: (l) => <span className="font-medium text-danger">{formatCurrencyBRL(l.valor)}</span> },
    { key: 'motivo', header: 'Motivo', render: (l) => lossReasonLabel[l.motivo] },
    { key: 'responsavel', header: 'Responsável', render: (l) => l.responsavel },
    { key: 'status', header: 'Status', render: (l) => <IndicatorBadge status={statusVariant[l.status]}>{statusLabel[l.status]}</IndicatorBadge> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <InventoryBreadcrumb trail={[{ label: 'Perdas' }]} />
      <PageHeader
        eyebrow="Operação"
        title="Perdas"
        description={`Total registrado: ${formatCurrencyBRL(totalValor)}`}
        actions={
          <Button size="sm" variant="navy" leftIcon={<Plus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setModalOpen(true)}>
            Registrar perda
          </Button>
        }
      />
      <InventoryInternalNav active="perdas" />

      <section>
        <SectionHeader title="Perdas recorrentes" description="Padrões identificados pelo CORTEX — exigem validação, não são conclusões definitivas" />
        <div className="flex flex-col gap-3 rounded-lg border border-warning/30 bg-warning-soft/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.7} />
            <div>
              <p className="text-support font-medium text-ink-primary">
                {getInventoryItemById(inventoryRecurringLossInsight.itemId)?.nome} — {units.find((u) => u.id === inventoryRecurringLossInsight.unitId)?.nomeCurto}
              </p>
              <p className="mt-0.5 text-support text-ink-secondary">
                {inventoryRecurringLossInsight.registros} registros em {inventoryRecurringLossInsight.periodoDias} dias · {inventoryRecurringLossInsight.totalQuantidade} kg ·{' '}
                {formatCurrencyBRL(inventoryRecurringLossInsight.totalValor)} · motivo predominante: {inventoryRecurringLossInsight.motivoPredominante} · tendência de alta
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => navigate(`/estoque/itens/${inventoryRecurringLossInsight.itemId}?unit=${inventoryRecurringLossInsight.unitId}`)}>
              Abrir histórico
            </Button>
            <Button size="sm" variant="primary" onClick={() => setActionDefaults({ titulo: 'Revisar porcionamento de carnes — Moinhos', unidade: 'Salvador Moinhos', prioridade: 'alta' })}>
              Criar ação
            </Button>
            <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/cmv/unidades/moinhos')}>
              Comparar com Serra
            </Button>
          </div>
        </div>
      </section>

      <Table columns={columns} data={allLosses} getRowId={(l) => l.id} />

      <RegisterLossModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={createLoss} />
      <CreateActionModal isOpen={Boolean(actionDefaults)} onClose={() => setActionDefaults(null)} defaults={actionDefaults ?? undefined} onSave={(action) => createAction(action)} />
    </div>
  )
}
