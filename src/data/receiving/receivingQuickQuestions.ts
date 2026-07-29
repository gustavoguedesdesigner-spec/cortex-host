import type { CmvQuickAnswer } from '@/types'

/** Perguntas rápidas do módulo de Recebimentos — respostas simuladas, texto fixo. */
export const receivingQuickQuestions: CmvQuickAnswer[] = [
  {
    pergunta: 'Quantos recebimentos estão com divergência hoje?',
    resposta: 'Cinco recebimentos têm divergência aberta, somando R$ 18.400. O mais crítico é a NF 9821, da Serra Alimentos em Moinhos — R$ 3.780 envolvidos, ainda sem retorno do fornecedor.',
    links: [{ label: 'Ver divergências', path: '/recebimentos/divergencias' }],
  },
  {
    pergunta: 'Por que a NF 9821 está divergente?',
    resposta: 'A Serra Alimentos entregou 520 kg de carne bovina (30 kg a menos que o pedido de 550 kg) a R$ 37,50/kg, R$ 3,14 acima do preço acordado de R$ 34,36/kg — uma diferença de quantidade e preço que soma R$ 3.780. O recebimento foi aceito parcialmente e o fornecedor já foi cobrado formalmente.',
    links: [{ label: 'Abrir REC-9821', path: '/recebimentos/rec-9821' }],
  },
  {
    pergunta: 'O que está em quarentena agora?',
    resposta: 'Um item está em quarentena: alface americana da Hortifruti Bahia, em Zona Norte — a temperatura de recebimento foi registrada em 11°C, acima da tolerância máxima de 6°C para hortifrúti resfriado. Ainda sem decisão final sobre aproveitamento.',
    links: [{ label: 'Ver quarentena', path: '/recebimentos/quarentena' }],
  },
  {
    pergunta: 'O que está agendado para hoje?',
    resposta: 'Seis entregas estão agendadas para hoje na rede, incluindo Sul Foodservice em Moinhos às 15h. Três recebimentos aguardam conferência e um está em conferência agora, na unidade Caxias Norte.',
    links: [{ label: 'Ver agenda', path: '/recebimentos/agenda' }],
  },
  {
    pergunta: 'Qual o saldo pendente do pedido PO-4532?',
    resposta: '80L de chope IPA, no valor de R$ 2.528. A Bebidas Sul confirmou 320L nesta entrega e já garantiu a entrega complementar do saldo no mesmo dia.',
    links: [{ label: 'Abrir REC-9860', path: '/recebimentos/rec-9860' }],
  },
  {
    pergunta: 'Qual unidade recebe com mais divergência?',
    resposta: 'Moinhos concentra os dois casos mais críticos do período — a NF 9821 (Serra Alimentos) e o recebimento parcial do pedido PO-4532 (Bebidas Sul) — ambos ainda em aberto.',
    links: [{ label: 'Ver histórico', path: '/recebimentos/historico' }],
  },
  {
    pergunta: 'Como funciona a leitura assistida da nota fiscal?',
    resposta: 'O CORTEX lê fornecedor, CNPJ, número da nota, data de emissão, itens, quantidades e valor total, com um nível de confiança simulado (alta, média ou baixa). Campos com confiança baixa ou divergentes do pedido são sinalizados para conferência manual antes de qualquer decisão — a leitura nunca decide sozinha.',
    links: [{ label: 'Registrar novo recebimento', path: '/recebimentos?novo=1' }],
  },
  {
    pergunta: 'Um recebimento pode entrar em estoque sem conferência completa?',
    resposta: 'Não. Todo recebimento passa por conferência de pedido, documento, quantidade física, preço, qualidade, lote e validade antes de qualquer entrada em estoque — mesmo recebimentos sem divergência aparente.',
    links: [{ label: 'Ver procedimento', path: '/biblioteca/procedimentos/pop-rec-002' }],
  },
  {
    pergunta: 'Quantos recebimentos foram concluídos no período?',
    resposta: '18 recebimentos foram concluídos na rede no período, com taxa de conformidade de 91%. O tempo médio de conferência é de 14 minutos por recebimento.',
    links: [{ label: 'Ver histórico', path: '/recebimentos/historico' }],
  },
  {
    pergunta: 'O que fazer com um item fora da temperatura?',
    resposta: 'Registrar a temperatura observada, enviar o item para quarentena e aguardar decisão — nunca liberar automaticamente. O padrão para itens resfriados é de 0°C a 4°C, com tolerância máxima de 6°C antes de exigir quarentena.',
    links: [{ label: 'Ver quarentena', path: '/recebimentos/quarentena' }],
  },
]

export function findReceivingQuickAnswer(question: string): CmvQuickAnswer | undefined {
  return receivingQuickQuestions.find((q) => q.pergunta.trim().toLowerCase() === question.trim().toLowerCase())
}
