import { RefreshCw } from 'lucide-react'
import { FilterBar } from '@/components/ui/FilterBar'
import { SearchInput } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { units } from '@/data/units'

export type UnitSortKey = 'criticidade' | 'cmvReal' | 'diferenca' | 'impacto' | 'perdas' | 'alertas' | 'vendas' | 'melhor' | 'nome'
export type UnitStatusFilter = 'todas' | 'critico' | 'atencao' | 'saudavel'
export type UnitConditionFilter = 'todas' | 'inventario_pendente' | 'divergencia' | 'estoque_critico' | 'acoes_atrasadas'

const sortOptions: { value: UnitSortKey; label: string }[] = [
  { value: 'criticidade', label: 'Maior criticidade' },
  { value: 'cmvReal', label: 'Maior CMV real' },
  { value: 'diferenca', label: 'Maior diferença de CMV' },
  { value: 'impacto', label: 'Maior impacto financeiro' },
  { value: 'perdas', label: 'Maiores perdas' },
  { value: 'alertas', label: 'Maior número de alertas' },
  { value: 'vendas', label: 'Maiores vendas' },
  { value: 'melhor', label: 'Melhor desempenho' },
  { value: 'nome', label: 'Ordem alfabética' },
]

const statusOptions: { value: UnitStatusFilter; label: string }[] = [
  { value: 'todas', label: 'Todos os status' },
  { value: 'critico', label: 'Críticas' },
  { value: 'atencao', label: 'Em atenção' },
  { value: 'saudavel', label: 'Saudáveis' },
]

const conditionOptions: { value: UnitConditionFilter; label: string }[] = [
  { value: 'todas', label: 'Todas as condições' },
  { value: 'inventario_pendente', label: 'Com inventário pendente' },
  { value: 'divergencia', label: 'Com divergência de recebimento' },
  { value: 'estoque_critico', label: 'Com estoque crítico' },
  { value: 'acoes_atrasadas', label: 'Com ações atrasadas' },
]

const managerOptions = [{ value: 'todos', label: 'Todos os gerentes' }, ...units.map((u) => ({ value: u.gerente, label: u.gerente }))]

interface UnitsFilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  status: UnitStatusFilter
  onStatusChange: (v: UnitStatusFilter) => void
  condition: UnitConditionFilter
  onConditionChange: (v: UnitConditionFilter) => void
  manager: string
  onManagerChange: (v: string) => void
  sort: UnitSortKey
  onSortChange: (v: UnitSortKey) => void
  resultCount: number
}

export function UnitsFilterBar({
  search, onSearchChange, status, onStatusChange, condition, onConditionChange, manager, onManagerChange, sort, onSortChange, resultCount,
}: UnitsFilterBarProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <FilterBar>
        <SearchInput value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar unidade..." wrapperClassName="w-48" />
        <Select aria-label="Status" value={status} onChange={(e) => onStatusChange(e.target.value as UnitStatusFilter)} options={statusOptions} className="w-40" />
        <Select aria-label="Condição" value={condition} onChange={(e) => onConditionChange(e.target.value as UnitConditionFilter)} options={conditionOptions} className="w-56" />
        <Select aria-label="Gerente" value={manager} onChange={(e) => onManagerChange(e.target.value)} options={managerOptions} className="w-44" />
        <Select aria-label="Ordenar por" value={sort} onChange={(e) => onSortChange(e.target.value as UnitSortKey)} options={sortOptions} className="w-52 ml-auto" />
      </FilterBar>
      <div className="flex flex-wrap items-center justify-between gap-2 text-caption text-ink-tertiary">
        <span>{resultCount} de {units.length} unidades · Ambiente demonstrativo — dados simulados</span>
        <span className="flex items-center gap-1.5">
          <RefreshCw className="h-3 w-3" />
          Atualizado há 12 minutos
        </span>
      </div>
    </div>
  )
}
