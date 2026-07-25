import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

export type InventoryTab = 'visao-geral' | 'posicao'

interface NavEntry {
  id: string
  label: string
  onClick: (navigate: ReturnType<typeof useNavigate>) => void
}

const entries: NavEntry[] = [
  { id: 'visao-geral', label: 'Visão geral', onClick: (nav) => nav('/estoque') },
  { id: 'posicao', label: 'Posição de estoque', onClick: (nav) => nav('/estoque?tab=posicao') },
  { id: 'inventarios', label: 'Inventários', onClick: (nav) => nav('/estoque/inventarios') },
  { id: 'movimentacoes', label: 'Movimentações', onClick: (nav) => nav('/estoque/movimentacoes') },
  { id: 'transferencias', label: 'Transferências', onClick: (nav) => nav('/estoque/transferencias') },
  { id: 'perdas', label: 'Perdas', onClick: (nav) => nav('/estoque/perdas') },
  { id: 'historico', label: 'Histórico', onClick: (nav) => nav('/estoque/movimentacoes?section=historico') },
]

/** Navegação interna do módulo de Estoque — mesma estética do CMV. */
export function InventoryInternalNav({ active }: { active: string }) {
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
            onClick={() => entry.onClick(navigate)}
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
