import type { CmvQuickAnswer } from '@/types'

/** Perguntas rápidas do módulo de Fichas Técnicas — respostas simuladas, texto fixo. */
export const recipeQuickQuestions: CmvQuickAnswer[] = [
  {
    pergunta: 'Quais fichas precisam ser revisadas?',
    resposta:
      'Existem sete fichas com revisão recomendada. As três prioritárias são:\n\n1. Burger Costela — impacto estimado de R$ 3.420\n2. Tomahawk Burger — rendimento não validado e impacto de R$ 2.760\n3. Chope IPA 500 ml — conversão e perdas divergentes, impacto de R$ 1.980',
    links: [{ label: 'Ver prioridades de revisão', path: '/fichas-tecnicas' }],
  },
  {
    pergunta: 'Quais produtos estão sem ficha?',
    resposta: 'Três produtos ainda não possuem ficha completa: Burger Veggie, Salada Caesar e Brownie com Sorvete. Os dois primeiros já estão ativos no PDV.',
    links: [{ label: 'Ver inconsistências', path: '/fichas-tecnicas/inconsistencias' }],
  },
  {
    pergunta: 'Quais custos estão desatualizados?',
    resposta: 'Sete fichas utilizam custos sem atualização há mais de 30 dias. O óleo de soja subiu 9,4% e afeta 12 fichas, com impacto mensal estimado de R$ 4.620.',
    links: [{ label: 'Ver custos', path: '/fichas-tecnicas/custos' }],
  },
  {
    pergunta: 'Qual produto possui maior divergência?',
    resposta:
      'Burger Costela apresenta a maior diferença entre consumo esperado e consumo observado. O consumo estimado de carne ficou aproximadamente 160 kg acima do teórico no período, concentrado em Moinhos e Caxias Centro.',
    links: [{ label: 'Abrir Burger Costela', path: '/fichas-tecnicas/burger-costela' }],
  },
  {
    pergunta: 'Qual alteração mais afetou a margem?',
    resposta:
      'A versão 3.2 do Burger Costela reduziu o bacon de 40 g para 35 g, aumentou o cheddar de 35 g para 40 g e atualizou o custo da carne. O custo por porção subiu R$ 0,62 e o CMV teórico passou de 30,9% para 32,1%.',
    links: [{ label: 'Comparar versões', path: '/fichas-tecnicas/burger-costela' }],
  },
  {
    pergunta: 'Quais produtos usam este insumo?',
    resposta: 'O blend de carne bovina é utilizado em cinco fichas: Burger Costela, Tomahawk Burger, Burger Bacon, Burger Clássico e Burger Duplo Cheddar.',
    links: [{ label: 'Ver custos', path: '/fichas-tecnicas/custos' }],
  },
  {
    pergunta: 'O preço de venda ainda é adequado?',
    resposta:
      'O Burger Costela possui preço de R$ 48,90 e custo teórico de R$ 15,70, resultando em CMV teórico de 32,1%. A margem teórica permanece adequada à meta atual, mas o consumo real eleva o custo observado. Antes de alterar o preço, recomendo corrigir a execução operacional.',
    links: [{ label: 'Abrir Burger Costela', path: '/fichas-tecnicas/burger-costela' }],
  },
  {
    pergunta: 'Quais produtos vendem muito e rendem pouco?',
    resposta:
      'O item promocional apresenta alto volume e margem reduzida. Burger Clássico também possui volume elevado, mas margem abaixo da média da categoria. Nenhum dos dois apresenta o mesmo nível de desvio operacional do Burger Costela.',
    links: [{ label: 'Ver engenharia de cardápio', path: '/cardapio/engenharia' }],
  },
  {
    pergunta: 'Onde o porcionamento está fora do padrão?',
    resposta: 'Moinhos e Caxias Centro concentram o maior desvio de porcionamento no Burger Costela. Serra é a unidade mais próxima da ficha técnica e serve de referência interna.',
    links: [{ label: 'Ver comparação entre unidades', path: '/fichas-tecnicas/burger-costela' }],
  },
  {
    pergunta: 'Qual ficha devo revisar primeiro?',
    resposta: 'Burger Costela deve ser priorizada — maior impacto financeiro (R$ 3.420), custo desatualizado há 42 dias e divergência confirmada em duas unidades.',
    links: [{ label: 'Abrir Burger Costela', path: '/fichas-tecnicas/burger-costela' }],
  },
  {
    pergunta: 'Como Burger Costela se compara entre unidades?',
    resposta:
      'Serra apresenta consumo médio mais próximo da ficha, com diferença de apenas 2 kg no período. Moinhos e Caxias Centro concentram as maiores diferenças — 70 kg e 55 kg acima do previsto, respectivamente.',
    links: [{ label: 'Abrir Burger Costela', path: '/fichas-tecnicas/burger-costela' }],
  },
  {
    pergunta: 'O que mudou nesta versão?',
    resposta:
      'A versão 3.2 do Burger Costela reduziu o bacon de 40 g para 35 g, aumentou o cheddar de 35 g para 40 g e atualizou o custo da carne. O custo por porção subiu R$ 0,62 e o CMV teórico passou de 30,9% para 32,1%.',
    links: [{ label: 'Ver histórico de versões', path: '/fichas-tecnicas/burger-costela' }],
  },
]

export function findRecipeQuickAnswer(pergunta: string): CmvQuickAnswer | undefined {
  return recipeQuickQuestions.find((q) => q.pergunta.trim().toLowerCase() === pergunta.trim().toLowerCase())
}
