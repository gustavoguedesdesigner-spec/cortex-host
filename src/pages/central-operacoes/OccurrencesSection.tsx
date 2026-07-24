import { useMemo, useState, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { OccurrenceCard } from '@/components/cortex/OccurrenceCard'
import { CreateActionModal, type CreateActionDefaults } from '@/components/cortex/CreateActionModal'
import { occurrences } from '@/data/occurrences'
import { units, getUnitIdByName } from '@/data/units'
import { useOccurrenceStatus } from '@/hooks/useOccurrenceStatus'
import { ListChecks } from 'lucide-react'
import type { CreatedAction, Occurrence } from '@/types'

const priorityOptions = [
  { value: 'todas', label: 'Todas as prioridades' },
  { value: 'critica', label: 'Crítica' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
]

const categoryOptions = [
  { value: 'todas', label: 'Todas as categorias' },
  ...Array.from(new Set(occurrences.map((o) => o.categoria))).map((c) => ({ value: c, label: c })),
]

const unitFilterOptions = [{ value: 'todas', label: 'Todas as unidades' }, ...units.map((u) => ({ value: u.nome, label: u.nome }))]

interface OccurrencesSectionProps {
  onCreateAction: (action: Omit<CreatedAction, 'id' | 'criadoEm'>) => void
  sectionRef?: RefObject<HTMLElement>
}

export function OccurrencesSection({ onCreateAction, sectionRef }: OccurrencesSectionProps) {
  const navigate = useNavigate()
  const { getStatus, markAsAnalyzed, toggleStatus } = useOccurrenceStatus()
  const [priorityFilter, setPriorityFilter] = useState('todas')
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const [unitFilter, setUnitFilter] = useState('todas')
  const [modalDefaults, setModalDefaults] = useState<CreateActionDefaults | null>(null)

  function openUnitWithContext(unitName: string, occurrence: Occurrence) {
    const unitId = getUnitIdByName(unitName)
    if (!unitId) return
    navigate(`/unidades/${unitId}`, {
      state: {
        fromOccurrenceId: occurrence.id,
        fromOccurrenceTitulo: occurrence.titulo,
        outrasUnidades: occurrence.unidades.filter((u) => u !== unitName && u !== 'Todas as unidades'),
      },
    })
  }

  const filtered = useMemo(() => {
    return occurrences.filter((o) => {
      if (priorityFilter !== 'todas' && o.prioridade !== priorityFilter) return false
      if (categoryFilter !== 'todas' && o.categoria !== categoryFilter) return false
      if (unitFilter !== 'todas' && !o.unidades.includes(unitFilter) && !o.unidades.includes('Todas as unidades')) return false
      return true
    })
  }, [priorityFilter, categoryFilter, unitFilter])

  return (
    <section ref={sectionRef} id="prioridades-de-hoje">
      <SectionHeader title="Prioridades de hoje" description="Ocorrências ordenadas por impacto e urgência" />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Select aria-label="Prioridade" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} options={priorityOptions} className="w-44" />
        <Select aria-label="Categoria" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} options={categoryOptions} className="w-48" />
        <Select aria-label="Unidade" value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} options={unitFilterOptions} className="w-52" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ListChecks className="h-5 w-5" />} title="Nenhuma ocorrência com esses filtros" description="Ajuste os filtros para ver outras ocorrências do período." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((occ) => (
            <OccurrenceCard
              key={occ.id}
              occurrence={occ}
              status={getStatus(occ.id)}
              onToggleStatus={() => toggleStatus(occ.id)}
              onCreateAction={() =>
                setModalDefaults({
                  titulo: occ.titulo,
                  unidade: occ.unidades[0],
                  prioridade: occ.prioridade === 'media' ? 'media' : occ.prioridade,
                  ocorrenciaId: occ.id,
                })
              }
              onOpenUnit={(unitName) => openUnitWithContext(unitName, occ)}
            />
          ))}
        </div>
      )}

      <CreateActionModal
        isOpen={Boolean(modalDefaults)}
        onClose={() => setModalDefaults(null)}
        defaults={modalDefaults ?? undefined}
        onSave={(action) => {
          onCreateAction(action)
          if (modalDefaults?.ocorrenciaId) markAsAnalyzed(modalDefaults.ocorrenciaId)
        }}
      />
    </section>
  )
}
