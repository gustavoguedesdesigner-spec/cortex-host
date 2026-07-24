import { CortexMark } from './CortexMark'

export function CortexButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Pergunte ao CORTEX"
      className="flex h-9 items-center gap-2 rounded-md border border-cortex-700/40 bg-cortex-900/40 pl-2.5 pr-2.5 sm:pr-3.5 text-support font-medium text-cortex-200 transition-colors hover:bg-cortex-900/70 hover:border-cortex-600/50"
    >
      <CortexMark className="h-4 w-4 text-cortex-400" animated />
      <span className="hidden sm:inline">Pergunte ao CORTEX</span>
    </button>
  )
}
