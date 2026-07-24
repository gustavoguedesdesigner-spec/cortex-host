import { ClipboardList, Eye, Percent, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CortexLabel } from '@/components/cortex/CortexButton'
import type { UnitProfile } from '@/types'

export function ExecutiveSummarySection({
  profile,
  onCreatePlan,
  onAnalyzeCmv,
  onViewEvidence,
  onAskCortex,
  aside,
}: {
  profile: UnitProfile
  onCreatePlan: () => void
  onAnalyzeCmv: () => void
  onViewEvidence: () => void
  onAskCortex: () => void
  aside?: React.ReactNode
}) {
  return (
    <section className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border shadow-card lg:grid-cols-12">
      <div className="flex flex-col gap-4 bg-surface p-5 lg:col-span-8 lg:p-6">
        <CortexLabel>Entendimento do CORTEX</CortexLabel>
        <p className="max-w-3xl text-body leading-relaxed text-ink-secondary">{profile.resumoExecutivo}</p>

        {profile.causasProvaveis && (
          <div>
            <p className="mb-1 text-label text-ink-tertiary">Principais causas prováveis</p>
            <ol className="flex flex-col divide-y divide-border border-t border-border">
              {profile.causasProvaveis.map((c, i) => (
                <li key={i} className="flex items-baseline gap-3 py-2.5">
                  <span className="text-caption tabular text-ink-tertiary">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-support text-ink-primary">{c}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="primary" leftIcon={<ClipboardList className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onCreatePlan}>
            Criar plano de ação
          </Button>
          <Button size="sm" variant="secondary" leftIcon={<Percent className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onAnalyzeCmv}>
            Analisar CMV
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Eye className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onViewEvidence}>
            Ver evidências
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onAskCortex}>
            Perguntar ao CORTEX
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-surface p-5 lg:col-span-4 lg:p-6">
        {aside}
        <div>
          <p className="mb-1 text-label text-ink-tertiary">Recomendações</p>
          <ul className="flex flex-col divide-y divide-border border-t border-border">
            {profile.recomendacoes.map((r, i) => (
              <li key={i} className="py-2.5 text-support text-ink-secondary">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
