import { useMemo } from 'react'
import { Clock } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { ReceivingBreadcrumb } from '@/components/receiving/ReceivingBreadcrumb'
import { ReceivingInternalNav } from '@/components/receiving/ReceivingInternalNav'
import { ReceiptsTable } from '@/components/receiving/ReceiptsTable'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { useReceiving } from '@/hooks/useReceiving'

export default function RecebimentosAguardando() {
  const { allReceipts } = useReceiving()

  const aguardando = useMemo(() => allReceipts.filter((r) => r.status === 'aguardando' || r.status === 'em_conferencia'), [allReceipts])

  return (
    <div className="flex flex-col gap-8">
      <ReceivingBreadcrumb trail={[{ label: 'Aguardando' }]} />
      <PageHero eyebrow="Recebimentos" title="Aguardando" description="Entregas ainda não conferidas — agendadas ou já chegadas, aguardando conclusão da conferência." />
      <ReceivingInternalNav active="aguardando" />

      <SectionHeader title={`${aguardando.length} recebimentos`} />

      {aguardando.length === 0 ? (
        <EmptyState icon={<Clock className="h-5 w-5" />} title="Nada aguardando conferência" description="Todos os recebimentos foram conferidos." />
      ) : (
        <ReceiptsTable receipts={aguardando} />
      )}
    </div>
  )
}
