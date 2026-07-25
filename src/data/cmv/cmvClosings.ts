import type { ClosingStatus, CmvClosingChecklistItem, CmvClosingRecord } from '@/types'

export const cmvCurrentPeriodStatus: ClosingStatus = 'em_revisao'

/**
 * Checklist de fechamento do período atual. As etapas bloqueadas
 * dependem da conclusão das anteriores — "Fechar período" só libera
 * quando não houver bloqueios críticos.
 */
export const cmvClosingChecklist: CmvClosingChecklistItem[] = [
  {
    id: 'validar-vendas',
    ordem: 1,
    titulo: 'Validar vendas',
    status: 'concluido',
    responsavel: 'Integração PDV',
    prazoLabel: 'Concluído',
    pendencias: [],
  },
  {
    id: 'validar-compras',
    ordem: 2,
    titulo: 'Validar compras e devoluções',
    status: 'concluido',
    responsavel: 'Compras',
    prazoLabel: 'Concluído',
    pendencias: [],
  },
  {
    id: 'confirmar-inventarios',
    ordem: 3,
    titulo: 'Confirmar inventários',
    status: 'pendente',
    responsavel: 'Bruno Teles',
    prazoLabel: 'Hoje, 18h',
    pendencias: ['Inventário de Caxias Norte pendente há 7 dias'],
    impacto: 'Pode alterar o CMV consolidado em até 0,3 ponto',
  },
  {
    id: 'conciliar-transferencias',
    ordem: 4,
    titulo: 'Conciliar transferências',
    status: 'pendente',
    responsavel: 'Estoque — Moinhos',
    prazoLabel: 'Amanhã',
    pendencias: ['Transferência de chope IPA sem confirmação de recebimento'],
  },
  {
    id: 'conferir-recebimentos',
    ordem: 5,
    titulo: 'Conferir recebimentos',
    status: 'pendente',
    responsavel: 'Recebimento',
    prazoLabel: 'Esta semana',
    pendencias: ['Duas divergências de recebimento sem resposta do fornecedor'],
  },
  {
    id: 'validar-perdas',
    ordem: 6,
    titulo: 'Validar perdas',
    status: 'concluido',
    responsavel: 'Operações',
    prazoLabel: 'Concluído',
    pendencias: [],
  },
  {
    id: 'verificar-fichas-tecnicas',
    ordem: 7,
    titulo: 'Verificar fichas técnicas',
    status: 'pendente',
    responsavel: 'Leo',
    prazoLabel: 'Esta semana',
    pendencias: ['3 fichas técnicas aguardando revisão'],
  },
  {
    id: 'revisar-divergencias',
    ordem: 8,
    titulo: 'Revisar divergências',
    status: 'pendente',
    responsavel: 'CORTEX',
    prazoLabel: 'Depende das etapas anteriores',
    pendencias: ['Aguardando conclusão de inventários e recebimentos'],
  },
  {
    id: 'aprovar-memoria-calculo',
    ordem: 9,
    titulo: 'Aprovar memória de cálculo',
    status: 'bloqueado',
    responsavel: 'Leo',
    prazoLabel: 'Depende das etapas anteriores',
    pendencias: ['Bloqueado até a conclusão das etapas 3 a 8'],
  },
  {
    id: 'fechar-periodo',
    ordem: 10,
    titulo: 'Fechar período',
    status: 'bloqueado',
    responsavel: 'Leo',
    prazoLabel: 'Depende das etapas anteriores',
    pendencias: ['Bloqueado enquanto existirem pendências críticas'],
  },
]

export const cmvClosingBlockingMessage =
  'O período ainda não pode ser fechado com confiança alta. O inventário pendente de Caxias Norte pode alterar o CMV consolidado em até 0,3 ponto.'

export const cmvDemonstrativeClosingNotice = 'Fechamento demonstrativo — sem efeito contábil.'

/** Histórico de fechamentos — períodos anteriores já fechados, para comparação. */
export const cmvClosingHistory: CmvClosingRecord[] = [
  {
    periodId: 'periodo-atual',
    periodoLabel: 'Período atual — últimos 7 dias',
    cmvReal: 0.348,
    cmvTeorico: 0.319,
    meta: 0.325,
    impacto: 27460,
    qualidadeDados: 0.92,
    status: 'em_revisao',
  },
  {
    periodId: 'semana-anterior',
    periodoLabel: 'Semana anterior',
    cmvReal: 0.344,
    cmvTeorico: 0.317,
    meta: 0.325,
    impacto: 25560,
    qualidadeDados: 0.97,
    status: 'fechado',
    fechadoPor: 'Leo',
    dataFechamento: '2026-07-17T18:20:00-03:00',
    observacao: 'Fechado sem bloqueios críticos — inventários concluídos no prazo em todas as unidades.',
  },
  {
    periodId: 'duas-semanas-atras',
    periodoLabel: 'Duas semanas atrás',
    cmvReal: 0.341,
    cmvTeorico: 0.318,
    meta: 0.325,
    impacto: 21780,
    qualidadeDados: 0.95,
    status: 'fechado',
    fechadoPor: 'Leo',
    dataFechamento: '2026-07-10T18:00:00-03:00',
  },
  {
    periodId: 'tres-semanas-atras',
    periodoLabel: 'Três semanas atrás',
    cmvReal: 0.327,
    cmvTeorico: 0.315,
    meta: 0.325,
    impacto: 11360,
    qualidadeDados: 0.98,
    status: 'fechado',
    fechadoPor: 'Leo',
    dataFechamento: '2026-07-03T18:00:00-03:00',
  },
]

export function getCmvClosingRecordById(periodId: string): CmvClosingRecord | undefined {
  return cmvClosingHistory.find((r) => r.periodId === periodId)
}
