import type { CmvQuickAnswer } from '@/types'

/** Perguntas rápidas do módulo de Estoque — respostas simuladas, texto fixo. */
export const inventoryQuickQuestions: CmvQuickAnswer[] = [
  {
    pergunta: 'Quais itens estão em risco de ruptura?',
    resposta:
      'Existem 11 itens com cobertura inferior ao prazo de reposição. Os mais críticos são:\n\n1. Chope IPA — Zona Norte — cobertura de 1,7 dia\n2. Carne bovina blend — Moinhos — cobertura de 2,1 dias\n3. Óleo de soja — Cidade Baixa — cobertura de 2,4 dias\n4. Batata congelada — Caxias Centro — cobertura de 2,6 dias\n\nA maior urgência está no chope IPA, pois o prazo médio de reposição é de três dias.',
    links: [{ label: 'Ver cobertura de itens críticos', path: '/estoque' }],
  },
  {
    pergunta: 'Onde existe estoque em excesso?',
    resposta:
      'R$ 21.600 estão concentrados em itens com cobertura superior a 45 dias. Cidade Baixa e Caxias Centro representam 58% desse valor.\n\nOs principais itens são embalagens promocionais, cerveja sazonal e dois molhos de baixa movimentação.',
    links: [{ label: 'Ver capital imobilizado', path: '/estoque' }],
  },
  {
    pergunta: 'Quais unidades possuem menor acuracidade?',
    resposta:
      'Caxias Norte tem a menor acuracidade da rede (68%), impactada pelo inventário semanal pendente há 7 dias. Moinhos vem em seguida, com 87,2% — abaixo da meta de 97% — por conta da divergência no estoque refrigerado.',
    links: [{ label: 'Abrir Caxias Norte', path: '/estoque/unidades/caxias-norte' }],
  },
  {
    pergunta: 'Quais divergências impactam o CMV?',
    resposta:
      'As divergências identificadas com maior impacto são:\n\n— Carne bovina em Moinhos: R$ 2.430\n— Chope IPA em Zona Norte: R$ 1.280\n— Óleo em Moinhos: R$ 610\n\nEsses valores já aparecem na investigação de CMV e devem ser validados pelos inventários pendentes.',
    links: [{ label: 'Ver impacto no CMV', path: '/estoque' }, { label: 'Abrir módulo de CMV', path: '/cmv' }],
  },
  {
    pergunta: 'Qual inventário devo priorizar?',
    resposta:
      'O inventário semanal do estoque refrigerado de Moinhos está em contagem, com 74% concluído e divergência provisória de R$ 3.280. É o mais urgente por estar em andamento com prazo hoje às 18h. O inventário de Caxias Norte está pendente há 7 dias e também precisa de atenção.',
    links: [{ label: 'Abrir inventário de Moinhos', path: '/estoque/inventarios/inv-moinhos-0726' }],
  },
  {
    pergunta: 'Posso transferir chope entre unidades?',
    resposta:
      'A transferência de 120 litros de Serra para Zona Norte reduziria o risco de ruptura na unidade de destino. Serra permaneceria com cobertura estimada de 4,7 dias.\n\nA recomendação é viável, desde que a venda prevista para o próximo evento em Serra seja confirmada.',
    links: [{ label: 'Ver transferências', path: '/estoque/transferencias' }],
  },
  {
    pergunta: 'Quais perdas estão se repetindo?',
    resposta:
      'Carne bovina em Moinhos concentra a maior recorrência: quatro registros em sete dias, totalizando 26 kg (R$ 853). O motivo predominante é preparo e porcionamento, com tendência de alta.',
    links: [{ label: 'Ver perdas recorrentes', path: '/estoque/perdas' }],
  },
  {
    pergunta: 'Onde faltam dados?',
    resposta:
      'Caxias Norte tem o inventário semanal pendente há 7 dias, o que reduz a confiabilidade de todas as posições da unidade. O estoque refrigerado de Moinhos também tem contagem desatualizada (6 dias) e uma transferência ainda não conciliada.',
    links: [{ label: 'Abrir Caxias Norte', path: '/estoque/unidades/caxias-norte' }],
  },
  {
    pergunta: 'Quais itens estão sem movimentação?',
    resposta:
      '9 itens estão sem movimentação relevante na rede. Os principais são o molho especial 5 kg e o xarope para drinks em Caxias Centro e Cidade Baixa — ambos parados há mais de 45 dias.',
    links: [{ label: 'Ver capital imobilizado', path: '/estoque' }],
  },
  {
    pergunta: 'O que devo cobrar hoje?',
    resposta:
      'Recomendo:\n\n1. Concluir a contagem do estoque refrigerado de Moinhos até 18h\n2. Confirmar o recebimento da transferência TR-2041 (chope IPA) na Zona Norte\n3. Investigar a divergência de 8 litros da TR-2038\n4. Validar as duas perdas de carne ainda aguardando aprovação\n5. Iniciar o inventário pendente de Caxias Norte',
    links: [{ label: 'Ver inventários', path: '/estoque/inventarios' }],
  },
]

export function findInventoryQuickAnswer(pergunta: string): CmvQuickAnswer | undefined {
  return inventoryQuickQuestions.find((q) => q.pergunta.trim().toLowerCase() === pergunta.trim().toLowerCase())
}
