import { useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { activityEvents } from '@/data/activity'
import { formatRelativeShort } from '@/utils/format'

export function ActivitySection() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? activityEvents : activityEvents.slice(0, 6)

  return (
    <section>
      <SectionHeader
        title="Atividade recente"
        description="Últimos eventos relevantes da operação"
        actions={
          !showAll && activityEvents.length > 6 ? (
            <Button size="sm" variant="ghost" onClick={() => setShowAll(true)}>
              Ver histórico completo
            </Button>
          ) : undefined
        }
      />
      <ul className="flex flex-col divide-y divide-border border-t border-border">
        {visible.map((event) => {
          const Icon = event.icon
          return (
            <li key={event.id} className="flex items-center justify-between gap-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Icon className="h-4 w-4 shrink-0 text-ink-tertiary" strokeWidth={1.7} />
                <p className="truncate text-support text-ink-secondary">
                  <span className="font-medium text-ink-primary">{event.usuario}</span> {event.acao}
                  {event.unidade && <span className="text-ink-tertiary"> · {event.unidade}</span>}
                </p>
              </div>
              <span className="shrink-0 text-caption text-ink-tertiary">{formatRelativeShort(event.horario)}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
