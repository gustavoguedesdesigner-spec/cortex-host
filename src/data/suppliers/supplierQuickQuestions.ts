import type { CmvQuickAnswer } from '@/types'

/** Perguntas rápidas do módulo de Fornecedores (secao 69-70) — respostas simuladas, texto fixo. */
export const supplierQuickQuestions: CmvQuickAnswer[] = [
  {
    pergunta: 'Qual fornecedor possui melhor desempenho?',
    resposta: 'A Sul Foodservice apresenta o melhor score geral, com 91 pontos, 96% de pontualidade e nenhuma divergência recente.',
    links: [{ label: 'Abrir Sul Foodservice', path: '/fornecedores/sul-foodservice' }],
  },
  {
    pergunta: 'Quais fornecedores estão em atenção?',
    resposta: 'Sete fornecedores estão em atenção. Serra Alimentos e Distribuidora Gaúcha exigem maior prioridade por recorrência de divergências e aumento de preços.',
    links: [{ label: 'Ver fornecedores em atenção', path: '/fornecedores?rapido=em_atencao' }],
  },
  {
    pergunta: 'Quem mais gera divergências?',
    resposta: 'Serra Alimentos apresenta quatro divergências em 60 dias, com valor acumulado de R$ 8.420.',
    links: [{ label: 'Ver divergências', path: '/fornecedores/divergencias' }],
  },
  {
    pergunta: 'Quem fornece este produto?',
    resposta: 'Depende do item consultado — a carne bovina para hambúrguer é fornecida pela Serra Alimentos, o chope IPA pela Bebidas Sul e o óleo de soja pela Sul Foodservice. Abra o fornecedor para ver a lista completa de itens.',
    links: [{ label: 'Ver fornecedores', path: '/fornecedores' }],
  },
  {
    pergunta: 'Onde existe dependência?',
    resposta: 'As categorias com maior dependência são: 1. carnes — 68% concentrados na Serra Alimentos; 2. chope IPA — 76% na Bebidas Sul; 3. hortifrúti — 54% na Hortifruti Bahia.',
    links: [{ label: 'Ver riscos', path: '/fornecedores/riscos' }],
  },
  {
    pergunta: 'Quais documentos estão vencendo?',
    resposta: 'Oito documentos estão próximos do vencimento na rede, com destaque para a Licença Sanitária da Serra Alimentos, que vence em 18 dias.',
    links: [{ label: 'Ver documentos', path: '/fornecedores/documentos' }],
  },
  {
    pergunta: 'Qual fornecedor devo escolher?',
    resposta: 'Para carnes, a Serra Alimentos segue como principal fonte, mas com plano corretivo pendente. Para itens secos e óleos, a Sul Foodservice tem o melhor equilíbrio entre preço, prazo e conformidade — é a recomendação padrão do CORTEX quando há mais de uma opção homologada.',
    links: [{ label: 'Comparar fornecedores', path: '/fornecedores' }],
  },
  {
    pergunta: 'Quem aumentou mais os preços?',
    resposta: 'A Serra Alimentos teve o maior avanço, com a carne bovina 9,1% acima do preço acordado no último recebimento. No geral, o preço médio de itens da Serra Alimentos subiu 8,7% no período.',
    links: [{ label: 'Ver histórico de preços', path: '/fornecedores/serra-alimentos' }],
  },
  {
    pergunta: 'Quais negociações estão abertas?',
    resposta: 'Seis negociações estão abertas, com destaque para a revisão comercial de carnes com a Serra Alimentos — potencial estimado de R$ 38.400 anuais.',
    links: [{ label: 'Ver negociações', path: '/fornecedores/negociacoes' }],
  },
  {
    pergunta: 'Qual fornecedor mais afeta o CMV?',
    resposta: 'A Serra Alimentos é o fornecedor com maior impacto no CMV atual — concentra a categoria de carnes, que é a principal causa do CMV acima da meta em Moinhos e Caxias Centro.',
    links: [{ label: 'Ver causas no CMV', path: '/cmv' }],
  },
  {
    pergunta: 'O que devo cobrar da Serra Alimentos?',
    resposta: 'Recomendo solicitar: 1. plano corretivo para divergências; 2. confirmação de preço antes do envio; 3. melhoria de prazo; 4. atualização documental; 5. proposta de SLA para os próximos 90 dias.',
    links: [{ label: 'Abrir Serra Alimentos', path: '/fornecedores/serra-alimentos' }],
  },
  {
    pergunta: 'Existe alternativa para este fornecedor?',
    resposta: 'Sul Foodservice e Atacado Central atendem parte dos itens, mas ainda não substituem integralmente a Serra Alimentos. A melhor estratégia é homologar uma segunda fonte para carnes e dividir o volume gradualmente.',
    links: [{ label: 'Comparar fornecedores', path: '/fornecedores' }],
  },
]

export function findSupplierQuickAnswer(question: string): CmvQuickAnswer | undefined {
  return supplierQuickQuestions.find((q) => q.pergunta.trim().toLowerCase() === question.trim().toLowerCase())
}
