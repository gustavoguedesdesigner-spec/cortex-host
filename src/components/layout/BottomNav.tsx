import { NavLink } from 'react-router-dom'
import { LayoutGrid, Building2, Percent, Menu } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAppState } from '@/context/AppStateContext'

const items = [
  { label: 'Central', path: '/', icon: LayoutGrid },
  { label: 'Unidades', path: '/unidades', icon: Building2 },
  { label: 'CMV', path: '/cmv', icon: Percent },
]

/** Navegação inferior no mobile — não replica o trilho do desktop. */
export function BottomNav() {
  const { setMobileNavOpen } = useAppState()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-border bg-shell lg:hidden">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn('flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                isActive ? 'text-accent' : 'text-ink-tertiary')
            }
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
            {item.label}
          </NavLink>
        )
      })}
      <button
        onClick={() => setMobileNavOpen(true)}
        className="flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium text-ink-tertiary"
      >
        <Menu className="h-[18px] w-[18px]" strokeWidth={1.7} />
        Mais
      </button>
    </nav>
  )
}
