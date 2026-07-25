import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecipeBreadcrumb } from '@/components/recipes/RecipeBreadcrumb'
import { RecipeInternalNav } from '@/components/recipes/RecipeInternalNav'
import { RecipeStatusBadge } from '@/components/recipes/RecipeStatusBadge'
import { RecipeIngredientTable } from '@/components/recipes/RecipeIngredientTable'
import { PageHeader } from '@/components/ui/PageHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Drawer } from '@/components/ui/Drawer'
import { DataList } from '@/components/ui/DataList'
import { subRecipes } from '@/data/recipes/subRecipes'
import { getRecipeById } from '@/data/recipes/recipes'
import { calcularCustoPorGrama, calcularCustoReceita } from '@/utils/recipeCalculations'
import { formatCurrencyPreciseBRL, formatDateFull } from '@/utils/format'
import type { SubRecipe } from '@/types'

export default function RecipeSubRecipes() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<SubRecipe | null>(null)

  const columns: TableColumn<SubRecipe>[] = [
    { key: 'nome', header: 'Sub-receita', render: (s) => <span className="font-medium">{s.nome}</span> },
    { key: 'rendimento', header: 'Rendimento', align: 'right', render: (s) => `${s.rendimentoG.toLocaleString('pt-BR')} g` },
    { key: 'validade', header: 'Validade', align: 'right', render: (s) => `${s.validadeDias} dias` },
    { key: 'versao', header: 'Versão', render: (s) => s.versao },
    { key: 'responsavel', header: 'Responsável', render: (s) => s.responsavel },
    { key: 'produtos', header: 'Produtos relacionados', align: 'right', render: (s) => s.produtosRelacionados.length },
    { key: 'status', header: 'Status', render: (s) => <RecipeStatusBadge status={s.status} /> },
  ]

  const custoTotal = selected ? calcularCustoReceita(selected.ingredientes) : 0
  const custoPorGrama = selected ? calcularCustoPorGrama(custoTotal, selected.rendimentoG) : 0

  return (
    <div className="flex flex-col gap-6">
      <RecipeBreadcrumb trail={[{ label: 'Sub-receitas' }]} />

      <PageHeader eyebrow="Conhecimento" title="Sub-receitas" description="Preparos intermediários usados em uma ou mais fichas técnicas — rendimento, validade e custo por grama." />

      <RecipeInternalNav active="subreceitas" />

      <Table columns={columns} data={subRecipes} getRowId={(s) => s.id} onRowClick={setSelected} />

      <Drawer isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.nome ?? ''} widthClassName="w-full max-w-lg">
        {selected && (
          <div className="flex flex-col gap-5">
            <DataList
              items={[
                { label: 'Versão', value: selected.versao },
                { label: 'Status', value: <RecipeStatusBadge status={selected.status} /> },
                { label: 'Rendimento', value: `${selected.rendimentoG.toLocaleString('pt-BR')} g` },
                { label: 'Validade', value: `${selected.validadeDias} dias` },
                { label: 'Responsável', value: selected.responsavel },
                { label: 'Última atualização', value: formatDateFull(selected.ultimaAtualizacaoIso) },
                ...(selected.ingredientes.length > 0
                  ? [
                      { label: 'Custo total do lote', value: formatCurrencyPreciseBRL(custoTotal) },
                      { label: 'Custo por grama', value: formatCurrencyPreciseBRL(custoPorGrama) },
                    ]
                  : []),
                ...(selected.perdas ? [{ label: 'Perdas', value: selected.perdas }] : []),
              ]}
            />

            {selected.ingredientes.length > 0 ? (
              <div>
                <p className="mb-2 text-label text-ink-tertiary">Ingredientes</p>
                <RecipeIngredientTable ingredientes={selected.ingredientes} editable={false} />
              </div>
            ) : (
              <p className="text-support text-ink-tertiary">Sem detalhamento de ingredientes cadastrado para esta sub-receita.</p>
            )}

            {selected.preparo.length > 0 && (
              <div>
                <p className="mb-2 text-label text-ink-tertiary">Preparo</p>
                <ol className="flex flex-col gap-2">
                  {selected.preparo.map((step) => (
                    <li key={step.ordem} className="flex gap-2 text-support text-ink-secondary">
                      <span className="shrink-0 text-ink-tertiary">{step.ordem}.</span>
                      <span>
                        {step.instrucao}
                        {step.pontoControle && <span className="ml-1.5 text-caption text-info">— {step.pontoControle}</span>}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div>
              <p className="mb-2 text-label text-ink-tertiary">Produtos relacionados</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.produtosRelacionados.map((id) => {
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
