import type { ReactNode } from 'react'
import { CircleCheckBig, TriangleAlert, OctagonAlert, Info, Circle } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { AttentionLevel, IndicatorStatus } from '@/types'

const attentionConfig: Record<AttentionLevel, { label: string; icon: ReactNode; classes: string }> = {
  saudavel: {
    label: 'Saudável',
    icon: <CircleCheckBig className="h-3 w-3" />,
    classes: 'bg-status-successBg text-status-success border-status-success/30',
  },
  atencao: {
    label: 'Atenção',
    icon: <TriangleAlert className="h-3 w-3" />,
    classes: 'bg-status-attentionBg text-status-attention border-status-attention/30',
  },
  critico: {
    label: 'Crítico',
    icon: <OctagonAlert className="h-3 w-3" />,
    classes: 'bg-status-criticalBg text-status-critical border-status-critical/30',
  },
}

const indicatorConfig: Record<IndicatorStatus, { icon: ReactNode; classes: string }> = {
  success: { icon: <CircleCheckBig className="h-3 w-3" />, classes: 'bg-status-successBg text-status-success border-status-success/30' },
  attention: { icon: <TriangleAlert className="h-3 w-3" />, classes: 'bg-status-attentionBg text-status-attention border-status-attention/30' },
  critical: { icon: <OctagonAlert className="h-3 w-3" />, classes: 'bg-status-criticalBg text-status-critical border-status-critical/30' },
  info: { icon: <Info className="h-3 w-3" />, classes: 'bg-status-infoBg text-status-info border-status-info/30' },
  neutral: { icon: <Circle className="h-3 w-3" />, classes: 'bg-status-neutralBg text-status-neutral border-status-neutral/30' },
}

export function StatusBadge({ level, className }: { level: AttentionLevel; className?: string }) {
  const config = attentionConfig[level]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-badge',
        config.classes,
        className,
      )}
    >
      {config.icon}
      {config.label}
    </span>
  )
}

export function IndicatorBadge({
  status,
  children,
  className,
}: {
  status: IndicatorStatus
  children: ReactNode
  className?: string
}) {
  const config = indicatorConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-badge',
        config.classes,
        className,
      )}
    >
      {config.icon}
      {children}
    </span>
  )
}
