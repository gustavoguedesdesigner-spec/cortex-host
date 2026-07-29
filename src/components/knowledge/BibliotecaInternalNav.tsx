import { InternalNav, type InternalNavEntry } from '@/components/navigation/InternalNav'

export type BibliotecaTab =
  | 'visao-geral'
  | 'documentos'
  | 'procedimentos'
  | 'treinamentos'
  | 'checklists'
  | 'execucoes'
  | 'conformidade'
  | 'revisoes'
  | 'historico'

const entries: InternalNavEntry[] = [
  { id: 'visao-geral', label: 'Visão geral', path: '/biblioteca' },
  { id: 'documentos', label: 'Documentos', path: '/biblioteca/documentos' },
  { id: 'procedimentos', label: 'Procedimentos', path: '/biblioteca/procedimentos' },
  { id: 'treinamentos', label: 'Treinamentos', path: '/biblioteca/treinamentos' },
  { id: 'checklists', label: 'Checklists', path: '/biblioteca/checklists' },
  { id: 'execucoes', label: 'Execuções', path: '/biblioteca/execucoes' },
  { id: 'conformidade', label: 'Conformidade', path: '/biblioteca/conformidade' },
  { id: 'revisoes', label: 'Revisões', path: '/biblioteca/revisoes' },
  { id: 'historico', label: 'Histórico', path: '/biblioteca/historico' },
]

/** Navegação interna da Biblioteca — padrão compartilhado de menu de página. */
export function BibliotecaInternalNav({ active }: { active: BibliotecaTab }) {
  return <InternalNav entries={entries} active={active} />
}
