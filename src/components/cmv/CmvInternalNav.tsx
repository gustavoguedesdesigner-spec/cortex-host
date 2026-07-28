import { InternalNav, type InternalNavEntry } from '@/components/navigation/InternalNav'

export type CmvTab = 'visao-geral' | 'unidades' | 'categorias' | 'produtos' | 'causas'

/**
 * Navegação interna do módulo de CMV. "Visão geral" a "Causas e
 * evidências" trocam de aba dentro de /cmv (preservando período/unidade
 * via query params); "Fechamento" e "Histórico" navegam para a rota
 * dedicada /cmv/fechamentos, que tem checklist e histórico completos.
 */
const entries: InternalNavEntry[] = [
  { id: 'visao-geral', label: 'Visão geral', path: '/cmv' },
  { id: 'unidades', label: 'Unidades', path: '/cmv?tab=unidades' },
  { id: 'categorias', label: 'Categorias', path: '/cmv?tab=categorias' },
  { id: 'produtos', label: 'Produtos', path: '/cmv?tab=produtos' },
  { id: 'causas', label: 'Causas e evidências', path: '/cmv?tab=causas' },
  { id: 'fechamento', label: 'Fechamento', path: '/cmv/fechamentos' },
  { id: 'historico', label: 'Histórico', path: '/cmv/fechamentos?section=historico' },
]

export function CmvInternalNav({ active }: { active: CmvTab | 'fechamento' | 'historico' }) {
  return <InternalNav entries={entries} active={active} />
}
