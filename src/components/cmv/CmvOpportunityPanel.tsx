import { useState } from 'react'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { formatCurrencyBRL } from '@/utils/format'
import { calcularRecuperacaoPotencial } from '@/utils/cmvCalculations'
import { cmvOpportunityDisclaimer } from '@/data/cmv/cmvPeriod'

type Cenario = '25' | '50' | 'meta'

const cenarioOptions: { value: Cenario; label: string }[] = [
  { value: '25', label: 'Reduzir 25% do desvio' },
  { value: '50', label: 'Reduzir 50% do desvio' },
  { value: 'meta', label: 'Aproximar da meta' },
]

/**
 * "Potencial de recuperação" — nunca promete economia garantida.
 * desvioVsTeorico alimenta os cenários 25%/50%; impactoVsMeta alimenta
 * o cenário "aproximar da meta".
 */
export function CmvOpportunityPanel({ desvioVsTeorico, impactoVsMeta }: { desvioVsTeorico: number; impactoVsMeta: number }) {
  const [cenario, setCenario] = useState<Cenario>('meta')

  const valor = cenario === '25' ? calcularRecuperacaoPotencial(desvioVsTeorico, 0.25) : cenario === '50' ? calcularRecuperacaoPotencial(desvioVsTeorico, 0.5) : impactoVsMeta

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-6">
      <p className="text-card-title text-ink-primary">Potencial de recuperação</p>
      <SegmentedControl value={cenario} onChange={setCenario} options={cenarioOptions} className="self-start" />
      <p className="text-metric-sm tabular text-ink-primary">{formatCurrencyBRL(valor)}</p>
      <p className="text-caption text-ink-tertiary">no período selecionado</p>
      <p className="text-caption text-ink-tertiary border-t border-border pt-3">{cmvOpportunityDisclaimer}</p>
    </div>
  )
}
