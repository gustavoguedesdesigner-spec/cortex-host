import { InternalNav, type InternalNavEntry } from '@/components/navigation/InternalNav'

export type ComprasTab = 'visao-geral' | 'necessidades' | 'requisicoes' | 'aprovacoes' | 'cotacoes' | 'pedidos'

const entries: InternalNavEntry[] = [
  { id: 'visao-geral', label: 'Visão geral', path: '/compras' },
  { id: 'necessidades', label: 'Necessidades', path: '/compras/necessidades' },
  { id: 'requisicoes', label: 'Requisições', path: '/compras/requisicoes' },
  { id: 'aprovacoes', label: 'Aprovações', path: '/compras/aprovacoes' },
  { id: 'cotacoes', label: 'Cotações', path: '/compras/cotacoes' },
  { id: 'pedidos', label: 'Pedidos', path: '/compras/pedidos' },
]

/** Navegação interna do módulo de Compras — padrão compartilhado de menu de página. */
export function ComprasInternalNav({ active }: { active: ComprasTab }) {
  return <InternalNav entries={entries} active={active} />
}
