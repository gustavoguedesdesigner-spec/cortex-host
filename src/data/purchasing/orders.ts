import type { PurchaseOrder } from '@/types'

/**
 * Pedidos de compra (seção 34-39). PO-4532 (Bebidas Sul, Moinhos, chope IPA)
 * é o pedido parcial aprofundado; PO-4518 (Serra Alimentos, Moinhos) é o
 * pedido divergente aprofundado. Os demais são amostra representativa dos
 * 14 pedidos em aberto, não a enumeração completa.
 * Preço acordado por unidade pode diferir do custo médio de estoque
 * (src/data/inventory/inventoryItems.ts) — o custo médio é uma média móvel
 * histórica, o preço acordado é o valor negociado neste pedido específico.
 */
export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-4532',
    fornecedorId: 'bebidas-sul',
    fornecedorNome: 'Bebidas Sul',
    unitId: 'moinhos',
    itens: [{ itemId: 'chope-ipa', nome: 'Chope IPA', unidadeMedida: 'litro', quantidadePedida: 400, quantidadeRecebida: 320, custoUnitarioAcordado: 31.6, custoUnitarioRecebido: 31.6 }],
    valorTotal: 12640,
    status: 'parcialmente_recebido',
    dataEmissao: '2026-07-22T09:30:00-03:00',
    previsaoEntrega: '2026-07-25T14:00:00-03:00',
    timeline: [
      { tipo: 'emitido', data: '2026-07-22T09:30:00-03:00', responsavel: 'Rafael Martins', status: 'Pedido emitido', descricao: 'Pedido emitido para Bebidas Sul — 400L de Chope IPA.' },
      { tipo: 'confirmado_fornecedor', data: '2026-07-22T14:10:00-03:00', responsavel: 'Bebidas Sul', status: 'Confirmado pelo fornecedor', descricao: 'Fornecedor confirmou o pedido com entrega prevista para 24/07.' },
      { tipo: 'entrega_prevista_atualizada', data: '2026-07-24T08:00:00-03:00', responsavel: 'Bebidas Sul', status: 'Previsão atualizada', descricao: 'Fornecedor remarcou a entrega para 25/07, às 14h, por atraso de rota.' },
      { tipo: 'em_transporte', data: '2026-07-25T07:20:00-03:00', responsavel: 'Bebidas Sul', status: 'Em transporte', descricao: 'Carga saiu para entrega — 320L confirmados nesta remessa, 80L no saldo seguinte.' },
      { tipo: 'recebimento_parcial', data: '2026-07-25T11:45:00-03:00', responsavel: 'Rafael Martins', status: 'Recebimento parcial registrado', descricao: '320L recebidos e conferidos sem divergência. Saldo de 80L previsto para hoje às 14h.', link: { label: 'Abrir recebimento', path: '/recebimentos' } },
    ],
  },
  {
    id: 'po-4518',
    fornecedorId: 'serra-alimentos',
    fornecedorNome: 'Serra Alimentos',
    unitId: 'moinhos',
    itens: [{ itemId: 'carne-bovina-blend', nome: 'Carne bovina — blend para hambúrguer', unidadeMedida: 'kg', quantidadePedida: 550, quantidadeRecebida: 520, custoUnitarioAcordado: 34.36, custoUnitarioRecebido: 37.5 }],
    valorTotal: 18900,
    status: 'divergente',
    dataEmissao: '2026-07-19T10:00:00-03:00',
    previsaoEntrega: '2026-07-23T10:00:00-03:00',
    divergencia: {
      tipo: 'quantidade_e_preco',
      descricao: 'Recebidos 520 kg (30 kg a menos que o pedido) a R$ 37,50/kg — R$ 3,14 acima do preço acordado (R$ 34,36/kg).',
      valorEnvolvido: 3780,
    },
    timeline: [
      { tipo: 'emitido', data: '2026-07-19T10:00:00-03:00', responsavel: 'Rafael Martins', status: 'Pedido emitido', descricao: 'Pedido emitido para Serra Alimentos — 550 kg de carne bovina.' },
      { tipo: 'confirmado_fornecedor', data: '2026-07-19T15:40:00-03:00', responsavel: 'Serra Alimentos', status: 'Confirmado pelo fornecedor', descricao: 'Fornecedor confirmou o pedido com entrega prevista para 23/07.' },
      { tipo: 'em_transporte', data: '2026-07-23T06:00:00-03:00', responsavel: 'Serra Alimentos', status: 'Em transporte', descricao: 'Carga saiu para entrega.' },
      {
        tipo: 'recebimento_parcial',
        data: '2026-07-23T10:20:00-03:00',
        responsavel: 'Rafael Martins',
        status: 'Recebido com divergência',
        descricao: '520 kg recebidos, 30 kg abaixo do pedido, com preço acima do acordado.',
        link: { label: 'Abrir recebimento', path: '/recebimentos' },
      },
      { tipo: 'divergencia_registrada', data: '2026-07-23T10:35:00-03:00', responsavel: 'Rafael Martins', status: 'Divergência registrada', descricao: 'Diferença de quantidade e preço registrada — R$ 3.780 envolvidos.' },
      { tipo: 'cobranca_fornecedor', data: '2026-07-24T09:00:00-03:00', responsavel: 'Leo', status: 'Fornecedor cobrado', descricao: 'Cobrança formal enviada à Serra Alimentos solicitando ajuste ou devolução do saldo.' },
    ],
  },
  {
    id: 'po-4536',
    fornecedorId: 'hortifruti-bahia',
    fornecedorNome: 'Hortifruti Bahia',
    unitId: 'zona-norte',
    itens: [{ itemId: 'alface-americana', nome: 'Alface americana', unidadeMedida: 'kg', quantidadePedida: 200, quantidadeRecebida: 0, custoUnitarioAcordado: 6.2 }],
    valorTotal: 1240,
    status: 'aguardando_entrega',
    dataEmissao: '2026-07-24T11:00:00-03:00',
    previsaoEntrega: '2026-07-26T10:00:00-03:00',
    timeline: [
      { tipo: 'emitido', data: '2026-07-24T11:00:00-03:00', responsavel: 'Patricia Lins', status: 'Pedido emitido', descricao: 'Pedido emitido para Hortifruti Bahia — 200 kg de alface americana.' },
      { tipo: 'confirmado_fornecedor', data: '2026-07-24T13:15:00-03:00', responsavel: 'Hortifruti Bahia', status: 'Confirmado pelo fornecedor', descricao: 'Fornecedor confirmou entrega para 26/07.' },
    ],
  },
  {
    id: 'po-4539',
    fornecedorId: 'laticinios-do-vale',
    fornecedorNome: 'Laticínios do Vale',
    unitId: 'cidade-baixa',
    itens: [{ itemId: 'queijo-cheddar', nome: 'Queijo cheddar', unidadeMedida: 'kg', quantidadePedida: 40, quantidadeRecebida: 0, custoUnitarioAcordado: 39 }],
    valorTotal: 1560,
    status: 'confirmado',
    dataEmissao: '2026-07-25T08:30:00-03:00',
    previsaoEntrega: '2026-07-28T10:00:00-03:00',
    requisicaoOrigemId: 'req-1846',
    timeline: [
      { tipo: 'emitido', data: '2026-07-25T08:30:00-03:00', responsavel: 'Diego Andrade', status: 'Pedido emitido', descricao: 'Pedido emitido para Laticínios do Vale — 40 kg de queijo cheddar.' },
      { tipo: 'confirmado_fornecedor', data: '2026-07-25T09:50:00-03:00', responsavel: 'Laticínios do Vale', status: 'Confirmado pelo fornecedor', descricao: 'Fornecedor confirmou entrega para 28/07.' },
    ],
  },
  {
    id: 'po-4542',
    fornecedorId: 'atacado-central',
    fornecedorNome: 'Atacado Central',
    unitId: 'caxias-norte',
    itens: [{ itemId: 'embalagem-delivery', nome: 'Embalagem delivery', unidadeMedida: 'unidade', quantidadePedida: 2000, quantidadeRecebida: 2000, custoUnitarioAcordado: 1.8, custoUnitarioRecebido: 1.8 }],
    valorTotal: 3600,
    status: 'concluido',
    dataEmissao: '2026-07-18T09:00:00-03:00',
    previsaoEntrega: '2026-07-21T10:00:00-03:00',
    timeline: [
      { tipo: 'emitido', data: '2026-07-18T09:00:00-03:00', responsavel: 'Bruno Teles', status: 'Pedido emitido', descricao: 'Pedido emitido para Atacado Central — 2.000 unidades de embalagem delivery.' },
      { tipo: 'confirmado_fornecedor', data: '2026-07-18T10:30:00-03:00', responsavel: 'Atacado Central', status: 'Confirmado pelo fornecedor', descricao: 'Fornecedor confirmou entrega para 21/07.' },
      { tipo: 'recebimento_parcial', data: '2026-07-21T09:40:00-03:00', responsavel: 'Bruno Teles', status: 'Recebido integralmente', descricao: '2.000 unidades recebidas e conferidas sem divergência.' },
      { tipo: 'concluido', data: '2026-07-21T09:45:00-03:00', responsavel: 'Bruno Teles', status: 'Pedido concluído', descricao: 'Pedido concluído — sem saldo pendente ou divergência aberta.' },
    ],
  },
]

export function getOrderById(id: string): PurchaseOrder | undefined {
  return purchaseOrders.find((o) => o.id === id)
}

export function getOrdersWithDivergence(): PurchaseOrder[] {
  return purchaseOrders.filter((o) => o.status === 'divergente')
}
