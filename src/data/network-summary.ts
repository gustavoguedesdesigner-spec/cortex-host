/**
 * NETWORK SUMMARY — indicadores consolidados da rede
 * ---------------------------------------------------------------------
 * Valores "oficiais" dos 6 indicadores principais da Central de
 * Operacoes (secao 8 do briefing). Mantidos como constantes fixas (em
 * vez de recalculados a partir das unidades) para preservar exatamente
 * os numeros de referencia usados no resumo executivo, no grafico de
 * CMV e nas respostas simuladas da IA. As unidades (units.ts) já somam
 * exatamente às perdas, alertas, compras e estoque abaixo — pequenas
 * diferenças de arredondamento no CMV consolidado (que depende de vendas
 * por unidade, não especificadas na origem) são esperadas e aceitáveis.
 * ---------------------------------------------------------------------
 */
export const networkSummary = {
  cmvReal: 0.348,
  cmvMeta: 0.325,
  cmvTeorico: 0.319,
  cmvTeoricoVariacaoAnterior: 0.004,
  diferencaFinanceira: 27460,
  compras: 428700,
  comprasVariacaoAnterior: 0.068,
  valorEstoque: 312850,
  perdas: 18320,
  perdasVariacaoAnterior: 0.142,
  totalOcorrencias: 18,
  ocorrenciasCriticas: 3,
  dataSimulada: '2026-07-23T14:32:00-03:00',
  ultimaAtualizacaoLabel: 'há 12 minutos',
}

export const integrationStatus = [
  { nome: 'PDV', estado: 'atualizado' as const },
  { nome: 'Estoque', estado: 'atualizado' as const },
  { nome: 'Compras', estado: 'atualizado' as const },
  { nome: 'Contagens', estado: 'pendente' as const, detalhe: '2 pendentes' },
]
