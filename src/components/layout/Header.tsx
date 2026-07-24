import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { SearchInput } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Avatar } from '@/components/ui/Avatar'
import { CortexButton } from '@/components/cortex/CortexButton'
import { NotificationsPanel } from './NotificationsPanel'
import { Logo } from './Logo'
import { useAppState, useUnitOptions } from '@/context/AppStateContext'
import { periodOptions } from '@/data/periods'
import { allNavItems } from '@/components/navigation/navConfig'
import { getUnitById } from '@/data/units'
import { demoUser } from '@/data/user'

/** Barra superior clara: contexto + controles globais, sem sombra pesada. */
export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { periodo, setPeriodo, unidadeSelecionada, setUnidadeSelecionada, setCortexPanelOpen } = useAppState()
  const unitOptions = useUnitOptions()

  const segments = location.pathname.split('/').filter(Boolean)
  const rootItem = allNavItems.find((item) => item.path === `/${segments[0] ?? ''}`)
  const unitName = segments[0] === 'unidades' && segments[1] ? getUnitById(segments[1])?.nomeCurto : undefined

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface px-4 lg:px-7">
      <Logo collapsed className="lg:hidden" />

      <nav aria-label="Trilha de navegação" className="hidden min-w-0 items-center gap-1.5 text-support lg:flex">
        <button onClick={() => navigate(rootItem?.path ?? '/')} className="truncate font-medium text-ink-primary hover:text-accent">
          {rootItem?.label ?? 'Central de Operações'}
        </button>
        {unitName && (
          <>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-ink-tertiary" strokeWidth={1.7} />
            <span className="truncate text-ink-secondary">{unitName}</span>
          </>
        )}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <SearchInput placeholder="Buscar..." wrapperClassName="hidden w-56 xl:block" />
        <Select
          aria-label="Selecionar período"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value as typeof periodo)}
          options={periodOptions.map((p) => ({ value: p.id, label: p.label }))}
          className="hidden w-36 md:block"
        />
        <Select
          aria-label="Selecionar unidade"
          value={unidadeSelecionada}
          onChange={(e) => setUnidadeSelecionada(e.target.value)}
          options={unitOptions.map((u) => ({ value: u.id, label: u.nome }))}
          className="hidden w-44 md:block"
        />
        <CortexButton onClick={() => setCortexPanelOpen(true)} />
        <NotificationsPanel />
        <Avatar iniciais={demoUser.iniciais} size="sm" />
      </div>
    </header>
  )
}
