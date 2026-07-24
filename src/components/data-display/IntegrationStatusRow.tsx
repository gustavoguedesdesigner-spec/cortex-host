import { CircleCheckBig, Clock } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { IntegrationStatusItem } from '@/types'

export function IntegrationStatusRow({ items, className }: { items: IntegrationStatusItem[]; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {items.map((item) => {
        const ok = item.estado === 'atualizado'
        return (
          <span
            key={item.nome}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption font-medium',
              ok ? 'border-status-success/30 bg-status-successBg text-status-success' : 'border-status-attention/30 bg-status-attentionBg text-status-attention',
            )}
          >
            {ok ? <CircleCheckBig className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {item.nome}
            {item.detalhe && <span className="opacity-80">· {item.detalhe}</span>}
          </span>
        )
      })}
    </div>
  )
}
