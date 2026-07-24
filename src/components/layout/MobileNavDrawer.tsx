import { LogOut } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { navGroups } from '@/components/navigation/navConfig'
import { NavGroup } from '@/components/navigation/NavGroup'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'
import { demoUser } from '@/data/user'

export function MobileNavDrawer() {
  const { isMobileNavOpen, setMobileNavOpen, logout } = useAppState()

  return (
    <Drawer
      isOpen={isMobileNavOpen}
      onClose={() => setMobileNavOpen(false)}
      title="Navegação"
      side="left"
      widthClassName="w-72"
      footer={
        <div className="flex items-center gap-2.5">
          <Avatar iniciais={demoUser.iniciais} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-support font-medium text-ink-primary">{demoUser.nome}</p>
            <p className="truncate text-caption text-ink-tertiary">{demoUser.empresa}</p>
          </div>
          <Button size="sm" variant="ghost" leftIcon={<LogOut className="h-4 w-4" strokeWidth={1.7} />} onClick={logout}>
            Sair
          </Button>
        </div>
      }
    >
      <nav className="flex flex-col gap-3">
        {navGroups.map((group) => (
          <NavGroup key={group.label} group={group} expanded onNavigate={() => setMobileNavOpen(false)} />
        ))}
      </nav>
    </Drawer>
  )
}
