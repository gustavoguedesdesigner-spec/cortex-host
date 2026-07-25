import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { purchaseFlowSteps } from '@/data/purchasing/situation'

/**
 * Visualização compacta do fluxo de compras — necessidades → requisições →
 * aprovação → cotação → pedidos → entrega → divergências. Cada etapa é
 * clicável e filtra a lista correspondente, sem virar um kanban pesado.
 */
export function PurchaseFlowBar() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-3">
      {purchaseFlowSteps.map((step, i) => (
        <div key={step.id} className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => navigate(step.path)}
            className="flex flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left transition-colors hover:bg-surface-hover"
          >
            <span className="text-metric tabular text-ink-primary">{step.valor}</span>
            <span className="whitespace-nowrap text-caption text-ink-tertiary">{step.label}</span>
          </button>
          {i < purchaseFlowSteps.length - 1 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-ink-tertiary" strokeWidth={1.7} />}
        </div>
      ))}
    </div>
  )
}
