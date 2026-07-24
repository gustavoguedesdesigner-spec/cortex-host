import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import type { AttentionLevel, IndicatorStatus } from '@/types'

const base = 'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap'

const attentionConfig: Record<AttentionLevel, { label: string; classes: string; dot: string }> = {
  saudavel: { label: 'Saudável', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  atencao: { label: 'Atenção', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  critico: { label: 'Crítico', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
}

const indicatorConfig: Record<IndicatorStatus, { classes: string; dot: string }> = {
  success: { classes: 'bg-success-soft text-success', dot: 'bg-success' },
  attention: { classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  critical: { classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  info: { classes: 'bg-info-soft text-info', dot: 'bg-info' },
  neutral: { classes: 'bg-surface-subtle text-ink-secondary', dot: 'bg-ink-tertiary' },
}

/** Status nunca comunicado só por cor: sempre ponto + texto. */
export function StatusBadge({ level, className }: { level: AttentionLevel; className?: string }) {
  const c = attentionConfig[level]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}

export function IndicatorBadge({ status, children, className }: { status: IndicatorStatus; children: ReactNode; className?: string }) {
  const c = indicatorConfig[status]
  return (
    <span className={cn(base, c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {children}
    </span>
  )
}
