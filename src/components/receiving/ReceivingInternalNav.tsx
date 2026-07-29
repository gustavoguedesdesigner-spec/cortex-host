import { InternalNav, type InternalNavEntry } from '@/components/navigation/InternalNav'

export type ReceivingTab = 'visao-geral' | 'agenda' | 'aguardando' | 'divergencias' | 'quarentena' | 'historico'

const entries: InternalNavEntry[] = [
  { id: 'visao-geral', label: 'Visão geral', path: '/recebimentos' },
  { id: 'agenda', label: 'Agenda', path: '/recebimentos/agenda' },
  { id: 'aguardando', label: 'Aguardando', path: '/recebimentos/aguardando' },
  { id: 'divergencias', label: 'Divergências', path: '/recebimentos/divergencias' },
  { id: 'quarentena', label: 'Quarentena', path: '/recebimentos/quarentena' },
  { id: 'historico', label: 'Histórico', path: '/recebimentos/historico' },
]

/** Navegação interna de Recebimentos — padrão compartilhado de menu de página. */
export function ReceivingInternalNav({ active }: { active: ReceivingTab }) {
  return <InternalNav entries={entries} active={active} />
}
