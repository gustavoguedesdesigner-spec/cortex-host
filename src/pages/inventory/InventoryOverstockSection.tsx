import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tooltip } from '@/components/ui/Tooltip'
import { Info } from 'lucide-react'
import { inventoryPositions, inventoryNow } from '@/data/inventory/inventoryPositions'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { units } from '@/data/units'
import { calcularCobertura, calcularSaldoDisponivel, calcularDiasSemMovimentacao } from '@/utils/inventoryCalculations'
import { formatCurrencyBRL } from '@/utils/format'
import { inventoryOverstockInsight, inventoryOverstockDisclaimer } from '@/data/inventory/inventorySummary'

export function InventoryOverstockSection() {
  const navigate = useNavigate()

  const rows = inventoryPositions
    .filter((p) => p.status === 'excesso' || p.status === 'sem_movimentacao')
    .map((p) => {
      const item = getInventoryItemById(p.itemId)
      const unit = units.find((u) => u.id === p.unitId)
      if (!item || !unit) return null
      const saldoDisponivel = calcularSaldoDisponivel(p.saldoSistemico, p.quantidadeReservada, p.quantidadeBloqueada)
      const cobertura = calcularCobertura(saldoDisponivel, p.consumoMedioDiario)
      const diasSemMovimentacao = calcularDiasSemMovimentacao(p.ultimaMovimentacao, inventoryNow)
      return {
        id: `${p.itemId}-${p.unitId}`,
        itemId: p.itemId,
        nome: item.nome,
        unitNome: unit.nomeCurto,
        valor: p.saldoSistemico * item.custoMedio,
        diasSemMovimentacao,
        cobertura,
        unidadeMedida: item.unidadeMedida,
      }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => b.valor - a.valor)

  return (
    <section>
      <SectionHeader
        title="Capital imobilizado"
        description="Itens em excesso ou sem movimentação relevante"
        actions={
          <Tooltip content={inventoryOverstockDisclaimer}>
            <span className="flex cursor-help items-center gap-1 text-caption text-ink-tertiary">
              <Info className="h-3.5 w-3.5" strokeWidth={1.7} />
              Sobre esta análise
            </span>
          </Tooltip>
        }
      />
      <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
        {rows.map((r) => (
          <button
            key={r.id}
            onClick={() => navigate(`/estoque/itens/${r.itemId}`)}
            className="flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
          >
            <div className="min-w-0">
              <p className="truncate text-support font-medium text-ink-primary">{r.nome}</p>
              <p className="mt-0.5 text-caption text-ink-tertiary">
                {r.unitNome} · {r.diasSemMovimentacao} dias sem movimentação
                {r.cobertura !== null && ` · cobertura estimada de ${Math.round(r.cobertura)} dias`}
              </p>
            </div>
            <span className="shrink-0 tabular text-support font-medium text-ink-primary">{formatCurrencyBRL(r.valor)}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-support text-ink-secondary">{inventoryOverstockInsight}</p>
    </section>
  )
}
