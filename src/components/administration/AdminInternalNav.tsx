import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface NavEntry {
  id: string
  label: string
  path: string
}

/** 13 abas da Administração (seção 6) — Marcas e Aparência ficam acessíveis a partir de Organização e Políticas, sem aba própria. */
const entries: NavEntry[] = [
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
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-border" role="tablist">
      {entries.map((entry) => {
        const isActive = active === entry.id
        return (
          <button
            key={entry.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => navigate(entry.path)}
            className={cn(
              'relative shrink-0 whitespace-nowrap px-3.5 py-2.5 text-support font-medium transition-colors',
              isActive ? 'text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary',
            )}
          >
            {entry.label}
            {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />}
          </button>
        )
      })}
    </div>
  )
}
