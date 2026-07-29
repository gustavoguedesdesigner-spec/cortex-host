import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Scale, Search } from 'lucide-react'
import { SuppliersHero, SuppliersFilterBar, type SuppliersFilters } from '@/components/suppliers/SuppliersHeader'
import { SuppliersInternalNav } from '@/components/suppliers/SuppliersInternalNav'
import { SupplierCard } from '@/components/suppliers/SupplierCard'
import { SuppliersTable } from '@/components/suppliers/SuppliersTable'
import { SupplierComparisonModal } from '@/components/suppliers/SupplierComparisonModal'
import { NovoFornecedorModal } from '@/components/suppliers/NovoFornecedorModal'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  SuppliersCortexSummarySection,
  SuppliersIndicatorsStrip,
  SuppliersPerformanceSection,
  SuppliersPurchaseDistributionSection,
  SuppliersDependencySection,
  SuppliersDivergencesPreviewSection,
  SuppliersDocumentsNegotiationsSection,
} from './suppliers/SuppliersOverviewSections'
import { useSuppliers } from '@/hooks/useSuppliers'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'

type ViewMode = 'cards' | 'tabela'

export default function Fornecedores() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { allSuppliers } = useSuppliers()

  const [viewMode, setViewMode] = useLocalStorageState<ViewMode>('cortex-host:suppliers-view-mode', 'cards')
  const [filters, setFilters] = useState<SuppliersFilters>({
    busca: '',
    categoria: 'todas',
    status: 'todos',
    unidade: 'todas',
    rapido: (searchParams.get('rapido') as SuppliersFilters['rapido']) ?? 'todos',
  })
  const [selected, setSelected] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  function handleFilterChange(next: SuppliersFilters) {
    setFilters(next)
    if (next.rapido !== 'todos') setSearchParams({ rapido: next.rapido })
    else setSearchParams({})
  }

  const filtered = useMemo(() => {
    const busca = filters.busca.trim().toLowerCase()
    return allSuppliers.filter((s) => {
      if (busca && !s.nome.toLowerCase().includes(busca) && !s.categoriaPrincipalId.includes(busca)) return false
      if (filters.categoria !== 'todas' && !s.categoriasIds.includes(filters.categoria)) return false
      if (filters.status !== 'todos') {
        if (filters.status === 'bloqueado' && s.status !== 'bloqueado') return false
        else if (filters.status === 'em_homologacao' && s.status !== 'em_homologacao') return false
        else if (['estrategico', 'ativo', 'em_atencao'].includes(filters.status) && s.statusOperacional !== filters.status) return false
      }
      switch (filters.rapido) {
        case 'estrategicos':
          return s.estrategico
        case 'em_atencao':
          return s.statusOperacional === 'em_atencao'
        case 'com_divergencias':
          return s.divergenciasAbertas > 0
        case 'documentos_vencendo':
          return s.documentosValidos < s.documentosObrigatorios
        case 'bloqueados':
          return s.status === 'bloqueado'
        case 'em_homologacao':
          return s.status === 'em_homologacao'
        case 'sem_compra_recente':
          return s.valorCompradoPeriodo === 0
        default:
          return true
      }
    })
  }, [allSuppliers, filters])

  function toggleSelect(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 4 ? prev : [...prev, id]))
  }

  const selectedSuppliers = allSuppliers.filter((s) => selected.includes(s.id))

  return (
    <div className="flex flex-col gap-10">
      <SuppliersHero onNovoFornecedor={() => setSearchParams({ novo: '1' })} onComparar={() => setViewMode('tabela')} />

      <SuppliersInternalNav active="visao-geral" />

      <section className="flex flex-col gap-5">
        <SuppliersFilterBar filters={filters} onChange={handleFilterChange} />

        <SectionHeader
          title={`${filtered.length} fornecedores`}
          actions={
            <div className="flex items-center gap-2">
              {viewMode === 'tabela' && selected.length >= 2 && (
                <button
                  onClick={() => setCompareOpen(true)}
                  className="flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-support font-medium text-white hover:bg-accent-hover"
                >
                  <Scale className="h-3.5 w-3.5" strokeWidth={1.7} />
                  Comparar {selected.length}
                </button>
              )}
              <SegmentedControl
                value={viewMode}
                onChange={setViewMode}
                options={[
                  { value: 'cards', label: 'Cards' },
                  { value: 'tabela', label: 'Tabela' },
                ]}
              />
            </div>
          }
        />

        {filtered.length === 0 ? (
          <EmptyState icon={<Search className="h-5 w-5" />} title="Nenhum fornecedor encontrado" description="Ajuste os filtros ou a busca para ver mais resultados." />
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <SupplierCard key={s.id} supplier={s} />
            ))}
          </div>
        ) : (
          <SuppliersTable suppliers={filtered} selected={selected} onToggleSelect={toggleSelect} />
        )}
      </section>

      <div className="flex flex-col gap-10 border-t border-border pt-10">
        <SuppliersCortexSummarySection />
        <SuppliersIndicatorsStrip />
        <SuppliersPerformanceSection />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SuppliersPurchaseDistributionSection />
          </div>
          <div className="lg:col-span-7">
            <SuppliersDependencySection />
          </div>
        </div>

        <SuppliersDivergencesPreviewSection />
        <SuppliersDocumentsNegotiationsSection />
      </div>

      <SupplierComparisonModal isOpen={compareOpen} selected={selectedSuppliers} onClose={() => setCompareOpen(false)} />
      <NovoFornecedorModal
        isOpen={searchParams.get('novo') === '1'}
        onClose={() => setSearchParams({})}
        onCreated={(supplier) => {
          setSearchParams({})
          navigate(`/fornecedores/${supplier.id}`)
        }}
      />
    </div>
  )
}
