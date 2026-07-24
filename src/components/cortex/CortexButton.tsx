import { CortexMark } from './CortexMark'

/** Ação estrutural escura com ponto laranja — âncora do assistente na barra superior. */
export function CortexButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Pergunte ao CORTEX"
      className="flex h-9 items-center gap-2 rounded-md bg-navy px-2.5 text-support font-medium text-white transition-colors hover:bg-navy-hover sm:px-3"
    >
      <CortexMark className="h-4 w-4 text-accent" />
      <span className="hidden sm:inline">Pergunte ao CORTEX</span>
    </button>
  )
}

/** Etiqueta de autoria do CORTEX usada em blocos de inteligência. */
export function CortexLabel({ children = 'CORTEX' }: { children?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-label font-medium uppercase tracking-wide text-ink-tertiary">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </span>
  )
}
