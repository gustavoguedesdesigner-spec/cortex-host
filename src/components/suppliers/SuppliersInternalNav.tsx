import { InternalNav, type InternalNavEntry } from '@/components/navigation/InternalNav'

export type SuppliersTab = 'visao-geral' | 'desempenho' | 'divergencias' | 'documentos' | 'negociacoes' | 'riscos' | 'historico'

const entries: InternalNavEntry[] = [
  { id: 'visao-geral', label: 'Visão geral', path: '/fornecedores' },
  { id: 'desempenho', label: 'Desempenho', path: '/fornecedores/desempenho' },
  { id: 'divergencias', label: 'Divergências', path: '/fornecedores/divergencias' },
  { id: 'documentos', label: 'Documentos', path: '/fornecedores/documentos' },
  { id: 'negociacoes', label: 'Negociações', path: '/fornecedores/negociacoes' },
  { id: 'riscos', label: 'Riscos', path: '/fornecedores/riscos' },
  { id: 'historico', label: 'Histórico', path: '/fornecedores/historico' },
]

/** Navegação interna de Fornecedores — padrão compartilhado de menu de página. */
export function SuppliersInternalNav({ active }: { active: SuppliersTab }) {
  return <InternalNav entries={entries} active={active} />
}
