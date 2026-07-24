import { Button } from '@/components/ui/Button'
import { CortexMark } from '@/components/cortex/CortexMark'
import { replicableInsight } from '@/data/unit-rankings'

interface ReplicableInsightCardProps {
  onCompareProcesses: () => void
  onCreateAction: () => void
  onOpenReference: () => void
}

export function ReplicableInsightCard({ onCompareProcesses, onCreateAction, onOpenReference }: ReplicableInsightCardProps) {
  return (
    <div className="rounded-lg bg-surface-2 border border-border-subtle p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cortex-900/60 text-cortex-400">
          <CortexMark className="h-4 w-4" />
        </span>
        <span className="text-caption text-content-tertiary font-semibold uppercase tracking-wide">CORTEX Insight</span>
      </div>
      <div>
        <h3 className="text-card-title text-content-primary">{replicableInsight.titulo}</h3>
        <p className="text-support text-content-secondary mt-1">{replicableInsight.texto}</p>
      </div>
      <div className="rounded-md bg-surface-3/60 p-3">
        <p className="text-caption text-content-tertiary mb-0.5">Ação recomendada</p>
        <p className="text-support text-content-primary">{replicableInsight.acaoRecomendada}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="primary" onClick={onCompareProcesses}>Comparar processos</Button>
        <Button size="sm" variant="secondary" onClick={onCreateAction}>Criar ação</Button>
        <Button size="sm" variant="ghost" onClick={onOpenReference}>Abrir Serra</Button>
      </div>
    </div>
  )
}
