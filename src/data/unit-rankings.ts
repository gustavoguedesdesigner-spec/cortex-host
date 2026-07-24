/**
 * Destaques da rede — usados na Visao das Unidades (secao "Destaques da rede").
 */
export const attentionRankings = [
  { label: 'Maior diferença de CMV', unitId: 'moinhos', valor: '+4,8 p.p.' },
  { label: 'Maior impacto financeiro', unitId: 'moinhos', valor: 'R$ 11.320' },
  { label: 'Mais divergências de recebimento', unitId: 'caxias-centro', valor: '2 no período' },
  { label: 'Maior perda registrada', unitId: 'moinhos', valor: 'R$ 4.860' },
  { label: 'Inventário pendente', unitId: 'caxias-norte', valor: 'há 7 dias' },
]

export const goodPracticeRankings = [
  { label: 'Melhor controle de CMV', unitId: 'serra', valor: '+0,4 p.p.' },
  { label: 'Inventários mais pontuais', unitId: 'serra', valor: '96% no prazo' },
  { label: 'Menor índice de perdas', unitId: 'serra', valor: '0,8% sobre vendas' },
  { label: 'Melhor desempenho de fornecedores', unitId: 'cidade-baixa', valor: '0 divergências' },
  { label: 'Maior evolução no período', unitId: 'zona-norte', valor: '-1,0 p.p. em 4 semanas' },
]

export const replicableInsight = {
  titulo: 'Existe uma prática replicável na unidade Serra',
  texto:
    'A unidade Serra opera apenas 0,4 ponto acima do CMV teórico e mantém os inventários em dia. A principal diferença em relação a Moinhos está na regularidade das contagens e no controle de porcionamento de carnes.',
  acaoRecomendada: 'Comparar o processo de abertura e fechamento de estoque refrigerado entre as duas unidades.',
  unidadeReferencia: 'serra',
  unidadeComparada: 'moinhos',
}
