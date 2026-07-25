import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ShoppingCart, Sparkles } from 'lucide-react'
import { ComprasBreadcrumb } from '@/components/purchasing/ComprasBreadcrumb'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import NotFound from './NotFound'
import { QuotationStatusBadge } from '@/components/purchasing/QuotationStatusBadge'
import { usePurchasing } from '@/hooks/usePurchasing'
import { cot0573DecisionScenarios, cot0573SummaryText, defaultScoreWeights } from '@/data/purchasing/quotations'
import { calcularScoreFornecedor } from '@/utils/purchasingCalculations'
import { useAppState } from '@/context/AppStateContext'
import { formatCurrencyBRL, formatDateShort, formatPercent } from '@/utils/format'
import type { QuotationScoreWeights } from '@/types'

const weightLabels: { key: keyof QuotationScoreWeights; label: string }[] = [
  { key: 'preco', label: 'Preço' },
  { key: 'prazo', label: 'Prazo de entrega' },
  { key: 'conformidade', label: 'Conformidade' },
  { key: 'qualidade', label: 'Qualidade (pontualidade histórica)' },
  { key: 'divergencias', label: 'Divergências' },
  { key: 'pagamento', label: 'Prazo de pagamento' },
]

export default function ComprasCotacaoDetail() {
  const { quotationId } = useParams()
  return <ComprasCotacaoDetailBody key={quotationId} id={quotationId ?? ''} />
}

function ComprasCotacaoDetailBody({ id }: { id: string }) {
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { getEffectiveQuotation, decideQuotation, convertQuotationToOrder } = usePurchasing()
  const [pesos, setPesos] = useState<QuotationScoreWeights>(defaultScoreWeights)
  const [selectedFornecedorId, setSelectedFornecedorId] = useState<string | null>(null)
  const [justificativa, setJustificativa] = useState('')

  const cotacao = getEffectiveQuotation(id)
  if (!cotacao) return <NotFound />

  const ranking = useMemo(
    () =>
      [...cotacao.respostas]
        .map((r) => ({ ...r, score: r.respondeu ? calcularScoreFornecedor(r, cotacao.respostas, pesos) : 0 }))
        .sort((a, b) => b.score - a.score),
    [cotacao.respostas, pesos],
  )

  const melhorScore = ranking.find((r) => r.respondeu);
  const isCot0573 = cotacao.id === 'cot-0573'

  function handleDecide(tipo: 'menor_preco' | 'melhor_equilibrio' | 'entrega_mais_rapida' | 'menor_risco' | 'personalizada', fornecedorId: string, texto: string) {
    const decisao = { tipo, fornecedorId, justificativa: texto }
    decideQuotation(cotacao!.id, decisao)
  }

  function handleConvert() {
    if (!cotacao!.decisao) return
    const pedido = convertQuotationToOrder({ ...cotacao!, decisao: cotacao!.decisao }, 'Leo')
    if (pedido) navigate(`/compras/pedidos/${pedido.id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <ComprasBreadcrumb trail={[{ label: 'Cotações', path: '/compras/cotacoes' }, { label: cotacao.id.toUpperCase() }]} />

      <PageHeader
        eyebrow={`Cotação · ${cotacao.categoria}`}
        title={`${cotacao.id.toUpperCase()} — ${cotacao.categoria}`}
        description={cotacao.escopo}
        meta={<div className="mt-1"><QuotationStatusBadge status={cotacao.status} /></div>}
        actions={
          <Button
            variant="ghost"
            leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />}
            onClick={() => askCortex(`Qual fornecedor devo escolher para ${cotacao.categoria.toLowerCase()}?`, cotacao.id.toUpperCase())}
          >
            Perguntar ao CORTEX
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <section>
            <SectionHeader title="Itens da cotação" />
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
              {cotacao.itens.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between px-4 py-3 text-support">
                  <span className="font-medium text-ink-primary">{item.nome}</span>
                  <span className="tabular text-ink-secondary">{item.quantidade.toLocaleString('pt-BR')} {item.unidadeMedida}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Mapa comparativo" description="Score calculado com os pesos ao lado — ajuste e veja o ranking mudar." />
            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
              <table className="w-full border-collapse text-support">
                <thead>
                  <tr className="border-b border-border">
                    {['Fornecedor', 'Valor total', 'Prazo', 'Pontualidade', 'Conformidade', 'Divergências', 'Pagamento', 'Score'].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((r, i) => (
                    <tr key={r.fornecedorId} className="border-b border-border last:border-b-0">
                      <td className="h-12 px-4 font-medium text-ink-primary">
                        {r.fornecedorNome} {i === 0 && r.respondeu && <span className="ml-1 rounded-full bg-success-soft px-1.5 py-0.5 text-badge text-success">Melhor score</span>}
                      </td>
                      <td className="h-12 px-4 tabular">{r.respondeu ? formatCurrencyBRL(r.valorTotal) : '—'}</td>
                      <td className="h-12 px-4 tabular">{r.respondeu ? `${r.prazoEntregaDias} dias` : '—'}</td>
                      <td className="h-12 px-4 tabular">{r.respondeu ? formatPercent(r.pontualidadeHistorica, 0) : '—'}</td>
                      <td className="h-12 px-4 tabular">{r.respondeu ? formatPercent(r.conformidadeHistorica, 0) : '—'}</td>
                      <td className="h-12 px-4 tabular">{r.respondeu ? r.divergenciasHistoricas : '—'}</td>
                      <td className="h-12 px-4">{r.respondeu ? r.formaPagamento : '—'}</td>
                      <td className="h-12 px-4 tabular font-medium text-ink-primary">{r.respondeu ? r.score.toFixed(0) : 'Sem resposta'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {isCot0573 && (
            <section>
              <SectionHeader title="Cenários de decisão" description="A escolha final é sua." />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {cot0573DecisionScenarios.map((s) => (
                  <Card
                    key={s.tipo}
                    interactive
                    onClick={() => setSelectedFornecedorId(s.fornecedorId)}
                    className={selectedFornecedorId === s.fornecedorId ? 'border-accent ring-1 ring-accent/30' : undefined}
                  >
                    <p className="text-card-title text-ink-primary">{s.titulo}</p>
                    <p className="mt-1 text-support text-ink-secondary">{s.resumo}</p>
                  </Card>
                ))}
              </div>
              <div className="mt-4 rounded-md border border-border bg-surface-subtle p-4">
                <p className="mb-1 text-label text-ink-tertiary">Resumo do CORTEX</p>
                <p className="text-support leading-relaxed text-ink-secondary">{cot0573SummaryText}</p>
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <Card>
            <p className="mb-3 text-label text-ink-tertiary">Resumo</p>
            <DataList
              items={[
                { label: 'Valor de referência', value: formatCurrencyBRL(cotacao.valorEstimado) },
                { label: 'Economia potencial', value: cotacao.economiaPotencial > 0 ? formatCurrencyBRL(cotacao.economiaPotencial) : '—' },
                { label: 'Prazo de resposta', value: formatDateShort(cotacao.prazoResposta) },
                { label: 'Fornecedores convidados', value: cotacao.fornecedoresConvidados.length },
              ]}
            />
          </Card>

          <Card>
            <p className="mb-3 text-label text-ink-tertiary">Pesos do score (ajustável)</p>
            <div className="flex flex-col gap-3">
              {weightLabels.map((w) => (
                <div key={w.key} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-caption">
                    <span className="text-ink-secondary">{w.label}</span>
                    <span className="tabular text-ink-primary">{pesos[w.key]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={pesos[w.key]}
                    onChange={(e) => setPesos((prev) => ({ ...prev, [w.key]: Number(e.target.value) }))}
                    className="h-1.5 w-full cursor-pointer accent-accent"
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-caption text-ink-tertiary">Pesos ajustáveis apenas nesta visualização — não alteram o histórico da decisão nem persistem entre sessões.</p>
          </Card>

          {cotacao.status !== 'decidida' && cotacao.status !== 'convertida_pedido' && melhorScore && (
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Decisão</p>
              <Input placeholder="Justificativa da decisão" value={justificativa} onChange={(e) => setJustificativa(e.target.value)} className="mb-2" />
              <Button
                variant="primary"
                className="w-full"
                onClick={() => handleDecide('personalizada', selectedFornecedorId ?? melhorScore.fornecedorId, justificativa || 'Decisão registrada a partir do mapa comparativo.')}
              >
                Registrar decisão — {ranking.find((r) => r.fornecedorId === (selectedFornecedorId ?? melhorScore.fornecedorId))?.fornecedorNome}
              </Button>
            </Card>
          )}

          {cotacao.status === 'decidida' && cotacao.decisao && (
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Decisão registrada</p>
              <DataList
                items={[
                  { label: 'Fornecedor', value: cotacao.respostas.find((r) => r.fornecedorId === cotacao.decisao!.fornecedorId)?.fornecedorNome ?? cotacao.decisao.fornecedorId },
                  { label: 'Justificativa', value: cotacao.decisao.justificativa },
                ]}
              />
              <Button variant="primary" className="mt-3 w-full" leftIcon={<ShoppingCart className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={handleConvert}>
                Converter em pedido
              </Button>
            </Card>
          )}

          {cotacao.pedidoId && (
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Pedido gerado</p>
              <Button variant="secondary" className="w-full" onClick={() => navigate(`/compras/pedidos/${cotacao.pedidoId}`)}>
                Abrir {cotacao.pedidoId.toUpperCase()}
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
