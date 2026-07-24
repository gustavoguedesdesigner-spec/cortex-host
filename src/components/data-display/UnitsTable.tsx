import { useMemo, useState } from 'react'
import { Table, type TableColumn } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Select } from '@/components/ui/Select'
import { formatCurrencyCompactBRL, formatDateShort, formatPercent, formatPercentPoints } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Unit } from '@/types'

type SortKey = 'cmvReal' | 'diferenca' | 'perdas' | 'alertas' | 'nome'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'diferenca', label: 'Maior diferença' },
  { value: 'cmvReal', label: 'Maior CMV' },
  { value: 'perdas', label: 'Maiores perdas' },
  { value: 'alertas', label: 'Maior número de alertas' },
  { value: 'nome', label: 'Nome' },
]

export function UnitsTable({ units, onSelectUnit }: { units: Unit[]; onSelectUnit: (unit: Unit) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>('diferenca')

  const sorted = useMemo(() => {
    const withDiff = units.map((u) => ({ unit: u, diferenca: u.cmvReal - u.cmvTeorico }))
    withDiff.sort((a, b) => {
      switch (sortKey) {
        case 'nome':
          return a.unit.nome.localeCompare(b.unit.nome)
        case 'cmvReal':
          return b.unit.cmvReal - a.unit.cmvReal
        case 'perdas':
          return b.unit.perdas - a.unit.perdas
        case 'alertas':
          return b.unit.numeroAlertas - a.unit.numeroAlertas
        case 'diferenca':
        default:
          return b.diferenca - a.diferenca
      }
    })
    return withDiff.map((w) => w.unit)
  }, [units, sortKey])

  const columns: TableColumn<Unit>[] = [
    { key: 'nome', header: 'Unidade', render: (u) => <span className="font-medium">{u.nome}</span> },
    { key: 'status', header: 'Status', render: (u) => <StatusBadge level={u.nivelAtencao} /> },
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
    { key: 'vendas', header: 'Vendas', align: 'right', render: (u) => formatCurrencyCompactBRL(u.vendas) },
    { key: 'compras', header: 'Compras', align: 'right', render: (u) => formatCurrencyCompactBRL(u.compras) },
    { key: 'perdas', header: 'Perdas', align: 'right', render: (u) => formatCurrencyCompactBRL(u.perdas) },
    { key: 'alertas', header: 'Alertas', align: 'right', render: (u) => u.numeroAlertas },
    { key: 'ultimaContagem', header: 'Última contagem', align: 'right', render: (u) => formatDateShort(u.ultimaContagem) },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end">
        <Select
          aria-label="Ordenar unidades por"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          options={sortOptions.map((o) => ({ value: o.value, label: o.label }))}
          className="w-52"
        />
      </div>
      <Table columns={columns} data={sorted} getRowId={(u) => u.id} onRowClick={onSelectUnit} />
    </div>
  )
}
