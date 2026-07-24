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
  { value: 'minhas', label: 'Minhas pendências' },
  { value: 'atrasada', label: 'Atrasadas' },
  { value: 'hoje', label: 'Hoje' },
  { value: 'esta_semana', label: 'Esta semana' },
]

const priorityDot = { alta: 'bg-status-critical', media: 'bg-status-attention', baixa: 'bg-status-neutral' } as const

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

  const allItems = useMemo(
    () => [...createdActions.map(createdActionToPendingItem), ...pendingItems],
    [createdActions],
  )

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      if (filter === 'minhas') return item.minha
      if (filter === 'atrasada' || filter === 'hoje' || filter === 'esta_semana') return item.bucket === filter
      return true
    })
  }, [allItems, filter])

  return (
    <section ref={sectionRef} id="pendencias-operacionais">
      <SectionHeader
        title="Pendências operacionais"
        description="Inventários, recebimentos, aprovações e ações criadas pelo gestor"
        actions={<SegmentedControl value={filter} onChange={setFilter} options={filterOptions} />}
      />

      {filtered.length === 0 ? (
        <EmptyState icon={<ListTodo className="h-5 w-5" />} title="Nenhuma pendência neste filtro" description="Tudo em dia por aqui." />
      ) : (
        <div className="flex flex-col divide-y divide-border-subtle rounded-lg border border-border-subtle bg-surface-2">
          {filtered.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <span className={cn('mt-1.5 h-1.5 w-1.5 rounded-full shrink-0', priorityDot[item.prioridade])} />
                <div className="min-w-0">
                  <p className="text-support font-medium text-content-primary truncate">{item.tipo}</p>
                  <p className="text-caption text-content-tertiary mt-0.5">
                    {item.unidade} · {item.responsavel} ·{' '}
                    <span className={item.bucket === 'atrasada' ? 'text-status-critical' : undefined}>{item.prazoLabel}</span>
                  </p>
                </div>
              </div>
              <button className="text-caption font-medium text-cortex-500 shrink-0 hover:text-cortex-400">{item.acaoRapida}</button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
