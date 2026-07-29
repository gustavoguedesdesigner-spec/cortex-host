import { useNavigate } from 'react-router-dom'
import { Table, type TableColumn } from '@/components/ui/Table'
import { ReceiptStatusBadge } from './ReceivingBadges'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { getUnitById } from '@/data/units'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'
import type { Receipt } from '@/types'

export function ReceiptsTable({ receipts }: { receipts: Receipt[] }) {
  const navigate = useNavigate()

  const columns: TableColumn<Receipt>[] = [
    { key: 'nf', header: 'NF', render: (r) => <span className="font-medium uppercase text-ink-primary">{r.nfNumero ? `NF ${r.nfNumero}` : r.id.toUpperCase()}</span> },
    { key: 'fornecedor', header: 'Fornecedor', render: (r) => getSupplierById(r.supplierId)?.nome ?? r.supplierId },
    { key: 'unidade', header: 'Unidade', render: (r) => getUnitById(r.unitId)?.nomeCurto ?? r.unitId },
    { key: 'data', header: 'Data', align: 'right', render: (r) => formatDateFull(r.dataChegada ?? r.dataAgendada) },
    { key: 'valorPedido', header: 'Valor pedido', align: 'right', render: (r) => formatCurrencyBRL(r.valorPedido) },
    { key: 'valorFisico', header: 'Valor recebido', align: 'right', render: (r) => (r.valorFisico > 0 ? formatCurrencyBRL(r.valorFisico) : '—') },
    { key: 'impacto', header: 'Impacto', align: 'right', render: (r) => (r.impactoFinanceiro > 0 ? <span className="text-danger">{formatCurrencyBRL(r.impactoFinanceiro)}</span> : '—') },
    { key: 'status', header: 'Status', render: (r) => <ReceiptStatusBadge status={r.status} /> },
  ]

  return <Table columns={columns} data={receipts} getRowId={(r) => r.id} onRowClick={(r) => navigate(`/recebimentos/${r.id}`)} stickyFirstColumn />
}
