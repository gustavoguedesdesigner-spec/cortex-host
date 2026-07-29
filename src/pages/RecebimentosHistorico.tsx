import { useMemo } from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { ReceivingBreadcrumb } from '@/components/receiving/ReceivingBreadcrumb'
import { ReceivingInternalNav } from '@/components/receiving/ReceivingInternalNav'
import { ReceiptsTable } from '@/components/receiving/ReceiptsTable'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { History } from 'lucide-react'
import { useReceiving } from '@/hooks/useReceiving'

export default function RecebimentosHistorico() {
  const { allReceipts } = useReceiving()

  const historico = useMemo(
    () => [...allReceipts].sort((a, b) => new Date(b.dataChegada ?? b.dataAgendada).getTime() - new Date(a.dataChegada ?? a.dataAgendada).getTime()),
    [allReceipts],
  )

  return (
    <div className="flex flex-col gap-8">
      <ReceivingBreadcrumb trail={[{ label: 'Histórico' }]} />
      <PageHero eyebrow="Recebimentos" title="Histórico" description="Todos os recebimentos da rede, do mais recente ao mais antigo." />
      <ReceivingInternalNav active="historico" />

      <SectionHeader title={`${historico.length} recebimentos`} />

      {historico.length === 0 ? <EmptyState icon={<History className="h-5 w-5" />} title="Nenhum recebimento registrado" /> : <ReceiptsTable receipts={historico} />}
    </div>
  )
}
