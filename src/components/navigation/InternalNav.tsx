import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

export interface InternalNavEntry {
  id: string
  label: string
  path: string
}

/**
 * Menu interno padrão das páginas de módulo: item ativo com fundo suave e
 * raio de 12px, boa área de clique, sem excesso de cor. No mobile, rolagem
 * horizontal. Os InternalNavs de cada módulo delegam para este componente.
 */
export function InternalNav({ entries, active, className }: { entries: InternalNavEntry[]; active: string; className?: string }) {
  const navigate = useNavigate()

  return (
    <div className={cn('flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-border pb-3', className)} role="tablist">
      {entries.map((entry) => {
        const isActive = active === entry.id
        return (
          <button
            key={entry.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => navigate(entry.path)}
            className={cn(
              'h-9 shrink-0 whitespace-nowrap rounded-md px-3.5 text-support font-medium transition-colors',
              isActive ? 'bg-surface-subtle text-ink-primary' : 'text-ink-tertiary hover:bg-surface-hover hover:text-ink-secondary',
            )}
          >
            {entry.label}
          </button>
        )
      })}
    </div>
  )
}
