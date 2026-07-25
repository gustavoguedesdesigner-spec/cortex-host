import { SectionHeader } from '@/components/ui/SectionHeader'
import { InventoryStatusBadge } from '@/components/inventory/InventoryStatusBadge'
import { inventoryPositions } from '@/data/inventory/inventoryPositions'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { units } from '@/data/units'
import { formatCurrencyBRL } from '@/utils/format'
import type { InventoryItemStatus } from '@/types'

const statusOrder: InventoryItemStatus[] = ['normal', 'abaixo_minimo', 'risco_ruptura', 'excesso', 'sem_movimentacao', 'divergente', 'dados_insuficientes']

export function InventoryHealthSection({ onSelectStatus }: { onSelectStatus: (status: InventoryItemStatus) => void }) {
  const buckets = statusOrder.map((status) => {
    const positions = inventoryPositions.filter((p) => p.status === status)
    const valor = positions.reduce((sum, p) => {
      const item = getInventoryItemById(p.itemId)
      return sum + p.saldoSistemico * (item?.custoMedio ?? 0)
    }, 0)
    const unidadesAfetadas = Array.from(new Set(positions.map((p) => units.find((u) => u.id === p.unitId)?.nomeCurto).filter(Boolean)))
    return { status, quantidade: positions.length, valor, unidadesAfetadas }
  })

  return (
    <section>
      <SectionHeader title="Saúde do estoque" description="Distribuição dos itens por situação — clique para filtrar a posição de estoque" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {buckets.map((b) => (
          <button
            key={b.status}
            onClick={() => onSelectStatus(b.status)}
            className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 text-left transition-all hover:border-border-strong hover:shadow-card"
          >
            <InventoryStatusBadge status={b.status} />
            <p className="text-metric-sm tabular text-ink-primary">{b.quantidade}</p>
            <p className="text-caption text-ink-tertiary">{formatCurrencyBRL(b.valor)}</p>
            {b.unidadesAfetadas.length > 0 && <p className="truncate text-caption text-ink-tertiary">{b.unidadesAfetadas.join(', ')}</p>}
          </button>
        ))}
      </div>
    </section>
  )
}
