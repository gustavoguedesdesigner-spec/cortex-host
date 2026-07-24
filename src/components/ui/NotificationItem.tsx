import { OctagonAlert, TriangleAlert, CircleCheckBig, Info } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { NotificationItemData, NotificationSeverity } from '@/types'
import { formatRelativeShort } from '@/utils/format'

const severityConfig: Record<NotificationSeverity, { icon: typeof Info; classes: string }> = {
  critical: { icon: OctagonAlert, classes: 'text-status-critical bg-status-criticalBg' },
  attention: { icon: TriangleAlert, classes: 'text-status-attention bg-status-attentionBg' },
  info: { icon: Info, classes: 'text-status-info bg-status-infoBg' },
  success: { icon: CircleCheckBig, classes: 'text-status-success bg-status-successBg' },
}

export function NotificationItem({ data, onClick }: { data: NotificationItemData; onClick?: () => void }) {
  const { icon: Icon, classes } = severityConfig[data.severidade]

  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 px-4 py-3.5 text-left border-b border-border-subtle last:border-b-0 hover:bg-surface-4 transition-colors"
    >
      <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full', classes)}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2">
          <span className={cn('text-support font-semibold text-content-primary', !data.lida && 'pr-1.5')}>{data.titulo}</span>
          {!data.lida && <span className="h-1.5 w-1.5 rounded-full bg-cortex-500 shrink-0" aria-label="Não lida" />}
        </span>
        <span className="block text-support text-content-secondary mt-0.5 line-clamp-2">{data.descricao}</span>
        <span className="flex items-center gap-2 mt-1.5 text-caption text-content-tertiary">
          {data.unidade && <span>{data.unidade}</span>}
          {data.unidade && <span aria-hidden="true">•</span>}
          <span>{formatRelativeShort(data.horario)}</span>
        </span>
      </span>
    </button>
  )
}
