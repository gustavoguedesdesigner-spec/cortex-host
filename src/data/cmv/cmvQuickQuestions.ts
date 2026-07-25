import type { CmvQuickAnswer } from '@/types'

/** Perguntas rápidas do módulo de CMV — respostas simuladas, texto fixo (sem IA real). */
export const cmvQuickQuestions: CmvQuickAnswer[] = [
  {
    pergunta: 'Por que o CMV aumentou?',
    resposta:
      'O CMV real chegou a 34,8%, 2,9 pontos acima do teórico. O impacto estimado é de R$ 27.460.\n\nA diferença está concentrada em:\n\n— Carnes: R$ 10.820\n— Chope: R$ 5.460\n— Óleos e frituras: R$ 4.620\n\nMoinhos e Caxias Centro representam aproximadamente 67% do impacto. Os dados indicam contribuição de consumo acima das fichas técnicas, variações de preço e divergências de estoque.',
    links: [
      { label: 'Abrir Carnes', path: '/cmv/categorias/carnes' },
      { label: 'Abrir Moinhos', path: '/cmv/unidades/moinhos' },
      { label: 'Ver evidências', path: '/cmv?tab=causas' },
      { label: 'Criar plano de ação' },
    ],
  },
  {
    pergunta: 'O desvio vem de preço ou consumo?',
    resposta:
      'A maior parte do desvio está relacionada ao consumo e à execução operacional.\n\nDistribuição estimada:\n\n— Porcionamento e rendimento: R$ 12.840\n— Preços: R$ 5.920\n— Divergências de estoque: R$ 4.780\n— Recebimentos e transferências: R$ 2.640\n— Ainda não explicado: R$ 1.280\n\nEssa decomposição é uma estimativa e depende da conclusão do inventário de Caxias Norte.',
    links: [{ label: 'Ver ponte do CMV', path: '/cmv' }],
  },
  {
    pergunta: 'Quais unidades explicam a diferença?',
    resposta:
      'Moinhos (R$ 11.320) e Caxias Centro (R$ 7.210) concentram 67% do impacto financeiro do período. Zona Norte (R$ 3.180), Caxias Norte (R$ 3.020) e Cidade Baixa (R$ 2.210) têm desvios moderados. Serra (R$ 520) é a unidade mais saudável da rede.',
    links: [{ label: 'Ver unidades', path: '/cmv?tab=unidades' }],
  },
  {
    pergunta: 'Quais categorias mais prejudicam a margem?',
    resposta:
      'Carnes, chope e óleos e frituras concentram 76% do desvio consolidado — R$ 10.820, R$ 5.460 e R$ 4.620, respectivamente. Hortifrúti, laticínios e outros somam os R$ 6.560 restantes.',
    links: [{ label: 'Ver categorias', path: '/cmv?tab=categorias' }],
  },
  {
    pergunta: 'Quais produtos precisam ser revisados?',
    resposta:
      'Burger Costela (R$ 3.420), Tomahawk Burger (R$ 2.760) e Porção de Entrecot (R$ 2.110) concentram o maior impacto entre os produtos de carne. Chope IPA 500 ml (R$ 1.980) também merece atenção pela transferência ainda não conciliada.',
    links: [{ label: 'Ver produtos', path: '/cmv?tab=produtos' }],
  },
  {
    pergunta: 'Quais evidências ainda estão faltando?',
    resposta:
      'Faltam a contagem completa do inventário de Caxias Norte, a confirmação de recebimento da transferência de chope IPA e a resposta do fornecedor a duas notas com divergência. Essas pendências limitam a confiança total do diagnóstico.',
    links: [{ label: 'Ver causas e evidências', path: '/cmv?tab=causas' }],
  },
  {
    pergunta: 'O período está pronto para fechar?',
    resposta:
      'Ainda não. A qualidade geral dos dados é de 92%, mas existem três bloqueios:\n\n1. Inventário de Caxias Norte\n2. Transferência de chope pendente\n3. Duas divergências de recebimento\n\nO inventário pendente pode alterar o CMV consolidado em até 0,3 ponto.',
    links: [{ label: 'Ver fechamento', path: '/cmv/fechamentos' }],
  },
  {
    pergunta: 'O que devo priorizar hoje?',
    resposta:
      'Recomendo:\n\n1. Concluir o inventário de Caxias Norte\n2. Conciliar a transferência de chope\n3. Validar as divergências de recebimento\n4. Revisar os três produtos de carne com maior impacto\n5. Confirmar o plano de ação de Moinhos',
    links: [{ label: 'Ver plano de ação' }],
  },
  {
    pergunta: 'Onde o nível de confiança é baixo?',
    resposta:
      'Caxias Norte tem confiança limitada em toda a matriz de categorias — o inventário semanal pendente há 7 dias reduz a confiabilidade de qualquer causa proposta. A parcela de R$ 1.280 do desvio consolidado ainda não pôde ser atribuída a uma causa específica.',
    links: [{ label: 'Abrir Caxias Norte', path: '/cmv/unidades/caxias-norte' }],
  },
  {
    pergunta: 'Quanto podemos recuperar reduzindo o desvio?',
    resposta:
      'Reduzir 25% do desvio recupera aproximadamente R$ 6.865 no período. Reduzir 50% recupera aproximadamente R$ 13.730. Aproximar o CMV real da meta recupera aproximadamente R$ 21.780. São estimativas baseadas no período selecionado — não representam garantia de resultado.',
    links: [{ label: 'Ver potencial de recuperação', path: '/cmv' }],
  },
]

export function findCmvQuickAnswer(pergunta: string): CmvQuickAnswer | undefined {
  return cmvQuickQuestions.find((q) => q.pergunta.trim().toLowerCase() === pergunta.trim().toLowerCase())
}
