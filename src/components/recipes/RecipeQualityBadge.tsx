import { cn } from '@/utils/cn'
import { recipeQualityLabel } from '@/utils/recipeValidation'
import type { RecipeQuality } from '@/types'

const classesByQuality: Record<RecipeQuality, { classes: string; dot: string }> = {
  completa: { classes: 'bg-success-soft text-success', dot: 'bg-success' },
  revisao_recomendada: { classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  incompleta: { classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  bloqueada: { classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  sem_ficha: { classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
}

export function RecipeQualityBadge({ qualidade, className }: { qualidade: RecipeQuality; className?: string }) {
  const c = classesByQuality[qualidade]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap', c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {recipeQualityLabel[qualidade]}
    </span>
  )
}
