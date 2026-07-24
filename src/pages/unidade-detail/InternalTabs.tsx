import { Construction } from 'lucide-react'
import { cn } from '@/utils/cn'

const tabs = ['Visão geral', 'CMV', 'Estoque', 'Compras', 'Recebimentos', 'Fornecedores', 'Pendências', 'Histórico'] as const

export type UnitTab = (typeof tabs)[number]

export function InternalTabs({ active, onChange }: { active: UnitTab; onChange: (tab: UnitTab) => void }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            'relative shrink-0 px-3.5 py-2.5 text-support font-medium whitespace-nowrap transition-colors',
            active === tab ? 'text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary',
          )}
        >
          {tab}
          {active === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
        </button>
      ))}
    </div>
  )
}

export function UnitTabPlaceholder({ unitName, tab }: { unitName: string; tab: UnitTab }) {
  return (
    <div className="flex flex-col gap-3 py-10 items-center text-center">
      <Construction className="h-5 w-5 text-accent" />
      <p className="text-card-title text-ink-primary">{tab} de {unitName}</p>
      <p className="text-support text-ink-tertiary max-w-md">
        Esta aba já está conectada ao contexto da unidade e ao período selecionado. A lógica completa do módulo de {tab}
        será desenvolvida em uma etapa dedicada do protótipo.
      </p>
    </div>
  )
}
