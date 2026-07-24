import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { FinancialImpactBars } from '@/components/data-display/FinancialImpactBars'
import { financialImpactCategories, financialImpactTotal } from '@/data/financial-impact'
import { formatCurrencyBRL } from '@/utils/format'

export function FinancialImpactSection({ onViewDetails }: { onViewDetails: () => void }) {
  const top = [...financialImpactCategories].sort((a, b) => b.valor - a.valor)[0]

  return (
    <section>
      <SectionHeader title="Onde a margem está sendo perdida" description="Composição do impacto financeiro por categoria de insumo" />
      <Card className="flex flex-col gap-5 sm:flex-row sm:gap-8">
        <div className="flex-1 min-w-0">
          <FinancialImpactBars categories={financialImpactCategories} total={financialImpactTotal} />
        </div>
        <div className="flex flex-col gap-4 sm:w-56 shrink-0 sm:border-l sm:border-border-subtle sm:pl-6">
          <div>
            <p className="text-caption text-content-tertiary">Total no período</p>
            <p className="text-metric-sm font-display text-content-primary mt-1">{formatCurrencyBRL(financialImpactTotal)}</p>
          </div>
          <div>
            <p className="text-caption text-content-tertiary">Maior contribuição</p>
            <p className="text-support text-content-primary font-medium mt-1">{top.categoria}</p>
            <p className="text-caption text-content-tertiary mt-0.5">{top.unidadePrincipal}</p>
          </div>
          <p className="text-caption text-content-tertiary leading-relaxed">
            Impacto estimado com base na diferença entre consumo real e consumo teórico no período.
          </p>
          <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={onViewDetails}>
            Ver detalhes
          </Button>
        </div>
      </Card>
    </section>
  )
}
