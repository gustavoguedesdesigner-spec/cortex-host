import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users2 } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { CmvConfidenceBadge } from '@/components/cmv/CmvConfidenceBadge'
import { ComparisonDrawer } from '@/pages/unidades/ComparisonDrawer'
import { units } from '@/data/units'
import { formatCurrencyCompactBRL, formatPercent, formatPercentPoints } from '@/utils/format'
import { cn } from '@/utils/cn'
import { useAppState } from '@/context/AppStateContext'
import type { CmvConfidenceLevel, TrendDirection, Unit } from '@/types'

type SortKey = 'impacto' | 'cmvReal' | 'diferenca' | 'perdas' | 'nome'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'impacto', label: 'Maior impacto' },
  { value: 'diferenca', label: 'Maior diferença' },
  { value: 'cmvReal', label: 'Maior CMV' },
  { value: 'perdas', label: 'Maiores perdas' },
  { value: 'nome', label: 'Nome' },
]

const confidenceByUnit: Record<string, CmvConfidenceLevel> = {
  moinhos: 'alta',
  'caxias-centro': 'alta',
  'zona-norte': 'media',
  'cidade-baixa': 'media',
  serra: 'alta',
  'caxias-norte': 'baixa',
}

const tendenciaByOperacional: Record<Unit['tendenciaOperacional'], TrendDirection> = {
  piorando: 'up',
  melhorando: 'down',
  estavel: 'flat',
}

const qualidadeLabel = (unitId: string) => (unitId === 'caxias-norte' ? 'Parcial (92% consolidado)' : 'Boa')

export function CmvUnitsTab() {
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const [sortKey, setSortKey] = useState<SortKey>('impacto')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [comparisonOpen, setComparisonOpen] = useState(false)

  const sorted = useMemo(() => {
    const arr = [...units]
    switch (sortKey) {
      case 'nome':
        return arr.sort((a, b) => a.nome.localeCompare(b.nome))
      case 'cmvReal':
        return arr.sort((a, b) => b.cmvReal - a.cmvReal)
      case 'perdas':
        return arr.sort((a, b) => b.perdas - a.perdas)
      case 'diferenca':
        return arr.sort((a, b) => b.cmvReal - b.cmvTeorico - (a.cmvReal - a.cmvTeorico))
      case 'impacto':
      default:
        return arr.sort((a, b) => b.impactoFinanceiro - a.impactoFinanceiro)
    }
  }, [sortKey])

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const selectedUnits = selectedIds.map((id) => units.find((u) => u.id === id)).filter(Boolean) as Unit[]

  const columns: TableColumn<Unit>[] = [
    { key: 'nome', header: 'Unidade', render: (u) => <span className="font-medium">{u.nomeCurto}</span> },
    { key: 'status', header: 'Status', render: (u) => <StatusBadge level={u.nivelAtencao} /> },
    { key: 'vendas', header: 'Vendas líquidas', align: 'right', render: (u) => formatCurrencyCompactBRL(u.vendas) },
    { key: 'cmvTeorico', header: 'CMV teórico', align: 'right', render: (u) => formatPercent(u.cmvTeorico) },
    { key: 'cmvReal', header: 'CMV real', align: 'right', render: (u) => formatPercent(u.cmvReal) },
    {
      key: 'diferenca',
      header: 'Diferença',
      align: 'right',
      render: (u) => (
        <span className={cn('font-medium', u.cmvReal > u.cmvTeorico ? 'text-danger' : 'text-success')}>
          {formatPercentPoints(u.cmvReal - u.cmvTeorico)}
        </span>
      ),
    },
    { key: 'impacto', header: 'Impacto', align: 'right', render: (u) => <span className="font-medium text-danger">{formatCurrencyCompactBRL(u.impactoFinanceiro)}</span> },
    { key: 'perdas', header: 'Perdas', align: 'right', render: (u) => formatCurrencyCompactBRL(u.perdas) },
    { key: 'qualidade', header: 'Qualidade dos dados', render: (u) => qualidadeLabel(u.id) },
    { key: 'confianca', header: 'Confiança', render: (u) => <CmvConfidenceBadge nivel={confidenceByUnit[u.id] ?? 'media'} /> },
    {
      key: 'tendencia',
      header: 'Tendência',
      render: (u) => (tendenciaByOperacional[u.tendenciaOperacional] === 'up' ? 'Piorando' : tendenciaByOperacional[u.tendenciaOperacional] === 'down' ? 'Melhorando' : 'Estável'),
    },
    {
      key: 'acao',
      header: '',
      align: 'right',
      render: (u) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/cmv/unidades/${u.id}`)}>
          Investigar
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Unidades"
        description="Comparação de CMV entre as seis unidades da rede — ordene, filtre e compare até 4 unidades"
        actions={
          <Select aria-label="Ordenar por" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} options={sortOptions} className="w-48" />
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1.5 pr-1 text-caption text-ink-tertiary">
            <Users2 className="h-3.5 w-3.5" strokeWidth={1.7} />
            Selecionar para comparar:
          </span>
          {units.map((u) => (
            <button
              key={u.id}
              onClick={() => toggleSelect(u.id)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-caption font-medium transition-colors',
                selectedIds.includes(u.id) ? 'border-accent bg-accent text-white' : 'border-border bg-surface text-ink-tertiary hover:text-ink-secondary',
              )}
            >
              {u.nomeCurto}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => askCortex('Quais unidades explicam a diferença?', 'CMV — Unidades')}>
            Perguntar ao CORTEX
          </Button>
          <Button size="sm" variant="primary" disabled={selectedUnits.length < 2} onClick={() => setComparisonOpen(true)}>
            Comparar selecionadas ({selectedUnits.length})
          </Button>
        </div>
      </div>

      <Table columns={columns} data={sorted} getRowId={(u) => u.id} onRowClick={(u) => navigate(`/cmv/unidades/${u.id}`)} />

      <ComparisonDrawer units={comparisonOpen ? selectedUnits : []} onClose={() => setComparisonOpen(false)} />
    </div>
  )
}
