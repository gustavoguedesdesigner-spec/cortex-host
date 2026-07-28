import { LogOut } from 'lucide-react'
import { navGroups } from '@/components/navigation/navConfig'
import { NavGroup } from '@/components/navigation/NavGroup'
import { IconButton } from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'
import { Logo } from './Logo'

/**
 * Sidebar permanente e legível (264px): grupos sempre visíveis, item ativo
 * com fundo claro e detalhe na cor de assinatura, rodapé discreto.
 */
export function NavigationRail() {
  const { logout } = useAppState()

  return (
    <aside className="sticky top-0 z-30 hidden h-screen w-[264px] shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-[68px] shrink-0 items-center gap-2.5 border-b border-border px-5">
        <Logo collapsed />
        <Logo showSignature />
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-none px-3 py-5">
        {navGroups.map((group) => (
          <NavGroup key={group.label} group={group} expanded />
        ))}
      </nav>

      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border py-3 pl-5 pr-3">
        <span className="truncate text-caption text-ink-tertiary">CORTEX HOST · by ZAKA</span>
        <IconButton icon={<LogOut className="h-4 w-4" strokeWidth={1.7} />} label="Sair" onClick={logout} size="sm" />
      </div>
    </aside>
  )
}
