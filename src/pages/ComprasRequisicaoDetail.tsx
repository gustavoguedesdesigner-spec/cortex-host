import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Sparkles, CheckCircle2, XCircle, Undo2, ShoppingCart, ClipboardList } from 'lucide-react'
import { ComprasBreadcrumb } from '@/components/purchasing/ComprasBreadcrumb'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import NotFound from './NotFound'
import { RequisitionStatusBadge } from '@/components/purchasing/RequisitionStatusBadge'
import { UrgencyBadge } from '@/components/purchasing/UrgencyBadge'
import { requisitionAlertLabels } from '@/components/purchasing/requisitionAlertLabels'
import { usePurchasing } from '@/hooks/usePurchasing'
import { getUnitById } from '@/data/units'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { suppliers } from '@/data/purchasing/suppliers'
import { getPurchaseNeedById } from '@/data/purchasing/purchaseNeeds'
import { useAppState } from '@/context/AppStateContext'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'
import type { PurchaseRequisition } from '@/types'

export default function ComprasRequisicaoDetail() {
  const { requestId } = useParams()
  return <ComprasRequisicaoDetailBody key={requestId} id={requestId ?? ''} />
}

function ComprasRequisicaoDetailBody({ id }: { id: string }) {
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { getEffectiveRequisition, approveRequisition, rejectRequisition, returnRequisition, convertRequisitionToOrder } = usePurchasing()
  const [cenarioEscolhido, setCenarioEscolhido] = useState<string | null>(null)
  const [justificativa, setJustificativa] = useState('')

  const req = getEffectiveRequisition(id)
  if (!req) return <NotFound />

  const unit = getUnitById(req.unitId)
  const necessidade = req.necessidadeOrigemId ? getPurchaseNeedById(req.necessidadeOrigemId) : undefined
  const primeiroItem = req.itens[0]
  const itemCatalogo = primeiroItem ? getInventoryItemById(primeiroItem.itemId) : undefined
  const fornecedorSugerido = itemCatalogo ? suppliers.find((s) => s.nome === itemCatalogo.fornecedorPrincipal) : undefined

  const cenarioAtivo = req.cenarios?.find((c) => c.id === cenarioEscolhido) ?? req.cenarios?.find((c) => c.recomendado) ?? req.cenarios?.[0]

  function handleApprove() {
    approveRequisition(req!.id, 'Leo', cenarioAtivo ? `Cenário escolhido: ${cenarioAtivo.titulo}.` : undefined)
  }

  function handleConvert() {
    const nome = fornecedorSugerido?.nome ?? itemCatalogo?.fornecedorPrincipal ?? 'Fornecedor a definir'
    const fid = fornecedorSugerido?.id ?? nome.toLowerCase().replace(/\s+/g, '-')
    convertRequisitionToOrder(req!, fid, nome, 'Leo')
  }

  return (
    <div className="flex flex-col gap-6">
      <ComprasBreadcrumb trail={[{ label: 'Requisições', path: '/compras/requisicoes' }, { label: req.id.toUpperCase() }]} />

      <PageHeader
        eyebrow={`Requisição · ${unit?.nome ?? req.unitId}`}
        title={`${req.id.toUpperCase()} — ${primeiroItem?.nome ?? req.categoria}`}
        description={req.motivo}
        meta={
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <RequisitionStatusBadge status={req.status} />
            <UrgencyBadge urgencia={req.prioridade} />
            {req.alertas.map((a) => (
              <span key={a} className="rounded-full bg-warning-soft px-2 py-0.5 text-badge text-warning">
                {requisitionAlertLabels[a]}
              </span>
            ))}
          </div>
        }
        actions={
          <Button
            variant="ghost"
            leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />}
            onClick={() => askCortex(`O que devo fazer com a requisição ${req.id.toUpperCase()}?`, req.id.toUpperCase(), req.recomendacaoCortex)}
          >
            Perguntar ao CORTEX
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <section>
            <SectionHeader title="Itens solicitados" />
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
              {req.itens.map((item) => (
                <div key={item.itemId} className="flex items-center justify-between px-4 py-3 text-support">
                  <span className="font-medium text-ink-primary">{item.nome}</span>
                  <span className="tabular text-ink-secondary">
                    {item.quantidade.toLocaleString('pt-BR')} {item.unidadeMedida} · {formatCurrencyBRL(item.custoEstimadoUnitario)}/{item.unidadeMedida}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {necessidade && (
            <section>
              <SectionHeader title="Necessidade de origem" description="Dados de estoque que geraram esta requisição." />
              <DataList
                items={[
                  { label: 'Saldo disponível', value: `${necessidade.saldoDisponivel} ${necessidade.unidadeMedida}` },
                  { label: 'Cobertura atual', value: necessidade.cobertura !== null ? `${necessidade.cobertura.toFixed(1)} dias` : '—' },
                  { label: 'Consumo médio diário', value: `${necessidade.consumoMedioDiario} ${necessidade.unidadeMedida}` },
                  { label: 'Prazo médio do fornecedor', value: `${necessidade.prazoMedioReposicaoDias} dias` },
                  { label: 'Estoque em trânsito', value: `${necessidade.estoqueEmTransito} ${necessidade.unidadeMedida}` },
                ]}
              />
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigate(`/estoque/itens/${necessidade.itemId}?unit=${necessidade.unitId}`)}>
                Ver no Estoque
              </Button>
            </section>
          )}

          {req.cenarios && req.cenarios.length > 0 && (
            <section>
              <SectionHeader title="Comparação de cenários" description="A decisão final é sua — o CORTEX recomenda, não decide sozinho." />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {req.cenarios.map((c) => {
                  const ativo = cenarioAtivo?.id === c.id
                  return (
                    <Card
                      key={c.id}
                      interactive
                      onClick={() => setCenarioEscolhido(c.id)}
                      className={ativo ? 'border-accent ring-1 ring-accent/30' : undefined}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <p className="text-card-title text-ink-primary">{c.titulo}</p>
                          {c.recomendado && <span className="rounded-full bg-success-soft px-2 py-0.5 text-badge text-success">Recomendado</span>}
                        </div>
                        <p className="text-support text-ink-secondary">{c.descricao}</p>
                        <div className="mt-1 border-t border-border pt-2 text-support">
                          <p className="tabular font-medium text-ink-primary">{formatCurrencyBRL(c.custo)}</p>
                          <p className="text-caption text-ink-tertiary">Cobertura: {c.coberturaResultante}</p>
                          <p className="text-caption text-ink-tertiary">Risco: {c.riscoResultante}</p>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
              {req.recomendacaoCortex && (
                <div className="mt-4 rounded-md border border-border bg-surface-subtle p-4">
                  <p className="mb-1 text-label text-ink-tertiary">Recomendação do CORTEX</p>
                  <p className="text-support leading-relaxed text-ink-secondary">{req.recomendacaoCortex}</p>
                </div>
              )}
            </section>
          )}

          <section>
            <SectionHeader title="Histórico" />
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
              {req.historico.map((h, i) => (
                <div key={i} className="flex flex-col gap-0.5 px-4 py-3">
                  <div className="flex items-center justify-between text-support">
                    <span className="font-medium text-ink-primary">{h.acao}</span>
                    <span className="text-caption text-ink-tertiary">{formatDateFull(h.data)}</span>
                  </div>
                  <span className="text-caption text-ink-tertiary">{h.usuario}</span>
                  {h.observacao && <p className="mt-1 text-support text-ink-secondary">{h.observacao}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <Card>
            <p className="mb-3 text-label text-ink-tertiary">Resumo</p>
            <DataList
              items={[
                { label: 'Solicitante', value: req.solicitante },
                { label: 'Unidade', value: unit?.nome ?? req.unitId },
                { label: 'Categoria', value: req.categoria },
                { label: 'Valor estimado', value: formatCurrencyBRL(cenarioAtivo?.custo ?? req.valorEstimado) },
                { label: 'Data necessária', value: formatDateFull(req.dataNecessaria) },
                { label: 'Alçada exigida', value: req.alcadaExigida ?? req.aprovador ?? '—' },
              ]}
            />
          </Card>

          {req.status === 'aguardando_aprovacao' && (
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Decisão</p>
              <div className="flex flex-col gap-2">
                <Button variant="primary" leftIcon={<CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={handleApprove}>
                  Aprovar requisição
                </Button>
                <Input placeholder="Justificativa (para devolver ou rejeitar)" value={justificativa} onChange={(e) => setJustificativa(e.target.value)} />
                <Button variant="secondary" leftIcon={<Undo2 className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => returnRequisition(req!.id, 'Leo', justificativa || 'Devolvida para revisão.')}>
                  Devolver para o solicitante
                </Button>
                <Button variant="ghost" leftIcon={<XCircle className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => rejectRequisition(req!.id, 'Leo', justificativa || 'Rejeitada.')}>
                  Rejeitar
                </Button>
              </div>
            </Card>
          )}

          {req.status === 'aprovada' && (
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Conversão</p>
              <Button variant="primary" leftIcon={<ShoppingCart className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={handleConvert}>
                Converter em pedido
              </Button>
            </Card>
          )}

          {req.pedidoId && (
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Pedido gerado</p>
              <Button variant="secondary" leftIcon={<ClipboardList className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/compras/pedidos/${req!.pedidoId}`)}>
                Abrir {req.pedidoId.toUpperCase()}
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
