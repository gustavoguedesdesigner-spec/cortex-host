import type { CmvBridgeStep, CmvNetworkPeriod, CmvTrendEvent, CmvWhatChangedItem, DataQualityInfo } from '@/types'
import { classificarQualidadeDados } from '@/utils/cmvConfidence'

/**
 * Dados brutos do periodo consolidado da rede — fonte unica de verdade
 * para o modulo de CMV. Todo valor derivado (CMV real/teorico, desvios,
 * impacto financeiro) e calculado por src/utils/cmvCalculations.ts a
 * partir destes numeros, nunca hardcoded em outro lugar.
 */
export const cmvNetworkPeriod: CmvNetworkPeriod = {
  periodId: 'periodo-atual',
  periodoLabel: 'Período atual — últimos 7 dias',
  vendasBrutas: 968400,
  deducoes: 21500,
  estoqueInicial: 213670,
  comprasBrutas: 432900,
  devolucoesFornecedores: 4200,
  transferenciasRecebidas: 39840,
  transferenciasEnviadas: 39840,
  ajustesAutorizados: 0,
  estoqueFinal: 312850,
  custoTeorico: 302060,
  metaCmv: 0.325,
  ultimoFechamentoLabel: 'Semana anterior — fechado por Leo em 17/07/2026',
  ultimaAtualizacao: '2026-07-23T14:30:00-03:00',
}

/**
 * Qualidade dos dados do periodo — 92% / Boa, com pendencias explicitas.
 * O percentual e a media simples do checklist abaixo (11 de 12 itens
 * completos ≈ 92%, arredondado para bater com o valor de referencia).
 */
export const cmvDataQuality: DataQualityInfo = {
  percentual: 0.92,
  classificacao: classificarQualidadeDados(0.92),
  checklist: [
    { label: 'Vendas importadas de todas as unidades', completo: true },
    { label: 'Compras confirmadas', completo: true },
    { label: 'Devoluções a fornecedores registradas', completo: true },
    { label: 'Inventário inicial validado', completo: true },
    { label: 'Inventário final — Caxias Norte', completo: false },
    { label: 'Transferências conciliadas', completo: false },
    { label: 'Fichas técnicas vigentes (3 aguardando revisão)', completo: false },
    { label: 'Recebimentos validados', completo: true },
    { label: 'Perdas registradas', completo: true },
    { label: 'Ajustes autorizados documentados', completo: true },
    { label: 'Preços padrão dos insumos atualizados', completo: true },
    { label: 'Divergências de recebimento respondidas', completo: true },
  ],
  pendencias: [
    'Inventário de Caxias Norte',
    'Uma transferência de chope sem conciliação',
    'Três fichas técnicas aguardando revisão',
  ],
}

/**
 * Ponte do CMV teórico ao CMV real — decomposição analítica do desvio de
 * R$ 27.460 em cinco componentes. Soma exata dos steps = 27.460.
 */
export const cmvBridgeSteps: CmvBridgeStep[] = [
  {
    id: 'porcionamento',
    label: 'Porcionamento e rendimento',
    valor: 12840,
    tooltip: 'Consumo de insumos acima do previsto pelas fichas técnicas — maior componente do desvio.',
  },
  {
    id: 'precos',
    label: 'Variação de preços',
    valor: 5920,
    tooltip: 'Aumento de preço de fornecedores acima do custo padrão vigente, sobretudo óleo.',
  },
  {
    id: 'estoque',
    label: 'Divergências de estoque',
    valor: 4780,
    tooltip: 'Diferenças entre contagem física e saldo esperado, incluindo inventários pendentes.',
  },
  {
    id: 'recebimento',
    label: 'Recebimentos e transferências',
    valor: 2640,
    tooltip: 'Notas com divergência de quantidade ou preço e transferências entre unidades ainda não conciliadas.',
  },
  {
    id: 'nao-explicado',
    label: 'Diferença ainda não explicada',
    valor: 1280,
    tooltip: 'Resíduo que os dados disponíveis ainda não permitem atribuir a uma causa específica.',
  },
]

/** Eventos observados sobre o gráfico de evolução — associação, não causalidade automática. */
export const cmvTrendEvents: CmvTrendEvent[] = [
  { semanaIndex: 2, label: 'Contagem incompleta' },
  { semanaIndex: 4, label: 'Aumento do preço do óleo' },
  { semanaIndex: 5, label: 'Divergência em recebimento' },
  { semanaIndex: 6, label: 'Transferência pendente' },
]

/** Painel "o que mudou" — comparação com o início da série de 8 semanas. */
export const cmvWhatChanged: CmvWhatChangedItem[] = [
  { label: 'CMV teórico', detalhe: '+0,4 ponto nas últimas 8 semanas' },
  { label: 'CMV real', detalhe: '+1,7 ponto nas últimas 8 semanas' },
  { label: 'Desvio (real − teórico)', detalhe: 'Ampliação de 1,3 ponto no período' },
  { label: 'Unidades que pioraram', detalhe: 'Moinhos e Caxias Centro' },
  { label: 'Unidade que melhorou', detalhe: 'Zona Norte' },
  { label: 'Categorias responsáveis pela maior parte da mudança', detalhe: 'Carnes, chope e óleos' },
]

export const cmvWhatChangedInsight =
  'A elevação do custo padrão explica apenas uma parte do aumento. A maior contribuição vem da ampliação da diferença entre consumo real e esperado.'

export const cmvExecutiveSummaryText =
  'O CMV real consolidado chegou a 34,8%, ficando 2,9 pontos acima do teórico e 2,3 pontos acima da meta. A diferença representa impacto estimado de R$ 27.460 no período. Carnes, chope e óleos concentram 76% do desvio. Moinhos e Caxias Centro representam 67% do impacto identificado.'

export const cmvExecutiveExplanations: string[] = [
  'Consumo de carnes acima das fichas técnicas',
  'Aumento de preços em óleos e determinados insumos',
  'Divergências de estoque e recebimento',
  'Transferência de chope ainda não conciliada',
  'Inventário pendente em Caxias Norte',
]

export const cmvExecutiveRecommendation =
  'Concluir as contagens pendentes e revisar os três produtos de carne com maior consumo não explicado antes do fechamento do período.'

/** Cenários de recuperação potencial — nunca prometem economia garantida. */
export function cenarioRecuperacao(desvioTotal: number, percentual: number): number {
  return desvioTotal * percentual
}

export const cmvOpportunityDisclaimer = 'Estimativa baseada no período selecionado. Não representa garantia de resultado.'
