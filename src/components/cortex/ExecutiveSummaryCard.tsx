import type { ReactNode } from 'react'
import { ArrowRight, ClipboardList, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CortexLabel } from './CortexButton'

interface ExecutiveSummaryCardProps {
  text: string
  recommendations: string[]
  onAnalyzeCauses: () => void
  onViewActionPlan: () => void
  onAskCortex: () => void
  aside?: React.ReactNode
  /** Rótulo e ícone do botão primário — padrão mantém o texto usado em CMV/Estoque/Fichas Técnicas/Administração. */
  primaryLabel?: string
  primaryIcon?: ReactNode
  secondaryLabel?: string
  secondaryIcon?: ReactNode
  /** Botões adicionais após "Perguntar ao CORTEX" — usado quando o módulo precisa de uma quarta ação rápida. */
  extraActions?: ReactNode
}

/**
 * Resumo executivo: superfície clara e horizontal (8 + 4 colunas),
 * integrada à página — sem card escuro destacado do resto do produto.
 */
export function ExecutiveSummaryCard({
  text,
  recommendations,
  onAnalyzeCauses,
  onViewActionPlan,
  onAskCortex,
  aside,
  primaryLabel = 'Analisar causas',
  primaryIcon = <Search className="h-3.5 w-3.5" strokeWidth={1.7} />,
  secondaryLabel = 'Ver plano de ação',
  secondaryIcon = <ClipboardList className="h-3.5 w-3.5" strokeWidth={1.7} />,
  extraActions,
}: ExecutiveSummaryCardProps) {
  return (
    <section className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border shadow-card lg:grid-cols-12">
      <div className="flex flex-col gap-4 bg-surface p-5 lg:col-span-8 lg:p-6">
        <CortexLabel>Resumo executivo do CORTEX</CortexLabel>
        <p className="max-w-3xl text-body leading-relaxed text-ink-secondary">{text}</p>

        <ol className="flex flex-col divide-y divide-border border-t border-border">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-baseline gap-3 py-2.5">
              <span className="text-caption tabular text-ink-tertiary">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-support text-ink-primary">{rec}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="primary" leftIcon={primaryIcon} onClick={onAnalyzeCauses}>
            {primaryLabel}
          </Button>
          <Button size="sm" variant="secondary" leftIcon={secondaryIcon} onClick={onViewActionPlan}>
            {secondaryLabel}
          </Button>
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onAskCortex}>
            Perguntar ao CORTEX
          </Button>
          {extraActions}
        </div>
      </div>

      {aside && <div className="bg-surface p-5 lg:col-span-4 lg:p-6">{aside}</div>}
    </section>
  )
}
