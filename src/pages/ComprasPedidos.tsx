import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { ComprasBreadcrumb } from '@/components/purchasing/ComprasBreadcrumb'
import { ComprasInternalNav } from '@/components/purchasing/ComprasInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { OrderStatusBadge } from '@/components/purchasing/OrderStatusBadge'
import { usePurchasing } from '@/hooks/usePurchasing'
import { getUnitById } from '@/data/units'
import { calcularPreenchimentoPedido } from '@/utils/purchasingCalculations'
import { formatCurrencyBRL, formatDateShort } from '@/utils/format'
import type { PurchaseOrder, PurchaseOrderStatus } from '@/types'

const statusFilters: { value: PurchaseOrderStatus | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'aguardando_entrega', label: 'Aguardando entrega' },
  { value: 'parcialmente_recebido', label: 'Parcialmente recebido' },
  { value: 'divergente', label: 'Divergente' },
  { value: 'concluido', label: 'Concluído' },
]

function preenchimentoPedido(order: PurchaseOrder) {
  const totalPedido = order.itens.reduce((s, i) => s + i.quantidadePedida, 0)
  const totalRecebido = order.itens.reduce((s, i) => s + i.quantidadeRecebida, 0)
  return calcularPreenchimentoPedido(totalRecebido, totalPedido)
}

export default function ComprasPedidos() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { allOrders } = usePurchasing()
  const statusParam = searchParams.get('status') as PurchaseOrderStatus | null
  const [filtro, setFiltro] = useState<PurchaseOrderStatus | 'todos'>(statusParam ?? 'todos')

  const filtered = useMemo(() => (filtro === 'todos' ? allOrders : allOrders.filter((o) => o.status === filtro)), [allOrders, filtro])

  const columns: TableColumn<PurchaseOrder>[] = [
    { key: 'id', header: 'Pedido', render: (o) => <span className="font-medium uppercase">{o.id}</span> },
    { key: 'fornecedor', header: 'Fornecedor', render: (o) => o.fornecedorNome },
    { key: 'unidade', header: 'Unidade', render: (o) => getUnitById(o.unitId)?.nomeCurto ?? o.unitId },
    { key: 'valor', header: 'Valor total', align: 'right', render: (o) => formatCurrencyBRL(o.valorTotal) },
    {
      key: 'preenchimento',
      header: 'Preenchimento',
      render: (o) => <ProgressBar value={preenchimentoPedido(o)} status={o.status === 'divergente' ? 'critical' : o.status === 'concluido' ? 'success' : 'attention'} valueLabel={`${Math.round(preenchimentoPedido(o) * 100)}%`} className="w-32" />,
    },
    { key: 'previsao', header: 'Previsão de entrega', align: 'right', render: (o) => formatDateShort(o.previsaoEntrega) },
    { key: 'status', header: 'Status', render: (o) => <OrderStatusBadge status={o.status} /> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <ComprasBreadcrumb trail={[{ label: 'Pedidos' }]} />
      <PageHeader eyebrow="Suprimentos" title="Pedidos de compra" description="Pedidos emitidos, com entrega, recebimento e divergências acompanhados até a conclusão." />
      <ComprasInternalNav active="pedidos" />

      <SectionHeader title={`${filtered.length} pedidos`} actions={<SegmentedControl value={filtro} onChange={setFiltro} options={statusFilters} />} />

      {filtered.length === 0 ? (
        <EmptyState icon={<SlidersHorizontal className="h-5 w-5" />} title="Nenhum pedido encontrado" description="Ajuste os filtros para ver outros pedidos." />
      ) : (
        <Table columns={columns} data={filtered} getRowId={(o) => o.id} onRowClick={(o) => navigate(`/compras/pedidos/${o.id}`)} />
      )}
    </div>
  )
}
