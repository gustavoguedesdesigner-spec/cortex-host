import { LogOut, Settings } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { navGroups } from '@/components/navigation/navConfig'
import { NavGroup } from '@/components/navigation/NavGroup'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'
import { demoUser } from '@/data/user'
import { Logo } from './Logo'

export function MobileNavDrawer() {
  const { isMobileNavOpen, setMobileNavOpen, logout } = useAppState()

  return (
    <Drawer
      isOpen={isMobileNavOpen}
      onClose={() => setMobileNavOpen(false)}
      title=""
      side="left"
      widthClassName="w-72"
      footer={
        <div className="flex items-center gap-2.5">
          <Avatar iniciais={demoUser.iniciais} />
          <div className="min-w-0 flex-1">
            <p className="text-support font-medium text-content-primary truncate">{demoUser.nome}</p>
            <p className="text-caption text-content-tertiary truncate">{demoUser.empresa}</p>
          </div>
          <IconButton icon={<Settings className="h-4 w-4" />} label="Configurações" size="sm" />
          <IconButton icon={<LogOut className="h-4 w-4" />} label="Sair" size="sm" onClick={logout} />
        </div>
      }
    >
      <div className="mb-5">
        <Logo />
      </div>
      <nav className="flex flex-col gap-5">
        {navGroups.map((group) => (
          <NavGroup key={group.label} group={group} onNavigate={() => setMobileNavOpen(false)} />
        ))}
      </nav>
    </Drawer>
  )
}
