import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { PeriodOptionId } from '@/types'
import { units } from '@/data/units'
import { useLocalStorageState } from '@/hooks/useLocalStorageState'

export const ALL_UNITS_ID = 'todas'

/** Tema visual da interface — claro (padrao) ou escuro. */
export type ThemeMode = 'claro' | 'escuro'

interface AppStateValue {
  // Autenticacao simulada
  isAuthenticated: boolean
  login: () => void
  logout: () => void

  // Tema visual
  theme: ThemeMode
  toggleTheme: () => void

  // Selecoes globais (cabecalho)
  periodo: PeriodOptionId
  setPeriodo: (p: PeriodOptionId) => void
  unidadeSelecionada: string
  setUnidadeSelecionada: (id: string) => void

  // Layout
  isSidebarCollapsed: boolean
  toggleSidebarCollapsed: () => void
  isMobileNavOpen: boolean
  setMobileNavOpen: (v: boolean) => void

  // Paineis laterais
  isCortexPanelOpen: boolean
  setCortexPanelOpen: (v: boolean) => void
  isNotificationsOpen: boolean
  setNotificationsOpen: (v: boolean) => void

  /** Pergunta a ser pre-preenchida ao abrir o painel do Assistente CORTEX */
  cortexPrefillQuestion: string | null
  /** Rotulo de contexto exibido no painel (ex.: "Salvador Moinhos") */
  cortexContextLabel: string | null
  /** Resposta pronta (usada pelas perguntas rapidas de unidade, que ja tem resposta simulada definida) */
  cortexDirectAnswer: string | null
  askCortex: (question: string, contextLabel?: string, directAnswer?: string) => void
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [theme, setTheme] = useLocalStorageState<ThemeMode>('cortex-host:theme', 'claro')
  const [periodo, setPeriodo] = useState<PeriodOptionId>('ultimos_7_dias')
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>(ALL_UNITS_ID)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const [isCortexPanelOpen, setCortexPanelOpen] = useState(false)
  const [isNotificationsOpen, setNotificationsOpen] = useState(false)
  const [cortexPrefillQuestion, setCortexPrefillQuestion] = useState<string | null>(null)
  const [cortexContextLabel, setCortexContextLabel] = useState<string | null>(null)
  const [cortexDirectAnswer, setCortexDirectAnswer] = useState<string | null>(null)

  /* O tema vive num atributo do <html> — os tokens CSS reagem a ele sem re-render de componente. */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'escuro' ? 'dark' : 'light')
  }, [theme])

  const value = useMemo<AppStateValue>(
    () => ({
      isAuthenticated,
      login: () => setIsAuthenticated(true),
      logout: () => setIsAuthenticated(false),
      theme,
      toggleTheme: () => setTheme(theme === 'escuro' ? 'claro' : 'escuro'),
      periodo,
      setPeriodo,
      unidadeSelecionada,
      setUnidadeSelecionada,
      isSidebarCollapsed,
      toggleSidebarCollapsed: () => setIsSidebarCollapsed((v) => !v),
      isMobileNavOpen,
      setMobileNavOpen,
      isCortexPanelOpen,
      setCortexPanelOpen,
      isNotificationsOpen,
      setNotificationsOpen,
      cortexPrefillQuestion,
      cortexContextLabel,
      cortexDirectAnswer,
      askCortex: (question: string, contextLabel?: string, directAnswer?: string) => {
        setCortexPrefillQuestion(question)
        setCortexContextLabel(contextLabel ?? null)
        setCortexDirectAnswer(directAnswer ?? null)
        setCortexPanelOpen(true)
      },
    }),
    [
      isAuthenticated,
      theme,
      setTheme,
      periodo,
      unidadeSelecionada,
      isSidebarCollapsed,
      isMobileNavOpen,
      isCortexPanelOpen,
      isNotificationsOpen,
      cortexPrefillQuestion,
      cortexContextLabel,
      cortexDirectAnswer,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState deve ser usado dentro de <AppStateProvider>')
  return ctx
}

export function useUnitOptions() {
  return useMemo(
    () => [{ id: ALL_UNITS_ID, nome: 'Todas as unidades' }, ...units.map((u) => ({ id: u.id, nome: u.nome }))],
    [],
  )
}
