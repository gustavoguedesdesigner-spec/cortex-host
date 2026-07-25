import type { PurchaseUrgency } from '@/types'

export interface PurchasingPriority {
  id: string
  titulo: string
  unitLabel: string
  descricao: string
  valor: number
  prazoLabel: string
  urgencia: PurchaseUrgency
  path: string
  acoesSecundarias: { label: string; path: string }[]
  perguntaCortex: string
  respostaCortex: string
}

/** Prioridades de hoje (seção 9) — cada uma corresponde a uma das cinco jornadas de teste do módulo. */
export const purchasingPriorities: PurchasingPriority[] = [
  {
    id: 'prioridade-req-1842',
    titulo: 'Chope IPA — Zona Norte',
    unitLabel: 'Zona Norte',
    descricao: 'Risco de ruptura em 1,7 dia. Requisição crítica aguardando decisão — comprar, transferir ou combinar as duas opções.',
    valor: 7800,
    prazoLabel: 'Necessário até amanhã',
    urgencia: 'critica',
    path: '/compras/requisicoes/req-1842',
    acoesSecundarias: [
      { label: 'Ver comparação de cenários', path: '/compras/requisicoes/req-1842' },
      { label: 'Abrir aprovações', path: '/compras/aprovacoes' },
    ],
    perguntaCortex: 'Posso transferir em vez de comprar o chope IPA da Zona Norte?',
    respostaCortex:
      'Sim, mas não integralmente. Serra tem 522L com cobertura de mais de 5 dias e pode ceder 120L sem risco — isso cobre a Zona Norte por 2,9 dias, ainda abaixo do prazo de entrega do fornecedor (3 dias). Recomendo combinar a transferência de 120L com uma compra complementar de 180L: custo total de R$ 5.040, cobertura final de 4,7 dias nas duas unidades, sem pagar o prêmio de uma compra emergencial de 300L.',
  },
  {
    id: 'prioridade-cot-0573',
    titulo: 'Óleos e frituras — cotação pronta',
    unitLabel: 'Rede',
    descricao: 'Quatro fornecedores responderam. Economia potencial de R$ 2.860 se a decisão for tomada hoje.',
    valor: 22900,
    prazoLabel: 'Prazo de resposta encerrado',
    urgencia: 'alta',
    path: '/compras/cotacoes/cot-0573',
    acoesSecundarias: [
      { label: 'Ver mapa comparativo', path: '/compras/cotacoes/cot-0573' },
      { label: 'Ver todas as cotações', path: '/compras/cotacoes' },
    ],
    perguntaCortex: 'Qual fornecedor devo escolher para óleos e frituras?',
    respostaCortex:
      'Depende do critério. Distribuidora Gaúcha tem o menor preço (R$ 20.040), mas a menor conformidade histórica do grupo. Sul Foodservice tem o melhor equilíbrio entre preço, prazo e conformidade, com o menor risco de divergência — é a recomendação padrão do CORTEX para este lote. Atacado Central entrega mais rápido, mas custa 6% a mais.',
  },
  {
    id: 'prioridade-po-4532',
    titulo: 'Chope IPA — entrega parcial hoje',
    unitLabel: 'Moinhos',
    descricao: 'Bebidas Sul confirmou a entrega do saldo de 80L às 14h. Pedido segue aberto até a conclusão.',
    valor: 12640,
    prazoLabel: 'Entrega prevista às 14h',
    urgencia: 'alta',
    path: '/compras/pedidos/po-4532',
    acoesSecundarias: [
      { label: 'Abrir pedido', path: '/compras/pedidos/po-4532' },
      { label: 'Ver Recebimentos', path: '/recebimentos' },
    ],
    perguntaCortex: 'O pedido PO-4532 vai ser concluído hoje?',
    respostaCortex:
      'Não necessariamente. A Bebidas Sul confirmou a entrega do saldo de 80L às 14h, mas o pedido já teve um atraso nesta semana. Recomendo manter o pedido aberto até a conferência do recebimento e cobrar formalmente o fornecedor se o horário não for cumprido.',
  },
  {
    id: 'prioridade-po-4518',
    titulo: 'Pedido divergente — Serra Alimentos',
    unitLabel: 'Moinhos',
    descricao: 'Diferença de quantidade e preço no recebimento — R$ 3.780 envolvidos. Fornecedor já foi cobrado.',
    valor: 18900,
    prazoLabel: 'Aberto há 2 dias',
    urgencia: 'alta',
    path: '/compras/pedidos/po-4518',
    acoesSecundarias: [
      { label: 'Abrir pedido', path: '/compras/pedidos/po-4518' },
      { label: 'Ver histórico do fornecedor', path: '/compras/pedidos/po-4518' },
    ],
    perguntaCortex: 'Por que o pedido PO-4518 está divergente?',
    respostaCortex:
      'A Serra Alimentos entregou 520 kg (30 kg a menos que o pedido) a R$ 37,50/kg, acima do preço acordado de R$ 34,36/kg — uma diferença de quantidade e preço que soma R$ 3.780. O fornecedor já foi cobrado formalmente. Recomendo não concluir o pedido até a confirmação do ajuste ou da devolução do saldo.',
  },
  {
    id: 'prioridade-duplicidade-cheddar',
    titulo: 'Possível duplicidade — queijo cheddar',
    unitLabel: 'Cidade Baixa · Serra',
    descricao: 'Duas requisições do mesmo item foram abertas por unidades diferentes na mesma janela de 25 minutos.',
    valor: 2925,
    prazoLabel: 'Aguardando consolidação',
    urgencia: 'media',
    path: '/compras/requisicoes/req-1846',
    acoesSecundarias: [
      { label: 'Comparar requisições', path: '/compras/requisicoes' },
      { label: 'Abrir REQ-1847', path: '/compras/requisicoes/req-1847' },
    ],
    perguntaCortex: 'Existe algum pedido duplicado hoje?',
    respostaCortex:
      'Sim. Cidade Baixa (REQ-1846) e Serra (REQ-1847) abriram requisições de queijo cheddar na mesma janela de 25 minutos, para o mesmo fornecedor. REQ-1847 já foi devolvida para o solicitante — recomendo consolidar em uma única requisição ou justificar a necessidade de manter as duas antes de reenviar.',
  },
]

export function getPurchasingPriorityById(id: string): PurchasingPriority | undefined {
  return purchasingPriorities.find((p) => p.id === id)
}
