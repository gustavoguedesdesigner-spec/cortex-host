import type { Quotation, QuotationScoreWeights } from '@/types'

/**
 * Cotações (seção 27-33). COT-0573 (óleos e frituras) é a cotação
 * aprofundada para demonstração — mapa comparativo completo, score
 * configurável e os quatro cenários de decisão do CORTEX. valorEstimado é o
 * preço de referência da categoria; economiaPotencial = valorEstimado menos
 * a melhor oferta recebida.
 */
export const purchaseQuotations: Quotation[] = [
  {
    id: 'cot-0573',
    categoria: 'Óleos e frituras',
    escopo: 'Reposição consolidada de óleos e frituras para as 6 unidades — óleo de soja, óleo especial para fritura e gordura vegetal.',
    itens: [
      { itemId: 'oleo-soja', nome: 'Óleo de soja', quantidade: 260, unidadeMedida: 'unidade', custoEstimadoUnitario: 33.9 },
      { itemId: 'oleo-especial-fritura', nome: 'Óleo especial para fritura', quantidade: 150, unidadeMedida: 'unidade', custoEstimadoUnitario: 42 },
      { itemId: 'gordura-vegetal', nome: 'Gordura vegetal', quantidade: 280, unidadeMedida: 'kg', custoEstimadoUnitario: 28 },
    ],
    fornecedoresConvidados: ['distribuidora-gaucha', 'serra-alimentos', 'sul-foodservice', 'atacado-central'],
    respostas: [
      { fornecedorId: 'distribuidora-gaucha', fornecedorNome: 'Distribuidora Gaúcha', valorTotal: 20040, prazoEntregaDias: 5, pontualidadeHistorica: 0.86, conformidadeHistorica: 0.78, divergenciasHistoricas: 3, formaPagamento: '30 dias', prazoPagamentoDias: 30, respondeu: true },
      { fornecedorId: 'serra-alimentos', fornecedorNome: 'Serra Alimentos', valorTotal: 23150, prazoEntregaDias: 4, pontualidadeHistorica: 0.8, conformidadeHistorica: 0.72, divergenciasHistoricas: 4, formaPagamento: '15 dias', prazoPagamentoDias: 15, respondeu: true },
      { fornecedorId: 'sul-foodservice', fornecedorNome: 'Sul Foodservice', valorTotal: 22350, prazoEntregaDias: 3, pontualidadeHistorica: 0.94, conformidadeHistorica: 0.92, divergenciasHistoricas: 1, formaPagamento: '28 dias', prazoPagamentoDias: 28, respondeu: true },
      { fornecedorId: 'atacado-central', fornecedorNome: 'Atacado Central', valorTotal: 23760, prazoEntregaDias: 2, pontualidadeHistorica: 0.97, conformidadeHistorica: 0.85, divergenciasHistoricas: 2, formaPagamento: '21 dias', prazoPagamentoDias: 21, respondeu: true },
    ],
    status: 'pronta_para_decisao',
    valorEstimado: 22900,
    economiaPotencial: 2860,
    prazoResposta: '2026-07-24T18:00:00-03:00',
    requisicaoOrigemId: 'req-1844',
  },
  {
    id: 'cot-0574',
    categoria: 'Secos',
    escopo: 'Reposição trimestral de itens secos de alto giro — batata congelada e molho especial.',
    itens: [
      { itemId: 'batata-congelada', nome: 'Batata congelada', quantidade: 400, unidadeMedida: 'kg', custoEstimadoUnitario: 8.6 },
      { itemId: 'molho-especial-5kg', nome: 'Molho especial — balde 5 kg', quantidade: 60, unidadeMedida: 'unidade', custoEstimadoUnitario: 84 },
    ],
    fornecedoresConvidados: ['atacado-central', 'distribuidora-gaucha', 'hortifruti-bahia'],
    respostas: [
      { fornecedorId: 'atacado-central', fornecedorNome: 'Atacado Central', valorTotal: 9160, prazoEntregaDias: 2, pontualidadeHistorica: 0.97, conformidadeHistorica: 0.85, divergenciasHistoricas: 2, formaPagamento: '21 dias', prazoPagamentoDias: 21, respondeu: true },
      { fornecedorId: 'distribuidora-gaucha', fornecedorNome: 'Distribuidora Gaúcha', valorTotal: 9640, prazoEntregaDias: 4, pontualidadeHistorica: 0.86, conformidadeHistorica: 0.78, divergenciasHistoricas: 3, formaPagamento: '30 dias', prazoPagamentoDias: 30, respondeu: true },
      { fornecedorId: 'hortifruti-bahia', fornecedorNome: 'Hortifruti Bahia', valorTotal: 9980, prazoEntregaDias: 3, pontualidadeHistorica: 0.91, conformidadeHistorica: 0.9, divergenciasHistoricas: 1, formaPagamento: '15 dias', prazoPagamentoDias: 15, respondeu: true },
    ],
    status: 'pronta_para_decisao',
    valorEstimado: 9800,
    economiaPotencial: 640,
    prazoResposta: '2026-07-25T12:00:00-03:00',
  },
  {
    id: 'cot-0575',
    categoria: 'Embalagens',
    escopo: 'Substituição de fornecedor de embalagens descartáveis — oportunidade de economia identificada pelo CORTEX.',
    itens: [{ itemId: 'embalagem-delivery', nome: 'Embalagem delivery', quantidade: 6000, unidadeMedida: 'unidade', custoEstimadoUnitario: 1.8 }],
    fornecedoresConvidados: ['embalagens-bahia', 'distribuidora-gaucha', 'atacado-central'],
    respostas: [
      { fornecedorId: 'distribuidora-gaucha', fornecedorNome: 'Distribuidora Gaúcha', valorTotal: 9840, prazoEntregaDias: 4, pontualidadeHistorica: 0.86, conformidadeHistorica: 0.78, divergenciasHistoricas: 3, formaPagamento: '30 dias', prazoPagamentoDias: 30, respondeu: true },
      { fornecedorId: 'embalagens-bahia', fornecedorNome: 'Embalagens Bahia', valorTotal: 0, prazoEntregaDias: 0, pontualidadeHistorica: 0.79, conformidadeHistorica: 0.75, divergenciasHistoricas: 3, formaPagamento: '—', prazoPagamentoDias: 0, respondeu: false },
      { fornecedorId: 'atacado-central', fornecedorNome: 'Atacado Central', valorTotal: 0, prazoEntregaDias: 0, pontualidadeHistorica: 0.97, conformidadeHistorica: 0.85, divergenciasHistoricas: 2, formaPagamento: '—', prazoPagamentoDias: 0, respondeu: false },
    ],
    status: 'aguardando_respostas',
    valorEstimado: 10800,
    economiaPotencial: 0,
    prazoResposta: '2026-07-27T18:00:00-03:00',
  },
  {
    id: 'cot-0576',
    categoria: 'Limpeza',
    escopo: 'Reposição semestral de produto de limpeza específico — cotação já decidida.',
    itens: [{ itemId: 'produto-limpeza-especifico', nome: 'Produto de limpeza específico', quantidade: 200, unidadeMedida: 'litro', custoEstimadoUnitario: 14.5 }],
    fornecedoresConvidados: ['distribuidora-gaucha'],
    respostas: [
      { fornecedorId: 'distribuidora-gaucha', fornecedorNome: 'Distribuidora Gaúcha', valorTotal: 2900, prazoEntregaDias: 4, pontualidadeHistorica: 0.86, conformidadeHistorica: 0.78, divergenciasHistoricas: 3, formaPagamento: '30 dias', prazoPagamentoDias: 30, respondeu: true },
    ],
    status: 'decidida',
    valorEstimado: 3100,
    economiaPotencial: 200,
    prazoResposta: '2026-07-18T18:00:00-03:00',
    decisao: {
      tipo: 'menor_preco',
      fornecedorId: 'distribuidora-gaucha',
      justificativa: 'Único fornecedor homologado para este item no momento — decisão sem comparação de alternativas.',
    },
  },
]

export function getQuotationById(id: string): Quotation | undefined {
  return purchaseQuotations.find((q) => q.id === id)
}

export const defaultScoreWeights: QuotationScoreWeights = { preco: 40, prazo: 20, conformidade: 15, qualidade: 10, divergencias: 10, pagamento: 5 }

export interface QuotationDecisionScenario {
  tipo: 'menor_preco' | 'melhor_equilibrio' | 'entrega_mais_rapida' | 'menor_risco'
  titulo: string
  fornecedorId: string
  resumo: string
}

/** Cenários de decisão para COT-0573 (seção 31) — a escolha final é sempre do usuário. */
export const cot0573DecisionScenarios: QuotationDecisionScenario[] = [
  { tipo: 'menor_preco', titulo: 'Menor preço', fornecedorId: 'distribuidora-gaucha', resumo: 'R$ 20.040 — R$ 2.860 abaixo do preço de referência, mas com a menor conformidade histórica do grupo (78%).' },
  { tipo: 'melhor_equilibrio', titulo: 'Melhor equilíbrio', fornecedorId: 'sul-foodservice', resumo: 'R$ 22.350 — prazo curto (3 dias), maior conformidade (92%) e menor histórico de divergências do grupo.' },
  { tipo: 'entrega_mais_rapida', titulo: 'Entrega mais rápida', fornecedorId: 'atacado-central', resumo: 'R$ 23.760 — entrega em 2 dias, mas custa 6% a mais que a melhor oferta.' },
  { tipo: 'menor_risco', titulo: 'Menor risco', fornecedorId: 'sul-foodservice', resumo: 'Mesma indicação do melhor equilíbrio — maior conformidade e menor divergência histórica do grupo.' },
]

export const cot0573SummaryText =
  'Distribuidora Gaúcha tem o menor preço, mas a menor conformidade histórica do grupo. Sul Foodservice tem o melhor equilíbrio entre preço, prazo e conformidade, com o menor risco de divergência — é a recomendação padrão do CORTEX para este lote. Atacado Central entrega mais rápido, mas custa 6% a mais que a melhor oferta.'
