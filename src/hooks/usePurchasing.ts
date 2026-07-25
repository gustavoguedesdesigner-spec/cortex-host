import { useCallback, useMemo } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import { purchaseRequisitions } from '@/data/purchasing/requisitions'
import { purchaseQuotations } from '@/data/purchasing/quotations'
import { purchaseOrders } from '@/data/purchasing/orders'
import { purchaseNeeds } from '@/data/purchasing/purchaseNeeds'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import type {
  OrderTimelineEvent,
  PurchaseNeed,
  PurchaseNeedStatus,
  PurchaseOrder,
  PurchaseOrderStatus,
  PurchaseRequisition,
  PurchaseUrgency,
  Quotation,
  QuotationStatus,
  RequisitionHistoryEntry,
  RequisitionItem,
  RequisitionStatus,
} from '@/types'

interface RequisitionOverride {
  status?: RequisitionStatus
  historicoExtra?: RequisitionHistoryEntry[]
  cotacaoId?: string
  pedidoId?: string
}

interface QuotationOverride {
  status?: QuotationStatus
  decisao?: Quotation['decisao']
  pedidoId?: string
}

interface OrderOverride {
  status?: PurchaseOrderStatus
  timelineExtra?: OrderTimelineEvent[]
  itensOverride?: PurchaseOrder['itens']
  previsaoEntrega?: string
}

interface NeedOverride {
  status?: PurchaseNeedStatus
  requisicaoGeradaId?: string
}

const now = () => new Date().toISOString()

/**
 * Camada de overrides sobre as amostras estáticas de Compras (requisições,
 * cotações, pedidos e necessidades) — persistida localmente, mesmo padrão de
 * useAdminUsers/useRecipeApprovals: os dados-fonte em src/data nunca são
 * mutados diretamente, apenas sobrepostos. Chamar este hook uma única vez
 * por página e distribuir o retorno via props evita duas instâncias
 * independentes lendo a mesma chave sem sincronizar entre si.
 */
export function usePurchasing() {
  const [requisitionOverrides, setRequisitionOverrides] = useLocalStorageState<Record<string, RequisitionOverride>>('cortex-host:purchasing-requisition-overrides', {})
  const [quotationOverrides, setQuotationOverrides] = useLocalStorageState<Record<string, QuotationOverride>>('cortex-host:purchasing-quotation-overrides', {})
  const [orderOverrides, setOrderOverrides] = useLocalStorageState<Record<string, OrderOverride>>('cortex-host:purchasing-order-overrides', {})
  const [needOverrides, setNeedOverrides] = useLocalStorageState<Record<string, NeedOverride>>('cortex-host:purchasing-need-overrides', {})
  const [createdRequisitions, setCreatedRequisitions] = useLocalStorageState<PurchaseRequisition[]>('cortex-host:purchasing-created-requisitions', [])
  const [createdOrders, setCreatedOrders] = useLocalStorageState<PurchaseOrder[]>('cortex-host:purchasing-created-orders', [])

  const allRequisitionsBase = useMemo(() => [...createdRequisitions, ...purchaseRequisitions], [createdRequisitions])
  const allOrdersBase = useMemo(() => [...createdOrders, ...purchaseOrders], [createdOrders])

  const getEffectiveRequisition = useCallback(
    (id: string): PurchaseRequisition | undefined => {
      const base = allRequisitionsBase.find((r) => r.id === id)
      if (!base) return undefined
      const override = requisitionOverrides[id]
      if (!override) return base
      return {
        ...base,
        status: override.status ?? base.status,
        cotacaoId: override.cotacaoId ?? base.cotacaoId,
        pedidoId: override.pedidoId ?? base.pedidoId,
        historico: override.historicoExtra ? [...base.historico, ...override.historicoExtra] : base.historico,
      }
    },
    [allRequisitionsBase, requisitionOverrides],
  )

  const allRequisitions = useMemo(() => allRequisitionsBase.map((r) => getEffectiveRequisition(r.id)!), [allRequisitionsBase, getEffectiveRequisition])

  const getEffectiveQuotation = useCallback(
    (id: string): Quotation | undefined => {
      const base = purchaseQuotations.find((q) => q.id === id)
      if (!base) return undefined
      const override = quotationOverrides[id]
      if (!override) return base
      return { ...base, status: override.status ?? base.status, decisao: override.decisao ?? base.decisao, pedidoId: override.pedidoId ?? base.pedidoId }
    },
    [quotationOverrides],
  )

  const allQuotations = useMemo(() => purchaseQuotations.map((q) => getEffectiveQuotation(q.id)!), [getEffectiveQuotation])

  const getEffectiveOrder = useCallback(
    (id: string): PurchaseOrder | undefined => {
      const base = allOrdersBase.find((o) => o.id === id)
      if (!base) return undefined
      const override = orderOverrides[id]
      if (!override) return base
      return {
        ...base,
        status: override.status ?? base.status,
        previsaoEntrega: override.previsaoEntrega ?? base.previsaoEntrega,
        itens: override.itensOverride ?? base.itens,
        timeline: override.timelineExtra ? [...base.timeline, ...override.timelineExtra] : base.timeline,
      }
    },
    [allOrdersBase, orderOverrides],
  )

  const allOrders = useMemo(() => allOrdersBase.map((o) => getEffectiveOrder(o.id)!), [allOrdersBase, getEffectiveOrder])

  const getEffectiveNeed = useCallback(
    (id: string): PurchaseNeed | undefined => {
      const base = purchaseNeeds.find((n) => n.id === id)
      if (!base) return undefined
      const override = needOverrides[id]
      if (!override) return base
      return { ...base, status: override.status ?? base.status, requisicaoGeradaId: override.requisicaoGeradaId ?? base.requisicaoGeradaId }
    },
    [needOverrides],
  )

  const allNeeds = useMemo(() => purchaseNeeds.map((n) => getEffectiveNeed(n.id)!), [getEffectiveNeed])

  const appendRequisitionHistory = useCallback(
    (id: string, patch: Partial<RequisitionOverride>, entry: RequisitionHistoryEntry) =>
      setRequisitionOverrides((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...patch, historicoExtra: [...(prev[id]?.historicoExtra ?? []), entry] },
      })),
    [setRequisitionOverrides],
  )

  const approveRequisition = useCallback(
    (id: string, aprovador: string, observacao?: string) =>
      appendRequisitionHistory(id, { status: 'aprovada' }, { data: now(), usuario: aprovador, acao: 'Requisição aprovada', observacao }),
    [appendRequisitionHistory],
  )

  const rejectRequisition = useCallback(
    (id: string, aprovador: string, justificativa: string) =>
      appendRequisitionHistory(id, { status: 'rejeitada' }, { data: now(), usuario: aprovador, acao: 'Requisição rejeitada', observacao: justificativa }),
    [appendRequisitionHistory],
  )

  const returnRequisition = useCallback(
    (id: string, aprovador: string, justificativa: string) =>
      appendRequisitionHistory(id, { status: 'devolvida' }, { data: now(), usuario: aprovador, acao: 'Devolvida para o solicitante', observacao: justificativa }),
    [appendRequisitionHistory],
  )

  const cancelRequisition = useCallback(
    (id: string, usuario: string, justificativa: string) =>
      appendRequisitionHistory(id, { status: 'cancelada' }, { data: now(), usuario, acao: 'Requisição cancelada', observacao: justificativa }),
    [appendRequisitionHistory],
  )

  const consolidateRequisitions = useCallback(
    (keepId: string, cancelId: string, usuario: string, justificativa: string) => {
      appendRequisitionHistory(cancelId, { status: 'cancelada' }, { data: now(), usuario, acao: 'Cancelada por consolidação', observacao: justificativa })
      appendRequisitionHistory(keepId, {}, { data: now(), usuario, acao: 'Consolidação confirmada', observacao: `Mantida como requisição única após consolidar com ${cancelId.toUpperCase()}.` })
    },
    [appendRequisitionHistory],
  )

  const sendToQuotation = useCallback(
    (id: string, usuario: string) => appendRequisitionHistory(id, { status: 'em_cotacao' }, { data: now(), usuario, acao: 'Encaminhada para cotação' }),
    [appendRequisitionHistory],
  )

  const convertRequisitionToOrder = useCallback(
    (requisicao: PurchaseRequisition, fornecedorId: string, fornecedorNome: string, usuario: string) => {
      const id = `po-${4550 + createdOrders.length}`
      const newOrder: PurchaseOrder = {
        id,
        fornecedorId,
        fornecedorNome,
        unitId: requisicao.unitId,
        itens: requisicao.itens.map((item: RequisitionItem) => ({
          itemId: item.itemId,
          nome: item.nome,
          unidadeMedida: item.unidadeMedida,
          quantidadePedida: item.quantidade,
          quantidadeRecebida: 0,
          custoUnitarioAcordado: item.custoEstimadoUnitario,
        })),
        valorTotal: requisicao.valorEstimado,
        status: 'emitido',
        dataEmissao: now(),
        previsaoEntrega: requisicao.dataNecessaria,
        requisicaoOrigemId: requisicao.id,
        timeline: [{ tipo: 'emitido', data: now(), responsavel: usuario, status: 'Pedido emitido', descricao: `Pedido gerado a partir de ${requisicao.id.toUpperCase()}.` }],
      }
      setCreatedOrders((prev) => [newOrder, ...prev])
      appendRequisitionHistory(requisicao.id, { status: 'convertida_pedido', pedidoId: id }, { data: now(), usuario, acao: 'Convertida em pedido', observacao: `Pedido ${id.toUpperCase()} criado.` })
      return newOrder
    },
    [setCreatedOrders, createdOrders.length, appendRequisitionHistory],
  )

  const decideQuotation = useCallback(
    (id: string, decisao: NonNullable<Quotation['decisao']>) =>
      setQuotationOverrides((prev) => ({ ...prev, [id]: { ...prev[id], status: 'decidida', decisao } })),
    [setQuotationOverrides],
  )

  const convertQuotationToOrder = useCallback(
    (cotacao: Quotation, usuario: string) => {
      if (!cotacao.decisao) return undefined
      const fornecedorNome = cotacao.respostas.find((r) => r.fornecedorId === cotacao.decisao!.fornecedorId)?.fornecedorNome ?? cotacao.decisao.fornecedorId
      const valor = cotacao.respostas.find((r) => r.fornecedorId === cotacao.decisao!.fornecedorId)?.valorTotal ?? cotacao.valorEstimado
      const id = `po-${4550 + createdOrders.length}`
      const newOrder: PurchaseOrder = {
        id,
        fornecedorId: cotacao.decisao.fornecedorId,
        fornecedorNome,
        unitId: 'todas',
        itens: cotacao.itens.map((item: RequisitionItem) => ({
          itemId: item.itemId,
          nome: item.nome,
          unidadeMedida: item.unidadeMedida,
          quantidadePedida: item.quantidade,
          quantidadeRecebida: 0,
          custoUnitarioAcordado: item.custoEstimadoUnitario,
        })),
        valorTotal: valor,
        status: 'emitido',
        dataEmissao: now(),
        previsaoEntrega: cotacao.prazoResposta,
        cotacaoOrigemId: cotacao.id,
        requisicaoOrigemId: cotacao.requisicaoOrigemId,
        timeline: [{ tipo: 'emitido', data: now(), responsavel: usuario, status: 'Pedido emitido', descricao: `Pedido gerado a partir da decisão de ${cotacao.id.toUpperCase()}.` }],
      }
      setCreatedOrders((prev) => [newOrder, ...prev])
      setQuotationOverrides((prev) => ({ ...prev, [cotacao.id]: { ...prev[cotacao.id], status: 'convertida_pedido', pedidoId: id } }))
      if (cotacao.requisicaoOrigemId) {
        appendRequisitionHistory(
          cotacao.requisicaoOrigemId,
          { status: 'convertida_pedido', pedidoId: id },
          { data: now(), usuario, acao: 'Convertida em pedido', observacao: `Pedido ${id.toUpperCase()} criado a partir da decisão de ${cotacao.id.toUpperCase()}.` },
        )
      }
      return newOrder
    },
    [setCreatedOrders, createdOrders.length, setQuotationOverrides, appendRequisitionHistory],
  )

  const appendOrderTimeline = useCallback(
    (id: string, patch: Partial<OrderOverride>, entry: OrderTimelineEvent) =>
      setOrderOverrides((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...patch, timelineExtra: [...(prev[id]?.timelineExtra ?? []), entry] },
      })),
    [setOrderOverrides],
  )

  const chargeSupplier = useCallback(
    (id: string, usuario: string) =>
      appendOrderTimeline(id, {}, { tipo: 'cobranca_fornecedor', data: now(), responsavel: usuario, status: 'Fornecedor cobrado', descricao: 'Cobrança formal registrada para o fornecedor.' }),
    [appendOrderTimeline],
  )

  const updateOrderForecast = useCallback(
    (id: string, novaPrevisao: string, usuario: string) =>
      appendOrderTimeline(
        id,
        { previsaoEntrega: novaPrevisao },
        { tipo: 'entrega_prevista_atualizada', data: now(), responsavel: usuario, status: 'Previsão atualizada', descricao: 'Nova previsão de entrega registrada.' },
      ),
    [appendOrderTimeline],
  )

  const registerReceipt = useCallback(
    (order: PurchaseOrder, usuario: string) => {
      const itensRecebidos = order.itens.map((item) => ({ ...item, quantidadeRecebida: item.quantidadePedida }))
      const concluido = itensRecebidos.every((item) => item.quantidadeRecebida >= item.quantidadePedida)
      appendOrderTimeline(
        order.id,
        { itensOverride: itensRecebidos, status: concluido ? 'concluido' : 'parcialmente_recebido' },
        { tipo: concluido ? 'concluido' : 'recebimento_parcial', data: now(), responsavel: usuario, status: concluido ? 'Pedido concluído' : 'Saldo recebido', descricao: concluido ? 'Saldo pendente recebido — pedido concluído.' : 'Recebimento de saldo registrado.' },
      )
    },
    [appendOrderTimeline],
  )

  const cancelOrderBalance = useCallback(
    (order: PurchaseOrder, usuario: string, justificativa: string) => {
      const itensAjustados = order.itens.map((item) => ({ ...item, quantidadePedida: item.quantidadeRecebida }))
      appendOrderTimeline(
        order.id,
        { itensOverride: itensAjustados, status: 'concluido' },
        { tipo: 'concluido', data: now(), responsavel: usuario, status: 'Saldo cancelado', descricao: `Saldo pendente cancelado. ${justificativa}` },
      )
    },
    [appendOrderTimeline],
  )

  const duplicateOrder = useCallback(
    (order: PurchaseOrder, usuario: string) => {
      const id = `po-${4550 + createdOrders.length}`
      const newOrder: PurchaseOrder = {
        ...order,
        id,
        status: 'emitido',
        dataEmissao: now(),
        itens: order.itens.map((item) => ({ ...item, quantidadeRecebida: 0, custoUnitarioRecebido: undefined })),
        timeline: [{ tipo: 'emitido', data: now(), responsavel: usuario, status: 'Pedido emitido', descricao: `Pedido duplicado a partir de ${order.id.toUpperCase()}.` }],
      }
      setCreatedOrders((prev) => [newOrder, ...prev])
      return newOrder
    },
    [setCreatedOrders, createdOrders.length],
  )

  const ignoreNeed = useCallback(
    (id: string) => setNeedOverrides((prev) => ({ ...prev, [id]: { ...prev[id], status: 'ignorada' } })),
    [setNeedOverrides],
  )

  const createRequisitionFromNeed = useCallback(
    (need: PurchaseNeed, quantidade: number, prioridade: PurchaseUrgency, motivo: string, solicitante: string) => {
      const id = `req-${1900 + createdRequisitions.length}`
      const custoEstimadoUnitario = getInventoryItemById(need.itemId)?.custoMedio ?? 0
      const newReq: PurchaseRequisition = {
        id,
        unitId: need.unitId,
        solicitante,
        categoria: need.categoria,
        itens: [{ itemId: need.itemId, nome: need.nome, quantidade, unidadeMedida: need.unidadeMedida, custoEstimadoUnitario }],
        motivo,
        prioridade,
        dataCriacao: now(),
        dataNecessaria: now(),
        valorEstimado: quantidade * custoEstimadoUnitario,
        status: 'aguardando_aprovacao',
        alertas: [],
        necessidadeOrigemId: need.id,
        historico: [{ data: now(), usuario: solicitante, acao: 'Requisição criada a partir da necessidade identificada' }],
      }
      setCreatedRequisitions((prev) => [newReq, ...prev])
      setNeedOverrides((prev) => ({ ...prev, [need.id]: { ...prev[need.id], status: 'em_requisicao', requisicaoGeradaId: id } }))
      return newReq
    },
    [createdRequisitions.length, setCreatedRequisitions, setNeedOverrides],
  )

  const createRequisition = useCallback(
    (input: { unitId: string; solicitante: string; categoria: string; itens: RequisitionItem[]; motivo: string; prioridade: PurchaseUrgency; dataNecessaria: string }) => {
      const id = `req-${1900 + createdRequisitions.length}`
      const valorEstimado = input.itens.reduce((soma, item) => soma + item.quantidade * item.custoEstimadoUnitario, 0)
      const newReq: PurchaseRequisition = {
        id,
        unitId: input.unitId,
        solicitante: input.solicitante,
        categoria: input.categoria,
        itens: input.itens,
        motivo: input.motivo,
        prioridade: input.prioridade,
        dataCriacao: now(),
        dataNecessaria: input.dataNecessaria,
        valorEstimado,
        status: 'aguardando_aprovacao',
        alertas: [],
        historico: [{ data: now(), usuario: input.solicitante, acao: 'Requisição criada' }],
      }
      setCreatedRequisitions((prev) => [newReq, ...prev])
      return newReq
    },
    [createdRequisitions.length, setCreatedRequisitions],
  )

  return {
    allRequisitions,
    allQuotations,
    allOrders,
    allNeeds,
    getEffectiveRequisition,
    getEffectiveQuotation,
    getEffectiveOrder,
    getEffectiveNeed,
    approveRequisition,
    rejectRequisition,
    returnRequisition,
    cancelRequisition,
    consolidateRequisitions,
    sendToQuotation,
    convertRequisitionToOrder,
    decideQuotation,
    convertQuotationToOrder,
    chargeSupplier,
    updateOrderForecast,
    registerReceipt,
    cancelOrderBalance,
    duplicateOrder,
    ignoreNeed,
    createRequisitionFromNeed,
    createRequisition,
  }
}
