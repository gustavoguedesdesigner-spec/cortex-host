import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { activityEvents } from '@/data/activity'
import { formatRelativeShort } from '@/utils/format'

export function ActivitySection() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? activityEvents : activityEvents.slice(0, 6)

  return (
    <section>
      <SectionHeader title="Atividade recente" description="Últimos eventos relevantes da operação" />
      <Card padded={false}>
        <ul className="flex flex-col divide-y divide-border-subtle">
          {visible.map((event) => {
            const Icon = event.icon
            return (
              <li key={event.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-3 text-content-tertiary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-support text-content-secondary truncate">
                    <span className="font-medium text-content-primary">{event.usuario}</span> {event.acao}
                    {event.unidade && <span className="text-content-tertiary"> · {event.unidade}</span>}
                  </p>
                </div>
                <span className="text-caption text-content-tertiary shrink-0">{formatRelativeShort(event.horario)}</span>
              </li>
            )
          })}
        </ul>
        {!showAll && activityEvents.length > 6 && (
          <div className="border-t border-border-subtle px-4 py-3">
            <Button size="sm" variant="ghost" onClick={() => setShowAll(true)}>
              Ver histórico completo
            </Button>
          </div>
        )}
      </Card>
    </section>
  )
}
