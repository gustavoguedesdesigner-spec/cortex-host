import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  Ban,
  CalendarClock,
  CheckCircle2,
  Copy,
  FileWarning,
  PackageCheck,
  PhoneCall,
  Sparkles,
  Truck,
} from 'lucide-react'
import { ComprasBreadcrumb } from '@/components/purchasing/ComprasBreadcrumb'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import NotFound from './NotFound'
import { OrderStatusBadge } from '@/components/purchasing/OrderStatusBadge'
import { usePurchasing } from '@/hooks/usePurchasing'
import { getUnitById } from '@/data/units'
import { calcularPreenchimentoPedido, calcularSaldoPendenteItem } from '@/utils/purchasingCalculations'
import { useAppState } from '@/context/AppStateContext'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'
import type { OrderTimelineEventType } from '@/types'

const timelineIcons: Record<OrderTimelineEventType, typeof Truck> = {
  emitido: FileWarning,
  confirmado_fornecedor: CheckCircle2,
  em_transporte: Truck,
  entrega_prevista_atualizada: CalendarClock,
  recebimento_parcial: PackageCheck,
  divergencia_registrada: AlertTriangle,
  cobranca_fornecedor: PhoneCall,
  concluido: CheckCircle2,
}

export default function ComprasPedidoDetail() {
  const { orderId } = useParams()
  return <ComprasPedidoDetailBody key={orderId} id={orderId ?? ''} />
}

function ComprasPedidoDetailBody({ id }: { id: string }) {
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { getEffectiveOrder, chargeSupplier, updateOrderForecast, registerReceipt, cancelOrderBalance, duplicateOrder } = usePurchasing()
  const [novaPrevisao, setNovaPrevisao] = useState('')
  const [justificativaCancelamento, setJustificativaCancelamento] = useState('')

  const order = getEffectiveOrder(id)
  if (!order) return <NotFound />

  const unit = getUnitById(order.unitId)
  const totalPedido = order.itens.reduce((s, i) => s + i.quantidadePedida, 0)
  const totalRecebido = order.itens.reduce((s, i) => s + i.quantidadeRecebida, 0)
  const preenchimento = calcularPreenchimentoPedido(totalRecebido, totalPedido)
  const temSaldoPendente = order.itens.some((i) => calcularSaldoPendenteItem(i) > 0)
  const podeConcluir = !temSaldoPendente && !order.divergencia

  return (
    <div className="flex flex-col gap-6">
      <ComprasBreadcrumb trail={[{ label: 'Pedidos', path: '/compras/pedidos' }, { label: order.id.toUpperCase() }]} />

      <PageHeader
        eyebrow={`Pedido · ${order.fornecedorNome}`}
        title={`${order.id.toUpperCase()} — ${unit?.nome ?? order.unitId}`}
        description={`Emitido em ${formatDateFull(order.dataEmissao)} · Previsão de entrega em ${formatDateFull(order.previsaoEntrega)}`}
        meta={<div className="mt-1"><OrderStatusBadge status={order.status} /></div>}
        actions={
          <Button variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex(`Por que o pedido ${order.id.toUpperCase()} está ${order.status.replace('_', ' ')}?`, order.id.toUpperCase())}>
            Perguntar ao CORTEX
          </Button>
        }
      />

      {!podeConcluir && (
        <p className="rounded-md border border-warning-soft bg-warning-soft px-4 py-2.5 text-support text-warning">
          Este pedido não pode ser concluído enquanto existir saldo pendente ou divergência aberta.
        </p>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <section>
            <SectionHeader title="Itens do pedido" />
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
              {order.itens.map((item) => {
                const p = calcularPreenchimentoPedido(item.quantidadeRecebida, item.quantidadePedida)
                return (
                  <div key={item.itemId} className="flex flex-col gap-1.5 border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between text-support">
                      <span className="font-medium text-ink-primary">{item.nome}</span>
                      <span className="tabular text-ink-secondary">
                        {item.quantidadeRecebida.toLocaleString('pt-BR')} / {item.quantidadePedida.toLocaleString('pt-BR')} {item.unidadeMedida}
                      </span>
                    </div>
                    <ProgressBar value={p} status={p >= 1 ? 'success' : 'attention'} />
                    <p className="text-caption text-ink-tertiary">
                      {formatCurrencyBRL(item.custoUnitarioAcordado)}/{item.unidadeMedida} acordado
                      {item.custoUnitarioRecebido && item.custoUnitarioRecebido !== item.custoUnitarioAcordado ? ` · ${formatCurrencyBRL(item.custoUnitarioRecebido)}/${item.unidadeMedida} recebido` : ''}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          {order.divergencia && (
            <section>
              <SectionHeader title="Divergência" />
              <div className="rounded-lg border border-danger-soft bg-danger-soft p-4">
                <p className="text-support text-danger">{order.divergencia.descricao}</p>
                <p className="mt-1 tabular text-card-title text-danger">{formatCurrencyBRL(order.divergencia.valorEnvolvido)} envolvidos</p>
              </div>
            </section>
          )}

          <section>
            <SectionHeader title="Linha do tempo" />
            <div className="flex flex-col gap-4">
              {order.timeline.map((event, i) => {
                const Icon = timelineIcons[event.tipo]
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink-secondary">
                      <Icon className="h-4 w-4" strokeWidth={1.7} />
                    </div>
                    <div className="flex-1 border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <p className="text-support font-medium text-ink-primary">{event.status}</p>
                        <span className="text-caption text-ink-tertiary">{formatDateFull(event.data)}</span>
                      </div>
                      <p className="mt-0.5 text-support text-ink-secondary">{event.descricao}</p>
                      <p className="mt-0.5 text-caption text-ink-tertiary">{event.responsavel}</p>
                      {event.link && (
                        <Button variant="ghost" size="sm" className="mt-1" onClick={() => navigate(event.link!.path)}>
                          {event.link.label}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <Card>
            <p className="mb-3 text-label text-ink-tertiary">Resumo</p>
            <DataList
              items={[
                { label: 'Valor total', value: formatCurrencyBRL(order.valorTotal) },
                { label: 'Preenchimento', value: `${Math.round(preenchimento * 100)}%` },
                { label: 'Fornecedor', value: order.fornecedorNome },
                { label: 'Unidade', value: unit?.nome ?? order.unitId },
              ]}
            />
          </Card>

          <Card>
            <p className="mb-3 text-label text-ink-tertiary">Ações</p>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" leftIcon={<Truck className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/recebimentos')}>
                Abrir recebimento
              </Button>
              <Button variant="secondary" leftIcon={<PhoneCall className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => chargeSupplier(order.id, 'Leo')}>
                Cobrar fornecedor
              </Button>
              <div className="flex items-center gap-2">
                <Input type="date" value={novaPrevisao} onChange={(e) => setNovaPrevisao(e.target.value)} className="h-9" />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (novaPrevisao) updateOrderForecast(order.id, new Date(novaPrevisao).toISOString(), 'Leo')
                  }}
                >
                  Atualizar previsão
                </Button>
              </div>
              {temSaldoPendente && (
                <Button variant="primary" leftIcon={<PackageCheck className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => registerReceipt(order, 'Leo')}>
                  Registrar recebimento do saldo
                </Button>
              )}
              {temSaldoPendente && (
                <>
                  <Input placeholder="Justificativa do cancelamento" value={justificativaCancelamento} onChange={(e) => setJustificativaCancelamento(e.target.value)} />
                  <Button
                    variant="ghost"
                    leftIcon={<Ban className="h-3.5 w-3.5" strokeWidth={1.7} />}
                    onClick={() => cancelOrderBalance(order, 'Leo', justificativaCancelamento || 'Saldo cancelado sem justificativa detalhada.')}
                  >
                    Cancelar saldo pendente
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                leftIcon={<Copy className="h-3.5 w-3.5" strokeWidth={1.7} />}
                onClick={() => {
                  const dup = duplicateOrder(order, 'Leo')
                  navigate(`/compras/pedidos/${dup.id}`)
                }}
              >
                Duplicar pedido
              </Button>
              {order.requisicaoOrigemId && (
                <Button variant="ghost" onClick={() => navigate(`/compras/requisicoes/${order.requisicaoOrigemId}`)}>
                  Abrir requisição de origem
                </Button>
              )}
              {order.cotacaoOrigemId && (
                <Button variant="ghost" onClick={() => navigate(`/compras/cotacoes/${order.cotacaoOrigemId}`)}>
                  Abrir cotação de origem
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
