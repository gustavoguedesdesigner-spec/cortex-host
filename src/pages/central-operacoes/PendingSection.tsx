import { useMemo, useState, type RefObject } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { EmptyState } from '@/components/ui/EmptyState'
import { ListTodo } from 'lucide-react'
import { pendingItems } from '@/data/pending-items'
import { cn } from '@/utils/cn'
import type { CreatedAction, PendingBucket, PendingItem } from '@/types'

type FilterId = 'minhas' | 'todas' | 'atrasada' | 'hoje' | 'esta_semana'

const filterOptions: { value: FilterId; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'minhas', label: 'Minhas' },
  { value: 'atrasada', label: 'Atrasadas' },
  { value: 'hoje', label: 'Hoje' },
  { value: 'esta_semana', label: 'Semana' },
]

const priorityDot = { alta: 'bg-danger', media: 'bg-warning', baixa: 'bg-ink-tertiary' } as const

function createdActionToPendingItem(action: CreatedAction): PendingItem {
  const bucket: PendingBucket = /hoje/i.test(action.prazo) ? 'hoje' : 'esta_semana'
  return {
    id: action.id,
    tipo: action.titulo,
    unidade: action.unidade,
    responsavel: action.responsavel,
    prazoLabel: action.prazo,
    bucket,
    prioridade: action.prioridade === 'critica' ? 'alta' : action.prioridade,
    acaoRapida: 'Ver ação',
    minha: true,
  }
}

export function PendingSection({ createdActions, sectionRef }: { createdActions: CreatedAction[]; sectionRef?: RefObject<HTMLElement> }) {
  const [filter, setFilter] = useState<FilterId>('todas')
  const allItems = useMemo(() => [...createdActions.map(createdActionToPendingItem), ...pendingItems], [createdActions])

  const filtered = useMemo(
    () =>
      allItems.filter((item) => {
        if (filter === 'minhas') return item.minha
        if (filter === 'atrasada' || filter === 'hoje' || filter === 'esta_semana') return item.bucket === filter
        return true
      }),
    [allItems, filter],
  )

  return (
    <section ref={sectionRef} id="pendencias-operacionais">
      <SectionHeader
        title="Pendências operacionais"
        description="Inventários, recebimentos, aprovações e ações criadas pelo gestor"
        actions={<SegmentedControl value={filter} onChange={setFilter} options={filterOptions} />}
      />
      {filtered.length === 0 ? (
        <EmptyState icon={<ListTodo className="h-5 w-5" strokeWidth={1.7} />} title="Nenhuma pendência neste filtro" description="Tudo em dia por aqui." />
      ) : (
        <ul className="flex flex-col divide-y divide-border border-t border-border">
          {filtered.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3.5">
              <div className="flex min-w-0 items-start gap-2.5">
                <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', priorityDot[item.prioridade])} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate text-support font-medium text-ink-primary">{item.tipo}</p>
                  <p className="mt-0.5 text-caption text-ink-tertiary">
                    {item.unidade} · {item.responsavel} ·{' '}
                    <span className={item.bucket === 'atrasada' ? 'text-danger' : undefined}>{item.prazoLabel}</span>
                  </p>
                </div>
              </div>
              <button className="shrink-0 text-caption font-medium text-accent transition-colors hover:text-accent-hover">{item.acaoRapida}</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
