import { Loader2 } from 'lucide-react'

export function LoadingState({ label = 'Carregando dados...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-ink-tertiary" role="status" aria-live="polite">
      <Loader2 className="h-5 w-5 animate-spin text-accent" strokeWidth={1.7} />
      <span className="text-support">{label}</span>
    </div>
  )
}
