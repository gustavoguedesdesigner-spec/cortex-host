import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { ReceivingBreadcrumb } from '@/components/receiving/ReceivingBreadcrumb'
import { ReceivingInternalNav } from '@/components/receiving/ReceivingInternalNav'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { QuarantineStatusBadge } from '@/components/receiving/ReceivingBadges'
import { useReceiving } from '@/hooks/useReceiving'
import { getReceiptById } from '@/data/receiving/receipts'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { getUnitById } from '@/data/units'
import { formatDateFull } from '@/utils/format'

export default function RecebimentosQuarentena() {
  const navigate = useNavigate()
  const { allQuarantine, updateQuarantineStatus } = useReceiving()

  return (
    <div className="flex flex-col gap-8">
      <ReceivingBreadcrumb trail={[{ label: 'Quarentena' }]} />
      <PageHero eyebrow="Recebimentos" title="Quarentena" description="Itens retidos por divergência de qualidade, temperatura, lote ou validade — liberados apenas com decisão explícita." />
      <ReceivingInternalNav active="quarentena" />

      <SectionHeader title={`${allQuarantine.length} registros`} />

      {allQuarantine.length === 0 ? (
        <EmptyState icon={<ShieldAlert className="h-5 w-5" />} title="Nenhum item em quarentena" />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {allQuarantine.map((q) => {
            const receipt = getReceiptById(q.receiptId)
            const supplier = receipt ? getSupplierById(receipt.supplierId) : undefined
            return (
              <Card key={q.id} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-card-title text-ink-primary">{q.itemNome}</p>
                    <p className="text-caption text-ink-tertiary">
                      {supplier?.nome} · {receipt ? getUnitById(receipt.unitId)?.nomeCurto : ''}
                    </p>
                  </div>
                  <QuarantineStatusBadge status={q.status} />
                </div>
                <p className="text-support leading-relaxed text-ink-secondary">{q.motivo}</p>
                <p className="text-caption text-ink-tertiary">
                  Em quarentena desde {formatDateFull(q.dataInicio)} · Responsável {q.responsavel}
                </p>
                {q.decisaoFinal && <p className="border-t border-border pt-2 text-support text-ink-secondary">{q.decisaoFinal}</p>}

                <div className="mt-1 flex flex-wrap gap-2 border-t border-border pt-3">
                  {receipt && (
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/recebimentos/${receipt.id}`)}>
                      Abrir recebimento
                    </Button>
                  )}
                  {q.status === 'em_analise' && (
                    <>
                      <Button size="sm" onClick={() => updateQuarantineStatus(q.id, 'liberado')}>
                        Liberar
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => updateQuarantineStatus(q.id, 'descartado')}>
                        Descartar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => updateQuarantineStatus(q.id, 'devolvido')}>
                        Devolver ao fornecedor
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
