import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { ReceivingHero, ReceivingFilterBar, type ReceivingFilters } from '@/components/receiving/ReceivingHeader'
import { ReceivingInternalNav } from '@/components/receiving/ReceivingInternalNav'
import { ReceiptsTable } from '@/components/receiving/ReceiptsTable'
import { NovoRecebimentoModal } from '@/components/receiving/NovoRecebimentoModal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  ReceivingCortexSummarySection,
  ReceivingIndicatorsStrip,
  ReceivingDivergencesPreviewSection,
  ReceivingQuarantinePreviewSection,
} from './receiving/ReceivingOverviewSections'
import { useReceiving } from '@/hooks/useReceiving'
import { getUnitById } from '@/data/units'
import { getSupplierById } from '@/data/suppliers/suppliers'

export default function Recebimentos() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { allReceipts, allQuarantine, createReceipt } = useReceiving()

  const [filters, setFilters] = useState<ReceivingFilters>({
    busca: '',
    unidade: 'todas',
    rapido: (searchParams.get('rapido') as ReceivingFilters['rapido']) ?? 'todos',
  })

  function handleFilterChange(next: ReceivingFilters) {
    setFilters(next)
    if (next.rapido !== 'todos') setSearchParams({ rapido: next.rapido })
    else setSearchParams({})
  }

  const filtered = useMemo(() => {
    const busca = filters.busca.trim().toLowerCase()
    return allReceipts.filter((r) => {
      if (busca) {
        const supplier = getSupplierById(r.supplierId)
        const unit = getUnitById(r.unitId)
        const haystack = `${r.nfNumero} ${supplier?.nome ?? ''} ${unit?.nome ?? ''}`.toLowerCase()
        if (!haystack.includes(busca)) return false
      }
      if (filters.unidade !== 'todas' && r.unitId !== filters.unidade) return false
      if (filters.rapido !== 'todos' && r.status !== filters.rapido) return false
      return true
    })
  }, [allReceipts, filters])

  const divergentes = useMemo(() => allReceipts.filter((r) => r.status === 'divergente'), [allReceipts])
  const quarentenaAtiva = useMemo(() => allQuarantine.filter((q) => q.status === 'em_analise'), [allQuarantine])

  return (
    <div className="flex flex-col gap-10">
      <ReceivingHero onNovoRecebimento={() => setSearchParams({ novo: '1' })} />

      <ReceivingInternalNav active="visao-geral" />

      <section className="flex flex-col gap-5">
        <ReceivingFilterBar filters={filters} onChange={handleFilterChange} />
        <SectionHeader title={`${filtered.length} recebimentos`} />

        {filtered.length === 0 ? (
          <EmptyState icon={<Search className="h-5 w-5" />} title="Nenhum recebimento encontrado" description="Ajuste os filtros ou a busca para ver mais resultados." />
        ) : (
          <ReceiptsTable receipts={filtered} />
        )}
      </section>

      <div className="flex flex-col gap-10 border-t border-border pt-10">
        <ReceivingCortexSummarySection />
        <ReceivingIndicatorsStrip />
        <ReceivingDivergencesPreviewSection divergentes={divergentes} />
        <ReceivingQuarantinePreviewSection quarantine={quarentenaAtiva} />
      </div>

      <NovoRecebimentoModal
        isOpen={searchParams.get('novo') === '1'}
        onClose={() => setSearchParams({})}
        createReceipt={createReceipt}
        onCreated={(receipt) => {
          setSearchParams({})
          navigate(`/recebimentos/${receipt.id}`)
        }}
      />
    </div>
  )
}
