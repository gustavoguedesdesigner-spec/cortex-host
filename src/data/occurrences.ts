import type { Occurrence } from '@/types'

/**
 * Ocorrencias prioritarias do dia — ordenadas por impacto e urgencia.
 * Compoe, junto às demais telas, o total de 18 ocorrencias mencionado
 * no resumo executivo do CORTEX.
 */
export const occurrences: Occurrence[] = [
  {
    id: 'oc1',
    prioridade: 'critica',
    titulo: 'Consumo de carne acima do previsto',
    descricao: 'O consumo real ficou 12,4% acima das fichas técnicas nas unidades Moinhos e Caxias Centro.',
    unidades: ['Salvador Moinhos', 'Salvador Caxias Centro'],
    categoria: 'Carnes',
    impactoFinanceiro: 8420,
    acaoRecomendada: 'Revisar porcionamento, perdas e contagem do estoque refrigerado.',
    botaoPrimario: 'Analisar',
    botaoSecundario: 'Criar ação',
  },
  {
    id: 'oc2',
    prioridade: 'critica',
    titulo: 'Divergência em dois recebimentos',
    descricao: 'Dois pedidos apresentam diferenças de quantidade e preço em relação às notas recebidas.',
    unidades: ['Salvador Caxias Centro'],
    categoria: 'Recebimento',
    impactoFinanceiro: 3780,
    responsavel: 'Serra Alimentos',
    acaoRecomendada: 'Conferir os dois recebimentos com o fornecedor Serra Alimentos.',
    botaoPrimario: 'Conferir recebimentos',
    botaoSecundario: 'Notificar compras',
  },
  {
    id: 'oc3',
    prioridade: 'alta',
    titulo: 'Aumento relevante de preço',
    descricao: 'O preço médio do óleo aumentou 9,4% nos últimos 30 dias.',
    unidades: ['Todas as unidades'],
    categoria: 'Óleos e frituras',
    impactoFinanceiro: 4620,
    impactoDescricao: 'R$ 4.620 mensais',
    acaoRecomendada: 'Comparar condições com outros fornecedores de óleo.',
    botaoPrimario: 'Comparar fornecedores',
    botaoSecundario: 'Ver histórico',
  },
  {
    id: 'oc4',
    prioridade: 'alta',
    titulo: 'Contagem semanal pendente',
    descricao: 'A unidade Caxias Norte ainda não concluiu o inventário previsto.',
    unidades: ['Salvador Caxias Norte'],
    categoria: 'Estoque',
    responsavel: 'Gerente da unidade',
    prazo: 'Hoje, 18h',
    acaoRecomendada: 'Enviar lembrete ao gerente e acompanhar a conclusão do inventário.',
    botaoPrimario: 'Enviar lembrete',
    botaoSecundario: 'Abrir unidade',
  },
  {
    id: 'oc5',
    prioridade: 'media',
    titulo: 'Risco de ruptura de chope IPA',
    descricao: 'O estoque atual cobre aproximadamente 1,7 dia de operação.',
    unidades: ['Salvador Cidade Baixa', 'Salvador Zona Norte'],
    categoria: 'Chope',
    acaoRecomendada: 'Avaliar transferência entre unidades ou requisição emergencial.',
    botaoPrimario: 'Ver estoque',
    botaoSecundario: 'Criar requisição',
  },
]
