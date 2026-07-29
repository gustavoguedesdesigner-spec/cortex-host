import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageBanner, PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { UnitStatusCard } from '@/components/data-display/UnitStatusCard'
import { UnitsTable } from '@/components/data-display/UnitsTable'
import { PerformanceMatrix } from '@/components/data-display/PerformanceMatrix'
import { NetworkSummaryBar } from './unidades/NetworkSummaryBar'
import { UnitsFilterBar, type UnitConditionFilter, type UnitSortKey, type UnitStatusFilter } from './unidades/UnitsFilterBar'
import { RankingsSection } from './unidades/RankingsSection'
import { ReplicableInsightCard } from './unidades/ReplicableInsightCard'
import { ComparisonDrawer } from './unidades/ComparisonDrawer'
import { units } from '@/data/units'
import { useAppState } from '@/context/AppStateContext'
import { SlidersHorizontal, Users2 } from 'lucide-react'
import type { Unit } from '@/types'

type ViewMode = 'cards' | 'tabela' | 'matriz'

export default function Unidades() {
  const navigate = useNavigate()
  const location = useLocation()
  const { askCortex } = useAppState()

  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<UnitStatusFilter>('todas')
  const [condition, setCondition] = useState<UnitConditionFilter>('todas')
  const [manager, setManager] = useState('todos')
  const [sort, setSort] = useState<UnitSortKey>('criticidade')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [comparisonOpen, setComparisonOpen] = useState(false)

  useEffect(() => {
    const preselecionar = (location.state as { preselecionar?: string } | null)?.preselecionar
    if (preselecionar) setSelectedIds((prev) => (prev.includes(preselecionar) ? prev : [...prev, preselecionar]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function openUnit(unit: Unit) {
    navigate(`/unidades/${unit.id}`)
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const filtered = useMemo(() => {
    return units.filter((u) => {
      if (search && !u.nome.toLowerCase().includes(search.toLowerCase()) && !u.nomeCurto.toLowerCase().includes(search.toLowerCase())) return false
      if (status !== 'todas' && u.nivelAtencao !== status) return false
      if (manager !== 'todos' && u.gerente !== manager) return false
      if (condition === 'inventario_pendente' && u.pendencias === 0) return false
      if (condition === 'divergencia' && u.divergenciasRecebimento === 0) return false
      if (condition === 'estoque_critico' && u.produtosCriticos === 0) return false
      if (condition === 'acoes_atrasadas' && u.acoesAtrasadas === 0) return false
      return true
    })
  }, [search, status, condition, manager])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (sort) {
      case 'nome':
        return arr.sort((a, b) => a.nome.localeCompare(b.nome))
      case 'cmvReal':
        return arr.sort((a, b) => b.cmvReal - a.cmvReal)
      case 'diferenca':
        return arr.sort((a, b) => b.cmvReal - b.cmvTeorico - (a.cmvReal - a.cmvTeorico))
      case 'impacto':
        return arr.sort((a, b) => b.impactoFinanceiro - a.impactoFinanceiro)
      case 'perdas':
        return arr.sort((a, b) => b.perdas - a.perdas)
      case 'alertas':
        return arr.sort((a, b) => b.numeroAlertas - a.numeroAlertas)
      case 'vendas':
        return arr.sort((a, b) => b.vendas - a.vendas)
      case 'melhor':
        return arr.sort((a, b) => a.cmvReal - a.cmvTeorico - (b.cmvReal - b.cmvTeorico))
      case 'criticidade':
      default:
        return arr.sort((a, b) => b.cmvReal - b.cmvTeorico - (a.cmvReal - a.cmvTeorico))
    }
  }, [filtered, sort])

  const selectedUnits = selectedIds.map((id) => units.find((u) => u.id === id)).filter(Boolean) as Unit[]

  return (
    <div className="flex flex-col gap-12">
      <PageHero
        eyebrow="Operação"
        title="Unidades"
        description="Compare a situação operacional das seis unidades e identifique onde sua atenção é mais necessária."
        banner={<PageBanner slot="banner-unidades" rotulo="Imagem do banner de Unidades" className="min-h-[172px]" />}
      />

      <NetworkSummaryBar
        onViewCritical={() => setStatus('critico')}
        onCompareTopBottom={() => {
          setSelectedIds(['moinhos', 'serra'])
          setComparisonOpen(true)
        }}
        onAskCortex={() => askCortex('Qual unidade precisa de atenção?')}
      />

      <ReplicableInsightCard
        onCompareProcesses={() => {
          setSelectedIds(['serra', 'moinhos'])
          setComparisonOpen(true)
        }}
        onCreateAction={() => askCortex('Comparar o processo de abertura e fechamento de estoque refrigerado entre Serra e Moinhos.')}
        onOpenReference={() => navigate('/unidades/serra')}
      />

      <section>
        <SectionHeader
          title="Comparativo da rede"
          description="Alterne entre cards, tabela comparativa e matriz de desempenho"
          actions={
            <SegmentedControl
              value={viewMode}
              onChange={setViewMode}
              options={[
                { value: 'cards', label: 'Cards' },
                { value: 'tabela', label: 'Tabela' },
                { value: 'matriz', label: 'Matriz' },
              ]}
            />
          }
        />

        <div className="mb-4">
          <UnitsFilterBar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            condition={condition}
            onConditionChange={setCondition}
            manager={manager}
            onManagerChange={setManager}
            sort={sort}
            onSortChange={setSort}
            resultCount={sorted.length}
          />
        </div>

        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="flex items-center gap-1.5 text-caption text-ink-tertiary pr-1">
              <Users2 className="h-3.5 w-3.5" />
              Selecionar para comparar:
            </span>
            {units.map((u) => (
              <button
                key={u.id}
                onClick={() => toggleSelect(u.id)}
                className={
                  'rounded-full border px-2.5 py-1 text-caption font-medium transition-colors ' +
                  (selectedIds.includes(u.id)
                    ? 'bg-accent border-accent text-white'
                    : 'bg-surface border-border text-ink-tertiary hover:text-ink-secondary')
                }
              >
                {u.nomeCurto}
              </button>
            ))}
          </div>
          <Button size="sm" variant="primary" disabled={selectedUnits.length < 2} onClick={() => setComparisonOpen(true)}>
            Comparar selecionadas ({selectedUnits.length})
          </Button>
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            icon={<SlidersHorizontal className="h-5 w-5" />}
            title="Nenhuma unidade encontrada"
            description="Ajuste os filtros para ver outras unidades da rede."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch('')
                  setStatus('todas')
                  setCondition('todas')
                  setManager('todos')
                }}
              >
                Limpar filtros
              </Button>
            }
          />
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sorted.map((unit) => (
              <UnitStatusCard key={unit.id} unit={unit} onClick={() => openUnit(unit)} />
            ))}
          </div>
        ) : viewMode === 'tabela' ? (
          <UnitsTable units={sorted} onSelectUnit={openUnit} />
        ) : (
          <PerformanceMatrix units={sorted} onSelectUnit={openUnit} />
        )}
      </section>

      <RankingsSection onOpenUnit={(id) => navigate(`/unidades/${id}`)} />

      <ComparisonDrawer units={comparisonOpen ? selectedUnits : []} onClose={() => setComparisonOpen(false)} />
    </div>
  )
}
