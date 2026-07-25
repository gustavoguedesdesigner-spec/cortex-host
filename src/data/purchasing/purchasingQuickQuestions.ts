import type { CmvQuickAnswer } from '@/types'

/** Perguntas rápidas do módulo de Compras (seção 40-42) — respostas simuladas, texto fixo. */
export const purchasingQuickQuestions: CmvQuickAnswer[] = [
  {
    pergunta: 'O que precisa ser comprado hoje?',
    resposta:
      'O item mais urgente é o chope IPA da Zona Norte — cobertura de 1,7 dia, risco de ruptura antes da próxima entrega. Há também quatro requisições aguardando aprovação, três compras emergenciais abertas e duas cotações prontas para decisão, com economia estimada de R$ 12.860.',
    links: [{ label: 'Ver requisição crítica', path: '/compras/requisicoes/req-1842' }, { label: 'Ver prioridades do dia', path: '/compras' }],
  },
  {
    pergunta: 'Posso transferir em vez de comprar?',
    resposta:
      'Para o chope IPA da Zona Norte, sim — parcialmente. Serra tem 522L com cobertura de mais de 5 dias e pode ceder 120L sem risco. Isso cobre a Zona Norte por 2,9 dias, ainda abaixo do prazo de entrega do fornecedor. Recomendo combinar a transferência de 120L com uma compra complementar de 180L.',
    links: [{ label: 'Ver comparação de cenários', path: '/compras/requisicoes/req-1842' }],
  },
  {
    pergunta: 'Qual fornecedor devo escolher?',
    resposta:
      'Na cotação de óleos e frituras (COT-0573), Distribuidora Gaúcha tem o menor preço, mas a menor conformidade histórica do grupo. Sul Foodservice tem o melhor equilíbrio entre preço, prazo e conformidade, com o menor risco de divergência — é a recomendação padrão do CORTEX. Atacado Central entrega mais rápido, mas custa 6% a mais.',
    links: [{ label: 'Abrir mapa comparativo', path: '/compras/cotacoes/cot-0573' }],
  },
  {
    pergunta: 'Existe algum pedido duplicado?',
    resposta:
      'Sim. Cidade Baixa (REQ-1846) e Serra (REQ-1847) abriram requisições de queijo cheddar na mesma janela de 25 minutos, para o mesmo fornecedor. REQ-1847 já foi devolvida para o solicitante — recomendo consolidar em uma única requisição antes de seguir para cotação.',
    links: [{ label: 'Ver REQ-1846', path: '/compras/requisicoes/req-1846' }, { label: 'Ver REQ-1847', path: '/compras/requisicoes/req-1847' }],
  },
  {
    pergunta: 'Onde existe potencial de economia?',
    resposta:
      'R$ 12.860 em cinco oportunidades: decidir a cotação de óleos e frituras (R$ 2.860), trocar o fornecedor de embalagens descartáveis (R$ 3.240), antecipar a compra de carnes antes do reajuste anunciado (R$ 3.980), consolidar pedidos de limpeza entre Zona Norte e Caxias Norte (R$ 1.560) e revisar a frequência de compra de hortifrúti (R$ 1.220).',
    links: [{ label: 'Ver oportunidades de economia', path: '/compras' }],
  },
  {
    pergunta: 'Quais requisições estão aguardando aprovação?',
    resposta:
      'Quatro requisições aguardam aprovação, com destaque para REQ-1842 (chope IPA, Zona Norte, crítica, R$ 7.800) e REQ-1846 (queijo cheddar, Cidade Baixa, com alerta de possível duplicidade).',
    links: [{ label: 'Abrir Central de Aprovações', path: '/compras/aprovacoes' }],
  },
  {
    pergunta: 'Por que este pedido está divergente?',
    resposta:
      'O exemplo mais recente é o PO-4518, da Serra Alimentos: 520 kg recebidos (30 kg a menos que o pedido) a R$ 37,50/kg, acima do preço acordado de R$ 34,36/kg — uma diferença de quantidade e preço que soma R$ 3.780. O fornecedor já foi cobrado formalmente.',
    links: [{ label: 'Abrir PO-4518', path: '/compras/pedidos/po-4518' }],
  },
  {
    pergunta: 'Quantos pedidos estão atrasados?',
    resposta:
      'Dois pedidos estão com divergência aberta e cinco estão parcialmente recebidos, aguardando conclusão. O PO-4532 (Bebidas Sul) teve uma remarcação de entrega nesta semana e o saldo de 80L está previsto para hoje às 14h.',
    links: [{ label: 'Ver pedidos', path: '/compras/pedidos' }],
  },
  {
    pergunta: 'Qual unidade comprou fora do padrão?',
    resposta:
      'Moinhos concentra os dois casos mais críticos do período: o pedido divergente PO-4518 e o pedido parcial PO-4532, ambos de categorias diferentes — sinal de que vale revisar o processo de recebimento da unidade, não apenas os fornecedores envolvidos.',
    links: [{ label: 'Abrir Moinhos', path: '/unidades/moinhos' }],
  },
  {
    pergunta: 'Como é calculada a necessidade sugerida?',
    resposta:
      'Necessidade sugerida = Ponto de reposição + consumo previsto até a entrega − saldo disponível − estoque em trânsito − pedidos já confirmados. O resultado é um ponto de partida para a decisão, nunca a criação automática de um pedido.',
    links: [{ label: 'Ver Necessidades de Compra', path: '/compras/necessidades' }],
  },
  {
    pergunta: 'Quais itens tiveram maior variação de preço?',
    resposta:
      'A variação média de preços da rede foi de +4,7% no período. Óleos e frituras teve o maior avanço entre as categorias (+9,4%), puxado pelo óleo de soja — um dos motivos pelos quais a cotação COT-0573 reúne quatro fornecedores em vez de uma compra direta.',
    links: [{ label: 'Ver compras por categoria', path: '/compras' }],
  },
]

export function findPurchasingQuickAnswer(question: string): CmvQuickAnswer | undefined {
  return purchasingQuickQuestions.find((q) => q.pergunta.trim().toLowerCase() === question.trim().toLowerCase())
}
