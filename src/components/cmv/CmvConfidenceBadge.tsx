import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/utils/cn'
import { confidenceLabel } from '@/utils/cmvConfidence'
import type { CmvConfidenceLevel } from '@/types'

const classesByLevel: Record<CmvConfidenceLevel, string> = {
  alta: 'bg-success-soft text-success border-success/30',
  media: 'bg-warning-soft text-warning border-warning/30',
  baixa: 'bg-surface-subtle text-ink-tertiary border-border-strong/30',
  insuficiente: 'bg-danger-soft text-danger border-danger/30',
}

/**
 * Nível de confiança padronizado do módulo de CMV — nunca comunicado
 * apenas por cor (texto + tooltip com a justificativa).
 */
export function CmvConfidenceBadge({ nivel, justificativa, className }: { nivel: CmvConfidenceLevel; justificativa?: string; className?: string }) {
  const badge = (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-badge whitespace-nowrap', classesByLevel[nivel], className)}>
      {confidenceLabel[nivel]}
    </span>
  )
  if (!justificativa) return badge
  return (
    <Tooltip content={justificativa}>
      <span className="cursor-help">{badge}</span>
    </Tooltip>
  )
}
