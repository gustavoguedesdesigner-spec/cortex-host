import { ClipboardPlus, ListPlus, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { SearchInput } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Tooltip } from '@/components/ui/Tooltip'
import { periodOptions } from '@/data/periods'
import { useAppState, useUnitOptions } from '@/context/AppStateContext'
import { formatPercent, formatRelativeShort } from '@/utils/format'
import { inventoryAccuracy, inventoryLastUpdate } from '@/data/inventory/inventorySummary'

export function InventoryHeader({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categoryOptions,
  onStartCount,
  onRegisterMovement,
}: {
  search: string
  onSearchChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
  categoryOptions: { value: string; label: string }[]
  onStartCount: () => void
  onRegisterMovement: () => void
}) {
  const { periodo, setPeriodo, unidadeSelecionada, setUnidadeSelecionada, askCortex } = useAppState()
  const unitOptions = useUnitOptions()

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Operação"
        title="Estoque"
        description="Veja a posição atual, identifique divergências e acompanhe inventários, transferências e perdas."
        actions={
          <>
            <Button size="sm" variant="secondary" leftIcon={<ClipboardPlus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onStartCount}>
              Iniciar inventário
            </Button>
            <Button size="sm" variant="navy" leftIcon={<ListPlus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onRegisterMovement}>
              Registrar movimentação
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />}
              onClick={() => askCortex('Quais itens estão em risco de ruptura?', 'Estoque consolidado')}
            >
              Pergunte ao CORTEX
            </Button>
          </>
        }
        meta={<p className="text-caption text-ink-tertiary">Atualizado {formatRelativeShort(inventoryLastUpdate)}</p>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select aria-label="Período" value={periodo} onChange={(e) => setPeriodo(e.target.value as typeof periodo)} options={periodOptions.map((p) => ({ value: p.id, label: p.label }))} className="w-40" />
        <Select aria-label="Unidade" value={unidadeSelecionada} onChange={(e) => setUnidadeSelecionada(e.target.value)} options={unitOptions.map((u) => ({ value: u.id, label: u.nome }))} className="w-52" />
        <Select aria-label="Categoria" value={category} onChange={(e) => onCategoryChange(e.target.value)} options={categoryOptions} className="w-48" />
        <SearchInput aria-label="Buscar item" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar item..." wrapperClassName="w-56" />
        <Tooltip content="A qualidade dos dados influencia a precisão e o nível de confiança das análises.">
          <span className="cursor-help">
            <IndicatorBadge status={inventoryAccuracy.classificacao === 'boa' ? 'success' : 'attention'}>
              Acuracidade: {formatPercent(inventoryAccuracy.percentual, 1)} — {inventoryAccuracy.classificacao === 'boa' ? 'Boa' : 'Parcial'}
            </IndicatorBadge>
          </span>
        </Tooltip>
      </div>
    </div>
  )
}
