import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { RecipeBreadcrumb } from '@/components/recipes/RecipeBreadcrumb'
import { RecipeInternalNav } from '@/components/recipes/RecipeInternalNav'
import { MenuQuadrantMatrix } from '@/components/recipes/MenuQuadrantMatrix'
import { PageHeader } from '@/components/ui/PageHeader'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Drawer } from '@/components/ui/Drawer'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { menuEngineeringProducts } from '@/data/recipes/menuProducts'
import { menuClassificationLabel } from '@/utils/menuEngineering'
import { formatCurrencyCompactBRL, formatPercent } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { MenuClassification, MenuEngineeringProduct } from '@/types'

const classificationStatus: Record<MenuClassification, 'success' | 'info' | 'attention' | 'critical'> = {
  estrela: 'success',
  cavalo_batalha: 'info',
  quebra_cabeca: 'attention',
  cao: 'critical',
}

const trendIcon = { up: ArrowUp, down: ArrowDown, flat: Minus }
const trendColor = { up: 'text-danger', down: 'text-success', flat: 'text-ink-tertiary' }

export default function MenuEngineering() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<MenuEngineeringProduct | null>(null)

  const countByClass = (c: MenuClassification) => menuEngineeringProducts.filter((p) => p.classificacaoComercial === c).length

  const columns: TableColumn<MenuEngineeringProduct>[] = [
    { key: 'nome', header: 'Produto', render: (p) => <span className="font-medium">{p.nome}</span> },
    { key: 'categoria', header: 'Categoria', render: (p) => p.categoria },
    { key: 'unidades', header: 'Unidades vendidas', align: 'right', render: (p) => p.unidadesVendidas.toLocaleString('pt-BR') },
    { key: 'receita', header: 'Receita', align: 'right', render: (p) => formatCurrencyCompactBRL(p.receita) },
    { key: 'popularidade', header: 'Popularidade', align: 'right', render: (p) => formatPercent(p.popularidadeIndice, 0) },
    { key: 'margem', header: 'Margem observada', align: 'right', render: (p) => formatPercent(p.margemObservada, 1) },
    {
      key: 'tendencia',
      header: 'Tendência',
      align: 'right',
      render: (p) => {
        const Icon = trendIcon[p.tendencia]
        return <Icon className={cn('inline h-3.5 w-3.5', trendColor[p.tendencia])} strokeWidth={1.7} />
      },
    },
    { key: 'classificacao', header: 'Classificação', render: (p) => <IndicatorBadge status={classificationStatus[p.classificacaoComercial]}>{menuClassificationLabel[p.classificacaoComercial].classico}</IndicatorBadge> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <RecipeBreadcrumb trail={[{ label: 'Engenharia de cardápio' }]} />

      <PageHeader
        eyebrow="Conhecimento"
        title="Engenharia de Cardápio"
        description="Cruza popularidade e margem observada para classificar cada produto — vender muito não significa preservar margem."
      />

      <RecipeInternalNav active="engenharia" />

      <MetricStrip className="sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard titulo={menuClassificationLabel.estrela.classico} valor={String(countByClass('estrela'))} status="success" comparacao="Alto volume, alta margem" />
        <MetricCard titulo={menuClassificationLabel.cavalo_batalha.classico} valor={String(countByClass('cavalo_batalha'))} status="info" comparacao="Alto volume, margem baixa" />
        <MetricCard titulo={menuClassificationLabel.quebra_cabeca.classico} valor={String(countByClass('quebra_cabeca'))} status="attention" comparacao="Baixo volume, alta margem" />
        <MetricCard titulo={menuClassificationLabel.cao.classico} valor={String(countByClass('cao'))} status="critical" comparacao="Baixo volume, margem baixa" />
      </MetricStrip>

      <section>
        <SectionHeader title="Matriz popularidade × margem" description="Clique em um ponto para ver o detalhe do produto" />
        <MenuQuadrantMatrix products={menuEngineeringProducts} onSelectProduct={setSelected} />
      </section>

      <section>
        <SectionHeader title="Todos os produtos" />
        <Table columns={columns} data={menuEngineeringProducts} getRowId={(p) => p.id} onRowClick={setSelected} />
      </section>

      <Drawer isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.nome ?? ''} widthClassName="w-full max-w-lg">
        {selected && (
          <div className="flex flex-col gap-5">
            <IndicatorBadge status={classificationStatus[selected.classificacaoComercial]}>
              {menuClassificationLabel[selected.classificacaoComercial].classico} — {menuClassificationLabel[selected.classificacaoComercial].executivo}
            </IndicatorBadge>
            <DataList
              items={[
                { label: 'Categoria', value: selected.categoria },
                { label: 'Unidades vendidas', value: selected.unidadesVendidas.toLocaleString('pt-BR') },
                { label: 'Receita', value: formatCurrencyCompactBRL(selected.receita) },
                { label: 'Custo teórico', value: formatCurrencyCompactBRL(selected.custoTeorico) },
                { label: 'Custo real estimado', value: formatCurrencyCompactBRL(selected.custoRealEstimado) },
                { label: 'Margem teórica', value: formatPercent(selected.margemTeorica, 1) },
                { label: 'Margem observada', value: formatPercent(selected.margemObservada, 1) },
                { label: 'Popularidade', value: formatPercent(selected.popularidadeIndice, 0) },
                { label: 'Complexidade operacional', value: selected.complexidade === 'alta' ? 'Alta' : selected.complexidade === 'media' ? 'Média' : 'Baixa' },
                { label: 'Desvio operacional', value: selected.desvioOperacional === 'alto' ? 'Alto' : selected.desvioOperacional === 'medio' ? 'Médio' : 'Baixo' },
              ]}
            />
            <Button size="sm" variant="secondary" onClick={() => navigate(`/fichas-tecnicas/${selected.recipeId}`)}>
              Abrir ficha técnica
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  )
}
