import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecipeBreadcrumb } from '@/components/recipes/RecipeBreadcrumb'
import { RecipeInternalNav } from '@/components/recipes/RecipeInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Drawer } from '@/components/ui/Drawer'
import { DataList } from '@/components/ui/DataList'
import { recipeCostItems, staleCostItems, oleoDeSojaImpactoMensal } from '@/data/recipes/recipeCosts'
import { getRecipeById } from '@/data/recipes/recipes'
import { confidenceLabel } from '@/utils/cmvConfidence'
import { formatCurrencyPreciseBRL, formatDateFull, formatPercentPoints } from '@/utils/format'
import type { RecipeCostItem } from '@/types'

const origemLabel = { custo_medio: 'Custo médio', ultimo_custo: 'Último custo', custo_contratado: 'Custo contratado', custo_definido_empresa: 'Custo definido pela empresa' }

export default function RecipeCosts() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<RecipeCostItem | null>(null)

  const variacao = (c: RecipeCostItem) => (c.custoAnterior === 0 ? 0 : (c.custoAtual - c.custoAnterior) / c.custoAnterior)

  const columns: TableColumn<RecipeCostItem>[] = [
    { key: 'nome', header: 'Insumo', render: (c) => <span className="font-medium">{c.nome}</span> },
    { key: 'fornecedor', header: 'Fornecedor', render: (c) => c.fornecedor },
    { key: 'origem', header: 'Origem do custo', render: (c) => origemLabel[c.origem] },
    { key: 'atual', header: 'Custo atual', align: 'right', render: (c) => `${formatCurrencyPreciseBRL(c.custoAtual)} / ${c.unidadeMedida}` },
    { key: 'anterior', header: 'Custo anterior', align: 'right', render: (c) => `${formatCurrencyPreciseBRL(c.custoAnterior)} / ${c.unidadeMedida}` },
    {
      key: 'variacao',
      header: 'Variação',
      align: 'right',
      render: (c) => (
        <span className={variacao(c) > 0 ? 'font-medium text-danger' : variacao(c) < 0 ? 'font-medium text-success' : undefined}>{formatPercentPoints(variacao(c))}</span>
      ),
    },
    { key: 'fichas', header: 'Fichas afetadas', align: 'right', render: (c) => c.fichasAfetadas.length },
    { key: 'dias', header: 'Dias sem atualização', align: 'right', render: (c) => (c.diasSemAtualizacao > 30 ? <span className="font-medium text-warning">{c.diasSemAtualizacao}</span> : c.diasSemAtualizacao) },
    { key: 'confianca', header: 'Confiança', render: (c) => confidenceLabel[c.confianca] },
  ]

  return (
    <div className="flex flex-col gap-6">
      <RecipeBreadcrumb trail={[{ label: 'Custos' }]} />

      <PageHeader eyebrow="Conhecimento" title="Custos" description="Origem, variação e defasagem dos custos de insumo que alimentam o cálculo de CMV teórico das fichas técnicas." />

      <RecipeInternalNav active="custos" />

      <MetricStrip className="sm:grid-cols-3">
        <MetricCard titulo="Insumos monitorados" valor={String(recipeCostItems.length)} status="neutral" />
        <MetricCard titulo="Custos desatualizados" valor={String(staleCostItems.length)} status="attention" tooltip="Sem atualização há mais de 30 dias" />
        <MetricCard titulo="Impacto mensal — óleo de soja" valor={formatCurrencyPreciseBRL(oleoDeSojaImpactoMensal)} status="critical" onClick={() => setSelected(recipeCostItems[0])} />
      </MetricStrip>

      <section>
        <SectionHeader title="Insumos" description="Clique em um insumo para ver as fichas técnicas afetadas" />
        <Table columns={columns} data={recipeCostItems} getRowId={(c) => c.id} onRowClick={setSelected} />
      </section>

      <Drawer isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.nome ?? ''} widthClassName="w-full max-w-lg">
        {selected && (
          <div className="flex flex-col gap-5">
            <DataList
              items={[
                { label: 'Fornecedor', value: selected.fornecedor },
                { label: 'Origem do custo', value: origemLabel[selected.origem] },
                { label: 'Custo atual', value: `${formatCurrencyPreciseBRL(selected.custoAtual)} / ${selected.unidadeMedida}` },
                { label: 'Custo anterior', value: `${formatCurrencyPreciseBRL(selected.custoAnterior)} / ${selected.unidadeMedida}` },
                { label: 'Variação', value: formatPercentPoints(variacao(selected)) },
                { label: 'Última atualização', value: formatDateFull(selected.ultimaAtualizacaoIso) },
                { label: 'Dias sem atualização', value: selected.diasSemAtualizacao },
                { label: 'Confiança', value: <IndicatorBadge status={selected.confianca === 'alta' ? 'success' : selected.confianca === 'media' ? 'attention' : 'critical'}>{confidenceLabel[selected.confianca]}</IndicatorBadge> },
              ]}
            />
            {selected.id === 'oleo-de-soja' && (
              <p className="rounded-md bg-warning-soft p-3 text-support text-warning">
                Impacto mensal estimado de {formatCurrencyPreciseBRL(oleoDeSojaImpactoMensal)} — mesma variação de custo (+9,4%) já identificada no módulo de CMV, junto à Distribuidora Gaúcha.
              </p>
            )}
            <div>
              <p className="mb-2 text-label text-ink-tertiary">Fichas técnicas afetadas ({selected.fichasAfetadas.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.fichasAfetadas.map((id) => {
                  const recipe = getRecipeById(id)
                  return (
                    <button
                      key={id}
                      onClick={() => navigate(`/fichas-tecnicas/${id}`)}
                      className="rounded-full border border-border bg-surface px-2.5 py-1 text-caption font-medium text-ink-secondary transition-colors hover:border-border-strong hover:text-ink-primary"
                    >
                      {recipe?.nome ?? id}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
