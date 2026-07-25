import { ClipboardCheck, FilePlus2, ListTodo } from 'lucide-react'
import { ExecutiveSummaryCard } from '@/components/cortex/ExecutiveSummaryCard'
import { Button } from '@/components/ui/Button'
import { useAppState } from '@/context/AppStateContext'
import { formatCurrencyBRL } from '@/utils/format'
import { purchasingExecutiveRecommendations, purchasingExecutiveSummaryText, purchasingRecommendationText, purchasingSituation } from '@/data/purchasing/situation'

export function ComprasExecutiveSection({
  onVerPrioridades,
  onAbrirAprovacoes,
  onCriarRequisicao,
}: {
  onVerPrioridades: () => void
  onAbrirAprovacoes: () => void
  onCriarRequisicao: () => void
}) {
  const { askCortex } = useAppState()

  return (
    <ExecutiveSummaryCard
      text={purchasingExecutiveSummaryText}
      recommendations={purchasingExecutiveRecommendations}
      onAnalyzeCauses={onVerPrioridades}
      onViewActionPlan={onAbrirAprovacoes}
      onAskCortex={() => askCortex('O que precisa ser comprado hoje?', 'Compras consolidadas')}
      primaryLabel="Ver prioridades"
      primaryIcon={<ListTodo className="h-3.5 w-3.5" strokeWidth={1.7} />}
      secondaryLabel="Abrir aprovações"
      secondaryIcon={<ClipboardCheck className="h-3.5 w-3.5" strokeWidth={1.7} />}
      extraActions={
        <Button size="sm" variant="ghost" leftIcon={<FilePlus2 className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onCriarRequisicao}>
          Criar requisição
        </Button>
      }
      aside={
        <div className="flex h-full flex-col gap-4">
          <div>
            <p className="text-caption text-ink-tertiary">Requisições aguardando aprovação</p>
            <p className="mt-1 text-metric-sm tabular text-ink-primary">{purchasingSituation.requisicoesAguardandoAprovacao}</p>
          </div>
          <div>
            <p className="mb-1 text-label text-ink-tertiary">Pendências</p>
            <ul className="flex flex-col gap-1 text-support text-ink-secondary">
              <li>{purchasingSituation.comprasEmergenciais} compras emergenciais abertas</li>
              <li>{purchasingSituation.cotacoesProntasParaDecisao} cotações prontas para decisão</li>
              <li>
                {purchasingSituation.pedidosComDivergencia} pedidos com divergência ({formatCurrencyBRL(purchasingSituation.valorPedidosComDivergencia)})
              </li>
            </ul>
          </div>
          <div className="mt-auto flex flex-col gap-2 border-t border-border pt-3">
            <p className="text-caption text-ink-tertiary">Recomendação principal</p>
            <p className="text-support text-ink-secondary leading-relaxed">{purchasingRecommendationText}</p>
          </div>
        </div>
      }
    />
  )
}
