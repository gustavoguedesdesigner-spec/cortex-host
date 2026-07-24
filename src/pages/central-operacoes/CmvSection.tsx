import { useMemo, useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { CmvWeeklyChart } from '@/components/data-display/CmvWeeklyChart'
import { CortexMark } from '@/components/cortex/CortexMark'
import { cmvWeeklySeriesConsolidado, cmvMeta, getCmvWeeklySeriesForUnit } from '@/data/cmv-weekly-series'
import { cortexCmvUnderstandingText } from '@/data/executive-summary'
import { units, getUnitById } from '@/data/units'
import { ALL_UNITS_ID } from '@/context/AppStateContext'

const unitOptions = [{ value: ALL_UNITS_ID, label: 'Rede consolidada' }, ...units.map((u) => ({ value: u.id, label: u.nome }))]

interface CmvSectionProps {
  onOpenFullAnalysis: () => void
}

export function CmvSection({ onOpenFullAnalysis }: CmvSectionProps) {
  const [selectedUnitId, setSelectedUnitId] = useState(ALL_UNITS_ID)

  const data = useMemo(() => {
    if (selectedUnitId === ALL_UNITS_ID) return cmvWeeklySeriesConsolidado
    const unit = getUnitById(selectedUnitId)
    return unit ? getCmvWeeklySeriesForUnit(unit) : cmvWeeklySeriesConsolidado
  }, [selectedUnitId])

  return (
    <section>
      <SectionHeader
        title="CMV teórico versus CMV real"
        description="Últimas 8 semanas — comparação com a meta da rede"
        actions={
          <Select
            aria-label="Selecionar unidade"
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            options={unitOptions}
            className="w-48"
          />
        }
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CmvWeeklyChart data={data} meta={cmvMeta} />
        </Card>
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cortex-900/60 text-cortex-400">
              <CortexMark className="h-4 w-4" />
            </span>
            <p className="text-card-title text-content-primary">Entendimento do CORTEX</p>
          </div>
          <p className="text-support text-content-secondary leading-relaxed flex-1">{cortexCmvUnderstandingText}</p>
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="primary" leftIcon={<Search className="h-3.5 w-3.5" />} onClick={onOpenFullAnalysis}>
              Abrir análise completa
            </Button>
            <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={onOpenFullAnalysis}>
              Ver produtos envolvidos
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
