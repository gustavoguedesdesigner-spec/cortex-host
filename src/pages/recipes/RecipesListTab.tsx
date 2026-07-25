import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { RecipeStatusBadge } from '@/components/recipes/RecipeStatusBadge'
import { RecipeQualityBadge } from '@/components/recipes/RecipeQualityBadge'
import { recipeListRows, type RecipeListRow } from '@/data/recipes/recipeRows'
import { getIssuesByRecipe } from '@/data/recipes/recipeIssues'
import { formatCurrencyBRL, formatCurrencyPreciseBRL, formatDateShort, formatPercent } from '@/utils/format'

type QuickFilter =
  | 'todas'
  | 'vigentes'
  | 'em_revisao'
  | 'incompletas'
  | 'sem_ficha'
  | 'custo_desatualizado'
  | 'conversao_inconsistente'
  | 'margem_critica'
  | 'desvio_operacional'
  | 'aguardando_aprovacao'

const quickFilters: { value: QuickFilter; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'vigentes', label: 'Vigentes' },
  { value: 'em_revisao', label: 'Em revisão' },
  { value: 'incompletas', label: 'Incompletas' },
  { value: 'sem_ficha', label: 'Sem ficha' },
  { value: 'custo_desatualizado', label: 'Custo desatualizado' },
  { value: 'conversao_inconsistente', label: 'Conversão inconsistente' },
  { value: 'margem_critica', label: 'Margem crítica' },
  { value: 'desvio_operacional', label: 'Desvio operacional' },
  { value: 'aguardando_aprovacao', label: 'Aguardando aprovação' },
]

const MARGEM_CRITICA = 0.45

function matchesFilter(row: RecipeListRow, filtro: QuickFilter): boolean {
  const issues = getIssuesByRecipe(row.recipe.id)
  switch (filtro) {
    case 'todas':
      return true
    case 'vigentes':
      return row.version?.status === 'publicada'
    case 'em_revisao':
      return row.version?.status === 'em_revisao'
    case 'incompletas':
      return row.recipe.qualidade === 'incompleta'
    case 'sem_ficha':
      return row.recipe.qualidade === 'sem_ficha'
    case 'custo_desatualizado':
      return issues.some((i) => i.tipo === 'custo_desatualizado' || i.tipo === 'subreceita_desatualizada')
    case 'conversao_inconsistente':
      return issues.some((i) => i.tipo === 'sem_conversao')
    case 'margem_critica':
      return row.financials !== null && row.financials.margemPercentual < MARGEM_CRITICA
    case 'desvio_operacional':
      return issues.some((i) => i.tipo === 'unidade_diferente_estoque')
    case 'aguardando_aprovacao':
      return row.version?.status === 'aguardando_aprovacao' || issues.some((i) => i.tipo === 'sem_aprovacao')
    default:
      return true
  }
}

export function RecipesListTab({ search }: { search: string }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const filtroParam = searchParams.get('filtro') as QuickFilter | null

  const [filtro, setFiltro] = useState<QuickFilter>(filtroParam ?? 'todas')

  const filtered = useMemo(
    () =>
      recipeListRows.filter((r) => {
        if (!matchesFilter(r, filtro)) return false
        if (search && !r.recipe.nome.toLowerCase().includes(search.toLowerCase())) return false
        return true
      }),
    [filtro, search],
  )

  const columns: TableColumn<RecipeListRow>[] = [
    { key: 'nome', header: 'Produto', render: (r) => <span className="font-medium">{r.recipe.nome}</span> },
    { key: 'categoria', header: 'Categoria', render: (r) => r.recipe.categoria },
    { key: 'versao', header: 'Versão vigente', render: (r) => r.version?.versao ?? '—' },
    { key: 'custoPorcao', header: 'Custo por porção', align: 'right', render: (r) => (r.financials ? formatCurrencyPreciseBRL(r.financials.custoPorcao) : '—') },
    { key: 'preco', header: 'Preço de venda', align: 'right', render: (r) => (r.version ? formatCurrencyPreciseBRL(r.version.precoVenda) : '—') },
    { key: 'cmv', header: 'CMV teórico', align: 'right', render: (r) => (r.financials ? formatPercent(r.financials.cmvTeorico, 1) : '—') },
    {
      key: 'margem',
      header: 'Margem',
      align: 'right',
      render: (r) =>
        r.financials ? (
          <span className={r.financials.margemPercentual < MARGEM_CRITICA ? 'font-medium text-danger' : undefined}>
            {formatPercent(r.financials.margemPercentual, 1)}
          </span>
        ) : (
          '—'
        ),
    },
    { key: 'revisao', header: 'Última revisão', align: 'right', render: (r) => formatDateShort(r.recipe.ultimaRevisaoIso) },
    { key: 'responsavel', header: 'Responsável', render: (r) => r.recipe.responsavel },
    { key: 'qualidade', header: 'Qualidade', render: (r) => <RecipeQualityBadge qualidade={r.recipe.qualidade} /> },
    { key: 'status', header: 'Status', render: (r) => (r.version ? <RecipeStatusBadge status={r.version.status} /> : '—') },
    {
      key: 'divergencia',
      header: 'Divergência real',
      align: 'right',
      render: (r) => (r.impactoTotal > 0 ? <span className="font-medium text-danger">{formatCurrencyBRL(r.impactoTotal)}</span> : '—'),
    },
    {
      key: 'acao',
      header: '',
      align: 'right',
      render: (r) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/fichas-tecnicas/${r.recipe.id}`)}>
          Abrir
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Todas as fichas técnicas"
        description="Custo, preço, CMV teórico e margem calculados a partir da versão vigente"
        actions={<SegmentedControl value={filtro} onChange={setFiltro} options={quickFilters} />}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<SlidersHorizontal className="h-5 w-5" />}
          title="Nenhuma ficha encontrada"
          description="Ajuste os filtros ou a busca para ver outras fichas técnicas."
          action={
            <Button variant="secondary" onClick={() => setFiltro('todas')}>
              Limpar filtros
            </Button>
          }
        />
      ) : (
        <Table columns={columns} data={filtered} getRowId={(r) => r.recipe.id} onRowClick={(r) => navigate(`/fichas-tecnicas/${r.recipe.id}`)} stickyFirstColumn />
      )}
    </div>
  )
}
