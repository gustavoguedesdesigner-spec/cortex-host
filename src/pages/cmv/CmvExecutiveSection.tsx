import { Eye, Search } from 'lucide-react'
import { ExecutiveSummaryCard } from '@/components/cortex/ExecutiveSummaryCard'
import { Button } from '@/components/ui/Button'
import { cmvExecutiveExplanations, cmvExecutiveRecommendation, cmvExecutiveSummaryText } from '@/data/cmv/cmvPeriod'
import { dataQualityLabel } from '@/utils/cmvConfidence'
import { formatPercent } from '@/utils/format'
import type { DataQualityInfo } from '@/types'

export function CmvExecutiveSection({
  quality,
  onInvestigarCausas,
  onVerEvidencias,
  onCriarPlano,
  onAskCortex,
}: {
  quality: DataQualityInfo
  onInvestigarCausas: () => void
  onVerEvidencias: () => void
  onCriarPlano: () => void
  onAskCortex: () => void
}) {
  return (
    <ExecutiveSummaryCard
      text={cmvExecutiveSummaryText}
      recommendations={cmvExecutiveExplanations}
      onAnalyzeCauses={onInvestigarCausas}
      onViewActionPlan={onCriarPlano}
      onAskCortex={onAskCortex}
      aside={
        <div className="flex h-full flex-col gap-4">
          <div>
            <p className="text-caption text-ink-tertiary">Qualidade dos dados</p>
            <p className="mt-1 text-metric-sm tabular text-ink-primary">
              {formatPercent(quality.percentual, 0)} <span className="text-support text-ink-tertiary">— {dataQualityLabel[quality.classificacao]}</span>
            </p>
          </div>
          <div>
            <p className="mb-1 text-label text-ink-tertiary">Pendências</p>
            <ul className="flex flex-col gap-1 text-support text-ink-secondary list-disc list-inside">
              {quality.pendencias.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="mt-auto flex flex-col gap-2 border-t border-border pt-3">
            <p className="text-caption text-ink-tertiary">Recomendação principal</p>
            <p className="text-support text-ink-secondary leading-relaxed">{cmvExecutiveRecommendation}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" variant="secondary" leftIcon={<Eye className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onVerEvidencias}>
                Ver evidências
              </Button>
              <Button size="sm" variant="ghost" leftIcon={<Search className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onInvestigarCausas}>
                Investigar causas
              </Button>
            </div>
          </div>
        </div>
      }
    />
  )
}
