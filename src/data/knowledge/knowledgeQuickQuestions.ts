import type { CmvQuickAnswer } from '@/types'

/** Perguntas rápidas do módulo de Biblioteca (seções 56-57) — respostas simuladas, texto fixo. */
export const knowledgeQuickQuestions: CmvQuickAnswer[] = [
  {
    pergunta: 'Quais procedimentos estão com revisão vencida?',
    resposta:
      'Cinco documentos estão com revisão vencida, com destaque para o POP-COZ-004 (Porcionamento de carnes para hambúrgueres), parado na versão 2.3 desde antes do prazo, e para a Política de Compras Emergenciais (v1.2). Três dos cinco são procedimentos críticos — usados diariamente em mais de uma unidade.',
    links: [{ label: 'Ver procedimentos', path: '/biblioteca/procedimentos' }, { label: 'Abrir POP-COZ-004', path: '/biblioteca/procedimentos/pop-coz-004' }],
  },
  {
    pergunta: 'Quantos treinamentos estão pendentes?',
    resposta:
      '24 treinamentos estão pendentes de conclusão, de 142 atribuições totais — uma taxa de conclusão de 83,1%. O maior gargalo é o treinamento de Recebimento de Produtos Refrigerados (TRN-REC-003): 28 pessoas foram atribuídas, 20 concluíram e 8 ainda estão pendentes.',
    links: [{ label: 'Ver treinamentos', path: '/biblioteca/treinamentos' }, { label: 'Abrir TRN-REC-003', path: '/biblioteca/treinamentos/trn-rec-003' }],
  },
  {
    pergunta: 'Qual unidade tem pior conformidade de checklist?',
    resposta:
      'Moinhos, com 68% de conformidade no checklist de Controle diário do estoque refrigerado (CHK-EST-007) — bem abaixo da meta de 95% e da média da rede (84%). Serra é a referência oposta, com 97% de conformidade no mesmo checklist.',
    links: [{ label: 'Abrir CHK-EST-007', path: '/biblioteca/checklists/chk-est-007' }, { label: 'Ver Moinhos', path: '/unidades/moinhos' }],
  },
  {
    pergunta: 'Quais não conformidades estão em aberto?',
    resposta:
      'Nove não conformidades estão abertas, três críticas. A mais recente é a NC-0248, em Moinhos — identificação incorreta de lote no recebimento, sob responsabilidade de Rafael Martins, com ação corretiva vencendo hoje às 20h.',
    links: [{ label: 'Ver conformidade', path: '/biblioteca/conformidade' }],
  },
  {
    pergunta: 'Este procedimento está atualizado?',
    resposta:
      'Depende do procedimento consultado. O POP-COZ-004 está na versão 2.3, com revisão vencida — o peso padrão de porcionamento (180g ±5g) segue vigente, mas a instrução de controle de gordura está desatualizada frente ao padrão atual da cozinha. Abra o procedimento para ver o histórico completo de versões.',
    links: [{ label: 'Abrir POP-COZ-004', path: '/biblioteca/procedimentos/pop-coz-004' }],
  },
  {
    pergunta: 'O que preciso saber antes de receber uma entrega?',
    resposta:
      'O procedimento POP-REC-002 (Recebimento de Produtos Refrigerados) e o checklist CHK-REC-003 são obrigatórios antes de liberar qualquer entrega refrigerada. O treinamento TRN-REC-003 cobre os cinco pontos críticos: temperatura, integridade da embalagem, prazo de validade, conferência de quantidade e identificação de lote.',
    links: [{ label: 'Vou receber uma entrega', path: '/biblioteca' }, { label: 'Abrir treinamento', path: '/biblioteca/treinamentos/trn-rec-003' }],
  },
  {
    pergunta: 'Quantos conteúdos a biblioteca tem hoje?',
    resposta:
      '68 conteúdos publicados: 12 procedimentos, 18 treinamentos e 24 checklists ativos, além de documentos complementares. Sete estão em revisão e cinco têm revisão vencida — a qualidade geral da biblioteca está em 91%.',
    links: [{ label: 'Ver visão geral', path: '/biblioteca' }],
  },
  {
    pergunta: 'Quais ações corretivas estão atrasadas?',
    resposta:
      'Quatro ações corretivas estão atrasadas, ligadas a não conformidades ainda abertas. A mais urgente é a de Moinhos (NC-0248), com prazo hoje às 20h — as demais estão distribuídas entre Caxias Centro e Zona Norte.',
    links: [{ label: 'Ver conformidade', path: '/biblioteca/conformidade' }],
  },
  {
    pergunta: 'Como funciona o processo de revisão de um procedimento?',
    resposta:
      'Uma revisão nasce de uma solicitação com motivo registrado, passa por elaboração, aprovação e só então é publicada — a versão anterior permanece disponível no histórico, nunca é apagada. Ao aprovar, o CORTEX mostra o impacto: quantas unidades, funções, treinamentos e checklists são afetados, e quantas pessoas precisam confirmar a leitura da nova versão.',
    links: [{ label: 'Ver revisões', path: '/biblioteca/revisoes' }],
  },
  {
    pergunta: 'Qual é a área com menor conformidade?',
    resposta:
      'Estoque refrigerado, com 72% de conformidade e três não conformidades associadas — Moinhos é a unidade crítica. Em seguida vem Porcionamento, com 78%, também concentrado em Moinhos.',
    links: [{ label: 'Ver conformidade por área', path: '/biblioteca/conformidade' }],
  },
  {
    pergunta: 'Quem é responsável pela NC-0248?',
    resposta:
      'Rafael Martins, gerente da unidade Moinhos, é o responsável pela ação corretiva da NC-0248 (identificação incorreta de lote no recebimento). O prazo da ação vence hoje às 20h.',
    links: [{ label: 'Abrir conformidade', path: '/biblioteca/conformidade' }, { label: 'Ver Moinhos', path: '/unidades/moinhos' }],
  },
  {
    pergunta: 'Como está a taxa de conclusão dos treinamentos?',
    resposta:
      '83,1% — 118 conclusões de 142 atribuições. É um número saudável, mas mascarado por concentração: quase metade das pendências está em um único treinamento crítico, o de Recebimento de Produtos Refrigerados.',
    links: [{ label: 'Ver treinamentos', path: '/biblioteca/treinamentos' }],
  },
]

export function findKnowledgeQuickAnswer(question: string): CmvQuickAnswer | undefined {
  return knowledgeQuickQuestions.find((q) => q.pergunta.trim().toLowerCase() === question.trim().toLowerCase())
}
