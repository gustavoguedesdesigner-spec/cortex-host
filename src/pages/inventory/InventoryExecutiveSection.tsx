import { Eye, Search } from 'lucide-react'
import { ExecutiveSummaryCard } from '@/components/cortex/ExecutiveSummaryCard'
import { Button } from '@/components/ui/Button'
import { formatPercent } from '@/utils/format'
import { inventoryAccuracy, inventoryExecutiveRecommendations, inventoryExecutiveSummaryText, inventorySituation } from '@/data/inventory/inventorySummary'

export function InventoryExecutiveSection({
  onVerDivergencias,
  onVerCriticos,
  onCriarPlano,
  onAskCortex,
}: {
  onVerDivergencias: () => void
  onVerCriticos: () => void
  onCriarPlano: () => void
  onAskCortex: () => void
}) {
  return (
    <ExecutiveSummaryCard
      text={inventoryExecutiveSummaryText}
      recommendations={inventoryExecutiveRecommendations}
      onAnalyzeCauses={onVerCriticos}
      onViewActionPlan={onCriarPlano}
      onAskCortex={onAskCortex}
      aside={
        <div className="flex h-full flex-col gap-4">
          <div>
            <p className="text-caption text-ink-tertiary">Acuracidade consolidada</p>
            <p className="mt-1 text-metric-sm tabular text-ink-primary">
              {formatPercent(inventoryAccuracy.percentual, 1)} <span className="text-support text-ink-tertiary">— Boa</span>
            </p>
            <p className="mt-0.5 text-caption text-ink-tertiary">Meta: {formatPercent(inventoryAccuracy.meta, 0)}</p>
          </div>
          <div>
            <p className="mb-1 text-label text-ink-tertiary">Situação consolidada</p>
            <ul className="flex flex-col gap-1 text-support text-ink-secondary">
              <li>{inventorySituation.inventariosPendentesOuAtrasados} inventários pendentes ou atrasados</li>
              <li>{inventorySituation.transferenciasEmTransito} transferências em trânsito</li>
              <li>{inventorySituation.transferenciasDivergentes} transferências divergentes</li>
            </ul>
          </div>
          <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-3">
            <Button size="sm" variant="secondary" leftIcon={<Eye className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onVerDivergencias}>
              Ver divergências
            </Button>
            <Button size="sm" variant="ghost" leftIcon={<Search className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onVerCriticos}>
              Ver itens críticos
            </Button>
          </div>
        </div>
      }
    />
  )
}
