import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNavDrawer } from './MobileNavDrawer'
import { CortexPanel } from '@/components/cortex/CortexPanel'
import { useAppState } from '@/context/AppStateContext'

/**
 * Shell principal da aplicacao: sidebar (desktop), header, drawer mobile,
 * painel do assistente CORTEX e area de conteudo roteavel.
 */
export function AppShell() {
  const { isCortexPanelOpen, setCortexPanelOpen } = useAppState()

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <MobileNavDrawer />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
            <Outlet />
          </div>
        </main>
      </div>

      <CortexPanel isOpen={isCortexPanelOpen} onClose={() => setCortexPanelOpen(false)} />
    </div>
  )
}
