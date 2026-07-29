import { useNavigate } from 'react-router-dom'
import { MessageSquareText, Package } from 'lucide-react'
import { ReceivingBreadcrumb } from './ReceivingBreadcrumb'
import { ReceiptStatusBadge } from './ReceivingBadges'
import { Button } from '@/components/ui/Button'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { getUnitById } from '@/data/units'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'
import { useAppState } from '@/context/AppStateContext'
import type { Receipt } from '@/types'

export function ReceiptDetailHero({ receipt }: { receipt: Receipt }) {
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const supplier = getSupplierById(receipt.supplierId)
  const unit = getUnitById(receipt.unitId)

  return (
    <div className="flex flex-col gap-5 border-b border-border pb-8">
      <ReceivingBreadcrumb trail={[{ label: receipt.nfNumero ? `NF ${receipt.nfNumero}` : receipt.id.toUpperCase() }]} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <div>
            <p className="text-label uppercase tracking-[0.06em] text-ink-tertiary">
              {receipt.nfNumero ? `NF ${receipt.nfNumero}` : receipt.id.toUpperCase()} · {unit?.nomeCurto}
            </p>
            <h1 className="text-page-title-sm lg:text-page-title">{supplier?.nome ?? receipt.supplierId}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <ReceiptStatusBadge status={receipt.status} />
              <span className="text-caption text-ink-tertiary">Responsável {receipt.responsavel}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {supplier && (
              <Button size="sm" variant="secondary" onClick={() => navigate(`/fornecedores/${supplier.id}`)}>
                Abrir fornecedor
              </Button>
            )}
            {receipt.orderId && (
              <Button size="sm" variant="secondary" onClick={() => navigate(`/compras/pedidos/${receipt.orderId}`)}>
                Abrir pedido de origem
              </Button>
            )}
            <Button size="sm" variant="ghost" leftIcon={<Package className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/estoque')}>
              Ver estoque
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<MessageSquareText className="h-3.5 w-3.5" strokeWidth={1.7} />}
              onClick={() => askCortex(`O que devo cobrar da ${supplier?.nome ?? 'fornecedor'}?`, receipt.nfNumero ? `NF ${receipt.nfNumero}` : receipt.id)}
            >
              Perguntar ao CORTEX
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface-subtle p-5 lg:col-span-5">
          <p className="text-label text-ink-tertiary">Valores do recebimento</p>
          <div className="mt-3 grid grid-cols-3 gap-4">
            <div>
              <p className="text-metric tabular text-ink-primary">{formatCurrencyBRL(receipt.valorPedido)}</p>
              <p className="text-caption text-ink-tertiary">Pedido</p>
            </div>
            <div>
              <p className="text-metric tabular text-ink-primary">{receipt.valorFisico > 0 ? formatCurrencyBRL(receipt.valorFisico) : '—'}</p>
              <p className="text-caption text-ink-tertiary">Recebido</p>
            </div>
            <div>
              <p className={`text-metric tabular ${receipt.impactoFinanceiro > 0 ? 'text-danger' : 'text-ink-primary'}`}>{receipt.impactoFinanceiro > 0 ? formatCurrencyBRL(receipt.impactoFinanceiro) : '—'}</p>
              <p className="text-caption text-ink-tertiary">Impacto</p>
            </div>
          </div>
          <p className="mt-4 text-caption text-ink-tertiary">
            {receipt.dataChegada ? `Chegada em ${formatDateFull(receipt.dataChegada)}` : `Agendado para ${formatDateFull(receipt.dataAgendada)}`}
          </p>
        </div>
      </div>
    </div>
  )
}
