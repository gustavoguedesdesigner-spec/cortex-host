import { InternalNav, type InternalNavEntry } from '@/components/navigation/InternalNav'

const entries: InternalNavEntry[] = [
  { id: 'visao-geral', label: 'Visão geral', path: '/fichas-tecnicas' },
  { id: 'fichas', label: 'Fichas técnicas', path: '/fichas-tecnicas?tab=fichas' },
  { id: 'revisoes', label: 'Revisões', path: '/fichas-tecnicas/revisoes' },
  { id: 'inconsistencias', label: 'Inconsistências', path: '/fichas-tecnicas/inconsistencias' },
  { id: 'subreceitas', label: 'Sub-receitas', path: '/fichas-tecnicas/subreceitas' },
  { id: 'custos', label: 'Custos', path: '/fichas-tecnicas/custos' },
  { id: 'engenharia', label: 'Engenharia de cardápio', path: '/fichas-tecnicas/engenharia' },
  { id: 'historico', label: 'Histórico', path: '/fichas-tecnicas/revisoes?section=historico' },
]

export function RecipeInternalNav({ active }: { active: string }) {
  return <InternalNav entries={entries} active={active} />
}
