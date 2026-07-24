import { Outlet } from 'react-router-dom'
import { NavigationRail } from './NavigationRail'
import { Header } from './Header'
import { MobileNavDrawer } from './MobileNavDrawer'
import { BottomNav } from './BottomNav'
import { CortexPanel } from '@/components/cortex/CortexPanel'
import { useAppState } from '@/context/AppStateContext'

export function AppShell() {
  const { isCortexPanelOpen, setCortexPanelOpen } = useAppState()

  return (
    <div className="flex min-h-screen bg-canvas">
      <NavigationRail />
      <MobileNavDrawer />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 px-4 pb-24 pt-6 lg:px-7 lg:pb-12 lg:pt-8">
          <div className="mx-auto flex w-full max-w-content flex-col gap-10">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
      <CortexPanel isOpen={isCortexPanelOpen} onClose={() => setCortexPanelOpen(false)} />
    </div>
  )
}
