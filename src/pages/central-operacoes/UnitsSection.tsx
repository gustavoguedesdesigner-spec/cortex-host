import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { UnitStatusCard } from '@/components/data-display/UnitStatusCard'
import { UnitsTable } from '@/components/data-display/UnitsTable'
import { getUnidadesOrdenadasPorCriticidade } from '@/data/units'
import type { Unit } from '@/types'

const unidadesOrdenadas = getUnidadesOrdenadasPorCriticidade()

export function UnitsSection() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'cards' | 'tabela'>('cards')

  function openUnit(unit: Unit) {
    navigate(`/unidades/${unit.id}`)
  }

  return (
    <section>
      <SectionHeader
        title="Situação das unidades"
        description="Ordenadas da situação mais crítica para a mais saudável"
        actions={
          <SegmentedControl
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: 'cards', label: 'Cards' },
              { value: 'tabela', label: 'Tabela' },
            ]}
          />
        }
      />

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {unidadesOrdenadas.map((unit) => (
            <UnitStatusCard key={unit.id} unit={unit} onClick={() => openUnit(unit)} />
          ))}
        </div>
      ) : (
        <UnitsTable units={unidadesOrdenadas} onSelectUnit={openUnit} />
      )}
    </section>
  )
}
