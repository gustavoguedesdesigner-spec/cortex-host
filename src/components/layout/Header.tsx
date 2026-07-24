import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { IconButton } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Avatar } from '@/components/ui/Avatar'
import { CortexButton } from '@/components/cortex/CortexButton'
import { NotificationsPanel } from './NotificationsPanel'
import { useAppState, useUnitOptions } from '@/context/AppStateContext'
import { periodOptions } from '@/data/periods'
import { allNavItems } from '@/components/navigation/navConfig'
import { demoUser } from '@/data/user'

export function Header() {
  const location = useLocation()
  const { periodo, setPeriodo, unidadeSelecionada, setUnidadeSelecionada, setMobileNavOpen, setCortexPanelOpen } = useAppState()
  const unitOptions = useUnitOptions()

  const currentItem = allNavItems.find((item) => item.path === location.pathname)
  const pageTitle = currentItem?.label ?? 'CORTEX HOST'

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border-subtle bg-surface-1/95 backdrop-blur px-4 lg:px-6">
      <IconButton
        icon={<Menu className="h-5 w-5" />}
        label="Abrir menu"
        className="lg:hidden"
        onClick={() => setMobileNavOpen(true)}
      />

      <div className="min-w-0 mr-2 hidden sm:block">
        <h1 className="text-support font-semibold text-content-primary truncate leading-tight">{pageTitle}</h1>
        <p className="text-caption text-content-tertiary truncate leading-tight">{demoUser.empresa}</p>
      </div>

      <div className="hidden md:flex items-center gap-2 ml-1">
        <Select
          aria-label="Selecionar período"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value as typeof periodo)}
          options={periodOptions.map((p) => ({ value: p.id, label: p.label }))}
          className="w-40"
        />
        <Select
          aria-label="Selecionar unidade"
          value={unidadeSelecionada}
          onChange={(e) => setUnidadeSelecionada(e.target.value)}
          options={unitOptions.map((u) => ({ value: u.id, label: u.nome }))}
          className="w-52"
        />
      </div>

      <div className="flex-1 hidden xl:flex justify-center px-4">
        <SearchInput placeholder="Buscar unidades, fornecedores, itens..." wrapperClassName="max-w-md w-full" />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <CortexButton onClick={() => setCortexPanelOpen(true)} />
        <NotificationsPanel />
        <Avatar iniciais={demoUser.iniciais} size="sm" className="ml-1" />
      </div>
    </header>
  )
}
