import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarClock } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { ReceivingBreadcrumb } from '@/components/receiving/ReceivingBreadcrumb'
import { ReceivingInternalNav } from '@/components/receiving/ReceivingInternalNav'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { ReceiptStatusBadge } from '@/components/receiving/ReceivingBadges'
import { useReceiving } from '@/hooks/useReceiving'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { getUnitById } from '@/data/units'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'

export default function RecebimentosAgenda() {
  const navigate = useNavigate()
  const { allReceipts } = useReceiving()

  const agenda = useMemo(
    () =>
      [...allReceipts]
        .filter((r) => r.status === 'aguardando' || r.status === 'em_conferencia')
        .sort((a, b) => new Date(a.dataAgendada).getTime() - new Date(b.dataAgendada).getTime()),
    [allReceipts],
  )

  return (
    <div className="flex flex-col gap-8">
      <ReceivingBreadcrumb trail={[{ label: 'Agenda' }]} />
      <PageHero eyebrow="Recebimentos" title="Agenda" description="Entregas previstas por unidade — cada recebimento só entra em estoque depois de passar pela conferência completa." />
      <ReceivingInternalNav active="agenda" />

      <SectionHeader title={`${agenda.length} entregas agendadas`} />

      {agenda.length === 0 ? (
        <EmptyState icon={<CalendarClock className="h-5 w-5" />} title="Nenhuma entrega agendada" description="Novas entregas aparecem aqui conforme forem programadas." />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {agenda.map((r) => {
            const supplier = getSupplierById(r.supplierId)
            return (
              <button key={r.id} onClick={() => navigate(`/recebimentos/${r.id}`)} className="flex items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
                <div className="min-w-0">
                  <p className="text-support font-medium text-ink-primary">
                    {supplier?.nome} · {getUnitById(r.unitId)?.nomeCurto}
                  </p>
                  <p className="text-caption text-ink-tertiary">{formatDateFull(r.dataAgendada)} · Responsável {r.responsavel}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-support font-medium tabular text-ink-secondary">{formatCurrencyBRL(r.valorPedido)}</span>
                  <ReceiptStatusBadge status={r.status} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
