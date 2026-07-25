import { useMemo, useState } from 'react'
import { GitCompareArrows, Plus } from 'lucide-react'
import { InventoryBreadcrumb } from '@/components/inventory/InventoryBreadcrumb'
import { InventoryInternalNav } from '@/components/inventory/InventoryInternalNav'
import { CreateTransferModal } from '@/components/inventory/CreateTransferModal'
import { PageHeader } from '@/components/ui/PageHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { inventoryTransfers } from '@/data/inventory/inventoryTransfers'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { transferStatusLabel } from '@/data/inventory/inventoryMovementLabels'
import { units } from '@/data/units'
import { useCreatedTransfers } from '@/hooks/useCreatedTransfers'
import { formatCurrencyBRL } from '@/utils/format'
import type { InventoryTransfer, TransferStatus } from '@/types'

const statusVariant: Record<TransferStatus, 'success' | 'attention' | 'critical' | 'info' | 'neutral'> = {
  solicitada: 'neutral',
  aprovada: 'info',
  separada: 'info',
  enviada: 'attention',
  em_transito: 'attention',
  recebida: 'info',
  conferida: 'info',
  concluida: 'success',
  divergente: 'critical',
}

export default function InventoryTransfers() {
  const { created, updateTransferStatus, createTransfer, applyOverride } = useCreatedTransfers()
  const [modalOpen, setModalOpen] = useState(false)
  const [receiving, setReceiving] = useState<InventoryTransfer | null>(null)
  const [quantidadeRecebida, setQuantidadeRecebida] = useState('')
  const [avaria, setAvaria] = useState('')

  const allTransfers = useMemo(() => [...created, ...inventoryTransfers].map(applyOverride), [created, applyOverride])

  function confirmReceipt() {
    if (!receiving || !quantidadeRecebida) return
    const recebida = Number(quantidadeRecebida)
    const status: TransferStatus = recebida < receiving.quantidadeEnviada ? 'divergente' : 'concluida'
    updateTransferStatus(receiving.id, status, recebida, avaria.trim() || undefined)
    setReceiving(null)
    setQuantidadeRecebida('')
    setAvaria('')
  }

  const columns: TableColumn<InventoryTransfer>[] = [
    { key: 'numero', header: 'Número', render: (t) => <span className="font-medium">{t.id}</span> },
    { key: 'origem', header: 'Origem', render: (t) => units.find((u) => u.id === t.origemUnitId)?.nomeCurto ?? t.origemUnitId },
    { key: 'destino', header: 'Destino', render: (t) => units.find((u) => u.id === t.destinoUnitId)?.nomeCurto ?? t.destinoUnitId },
    { key: 'item', header: 'Item', render: (t) => getInventoryItemById(t.itemId)?.nome ?? t.itemId },
    { key: 'enviada', header: 'Qtd. enviada', align: 'right', render: (t) => `${t.quantidadeEnviada} ${t.unidadeMedida}` },
    { key: 'recebida', header: 'Qtd. recebida', align: 'right', render: (t) => (t.quantidadeRecebida !== null ? `${t.quantidadeRecebida} ${t.unidadeMedida}` : 'Pendente') },
    { key: 'valor', header: 'Valor', align: 'right', render: (t) => formatCurrencyBRL(t.valor) },
    { key: 'solicitante', header: 'Solicitante', render: (t) => t.solicitante },
    { key: 'status', header: 'Status', render: (t) => <IndicatorBadge status={statusVariant[t.status]}>{transferStatusLabel[t.status]}</IndicatorBadge> },
    {
      key: 'acao',
      header: '',
      align: 'right',
      render: (t) =>
        t.status === 'em_transito' || t.status === 'enviada' ? (
          <Button size="sm" variant="ghost" onClick={() => setReceiving(t)}>
            Confirmar recebimento
          </Button>
        ) : null,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <InventoryBreadcrumb trail={[{ label: 'Transferências' }]} />
      <PageHeader
        eyebrow="Operação"
        title="Transferências"
        description="Solicitada → Aprovada → Separada → Enviada → Em trânsito → Recebida → Conferida → Concluída (ou Divergente)"
        actions={
          <Button size="sm" variant="navy" leftIcon={<Plus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setModalOpen(true)}>
            Criar transferência
          </Button>
        }
      />
      <InventoryInternalNav active="transferencias" />
      <Table columns={columns} data={allTransfers} getRowId={(t) => t.id} />

      <CreateTransferModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={createTransfer} />

      <Drawer isOpen={Boolean(receiving)} onClose={() => setReceiving(null)} title={receiving ? `Receber ${receiving.id}` : ''} widthClassName="w-full max-w-md">
        {receiving && (
          <div className="flex flex-col gap-4">
            <p className="text-support text-ink-secondary">
              {getInventoryItemById(receiving.itemId)?.nome} · Enviado: {receiving.quantidadeEnviada} {receiving.unidadeMedida} de {units.find((u) => u.id === receiving.origemUnitId)?.nomeCurto}
            </p>
            <Input label="Quantidade recebida" type="number" value={quantidadeRecebida} onChange={(e) => setQuantidadeRecebida(e.target.value)} placeholder="0" />
            <Input label="Avaria ou observação (opcional)" value={avaria} onChange={(e) => setAvaria(e.target.value)} placeholder="Ex.: barril amassado no transporte" />
            <div className="flex items-center gap-2">
              <Button variant="primary" onClick={confirmReceipt} disabled={!quantidadeRecebida} leftIcon={<GitCompareArrows className="h-3.5 w-3.5" strokeWidth={1.7} />}>
                Concluir recebimento
              </Button>
            </div>
            <p className="text-caption text-ink-tertiary">O estoque disponível do destino só é atualizado após a confirmação.</p>
          </div>
        )}
      </Drawer>
    </div>
  )
}
