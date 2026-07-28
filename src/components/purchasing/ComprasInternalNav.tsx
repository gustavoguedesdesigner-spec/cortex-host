import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

export type ComprasTab = 'visao-geral' | 'necessidades' | 'requisicoes' | 'aprovacoes' | 'cotacoes' | 'pedidos'

interface NavEntry {
  id: ComprasTab
  label: string
  path: string
}

const entries: NavEntry[] = [
  { id: 'visao-geral', label: 'Visão geral', path: '/compras' },
  { id: 'necessidades', label: 'Necessidades', path: '/compras/necessidades' },
  { id: 'requisicoes', label: 'Requisições', path: '/compras/requisicoes' },
  { id: 'aprovacoes', label: 'Aprovações', path: '/compras/aprovacoes' },
  { id: 'cotacoes', label: 'Cotações', path: '/compras/cotacoes' },
  { id: 'pedidos', label: 'Pedidos', path: '/compras/pedidos' },
]

/** Navegação interna do módulo de Compras — mesma estética do CMV e do Estoque. No mobile, rolagem horizontal. */
export function ComprasInternalNav({ active }: { active: ComprasTab }) {
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
              'relative shrink-0 whitespace-nowrap px-4 py-3 text-support font-medium transition-colors',
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
