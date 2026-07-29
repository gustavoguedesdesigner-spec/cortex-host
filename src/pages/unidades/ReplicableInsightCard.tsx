import { Button } from '@/components/ui/Button'
import { CortexLabel } from '@/components/cortex/CortexButton'
import { replicableInsight } from '@/data/unit-rankings'

export function ReplicableInsightCard({
  onCompareProcesses,
  onCreateAction,
  onOpenReference,
}: {
  onCompareProcesses: () => void
  onCreateAction: () => void
  onOpenReference: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-accent-line bg-accent-soft p-6">
      <CortexLabel />
      <div className="max-w-3xl">
        <h3 className="text-card-title">{replicableInsight.titulo}</h3>
        <p className="mt-1 text-support leading-relaxed text-ink-secondary">{replicableInsight.texto}</p>
      </div>
      <p className="text-support text-ink-primary">
        <span className="text-ink-tertiary">Ação recomendada · </span>
        {replicableInsight.acaoRecomendada}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="primary" onClick={onCompareProcesses}>
          Comparar processos
        </Button>
        <Button size="sm" variant="secondary" onClick={onCreateAction}>
          Criar ação
        </Button>
        <Button size="sm" variant="ghost" onClick={onOpenReference}>
          Abrir Serra
        </Button>
      </div>
    </div>
  )
}
