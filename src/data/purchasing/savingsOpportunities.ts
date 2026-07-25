import type { SavingsOpportunity } from '@/types'

/** Oportunidades de economia (seção 12) — soma exatamente aos R$ 12.860 de purchasingSituation.economiaEstimadaCotacoes. */
export const savingsOpportunities: SavingsOpportunity[] = [
  {
    id: 'economia-oleos',
    titulo: 'Decidir a cotação de óleos e frituras entre as 6 unidades',
    descricao: 'COT-0573 já reúne quatro respostas de fornecedores — decidir hoje evita nova rodada de cotação isolada por unidade.',
    valor: 2860,
    categoria: 'Óleos e frituras',
  },
  {
    id: 'economia-embalagens',
    titulo: 'Trocar o fornecedor de embalagens descartáveis',
    descricao: 'Embalagens Bahia está acima da média da categoria nos últimos três pedidos, sem ganho de prazo ou conformidade.',
    valor: 3240,
    categoria: 'Embalagens',
  },
  {
    id: 'economia-carnes',
    titulo: 'Antecipar a compra de carnes antes do reajuste anunciado',
    descricao: 'Serra Alimentos comunicou reajuste de preço para a próxima semana em parte da linha de carnes.',
    valor: 3980,
    categoria: 'Carnes',
  },
  {
    id: 'economia-limpeza',
    titulo: 'Consolidar pedidos de limpeza entre Zona Norte e Caxias Norte',
    descricao: 'As duas unidades compram do mesmo fornecedor em datas próximas, sem consolidar em um único pedido.',
    valor: 1560,
    categoria: 'Limpeza',
  },
  {
    id: 'economia-hortifruti',
    titulo: 'Revisar a frequência de compra de hortifrúti',
    descricao: 'Itens perecíveis vêm sendo comprados acima do consumo entre uma entrega e outra, gerando perda por validade.',
    valor: 1220,
    categoria: 'Hortifrúti',
  },
]

export const savingsOpportunitiesDisclaimer =
  'Estimativas calculadas a partir de cotações em andamento, histórico de preços e consolidação possível de pedidos — não representam economia garantida até a decisão ser tomada e o pedido emitido.'
