import { ChevronsLeft, ChevronsRight, LogOut, Settings } from 'lucide-react'
import { cn } from '@/utils/cn'
import { navGroups } from '@/components/navigation/navConfig'
import { NavGroup } from '@/components/navigation/NavGroup'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'
import { demoUser } from '@/data/user'
import { Logo } from './Logo'

/** Sidebar fixa para desktop. Em tablet/mobile, ver MobileNavDrawer. */
export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebarCollapsed, logout } = useAppState()

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col shrink-0 h-screen sticky top-0 border-r border-border-subtle bg-surface-1 transition-[width] duration-200',
        isSidebarCollapsed ? 'w-[76px]' : 'w-64',
      )}
    >
      <div className={cn('flex items-center h-16 shrink-0 border-b border-border-subtle', isSidebarCollapsed ? 'justify-center px-2' : 'px-4')}>
        <Logo collapsed={isSidebarCollapsed} />
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-none px-2.5 py-4 flex flex-col gap-5">
        {navGroups.map((group) => (
          <NavGroup key={group.label} group={group} collapsed={isSidebarCollapsed} />
        ))}
      </nav>

      <div className={cn('border-t border-border-subtle p-3 flex items-center gap-2.5', isSidebarCollapsed && 'justify-center')}>
        <Avatar iniciais={demoUser.iniciais} />
        {!isSidebarCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-support font-medium text-content-primary truncate">{demoUser.nome}</p>
            <p className="text-caption text-content-tertiary truncate">{demoUser.empresa}</p>
          </div>
        )}
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-0.5">
            <IconButton icon={<Settings className="h-4 w-4" />} label="Configurações" size="sm" />
            <IconButton icon={<LogOut className="h-4 w-4" />} label="Sair" size="sm" onClick={logout} />
          </div>
        )}
      </div>

      <button
        onClick={toggleSidebarCollapsed}
        className="flex items-center justify-center gap-2 h-9 border-t border-border-subtle text-content-tertiary hover:text-content-primary hover:bg-surface-3 transition-colors text-support"
        aria-label={isSidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {isSidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : (
          <>
            <ChevronsLeft className="h-4 w-4" />
            Recolher
          </>
        )}
      </button>
    </aside>
  )
}
