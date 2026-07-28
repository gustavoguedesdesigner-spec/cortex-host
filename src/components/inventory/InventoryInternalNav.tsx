import { InternalNav, type InternalNavEntry } from '@/components/navigation/InternalNav'

export type InventoryTab = 'visao-geral' | 'posicao'

const entries: InternalNavEntry[] = [
  { id: 'visao-geral', label: 'Visão geral', path: '/estoque' },
  { id: 'posicao', label: 'Posição de estoque', path: '/estoque?tab=posicao' },
  { id: 'inventarios', label: 'Inventários', path: '/estoque/inventarios' },
  { id: 'movimentacoes', label: 'Movimentações', path: '/estoque/movimentacoes' },
  { id: 'transferencias', label: 'Transferências', path: '/estoque/transferencias' },
  { id: 'perdas', label: 'Perdas', path: '/estoque/perdas' },
  { id: 'historico', label: 'Histórico', path: '/estoque/movimentacoes?section=historico' },
]

/** Navegação interna do módulo de Estoque — padrão compartilhado de menu de página. */
export function InventoryInternalNav({ active }: { active: string }) {
  return <InternalNav entries={entries} active={active} />
}
