import { useNavigate } from 'react-router-dom'
import { FilePlus2, Sparkles, TriangleAlert } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { SearchInput } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Tooltip } from '@/components/ui/Tooltip'
import { useAppState, useUnitOptions } from '@/context/AppStateContext'
import { formatPercent, formatRelativeShort } from '@/utils/format'
import { recipeCategorySummaries, recipeLastUpdate, recipeQualityOverall } from '@/data/recipes/recipeSummary'

export function RecipeHeader({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: {
  search: string
  onSearchChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
}) {
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const unitOptions = useUnitOptions()

  const categoryOptions = [{ value: 'todas', label: 'Todas as categorias' }, ...recipeCategorySummaries.map((c) => ({ value: c.id, label: c.categoria }))]

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Conhecimento"
        title="Fichas Técnicas"
        description="Padronize receitas, acompanhe custos e mantenha o CMV teórico alinhado à operação."
        actions={
          <>
            <Button size="sm" variant="secondary" leftIcon={<TriangleAlert className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/fichas-tecnicas/inconsistencias')}>
              Revisar inconsistências
            </Button>
            <Button size="sm" variant="navy" leftIcon={<FilePlus2 className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/fichas-tecnicas/nova')}>
              Nova ficha
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />}
              onClick={() => askCortex('Quais fichas precisam ser revisadas?', 'Fichas técnicas consolidadas')}
            >
              Pergunte ao CORTEX
            </Button>
          </>
        }
        meta={<p className="text-caption text-ink-tertiary">Atualizado {formatRelativeShort(recipeLastUpdate)}</p>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput aria-label="Buscar produto" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar produto..." wrapperClassName="w-56" />
        <Select aria-label="Categoria" value={category} onChange={(e) => onCategoryChange(e.target.value)} options={categoryOptions} className="w-48" />
        <Select aria-label="Unidade" defaultValue="todas" options={[{ value: 'todas', label: 'Todas as unidades' }, ...unitOptions.slice(1).map((u) => ({ value: u.id, label: u.nome }))]} className="w-48" />
        <Select aria-label="Responsável" defaultValue="todos" options={[{ value: 'todos', label: 'Todos os responsáveis' }, { value: 'chef', label: 'Chef Executivo' }, { value: 'operacoes', label: 'Operações' }]} className="w-52" />
        <Tooltip content="A qualidade das fichas influencia a confiabilidade do CMV teórico calculado a partir delas.">
          <span className="cursor-help">
            <IndicatorBadge status={recipeQualityOverall.percentual >= recipeQualityOverall.meta ? 'success' : 'attention'}>
              Qualidade das fichas: {formatPercent(recipeQualityOverall.percentual, 0)}
            </IndicatorBadge>
          </span>
        </Tooltip>
      </div>
    </div>
  )
}
