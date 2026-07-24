import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { cn } from '@/utils/cn'
import { navGroups } from '@/components/navigation/navConfig'
import { NavGroup } from '@/components/navigation/NavGroup'
import { IconButton } from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'
import { Logo } from './Logo'

/**
 * Trilho lateral compacto (72px), expandindo temporariamente no hover.
 * Substitui a sidebar SaaS permanente de 260px.
 */
export function NavigationRail() {
  const { logout } = useAppState()
  const [expanded, setExpanded] = useState(false)

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cn(
        'sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 lg:flex',
        expanded ? 'w-[220px]' : 'w-[72px]',
      )}
    >
      <div className={cn('flex h-16 shrink-0 items-center border-b border-border', expanded ? 'gap-2.5 px-4' : 'justify-center')}>
        <Logo collapsed />
        {expanded && <Logo />}
      </div>

      <nav className={cn('flex flex-1 flex-col gap-1 overflow-y-auto scrollbar-none py-3', expanded ? 'px-2.5' : 'items-center px-2')}>
        {navGroups.map((group) => (
          <NavGroup key={group.label} group={group} expanded={expanded} />
        ))}
      </nav>

      <div className={cn('border-t border-border p-2', expanded ? 'px-2.5' : 'flex justify-center')}>
        <IconButton icon={<LogOut className="h-[18px] w-[18px]" strokeWidth={1.7} />} label="Sair" onClick={logout} />
      </div>
    </aside>
  )
}
