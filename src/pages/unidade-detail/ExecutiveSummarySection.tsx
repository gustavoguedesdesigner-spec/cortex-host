import { ClipboardList, Eye, Percent, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CortexMark } from '@/components/cortex/CortexMark'
import type { UnitProfile } from '@/types'

interface ExecutiveSummarySectionProps {
  profile: UnitProfile
  onCreatePlan: () => void
  onAnalyzeCmv: () => void
  onViewEvidence: () => void
  onAskCortex: () => void
}

export function ExecutiveSummarySection({ profile, onCreatePlan, onAnalyzeCmv, onViewEvidence, onAskCortex }: ExecutiveSummarySectionProps) {
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
          <h2 className="text-card-title text-content-primary">Entendimento do CORTEX</h2>
        </div>

        <p className="text-body text-content-secondary leading-relaxed max-w-3xl">{profile.resumoExecutivo}</p>

        {profile.causasProvaveis && (
          <div>
            <p className="text-label text-content-tertiary mb-2">Principais causas prováveis</p>
            <ol className="flex flex-col gap-1.5">
              {profile.causasProvaveis.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5 text-support text-content-secondary">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cortex-900/70 text-cortex-300 text-caption font-semibold mt-0.5">
                    {i + 1}
                  </span>
                  {c}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button size="sm" variant="primary" leftIcon={<ClipboardList className="h-3.5 w-3.5" />} onClick={onCreatePlan}>
            Criar plano de ação
          </Button>
          <Button size="sm" variant="secondary" leftIcon={<Percent className="h-3.5 w-3.5" />} onClick={onAnalyzeCmv}>
            Analisar CMV
          </Button>
          <Button size="sm" variant="secondary" leftIcon={<Eye className="h-3.5 w-3.5" />} onClick={onViewEvidence}>
            Ver evidências
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" />} onClick={onAskCortex}>
            Perguntar ao CORTEX
          </Button>
        </div>
      </div>
    </div>
  )
}
