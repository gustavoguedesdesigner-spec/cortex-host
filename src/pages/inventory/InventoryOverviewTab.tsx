import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { InventoryExecutiveSection } from './InventoryExecutiveSection'
import { InventoryIndicatorsStrip } from './InventoryIndicatorsStrip'
import { InventoryCategoryComposition } from '@/components/inventory/InventoryCategoryComposition'
import { InventoryHealthSection } from './InventoryHealthSection'
import { InventoryCoverageSection } from './InventoryCoverageSection'
import { InventoryCmvImpactSection } from './InventoryCmvImpactSection'
import { InventoryOverstockSection } from './InventoryOverstockSection'
import { inventoryCategorySummaries, inventoryCategoryTotal } from '@/data/inventory/inventorySummary'
import { useAppState } from '@/context/AppStateContext'
import type { InventoryItemStatus } from '@/types'

export function InventoryOverviewTab() {
  const navigate = useNavigate()
  const { askCortex } = useAppState()

  function goToPosition(filtro: string) {
    navigate(`/estoque?tab=posicao&status=${filtro}`)
  }

  return (
    <div className="flex flex-col gap-8">
      <InventoryExecutiveSection
        onVerDivergencias={() => goToPosition('divergentes')}
        onVerCriticos={() => goToPosition('risco_ruptura')}
        onCriarPlano={() => goToPosition('abaixo_minimo')}
        onAskCortex={() => askCortex('Quais itens estão em risco de ruptura?', 'Estoque consolidado')}
      />

      <InventoryIndicatorsStrip onSelect={goToPosition} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <SectionHeader title="Composição do estoque" description="Valor por categoria de insumo" />
          <InventoryCategoryComposition categories={inventoryCategorySummaries} total={inventoryCategoryTotal} onSelectCategory={(id) => navigate(`/estoque?tab=posicao&category=${id}`)} />
        </section>
        <section className="lg:col-span-5">
          <InventoryHealthSection onSelectStatus={(status: InventoryItemStatus) => goToPosition(status)} />
        </section>
      </div>

      <InventoryCoverageSection />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <InventoryCmvImpactSection />
        </div>
        <div className="lg:col-span-5">
          <InventoryOverstockSection />
        </div>
      </div>
    </div>
  )
}
