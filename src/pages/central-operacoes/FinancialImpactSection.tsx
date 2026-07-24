import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { FinancialImpactBars } from '@/components/data-display/FinancialImpactBars'
import { financialImpactCategories, financialImpactTotal } from '@/data/financial-impact'
import { formatCurrencyBRL } from '@/utils/format'

export function FinancialImpactSection({ onViewDetails }: { onViewDetails: () => void }) {
  const top = [...financialImpactCategories].sort((a, b) => b.valor - a.valor)[0]

  return (
    <section>
      <SectionHeader
        title="Onde a margem está sendo perdida"
        description="Composição do impacto financeiro por categoria de insumo"
        actions={
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onViewDetails}>
            Ver detalhes
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <FinancialImpactBars categories={financialImpactCategories} total={financialImpactTotal} />
        </div>
        <div className="flex flex-col gap-5 lg:col-span-4 lg:col-start-9">
          <div>
            <p className="text-caption text-ink-tertiary">Total no período</p>
            <p className="mt-1 text-metric tabular text-ink-primary">{formatCurrencyBRL(financialImpactTotal)}</p>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-caption text-ink-tertiary">Maior contribuição</p>
            <p className="mt-1 text-card-title">{top.categoria}</p>
            <p className="text-caption text-ink-tertiary">{top.unidadePrincipal}</p>
          </div>
          <p className="border-t border-border pt-4 text-caption leading-relaxed text-ink-tertiary">
            Impacto estimado com base na diferença entre consumo real e consumo teórico no período.
          </p>
        </div>
      </div>
    </section>
  )
}
