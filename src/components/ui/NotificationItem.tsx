import { cn } from '@/utils/cn'
import type { NotificationItemData, NotificationSeverity } from '@/types'
import { formatRelativeShort } from '@/utils/format'

const dotBySeverity: Record<NotificationSeverity, string> = {
  critical: 'bg-danger',
  attention: 'bg-warning',
  info: 'bg-info',
  success: 'bg-success',
}

export function NotificationItem({ data, onClick }: { data: NotificationItemData; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface-hover"
    >
      <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', dotBySeverity[data.severidade])} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-support font-medium text-ink-primary">{data.titulo}</span>
          {!data.lida && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-label="Não lida" />}
        </span>
        <span className="mt-0.5 block line-clamp-2 text-support text-ink-secondary">{data.descricao}</span>
        <span className="mt-1 flex items-center gap-2 text-caption text-ink-tertiary">
          {data.unidade && <span>{data.unidade}</span>}
          {data.unidade && <span aria-hidden="true">·</span>}
          <span>{formatRelativeShort(data.horario)}</span>
        </span>
      </span>
    </button>
  )
}
