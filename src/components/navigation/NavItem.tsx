import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'
import type { NavLeafItem } from '@/types'

export function NavItem({ item, collapsed, onNavigate }: { item: NavLeafItem; collapsed?: boolean; onNavigate?: () => void }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      end={item.path === '/'}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-md px-3 py-2 text-support font-medium transition-colors',
          collapsed && 'justify-center px-0',
          isActive
            ? 'bg-surface-3 text-content-primary'
            : 'text-content-secondary hover:bg-surface-3/60 hover:text-content-primary',
        )
      }
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-cortex-500" aria-hidden="true" />
          )}
          <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-cortex-500' : 'text-content-tertiary group-hover:text-content-secondary')} />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  )
}
