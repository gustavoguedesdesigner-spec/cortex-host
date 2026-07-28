import { InternalNav, type InternalNavEntry } from '@/components/navigation/InternalNav'

/** 13 abas da Administração (seção 6) — Marcas e Aparência ficam acessíveis a partir de Organização e Políticas, sem aba própria. */
const entries: InternalNavEntry[] = [
  { id: 'visao-geral', label: 'Visão geral', path: '/configuracoes' },
  { id: 'organizacao', label: 'Organização', path: '/configuracoes/organizacao' },
  { id: 'unidades', label: 'Unidades', path: '/configuracoes/unidades' },
  { id: 'usuarios', label: 'Usuários', path: '/configuracoes/usuarios' },
  { id: 'perfis', label: 'Perfis e permissões', path: '/configuracoes/perfis' },
  { id: 'alcadas', label: 'Alçadas', path: '/configuracoes/alcadas' },
  { id: 'modulos', label: 'Módulos', path: '/configuracoes/modulos' },
  { id: 'notificacoes', label: 'Notificações', path: '/configuracoes/notificacoes' },
  { id: 'integracoes', label: 'Integrações', path: '/configuracoes/integracoes' },
  { id: 'seguranca', label: 'Segurança', path: '/configuracoes/seguranca' },
  { id: 'auditoria', label: 'Auditoria', path: '/configuracoes/auditoria' },
  { id: 'dados', label: 'Dados e retenção', path: '/configuracoes/dados' },
  { id: 'politicas', label: 'Políticas', path: '/configuracoes/politicas' },
]

export function AdminInternalNav({ active }: { active: string }) {
  return <InternalNav entries={entries} active={active} />
}
