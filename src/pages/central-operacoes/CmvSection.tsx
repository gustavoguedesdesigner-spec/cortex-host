import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { CmvWeeklyChart } from '@/components/data-display/CmvWeeklyChart'
import { CortexLabel } from '@/components/cortex/CortexButton'
import { cmvWeeklySeriesConsolidado, cmvMeta, getCmvWeeklySeriesForUnit } from '@/data/cmv-weekly-series'
import { cortexCmvUnderstandingText } from '@/data/executive-summary'
import { units, getUnitById } from '@/data/units'
import { ALL_UNITS_ID } from '@/context/AppStateContext'

const unitOptions = [{ value: ALL_UNITS_ID, label: 'Rede consolidada' }, ...units.map((u) => ({ value: u.id, label: u.nomeCurto }))]

export function CmvSection({ onOpenFullAnalysis }: { onOpenFullAnalysis: () => void }) {
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
            className="w-44"
          />
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-lg border border-border bg-surface p-5 lg:col-span-8">
          <CmvWeeklyChart data={data} meta={cmvMeta} />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <CortexLabel>Entendimento do CORTEX</CortexLabel>
          <p className="flex-1 text-support leading-relaxed text-ink-secondary">{cortexCmvUnderstandingText}</p>
          <div className="flex flex-col items-start gap-1 border-t border-border pt-4">
            <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onOpenFullAnalysis}>
              Abrir análise completa
            </Button>
            <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onOpenFullAnalysis}>
              Ver produtos envolvidos
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
