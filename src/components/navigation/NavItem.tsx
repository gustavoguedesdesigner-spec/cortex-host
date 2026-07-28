import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Tooltip } from '@/components/ui/Tooltip'
import type { NavLeafItem } from '@/types'

/** Item do trilho: ícone sempre, rótulo apenas quando o trilho está expandido. */
export function NavItem({ item, expanded, onNavigate }: { item: NavLeafItem; expanded?: boolean; onNavigate?: () => void }) {
  const Icon = item.icon

  const link = (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      end={item.path === '/'}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-md transition-colors',
          expanded ? 'h-10 px-3' : 'h-10 w-10 justify-center',
          isActive ? 'bg-surface-subtle text-ink-primary' : 'text-ink-secondary hover:bg-surface-hover hover:text-ink-primary',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive && 'text-accent')} strokeWidth={1.7} />
          {expanded && <span className="truncate text-support font-medium">{item.label}</span>}
          {isActive && !expanded && (
            <span className="absolute -right-[9px] h-4 w-[3px] rounded-full bg-accent" aria-hidden="true" />
          )}
        </>
      )}
    </NavLink>
  )

  return expanded ? link : <Tooltip content={item.label} side="bottom">{link}</Tooltip>
}
