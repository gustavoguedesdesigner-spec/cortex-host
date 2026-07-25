import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

interface NavEntry {
  id: string
  label: string
  onClick: (navigate: ReturnType<typeof useNavigate>) => void
}

const entries: NavEntry[] = [
  { id: 'visao-geral', label: 'Visão geral', onClick: (nav) => nav('/fichas-tecnicas') },
  { id: 'fichas', label: 'Fichas técnicas', onClick: (nav) => nav('/fichas-tecnicas?tab=fichas') },
  { id: 'revisoes', label: 'Revisões', onClick: (nav) => nav('/fichas-tecnicas/revisoes') },
  { id: 'inconsistencias', label: 'Inconsistências', onClick: (nav) => nav('/fichas-tecnicas/inconsistencias') },
  { id: 'subreceitas', label: 'Sub-receitas', onClick: (nav) => nav('/fichas-tecnicas/subreceitas') },
  { id: 'custos', label: 'Custos', onClick: (nav) => nav('/fichas-tecnicas/custos') },
  { id: 'engenharia', label: 'Engenharia de cardápio', onClick: (nav) => nav('/fichas-tecnicas/engenharia') },
  { id: 'historico', label: 'Histórico', onClick: (nav) => nav('/fichas-tecnicas/revisoes?section=historico') },
]

export function RecipeInternalNav({ active }: { active: string }) {
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
