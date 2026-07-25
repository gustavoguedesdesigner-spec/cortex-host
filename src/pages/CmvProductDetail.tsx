import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ClipboardPlus, FileText, GitCompareArrows, Layers, Sparkles } from 'lucide-react'
import { CmvBreadcrumb } from '@/components/cmv/CmvBreadcrumb'
import { Button } from '@/components/ui/Button'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { DataList } from '@/components/ui/DataList'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Drawer } from '@/components/ui/Drawer'
import { CreateActionModal, type CreateActionDefaults } from '@/components/cortex/CreateActionModal'
import { CmvQuantityHistoryChart } from '@/components/cmv/CmvQuantityHistoryChart'
import { getCmvProductById, getCmvProductDetail } from '@/data/cmv/cmvProducts'
import { getCmvIngredientById } from '@/data/cmv/cmvIngredients'
import { units } from '@/data/units'
import { useAppState } from '@/context/AppStateContext'
import { useCreatedActions } from '@/hooks/useCreatedActions'
import { formatCurrencyBRL, formatCurrencyCompactBRL, formatPercent } from '@/utils/format'
import { confidenceLabel } from '@/utils/cmvConfidence'
import NotFound from './NotFound'

export default function CmvProductDetail() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { createAction } = useCreatedActions()
  const [modalDefaults, setModalDefaults] = useState<CreateActionDefaults | null>(null)
  const [ingredientOpen, setIngredientOpen] = useState(false)

  const produto = productId ? getCmvProductById(productId) : undefined
  if (!produto) return <NotFound />

  const detalhe = getCmvProductDetail(produto.id)
  const insumo = detalhe?.insumoId ? getCmvIngredientById(detalhe.insumoId) : undefined
  const contextLabel = `CMV — ${produto.nome}`
  const margemTeorica = detalhe ? (detalhe.precoVenda - detalhe.custoPadrao) / detalhe.precoVenda : undefined

  return (
    <div className="flex flex-col gap-6">
      <CmvBreadcrumb trail={[{ label: 'Produtos', path: '/cmv?tab=produtos' }, { label: produto.nome }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-page-title">{produto.nome}</h1>
          <p className="text-support text-ink-secondary">
            {produto.categoria} · Ficha técnica {produto.fichaTecnicaVersao}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" leftIcon={<FileText className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/fichas-tecnicas')}>
            Abrir ficha técnica
          </Button>
          <Button size="sm" variant="secondary" leftIcon={<GitCompareArrows className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/cmv?tab=unidades')}>
            Comparar unidades
          </Button>
          <Button size="sm" variant="primary" leftIcon={<ClipboardPlus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setModalDefaults({ titulo: `Revisar porcionamento — ${produto.nome}`, prioridade: 'alta' })}>
            Criar ação
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Quais produtos precisam ser revisados?', contextLabel)}>
            Perguntar ao CORTEX
          </Button>
        </div>
      </div>

      <MetricStrip className="xl:grid-cols-4">
        <MetricCard titulo="Impacto estimado" valor={formatCurrencyCompactBRL(produto.impacto)} status="critical" />
        <MetricCard titulo="Vendas no período" valor={formatCurrencyCompactBRL(produto.vendas)} status="neutral" />
        <MetricCard titulo="Unidades vendidas" valor={produto.unidadesVendidas.toLocaleString('pt-BR')} status="neutral" />
        <MetricCard titulo="Confiança" valor={confidenceLabel[produto.confianca]} status="neutral" />
      </MetricStrip>

      {detalhe ? (
        <>
          <section>
            <SectionHeader title="Ficha técnica vigente" description="Custo padrão, preço de venda e margem teórica" />
            <DataList
              items={[
                { label: 'Versão', value: detalhe.fichaTecnicaVersao },
                { label: 'Custo padrão', value: formatCurrencyBRL(detalhe.custoPadrao) },
                { label: 'Preço de venda', value: formatCurrencyBRL(detalhe.precoVenda) },
                { label: 'Margem teórica', value: margemTeorica !== undefined ? formatPercent(margemTeorica, 1) : '—' },
                { label: 'Consumo teórico', value: detalhe.consumoTeoricoLabel },
                { label: 'Consumo real estimado', value: detalhe.consumoRealLabel },
                { label: 'Perdas', value: detalhe.perdas },
                { label: 'Unidades mais afetadas', value: detalhe.unidadesMaisAfetadas.join(', ') },
              ]}
            />
          </section>

          <section>
            <SectionHeader title="Histórico — consumo teórico vs. real" description="Últimas 8 semanas" />
            <div className="rounded-lg border border-border bg-surface p-5">
              <CmvQuantityHistoryChart
                data={detalhe.historico.map((h) => ({ semana: h.semana, teorico: h.consumoTeorico, real: h.consumoReal }))}
                unidade="kg"
              />
            </div>
          </section>

          <section>
            <SectionHeader title="Explicação" description="Hipótese investigativa — exige validação" />
            <p className="rounded-lg border border-border bg-surface p-5 text-support leading-relaxed text-ink-secondary">{detalhe.explicacao}</p>
          </section>

          {insumo && (
            <div>
              <Button size="sm" variant="secondary" leftIcon={<Layers className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setIngredientOpen(true)}>
                Ver insumo — {insumo.nome}
              </Button>
            </div>
          )}
        </>
      ) : (
        <section>
          <SectionHeader title="Consumo teórico vs. real" description="Comparação disponível para este produto" />
          <DataList
            items={[
              { label: 'Custo teórico', value: formatCurrencyBRL(produto.custoTeorico) },
              { label: 'Custo real estimado', value: formatCurrencyBRL(produto.custoRealEstimado) },
              { label: 'Diferença', value: formatCurrencyBRL(produto.impacto) },
            ]}
          />
        </section>
      )}

      {insumo && (
        <Drawer isOpen={ingredientOpen} onClose={() => setIngredientOpen(false)} title={insumo.nome} widthClassName="w-full max-w-lg">
          <div className="flex flex-col gap-4">
            <DataList
              items={[
                { label: 'Estoque inicial', value: `${insumo.estoqueInicial} ${insumo.unidadeMedida}` },
                { label: 'Entradas', value: `${insumo.entradas} ${insumo.unidadeMedida}` },
                { label: 'Transferências', value: `${insumo.transferencias} ${insumo.unidadeMedida}` },
                { label: 'Perdas', value: `${insumo.perdas} ${insumo.unidadeMedida}` },
                { label: 'Consumo teórico', value: `${insumo.consumoTeorico} ${insumo.unidadeMedida}` },
                { label: 'Consumo real', value: `${insumo.consumoReal} ${insumo.unidadeMedida}` },
                { label: 'Estoque final', value: `${insumo.estoqueFinal} ${insumo.unidadeMedida}` },
                { label: 'Preço médio', value: `${formatCurrencyBRL(insumo.precoMedio)} / ${insumo.unidadeMedida}` },
                { label: 'Fornecedores', value: insumo.fornecedores.join(', ') },
                { label: 'Unidades', value: insumo.unidades.join(', ') },
                { label: 'Produtos que utilizam', value: insumo.produtosQueUtilizam.join(', ') },
              ]}
            />
            <div className="flex flex-wrap gap-2 border-t border-border pt-3">
              <Button size="sm" variant="ghost" onClick={() => navigate('/estoque')}>
                Ver estoque
              </Button>
              <Button size="sm" variant="ghost" onClick={() => navigate('/fornecedores')}>
                Ver fornecedores
              </Button>
            </div>
          </div>
        </Drawer>
      )}

      <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-4">
        <span className="text-caption text-ink-tertiary">Unidades que vendem este produto:</span>
        {units.map((u) => (
          <button
            key={u.id}
            onClick={() => navigate(`/cmv/unidades/${u.id}`)}
            className="rounded-full border border-border bg-surface px-2.5 py-1 text-caption font-medium text-ink-secondary transition-colors hover:border-border-strong hover:text-ink-primary"
          >
            {u.nomeCurto}
          </button>
        ))}
      </div>

      <CreateActionModal isOpen={Boolean(modalDefaults)} onClose={() => setModalDefaults(null)} defaults={modalDefaults ?? undefined} onSave={(action) => createAction(action)} />
    </div>
  )
}
