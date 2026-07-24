import type { QuickQuestion } from '@/types'

/**
 * Perguntas rapidas para o CORTEX, com respostas simuladas coerentes com
 * os demais dados da Central de Operacoes (indicadores, ocorrencias,
 * unidades e fornecedores).
 */
export const quickQuestions: QuickQuestion[] = [
  {
    id: 'q1',
    pergunta: 'Por que o CMV aumentou?',
    resposta:
      'O CMV real consolidado chegou a 34,8%, ficando 2,3 pontos acima da meta e 2,9 pontos acima do CMV teórico. Três fatores explicam aproximadamente 76% da diferença: consumo de carne 12,4% acima do previsto nas unidades Moinhos e Caxias Centro; aumento médio de 9,4% no preço do óleo; e divergências de estoque e recebimento relacionadas a chope IPA. A prioridade recomendada é revisar o porcionamento de carne e concluir as contagens pendentes antes do fechamento semanal.',
    links: [
      { label: 'Ver análise de CMV', path: '/cmv' },
      { label: 'Abrir Moinhos', path: '/unidades' },
      { label: 'Abrir Caxias Centro', path: '/unidades' },
      { label: 'Ver plano de ação' },
    ],
  },
  {
    id: 'q2',
    pergunta: 'Qual unidade precisa de atenção?',
    resposta:
      'A unidade Moinhos apresenta a maior criticidade. O CMV real está em 36,9%, 4,8 pontos acima do teórico. A unidade também concentra cinco alertas ativos e R$ 4.860 em perdas registradas.',
    links: [{ label: 'Abrir Moinhos', path: '/unidades' }],
  },
  {
    id: 'q3',
    pergunta: 'Quais produtos geraram maior perda?',
    resposta:
      'Carnes lideram o impacto financeiro do período, com R$ 10.820 — 39% do total de R$ 27.460. Em seguida vêm chope (R$ 5.460) e óleos e frituras (R$ 4.620). Juntas, essas três categorias respondem por 76% da diferença entre CMV real e teórico.',
    links: [{ label: 'Ver produtos envolvidos' }],
  },
  {
    id: 'q4',
    pergunta: 'Quais fornecedores aumentaram os preços?',
    resposta:
      'Serra Alimentos aumentou preços em 8,7% e concentra 4 divergências recentes, com atraso médio de 1,8 dia — está em status crítico. Distribuidora Gaúcha aumentou 5,2%, com 2 divergências. O preço médio do óleo, de forma geral, subiu 9,4% nos últimos 30 dias.',
    links: [{ label: 'Ver todos os fornecedores', path: '/fornecedores' }],
  },
  {
    id: 'q5',
    pergunta: 'Quais ações devo priorizar hoje?',
    resposta:
      'Recomendo priorizar: concluir o inventário de Caxias Norte; revisar o consumo de carne em Moinhos; validar as duas notas com divergência; comparar fornecedores de óleo; e criar uma transferência de chope IPA entre Cidade Baixa e Zona Norte.',
    links: [{ label: 'Ver plano de ação' }],
  },
  {
    id: 'q6',
    pergunta: 'Existe risco de ruptura?',
    resposta:
      'Sim. O chope IPA cobre aproximadamente 1,7 dia de operação nas unidades Cidade Baixa e Zona Norte. Recomenda-se avaliar uma transferência entre unidades ou abrir uma requisição emergencial ainda hoje.',
    links: [{ label: 'Ver estoque', path: '/estoque' }],
  },
]
