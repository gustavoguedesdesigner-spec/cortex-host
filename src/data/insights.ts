import type { AIInsight } from '@/types'

export const aiInsights: AIInsight[] = [
  {
    id: 'i1',
    titulo: 'Consumo de carne acima do previsto',
    texto: 'O consumo real ficou 12,4% acima das fichas técnicas em duas unidades no período selecionado.',
    prioridade: 'alta',
    impactoFinanceiro: 'R$ 8.420 no período',
    acaoRecomendada: 'Revisar porcionamento e contagem do estoque refrigerado.',
    unidadesAfetadas: ['Salvador Cidade Baixa', 'Salvador Caxias Norte'],
  },
  {
    id: 'i2',
    titulo: 'Divergência recorrente em recebimentos',
    texto: 'Três dos últimos cinco recebimentos da Distribuidora Bahia Sul apresentaram preço diferente do combinado.',
    prioridade: 'alta',
    impactoFinanceiro: 'R$ 3.180 em excesso pago',
    acaoRecomendada: 'Confirmar tabela de preços com o fornecedor antes do próximo pedido.',
    unidadesAfetadas: ['Salvador Cidade Baixa'],
  },
  {
    id: 'i3',
    titulo: 'Chope com perda acima da média',
    texto: 'A perda de chope em barril está 2,1 pontos percentuais acima da média das demais unidades.',
    prioridade: 'media',
    impactoFinanceiro: 'R$ 2.050 no período',
    acaoRecomendada: 'Verificar calibragem das torneiras e treinamento de sangria.',
    unidadesAfetadas: ['Salvador Caxias Norte'],
  },
]
