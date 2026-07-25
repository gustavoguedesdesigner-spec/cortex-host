import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/utils/cn'
import { inventoryConfidenceLabel } from '@/utils/inventoryConfidence'
import type { InventoryConfidenceLevel } from '@/types'

const classesByLevel: Record<InventoryConfidenceLevel, string> = {
  alta: 'bg-success-soft text-success border-success/30',
  media: 'bg-warning-soft text-warning border-warning/30',
  baixa: 'bg-surface-subtle text-ink-tertiary border-border-strong/30',
  insuficiente: 'bg-danger-soft text-danger border-danger/30',
}

export function InventoryConfidenceBadge({ nivel, motivos, className }: { nivel: InventoryConfidenceLevel; motivos?: string[]; className?: string }) {
  const badge = (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-badge whitespace-nowrap', classesByLevel[nivel], className)}>
      {inventoryConfidenceLabel[nivel]}
    </span>
  )
  if (!motivos || motivos.length === 0) return badge
  return (
    <Tooltip content={motivos.join(' · ')}>
      <span className="cursor-help">{badge}</span>
    </Tooltip>
  )
}
