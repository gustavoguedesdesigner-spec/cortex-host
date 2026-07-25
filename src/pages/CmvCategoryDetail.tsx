import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowDown, ArrowUp, ClipboardPlus, Minus, Sparkles } from 'lucide-react'
import { CmvBreadcrumb } from '@/components/cmv/CmvBreadcrumb'
import { Button } from '@/components/ui/Button'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { CreateActionModal, type CreateActionDefaults } from '@/components/cortex/CreateActionModal'
import { CmvWeeklyChart } from '@/components/data-display/CmvWeeklyChart'
import { confidenceLabel } from '@/utils/cmvConfidence'
import { getCmvCategoryById } from '@/data/cmv/cmvCategories'
import { cmvProducts } from '@/data/cmv/cmvProducts'
import { cmvCauses } from '@/data/cmv/cmvCauses'
import { cmvWeeklySeriesConsolidado, cmvMeta } from '@/data/cmv-weekly-series'
import { units } from '@/data/units'
import { useAppState } from '@/context/AppStateContext'
import { useCreatedActions } from '@/hooks/useCreatedActions'
import { calcularParticipacao } from '@/utils/cmvCalculations'
import { formatCurrencyBRL, formatCurrencyCompactBRL, formatPercent } from '@/utils/format'
import { financialImpactTotal } from '@/data/financial-impact'
import { cn } from '@/utils/cn'
import NotFound from './NotFound'
import type { CmvProductData } from '@/types'

const trendIcon = { up: ArrowUp, down: ArrowDown, flat: Minus }
const trendColor = { up: 'text-danger', down: 'text-success', flat: 'text-ink-tertiary' }
const trendLabel = { up: 'Piora nas últimas semanas', down: 'Melhora nas últimas semanas', flat: 'Estável nas últimas semanas' }

export default function CmvCategoryDetail() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { createAction } = useCreatedActions()
  const [modalDefaults, setModalDefaults] = useState<CreateActionDefaults | null>(null)

  const categoria = categoryId ? getCmvCategoryById(categoryId) : undefined
  if (!categoria) return <NotFound />

  const produtos = cmvProducts.filter((p) => p.categoriaId === categoria.id).sort((a, b) => b.impacto - a.impacto)
  const causas = cmvCauses.filter((c) => c.categorias.includes(categoria.categoria)).sort((a, b) => b.impacto - a.impacto)
  const participacao = calcularParticipacao(categoria.impacto, financialImpactTotal)
  const contextLabel = `CMV — ${categoria.categoria}`

  const unidadesAfetadasUnits = categoria.unidadesAfetadas
    .map((nomeCurto) => units.find((u) => u.nomeCurto === nomeCurto))
    .filter(Boolean) as typeof units

  const columns: TableColumn<CmvProductData>[] = [
    { key: 'nome', header: 'Produto', render: (p) => <span className="font-medium">{p.nome}</span> },
    { key: 'impacto', header: 'Impacto', align: 'right', render: (p) => <span className="font-medium text-danger">{formatCurrencyBRL(p.impacto)}</span> },
    {
      key: 'tendencia',
      header: 'Tendência',
      align: 'right',
      render: (p) => {
        const Icon = trendIcon[p.tendencia]
        return <Icon className={cn('inline h-3.5 w-3.5', trendColor[p.tendencia])} strokeWidth={1.7} />
      },
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <CmvBreadcrumb trail={[{ label: 'Categorias', path: '/cmv?tab=categorias' }, { label: categoria.categoria }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-page-title">{categoria.categoria}</h1>
          <p className="text-support text-ink-secondary">{categoria.resumo}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            leftIcon={<ClipboardPlus className="h-3.5 w-3.5" strokeWidth={1.7} />}
            onClick={() => setModalDefaults({ titulo: `Reduzir o desvio de ${categoria.categoria}`, prioridade: 'alta' })}
          >
            Criar ação
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex(`Quais categorias mais prejudicam a margem?`, contextLabel)}>
            Perguntar ao CORTEX
          </Button>
        </div>
      </div>

      <MetricStrip className="xl:grid-cols-4">
        <MetricCard titulo="Impacto estimado" valor={formatCurrencyCompactBRL(categoria.impacto)} status={categoria.impacto > 0 ? 'critical' : 'success'} />
        <MetricCard titulo="Participação no desvio" valor={formatPercent(participacao, 1)} status="neutral" />
        <MetricCard titulo="Tendência" valor={trendLabel[categoria.tendencia]} status={categoria.tendencia === 'up' ? 'attention' : 'neutral'} />
        <MetricCard titulo="Confiança" valor={confidenceLabel[categoria.confianca]} status="neutral" />
      </MetricStrip>

      {categoria.unidadesAfetadas.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-support text-ink-tertiary">Unidades mais afetadas:</span>
          {unidadesAfetadasUnits.map((u) => (
            <button
              key={u.id}
              onClick={() => navigate(`/cmv/unidades/${u.id}`)}
              className="rounded-full border border-border bg-surface px-2.5 py-1 text-caption font-medium text-ink-secondary transition-colors hover:border-border-strong hover:text-ink-primary"
            >
              {u.nomeCurto}
            </button>
          ))}
        </div>
      )}

      <section>
        <SectionHeader title="Evolução" description="CMV teórico versus real da rede — referência para acompanhar o efeito desta categoria" />
        <div className="rounded-lg border border-border bg-surface p-5">
          <CmvWeeklyChart data={cmvWeeklySeriesConsolidado} meta={cmvMeta} height={220} />
        </div>
      </section>

      {categoria.explicacoesProvaveis.length > 0 && (
        <section>
          <SectionHeader title="Explicações prováveis" description="Hipóteses investigativas — exigem validação, não são conclusões definitivas" />
          <ol className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface px-4">
            {categoria.explicacoesProvaveis.map((exp, i) => (
              <li key={i} className="flex items-baseline gap-3 py-3">
                <span className="tabular text-caption text-ink-tertiary">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-support text-ink-primary">{exp}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {produtos.length > 0 && (
        <section>
          <SectionHeader title="Produtos desta categoria" description="Ordenados por impacto financeiro estimado" />
          <Table columns={columns} data={produtos} getRowId={(p) => p.id} onRowClick={(p) => navigate(`/cmv/produtos/${p.id}`)} />
        </section>
      )}

      {causas.length > 0 && (
        <section>
          <SectionHeader title="Causas relacionadas" description="Causas priorizadas do período que envolvem esta categoria" />
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
            {causas.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-support font-medium text-ink-primary">{c.titulo}</p>
                  <p className="text-caption text-ink-tertiary">{c.unidades.join(', ') || 'Rede'}</p>
                </div>
                <span className="tabular text-support font-medium text-danger">{formatCurrencyBRL(c.impacto)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <CreateActionModal isOpen={Boolean(modalDefaults)} onClose={() => setModalDefaults(null)} defaults={modalDefaults ?? undefined} onSave={(action) => createAction(action)} />
    </div>
  )
}
