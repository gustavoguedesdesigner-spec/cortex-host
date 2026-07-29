import type { AreaCompliance, KnowledgeArea, QuickActivity } from '@/types'

/**
 * Situacao consolidada da Biblioteca Operacional (secao 10) — mesmo padrao de
 * constantes de referencia usado em purchasingSituation/administrationSituation:
 * numeros fixos e coerentes em toda a aplicacao, nao recalculados a partir das
 * amostras parciais dos demais arquivos deste modulo.
 */
export const knowledgeSummary = {
  conteudosPublicados: 68,
  procedimentos: 12,
  treinamentos: 18,
  checklistsAtivos: 24,
  documentosEmRevisao: 7,
  revisoesVencidas: 5,
  procedimentosCriticosDesatualizados: 3,
  atribuicoesTreinamento: 142,
  treinamentosConcluidos: 118,
  treinamentosPendentes: 24,
  taxaConclusao: 0.831,
  conformidadeGeral: 0.894,
  metaConformidade: 0.95,
  naoConformidadesAbertas: 9,
  naoConformidadesCriticas: 3,
  acoesCorretivasAtrasadas: 4,
  qualidadeBiblioteca: 0.91,
  ultimaAtualizacaoLabel: 'há 18 minutos',
}

export const knowledgeExecutiveSummaryText =
  'A biblioteca possui 68 conteúdos publicados. Cinco documentos estão com revisão vencida e três procedimentos críticos precisam ser atualizados. A taxa geral de conclusão dos treinamentos é de 83,1%, enquanto a conformidade dos checklists está em 89,4%. Moinhos concentra quatro das nove não conformidades abertas.'

export const knowledgeExecutiveRecommendations: string[] = [
  'Revisar o procedimento de porcionamento de carnes',
  'Concluir treinamentos pendentes de recebimento',
  'Atualizar o checklist do estoque refrigerado',
  'Tratar quatro não conformidades de Moinhos',
  'Replicar o procedimento de inventário utilizado pela unidade Serra',
]

/** Rotulos legiveis das areas operacionais (secao 11). */
export const areaLabels: Record<KnowledgeArea, string> = {
  cozinha: 'Cozinha',
  bar: 'Bar',
  estoque: 'Estoque',
  compras: 'Compras',
  recebimento: 'Recebimento',
  gestao: 'Gestão',
  financeiro: 'Financeiro',
  seguranca_alimentar: 'Segurança alimentar',
  limpeza: 'Limpeza',
  atendimento: 'Atendimento',
  manutencao: 'Manutenção',
  pessoas: 'Pessoas',
  tecnologia: 'Tecnologia',
  emergencia: 'Emergência',
}

/** Areas com menor conformidade (secao 49). */
export const areaComplianceRanking: AreaCompliance[] = [
  { area: 'estoque', label: 'Estoque refrigerado', conformidade: 0.72, naoConformidades: 3, unidadeCritica: 'Moinhos' },
  { area: 'cozinha', label: 'Porcionamento', conformidade: 0.78, naoConformidades: 2, unidadeCritica: 'Moinhos' },
  { area: 'recebimento', label: 'Recebimento', conformidade: 0.84, naoConformidades: 2, unidadeCritica: 'Caxias Centro' },
  { area: 'estoque', label: 'Registro de perdas', conformidade: 0.88, naoConformidades: 1, unidadeCritica: 'Caxias Norte' },
  { area: 'cozinha', label: 'Fechamento da cozinha', conformidade: 0.91, naoConformidades: 1, unidadeCritica: 'Zona Norte' },
  { area: 'seguranca_alimentar', label: 'Controle de validade', conformidade: 0.93, naoConformidades: 0, unidadeCritica: 'Cidade Baixa' },
  { area: 'gestao', label: 'Registros e evidências', conformidade: 0.95, naoConformidades: 0, unidadeCritica: '—' },
]

/** Acesso rapido por atividade (secao 17) — a pergunta e "o que vou fazer agora". */
export const quickActivities: QuickActivity[] = [
  { id: 'receber-entrega', label: 'Vou receber uma entrega', procedimentoId: 'pop-rec-002', checklistId: 'chk-rec-003', treinamentoId: 'trn-rec-003', responsavel: 'Conferente ou gerente', versaoLabel: 'v1.8 vigente' },
  { id: 'realizar-inventario', label: 'Vou realizar inventário', procedimentoId: 'pop-est-001', checklistId: 'chk-est-007', responsavel: 'Estoquista', versaoLabel: 'v2.0 vigente' },
  { id: 'registrar-perda', label: 'Vou registrar perda', procedimentoId: 'pop-est-005', checklistId: 'chk-est-009', responsavel: 'Gerente de unidade', versaoLabel: 'v1.4 vigente' },
  { id: 'conferir-porcionamento', label: 'Vou conferir porcionamento', procedimentoId: 'pop-coz-004', checklistId: 'chk-coz-002', treinamentoId: 'trn-coz-007', responsavel: 'Chef ou cozinheiro', versaoLabel: 'v2.3 — revisão recomendada' },
  { id: 'abrir-cozinha', label: 'Vou abrir a cozinha', procedimentoId: 'pop-coz-001', checklistId: 'chk-coz-001', responsavel: 'Cozinheiro', versaoLabel: 'v3.0 vigente' },
  { id: 'fechar-unidade', label: 'Vou fechar a unidade', procedimentoId: 'pop-ges-002', checklistId: 'chk-ges-004', responsavel: 'Gerente de unidade', versaoLabel: 'v2.1 vigente' },
  { id: 'solicitar-compra', label: 'Vou solicitar uma compra', procedimentoId: 'pol-com-001', responsavel: 'Gerente de unidade', versaoLabel: 'v1.2 — revisão vencida' },
  { id: 'revisar-ficha', label: 'Vou revisar uma ficha técnica', procedimentoId: 'pop-coz-006', responsavel: 'Chef Executivo', versaoLabel: 'v1.5 vigente' },
  { id: 'treinar-colaborador', label: 'Vou treinar um colaborador', treinamentoId: 'trn-rec-003', responsavel: 'Gerente de unidade', versaoLabel: 'v1.0 vigente' },
  { id: 'realizar-auditoria', label: 'Vou realizar auditoria', procedimentoId: 'pop-ges-008', checklistId: 'chk-ges-011', responsavel: 'Auditor interno', versaoLabel: 'v1.1 vigente' },
]

/** "Continuar de onde parei" do usuario demonstrativo (secao 18). */
export const continueItems = [
  { id: 'cont-treinamento', tipo: 'Treinamento em andamento', titulo: 'Recebimento de Produtos Refrigerados', detalhe: '65% concluído · módulo 4 de 5', path: '/biblioteca/treinamentos/trn-rec-003' },
  { id: 'cont-checklist', tipo: 'Checklist incompleto', titulo: 'Controle diário do estoque refrigerado', detalhe: 'Moinhos · pausado no item 7 de 12', path: '/biblioteca/checklists/chk-est-007' },
  { id: 'cont-documento', tipo: 'Documento salvo', titulo: 'Porcionamento de carnes para hambúrgueres', detalhe: 'POP-COZ-004 · leitura não confirmada', path: '/biblioteca/procedimentos/pop-coz-004' },
  { id: 'cont-revisao', tipo: 'Revisão pendente', titulo: 'Política de compras emergenciais', detalhe: 'Aguardando sua aprovação', path: '/biblioteca/revisoes' },
  { id: 'cont-acao', tipo: 'Ação corretiva', titulo: 'NC-0248 — identificação de lotes', detalhe: 'Moinhos · prazo hoje, 20h', path: '/biblioteca/conformidade' },
]
