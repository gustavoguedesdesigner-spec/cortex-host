import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { financialImpactCategories, financialImpactTotal } from '@/data/financial-impact'
import { units } from '@/data/units'
import { cn } from '@/utils/cn'
import { formatCurrencyBRL, formatCurrencyCompactBRL, formatPercentPoints } from '@/utils/format'

const maxCategoryImpact = Math.max(...financialImpactCategories.map((c) => c.valor))

/** Caxias Norte tem qualidade reduzida devido ao inventário semanal pendente — sinal já publicado em unit-profiles.ts. */
function qualidadeLabel(unitId: string): string {
  return unitId === 'caxias-norte' ? 'Parcial' : 'Boa'
}

export function CmvCategoryUnitImpactSection({ onOpenCategory, onOpenUnit }: { onOpenCategory: (id: string) => void; onOpenUnit: (id: string) => void }) {
  const unitsByImpact = [...units].sort((a, b) => b.impactoFinanceiro - a.impactoFinanceiro)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <SectionHeader title="Onde a margem está sendo perdida" description="Impacto financeiro por categoria de insumo — clique para investigar" />
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface px-4">
          {financialImpactCategories.map((cat, i) => (
            <button key={cat.id} onClick={() => onOpenCategory(cat.id)} className="flex flex-col gap-2 py-3 text-left transition-colors hover:bg-surface-hover">
              <div className="flex items-baseline justify-between gap-3 text-support">
                <span className="font-medium text-ink-primary">{cat.categoria}</span>
                <span className="tabular text-ink-secondary">
                  {formatCurrencyBRL(cat.valor)}
                  <span className="ml-1.5 text-ink-tertiary">{((cat.valor / financialImpactTotal) * 100).toFixed(0)}%</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-subtle">
                  <div className={cn('h-full rounded-full', i === 0 ? 'bg-accent' : 'bg-navy/35')} style={{ width: `${(cat.valor / maxCategoryImpact) * 100}%` }} />
                </div>
                <span className="w-40 shrink-0 truncate text-caption text-ink-tertiary">{cat.unidadePrincipal}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="lg:col-span-5">
        <SectionHeader title="Impacto por unidade" description="Ordenado do maior para o menor impacto" />
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
          {unitsByImpact.map((unit) => {
            const desvio = unit.cmvReal - unit.cmvTeorico
            const qualidade = qualidadeLabel(unit.id)
            return (
              <div key={unit.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-support font-medium text-ink-primary">{unit.nomeCurto}</p>
                    <StatusBadge level={unit.nivelAtencao} />
                  </div>
                  <p className="mt-0.5 text-caption text-ink-tertiary">
                    {formatPercentPoints(desvio)} vs. teórico ·{' '}
                    {qualidade === 'Parcial' ? (
                      <Tooltip content="Inventário semanal pendente — confiabilidade reduzida até a conclusão da contagem.">
                        <span className="cursor-help underline decoration-dotted underline-offset-2">Qualidade {qualidade}</span>
                      </Tooltip>
                    ) : (
                      `Qualidade ${qualidade}`
                    )}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="tabular text-support font-medium text-danger">{formatCurrencyCompactBRL(unit.impactoFinanceiro)}</span>
                  <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => onOpenUnit(unit.id)}>
                    Investigar
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
