import { ArrowRight, Search, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CortexMark } from './CortexMark'

interface ExecutiveSummaryCardProps {
  text: string
  recommendations: string[]
  onAnalyzeCauses: () => void
  onViewActionPlan: () => void
  onAskCortex: () => void
}

export function ExecutiveSummaryCard({ text, recommendations, onAnalyzeCauses, onViewActionPlan, onAskCortex }: ExecutiveSummaryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-cortex-700/30 bg-gradient-to-br from-surface-2 to-surface-1 p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: 'radial-gradient(circle, #C2793D 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cortex-900/60 text-cortex-400">
            <CortexMark className="h-[1.125rem] w-[1.125rem]" animated />
          </span>
          <div>
            <h2 className="text-card-title text-content-primary leading-tight">Resumo executivo do CORTEX</h2>
            <p className="text-caption text-content-tertiary">Gerado automaticamente a partir da operação de hoje</p>
          </div>
        </div>

        <p className="text-body text-content-secondary leading-relaxed max-w-3xl">{text}</p>

        <div className="grid gap-2 sm:grid-cols-3">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-md bg-surface-3/60 border border-border-subtle px-3.5 py-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cortex-900/70 text-cortex-300 text-caption font-semibold">
                {i + 1}
              </span>
              <span className="text-support text-content-secondary leading-snug">{rec}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button size="sm" variant="primary" leftIcon={<Search className="h-3.5 w-3.5" />} onClick={onAnalyzeCauses}>
            Analisar causas
          </Button>
          <Button size="sm" variant="secondary" leftIcon={<ClipboardList className="h-3.5 w-3.5" />} onClick={onViewActionPlan}>
            Ver plano de ação
          </Button>
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={onAskCortex}>
            Perguntar ao CORTEX
          </Button>
        </div>
      </div>
    </div>
  )
}
