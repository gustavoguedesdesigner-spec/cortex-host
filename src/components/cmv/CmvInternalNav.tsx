import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

export type CmvTab = 'visao-geral' | 'unidades' | 'categorias' | 'produtos' | 'causas'

const tabs: { id: CmvTab; label: string }[] = [
  { id: 'visao-geral', label: 'Visão geral' },
  { id: 'unidades', label: 'Unidades' },
  { id: 'categorias', label: 'Categorias' },
  { id: 'produtos', label: 'Produtos' },
  { id: 'causas', label: 'Causas e evidências' },
]

/**
 * Navegação interna do módulo de CMV. "Visão geral" a "Causas e
 * evidências" trocam de aba dentro de /cmv (preservando período/unidade
 * via query params); "Fechamento" e "Histórico" navegam para a rota
 * dedicada /cmv/fechamentos, que tem checklist e histórico completos.
 */
export function CmvInternalNav({ active }: { active: CmvTab | 'fechamento' | 'historico' }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-border" role="tablist">
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => navigate(tab.id === 'visao-geral' ? '/cmv' : `/cmv?tab=${tab.id}`)}
            className={cn(
              'relative shrink-0 whitespace-nowrap px-3.5 py-2.5 text-support font-medium transition-colors',
              isActive ? 'text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary',
            )}
          >
            {tab.label}
            {isActive && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />}
          </button>
        )
      })}
      <button
        role="tab"
        aria-selected={active === 'fechamento'}
        onClick={() => navigate('/cmv/fechamentos')}
        className={cn(
          'relative shrink-0 whitespace-nowrap px-3.5 py-2.5 text-support font-medium transition-colors',
          active === 'fechamento' ? 'text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary',
        )}
      >
        Fechamento
        {active === 'fechamento' && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />}
      </button>
      <button
        role="tab"
        aria-selected={active === 'historico'}
        onClick={() => navigate('/cmv/fechamentos?section=historico')}
        className={cn(
          'relative shrink-0 whitespace-nowrap px-3.5 py-2.5 text-support font-medium transition-colors',
          active === 'historico' ? 'text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary',
        )}
      >
        Histórico
        {active === 'historico' && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />}
      </button>
    </div>
  )
}
