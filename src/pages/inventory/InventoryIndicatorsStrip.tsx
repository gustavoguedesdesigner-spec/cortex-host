import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { formatCurrencyBRL, formatCurrencyCompactBRL, formatPercent } from '@/utils/format'
import { inventoryAccuracy, inventorySituation, inventoryTotalValue } from '@/data/inventory/inventorySummary'

export function InventoryIndicatorsStrip({ onSelect }: { onSelect: (filtro: string) => void }) {
  return (
    <MetricStrip className="xl:grid-cols-4">
      <MetricCard titulo="Valor em estoque" valor={formatCurrencyCompactBRL(inventoryTotalValue)} status="neutral" comparacao="consolidado das 6 unidades" onClick={() => onSelect('todos')} />
      <MetricCard
        titulo="Acuracidade"
        valor={formatPercent(inventoryAccuracy.percentual, 1)}
        status="attention"
        comparacao={`Meta: ${formatPercent(inventoryAccuracy.meta, 0)}`}
        onClick={() => onSelect('divergentes')}
      />
      <MetricCard titulo="Risco de ruptura" valor={String(inventorySituation.riscoDeRuptura)} unidade="itens" status="critical" onClick={() => onSelect('risco_ruptura')} />
      <MetricCard titulo="Abaixo do mínimo" valor={String(inventorySituation.abaixoDoMinimo)} unidade="itens" status="attention" onClick={() => onSelect('abaixo_minimo')} />
      <MetricCard titulo="Estoque em excesso" valor={String(inventorySituation.emExcesso)} unidade="itens" status="info" onClick={() => onSelect('excesso')} />
      <MetricCard
        titulo="Perdas registradas"
        valor={formatCurrencyCompactBRL(inventorySituation.perdasRegistradas)}
        status="critical"
        tooltip={`Valor completo: ${formatCurrencyBRL(inventorySituation.perdasRegistradas)}`}
        onClick={() => onSelect('perdas')}
      />
      <MetricCard
        titulo="Divergências não justificadas"
        valor={formatCurrencyCompactBRL(inventorySituation.divergenciasNaoJustificadas)}
        status="attention"
        tooltip={`Valor completo: ${formatCurrencyBRL(inventorySituation.divergenciasNaoJustificadas)}`}
        onClick={() => onSelect('divergentes')}
      />
      <MetricCard titulo="Inventários pendentes" valor={String(inventorySituation.inventariosPendentesOuAtrasados)} status="attention" onClick={() => onSelect('inventarios')} />
    </MetricStrip>
  )
}
