import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FilePlus2, GitCompareArrows, Percent, Sparkles } from 'lucide-react'
import { RecipeBreadcrumb } from '@/components/recipes/RecipeBreadcrumb'
import { RecipeQualityBadge } from '@/components/recipes/RecipeQualityBadge'
import { RecipeStatusBadge } from '@/components/recipes/RecipeStatusBadge'
import { RecipeIngredientTable } from '@/components/recipes/RecipeIngredientTable'
import { Button } from '@/components/ui/Button'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { DataList } from '@/components/ui/DataList'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tabs } from '@/components/ui/Tabs'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { AlertBadge } from '@/components/ui/AlertBadge'
import { CmvQuantityHistoryChart } from '@/components/cmv/CmvQuantityHistoryChart'
import { RecipeVersionHistorySection } from './recipes/RecipeVersionHistorySection'
import { RecipeCostSimulator } from './recipes/RecipeCostSimulator'
import { getRecipeById } from '@/data/recipes/recipes'
import { getCmvProductById } from '@/data/cmv/cmvProducts'
import { getRecipeVersionsByRecipe } from '@/data/recipes/recipeVersions'
import { getIssuesByRecipe } from '@/data/recipes/recipeIssues'
import { burgerCostelaConsumption, burgerCostelaUnitComparison, burgerCostelaUnitComparisonInsight } from '@/data/recipes/recipeConsumption'
import { units } from '@/data/units'
import { useAppState } from '@/context/AppStateContext'
import { useCreatedRecipes } from '@/hooks/useCreatedRecipes'
import { useRecipeApprovals } from '@/hooks/useRecipeApprovals'
import { computeRecipeFinancials } from '@/utils/recipeCalculations'
import { formatCurrencyBRL, formatCurrencyPreciseBRL, formatDateFull, formatPercent } from '@/utils/format'
import { cn } from '@/utils/cn'
import NotFound from './NotFound'

const approvalStatusIndicator = { aprovado: 'success', pendente: 'attention', rejeitado: 'critical' } as const

/** Rotas com o mesmo elemento não remontam ao trocar apenas o :recipeId — a key força reset de estado local (aba ativa, simulador) entre fichas. */
export default function RecipeDetail() {
  const { recipeId } = useParams<{ recipeId: string }>()
  return <RecipeDetailBody key={recipeId} recipeId={recipeId} />
}

function RecipeDetailBody({ recipeId }: { recipeId?: string }) {
  // Todos os hooks precisam rodar sempre, na mesma ordem, independente de a ficha existir —
  // os retornos antecipados (sem ficha / sem versão) vêm depois, nunca entre hooks.
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { getCreatedRecipeById } = useCreatedRecipes()
  const { getStepStatus, setStepStatus } = useRecipeApprovals()
  const [ingredientDrawerNotice, setIngredientDrawerNotice] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('ficha')

  const staticRecipe = recipeId ? getRecipeById(recipeId) : undefined
  const createdEntry = !staticRecipe && recipeId ? getCreatedRecipeById(recipeId) : undefined
  const recipe = staticRecipe ?? createdEntry?.recipe
  if (!recipe) return <NotFound />

  const staticVersions = getRecipeVersionsByRecipe(recipe.id)
  const versions = staticVersions.length > 0 ? staticVersions : createdEntry ? [createdEntry.version] : []
  const version = versions.find((v) => v.id === recipe.versaoVigenteId) ?? versions[0]
  const issues = getIssuesByRecipe(recipe.id)
  const impactoTotal = issues.reduce((sum, i) => sum + (i.impacto ?? 0), 0)
  const consumption = recipe.id === 'burger-costela' ? burgerCostelaConsumption : null
  const unitComparison = recipe.id === 'burger-costela' ? burgerCostelaUnitComparison : null
  const contextLabel = `Ficha técnica — ${recipe.nome}`

  const tabItems = [
    { id: 'ficha', label: 'Ficha técnica' },
    { id: 'preparo', label: 'Preparo e pontos críticos' },
    { id: 'aprovacoes', label: 'Aprovações', badge: issues.some((i) => i.tipo === 'sem_aprovacao') ? <AlertBadge count={1} /> : undefined },
    { id: 'versoes', label: 'Histórico de versões' },
    ...(consumption ? [{ id: 'consumo', label: 'Consumo teórico vs. real' }] : []),
    { id: 'simulador', label: 'Simulador' },
  ]

  if (!version) {
    return (
      <div className="flex flex-col gap-6">
        <RecipeBreadcrumb trail={[{ label: recipe.nome }]} />
        <div className="flex flex-col gap-2">
          <h1 className="text-page-title">{recipe.nome}</h1>
          <p className="text-support text-ink-secondary">{recipe.categoria}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6 text-center">
          <p className="text-support text-ink-secondary">Este produto ainda não possui uma ficha técnica publicada.</p>
          <Button className="mt-3" size="sm" variant="navy" leftIcon={<FilePlus2 className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/fichas-tecnicas/nova')}>
            Criar ficha técnica
          </Button>
        </div>
      </div>
    )
  }

  const financials = computeRecipeFinancials({
    ingredientes: version.ingredientes,
    porcoes: version.rendimento.porcoes,
    precoVenda: version.precoVenda,
    descontoMedioPercentual: version.descontoMedioPercentual,
    custoEmbalagem: version.custoEmbalagem,
  })

  return (
    <div className="flex flex-col gap-6">
      <RecipeBreadcrumb trail={[{ label: recipe.nome }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-page-title">{recipe.nome}</h1>
            <RecipeQualityBadge qualidade={recipe.qualidade} />
            <RecipeStatusBadge status={version.status} />
          </div>
          <p className="text-support text-ink-secondary">
            {recipe.categoria} · Código PDV {recipe.codigoPdv} · Versão {version.versao} · Responsável {recipe.responsavel}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {getCmvProductById(recipe.id) && (
            <Button size="sm" variant="secondary" leftIcon={<Percent className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/cmv/produtos/${recipe.id}`)}>
              Ver no CMV
            </Button>
          )}
          <Button size="sm" variant="secondary" leftIcon={<GitCompareArrows className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setActiveTab('versoes')}>
            Comparar versões
          </Button>
          <Button size="sm" variant="navy" leftIcon={<FilePlus2 className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/fichas-tecnicas/revisoes?receita=${recipe.id}`)}>
            Nova revisão
          </Button>
          <Button size="sm" variant="primary" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Por que o custo desta ficha mudou?', contextLabel)}>
            Pergunte ao CORTEX
          </Button>
        </div>
      </div>

      <MetricStrip className="xl:grid-cols-6">
        <MetricCard titulo="Custo por porção" valor={formatCurrencyPreciseBRL(financials.custoPorcao)} status="neutral" />
        <MetricCard titulo="Preço de venda" valor={formatCurrencyPreciseBRL(version.precoVenda)} status="neutral" />
        <MetricCard titulo="CMV teórico" valor={formatPercent(financials.cmvTeorico, 1)} status="neutral" />
        <MetricCard titulo="Margem" valor={formatPercent(financials.margemPercentual, 1)} status={financials.margemPercentual < 0.45 ? 'critical' : 'success'} />
        <MetricCard titulo="Divergência real" valor={impactoTotal > 0 ? formatCurrencyBRL(impactoTotal) : '—'} status={impactoTotal > 0 ? 'critical' : 'neutral'} />
        <MetricCard titulo="Última revisão" valor={formatDateFull(recipe.ultimaRevisaoIso)} status="neutral" />
      </MetricStrip>

      {issues.length > 0 && (
        <div className="rounded-lg border border-warning-soft bg-warning-soft/40 p-4">
          <p className="text-label font-medium text-warning">Inconsistências desta ficha</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {issues.map((issue) => (
              <li key={issue.id} className="flex items-center justify-between gap-3 text-support text-ink-secondary">
                <span>{issue.titulo}</span>
                {issue.impacto !== undefined && <span className="shrink-0 tabular font-medium text-danger">{formatCurrencyBRL(issue.impacto)}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Tabs items={tabItems} defaultTabId={activeTab} onChange={setActiveTab} />

      {activeTab === 'ficha' && (
        <div className="flex flex-col gap-6">
          <section>
            <SectionHeader title="Ingredientes" description="Composição da versão vigente, com custo, fator de correção e confiança" />
            <RecipeIngredientTable
              ingredientes={version.ingredientes}
              editable={false}
              onOpenIngredient={(line) => {
                if (line.subReceitaId) navigate('/fichas-tecnicas/subreceitas')
                else setIngredientDrawerNotice(line.nome)
              }}
            />
          </section>

          <section>
            <SectionHeader title="Rendimento" />
            <DataList
              items={[
                { label: 'Peso bruto', value: `${version.rendimento.pesoBrutoG} g` },
                { label: 'Peso líquido', value: `${version.rendimento.pesoLiquidoG} g` },
                { label: 'Porções', value: version.rendimento.porcoes },
                { label: 'Peso por porção', value: `${version.rendimento.pesoPorcaoG} g` },
                { label: 'Perda técnica prevista', value: formatPercent(version.rendimento.perdaTecnicaPercentual, 1) },
                ...(version.rendimento.perdaOperacionalObservadaPercentual !== undefined
                  ? [{ label: 'Perda operacional observada', value: formatPercent(version.rendimento.perdaOperacionalObservadaPercentual, 1) }]
                  : []),
              ]}
            />
            {version.loteDePreparoExemplo && (
              <p className="mt-3 rounded-md bg-surface-subtle p-3 text-caption text-ink-tertiary">
                Exemplo de lote de preparo — {version.loteDePreparoExemplo.ingredienteNome}: {version.loteDePreparoExemplo.pesoBrutoG.toLocaleString('pt-BR')} g brutos rendem{' '}
                {version.loteDePreparoExemplo.pesoLiquidoG.toLocaleString('pt-BR')} g líquidos ({version.loteDePreparoExemplo.porcoesRendidas} porções de{' '}
                {version.loteDePreparoExemplo.pesoPorcaoG} g, perda técnica de {formatPercent(version.loteDePreparoExemplo.perdaTecnicaPercentual, 1)}). Exemplo ilustrativo — não altera o
                cálculo financeiro da ficha.
              </p>
            )}
          </section>

          {ingredientDrawerNotice && (
            <p className="text-caption text-ink-tertiary">
              {ingredientDrawerNotice} é um insumo direto — sem sub-receita vinculada.{' '}
              <button className="text-accent hover:underline" onClick={() => setIngredientDrawerNotice(null)}>
                Fechar
              </button>
            </p>
          )}
        </div>
      )}

      {activeTab === 'preparo' && (
        <div className="flex flex-col gap-6">
          <section>
            <SectionHeader title="Modo de preparo" />
            {version.preparo.length === 0 ? (
              <p className="text-support text-ink-tertiary">Nenhuma etapa de preparo cadastrada para esta versão.</p>
            ) : (
              <ol className="flex flex-col gap-3">
                {version.preparo.map((step) => (
                  <li key={step.ordem} className="flex gap-3 rounded-lg border border-border bg-surface p-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-caption font-medium text-ink-secondary">{step.ordem}</span>
                    <div className="flex flex-col gap-1">
                      <p className="text-support text-ink-primary">{step.instrucao}</p>
                      <p className="text-caption text-ink-tertiary">
                        {[
                          step.tempoMinutos !== undefined && `${step.tempoMinutos} min`,
                          step.temperaturaC !== undefined && `${step.temperaturaC} °C`,
                          step.equipamento,
                          step.responsavel,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                      {step.pontoControle && <p className="text-caption text-info">Ponto de controle: {step.pontoControle}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section>
            <SectionHeader title="Pontos críticos" />
            {version.pontosCriticos.length === 0 ? (
              <p className="text-support text-ink-tertiary">Nenhum ponto crítico cadastrado para esta versão.</p>
            ) : (
              <DataList items={version.pontosCriticos.map((p) => ({ label: p.label, value: p.valor }))} />
            )}
          </section>
        </div>
      )}

      {activeTab === 'aprovacoes' && (
        <section>
          <SectionHeader title="Fluxo de aprovação" description="Etapas necessárias para publicar esta versão" />
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
            {version.aprovacoes.map((step) => {
              const status = getStepStatus(version.id, step.ordem, step.status)
              return (
                <div key={step.ordem} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="text-support font-medium text-ink-primary">
                      {step.ordem}. {step.papel}
                    </p>
                    {step.responsavel && <p className="text-caption text-ink-tertiary">{step.responsavel}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {step.data && <span className="text-caption text-ink-tertiary">{formatDateFull(step.data)}</span>}
                    <IndicatorBadge status={approvalStatusIndicator[status]}>
                      {status === 'aprovado' ? 'Aprovado' : status === 'rejeitado' ? 'Rejeitado' : 'Pendente'}
                    </IndicatorBadge>
                    {status === 'pendente' && (
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" variant="secondary" onClick={() => setStepStatus(version.id, step.ordem, 'rejeitado')}>
                          Rejeitar
                        </Button>
                        <Button size="sm" variant="navy" onClick={() => setStepStatus(version.id, step.ordem, 'aprovado')}>
                          Aprovar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {activeTab === 'versoes' && <RecipeVersionHistorySection versions={versions} />}

      {activeTab === 'consumo' && consumption && (
        <div className="flex flex-col gap-6">
          <section>
            <SectionHeader title="Consumo teórico vs. real" description="Últimas 8 semanas" />
            <div className="rounded-lg border border-border bg-surface p-5">
              <CmvQuantityHistoryChart data={consumption.historicoSemanal} unidade="kg" />
            </div>
            <DataList
              className="mt-4"
              items={[
                { label: 'Unidades vendidas no período', value: consumption.unidadesVendidas.toLocaleString('pt-BR') },
                { label: 'Consumo teórico', value: `${consumption.consumoTeoricoKg.toLocaleString('pt-BR')} kg` },
                { label: 'Consumo real estimado', value: `${consumption.consumoRealKg.toLocaleString('pt-BR')} kg` },
                { label: 'Impacto financeiro estimado', value: formatCurrencyBRL(consumption.impacto) },
                { label: 'Unidades mais afetadas', value: consumption.unidadesMaisAfetadas.join(', ') },
              ]}
            />
          </section>

          {unitComparison && (
            <section>
              <SectionHeader title="Comparação entre unidades" description="Consumo estimado versus quantidade prevista pela ficha, por unidade" />
              <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                <table className="w-full border-collapse text-support">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Unidade</th>
                      <th className="px-4 py-2.5 text-right text-label font-medium text-ink-tertiary">Previsto</th>
                      <th className="px-4 py-2.5 text-right text-label font-medium text-ink-tertiary">Estimado</th>
                      <th className="px-4 py-2.5 text-right text-label font-medium text-ink-tertiary">Diferença</th>
                      <th className="px-4 py-2.5 text-right text-label font-medium text-ink-tertiary">Impacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unitComparison.map((row) => {
                      const unit = units.find((u) => u.id === row.unitId)
                      return (
                        <tr key={row.unitId} className="border-b border-border last:border-b-0">
                          <td className="h-12 px-4 font-medium text-ink-primary">{unit?.nomeCurto ?? row.unitId}</td>
                          <td className="h-12 px-4 text-right tabular text-ink-primary">{(row.quantidadePrevistaG / 1000).toLocaleString('pt-BR')} kg</td>
                          <td className="h-12 px-4 text-right tabular text-ink-primary">{(row.consumoEstimadoG / 1000).toLocaleString('pt-BR')} kg</td>
                          <td className={cn('h-12 px-4 text-right tabular font-medium', row.diferencaG > 0 ? 'text-danger' : 'text-ink-primary')}>
                            +{(row.diferencaG / 1000).toLocaleString('pt-BR')} kg
                          </td>
                          <td className="h-12 px-4 text-right tabular font-medium text-danger">{formatCurrencyBRL(row.impacto)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-support text-ink-secondary">{burgerCostelaUnitComparisonInsight}</p>
            </section>
          )}
        </div>
      )}

      {activeTab === 'simulador' && <RecipeCostSimulator version={version} />}
    </div>
  )
}
