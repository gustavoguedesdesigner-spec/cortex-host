/**
 * Tipos do modulo de Biblioteca Operacional: documentos, procedimentos,
 * treinamentos, checklists, execucoes, evidencias, conformidade e nao
 * conformidades. Vocabulario proprio de status e obrigatoriedade — nao
 * reaproveita RecipeStatus porque o ciclo de vida aqui inclui expiracao
 * e bloqueio, que fichas tecnicas nao tem.
 */

export type KnowledgeStatus =
  | 'rascunho'
  | 'em_revisao'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'publicado'
  | 'revisao_recomendada'
  | 'expirado'
  | 'substituido'
  | 'arquivado'
  | 'bloqueado'

export type KnowledgeObligation = 'obrigatorio' | 'recomendado' | 'referencia' | 'restrito'

export type KnowledgeArea =
  | 'cozinha'
  | 'bar'
  | 'estoque'
  | 'compras'
  | 'recebimento'
  | 'gestao'
  | 'financeiro'
  | 'seguranca_alimentar'
  | 'limpeza'
  | 'atendimento'
  | 'manutencao'
  | 'pessoas'
  | 'tecnologia'
  | 'emergencia'

export type KnowledgeType =
  | 'procedimento'
  | 'manual'
  | 'politica'
  | 'instrucao_trabalho'
  | 'ficha_seguranca'
  | 'guia_rapido'
  | 'treinamento'
  | 'video'
  | 'apresentacao'
  | 'documento_tecnico'
  | 'checklist'
  | 'formulario'
  | 'modelo'
  | 'comunicado'
  | 'receita_operacional'
  | 'onboarding'
  | 'auditoria'
  | 'plano_emergencia'

/** Perfis demonstrativos usados nas permissoes do modulo. */
export type KnowledgeRole = 'administrador' | 'gestor_operacoes' | 'gerente_unidade' | 'colaborador' | 'auditor'

export interface DocumentVersion {
  versao: string
  status: KnowledgeStatus
  autor: string
  criadaEm: string
  publicadaEm?: string
  vigenteDe?: string
  motivo: string
  /** Mudancas em relacao a versao anterior — alimenta a comparacao de versoes. */
  alteracoes: VersionChange[]
}

export type VersionChangeType = 'texto' | 'etapa_adicionada' | 'etapa_removida' | 'tolerancia' | 'responsavel' | 'evidencia' | 'treinamento' | 'checklist'

export interface VersionChange {
  tipo: VersionChangeType
  descricao: string
  antes?: string
  depois?: string
}

export interface KnowledgeDocument {
  id: string
  codigo: string
  titulo: string
  descricao: string
  tipo: KnowledgeType
  area: KnowledgeArea
  categoria: string
  palavrasChave: string[]
  versaoVigente: string
  status: KnowledgeStatus
  obrigatoriedade: KnowledgeObligation
  autor: string
  responsavel: string
  aprovadores: string[]
  criadoEm: string
  publicadoEm?: string
  ultimaRevisao: string
  proximaRevisao: string
  /** Data-limite de validade do conteudo; ausente = sem prazo de validade. */
  validade?: string
  unidadesAplicaveis: string[]
  funcoesAplicaveis: string[]
  tempoLeituraMin?: number
  visualizacoes: number
  confirmacoesLeitura: number
  confirmacoesEsperadas: number
  favorito?: boolean
  conteudoRelacionado: string[]
  ocorrenciasRelacionadas: string[]
  treinamentosRelacionados: string[]
  checklistsRelacionados: string[]
  fichasRelacionadas?: string[]
  anexos: { nome: string; tipo: string; tamanhoKb: number }[]
  versoes: DocumentVersion[]
}

export interface ProcedureStepDetail {
  numero: number
  titulo: string
  itens: string[]
  /** Controles criticos exibidos na tabela de limites e tolerancias. */
  controles?: ProcedureControl[]
}

export interface ProcedureControl {
  parametro: string
  padrao: string
  tolerancia: string
  frequencia: string
  responsavel: string
  evidencia: string
}

export interface Procedure {
  documentId: string
  objetivo: string
  escopo: string
  responsaveis: string[]
  materiais: string[]
  seguranca: string[]
  etapas: ProcedureStepDetail[]
  controles: ProcedureControl[]
  evidenciasObrigatorias: string[]
  naoConformidadesComuns: string[]
  acoesCorretivas: string[]
}

export type TrainingFormat =
  | 'leitura_orientada'
  | 'video'
  | 'apresentacao'
  | 'aula_registrada'
  | 'pratica_supervisionada'
  | 'avaliacao'
  | 'combinado'

export type TrainingProgressStatus = 'nao_iniciado' | 'em_andamento' | 'concluido' | 'reprovado' | 'vencido'

export interface TrainingModule {
  numero: number
  titulo: string
  conteudo: string
  duracaoMin: number
  materialRelacionado?: string
  perguntaVerificacao: string
  respostaEsperada: string
}

export interface TrainingQuestion {
  id: string
  enunciado: string
  alternativas: string[]
  indiceCorreto: number
  explicacao: string
}

export interface Training {
  id: string
  codigo: string
  titulo: string
  descricao: string
  area: KnowledgeArea
  formato: TrainingFormat
  duracaoMin: number
  obrigatoriedade: KnowledgeObligation
  publico: string[]
  unidades: string[]
  modulos: TrainingModule[]
  avaliacao: TrainingQuestion[]
  aproveitamentoMinimo: number
  validadeMeses: number
  atribuidos: number
  concluidos: number
  pendentes: number
  status: KnowledgeStatus
  documentoRelacionado?: string
  checklistRelacionado?: string
  unidadesCriticas: string[]
}

export interface TrainingAssignment {
  id: string
  trainingId: string
  colaborador: string
  funcao: string
  unitId: string
  prazo: string
  obrigatorio: boolean
  motivo: string
  status: TrainingProgressStatus
  progressoPercentual: number
  modulosConcluidos: number
  ultimaAtividade?: string
  tentativas: number
  resultado?: number
  atrasado: boolean
}

export type ChecklistFrequency = 'diaria' | 'semanal' | 'mensal' | 'por_evento' | 'sob_demanda'

export type ChecklistAnswerType = 'sim_nao' | 'quantidade' | 'temperatura' | 'texto' | 'escolha' | 'foto' | 'documento' | 'assinatura' | 'conformidade'

export type ChecklistRunStatus = 'planejado' | 'em_execucao' | 'pausado' | 'incompleto' | 'concluido' | 'atrasado'

export interface ChecklistItem {
  id: string
  ordem: number
  secao: string
  titulo: string
  instrucao: string
  tipoResposta: ChecklistAnswerType
  obrigatorio: boolean
  exigeEvidencia: boolean
  critico: boolean
  /** Faixa esperada para respostas numericas (temperatura/quantidade). */
  faixaMin?: number
  faixaMax?: number
  unidade?: string
  opcoes?: string[]
}

export interface Checklist {
  id: string
  codigo: string
  titulo: string
  descricao: string
  area: KnowledgeArea
  tipo: string
  frequencia: ChecklistFrequency
  unidades: string[]
  responsavelPadrao: string
  horarioRecomendado: string
  versao: string
  status: KnowledgeStatus
  itens: ChecklistItem[]
  conformidadeRede: number
  conformidadePorUnidade: Record<string, number>
  execucoesPeriodo: number
  naoConformidadesAbertas: number
  proximaExecucao: string
  documentoRelacionado?: string
  treinamentoRelacionado?: string
}

export interface ChecklistAnswer {
  itemId: string
  valor: string | number | boolean | null
  conforme: boolean | null
  observacao?: string
  evidencia?: string
  respondidoEm: string
}

export interface ChecklistExecution {
  id: string
  checklistId: string
  unitId: string
  responsavel: string
  iniciadaEm: string
  concluidaEm?: string
  status: ChecklistRunStatus
  respostas: ChecklistAnswer[]
  conformidade: number | null
  itensConformes: number
  itensAplicaveis: number
  naoConformidades: string[]
  assinatura?: string
}

export interface Evidence {
  id: string
  tipo: 'foto' | 'documento' | 'observacao' | 'assinatura'
  descricao: string
  registradoPor: string
  registradoEm: string
  origem: string
}

export type NonConformityStatus = 'aberta' | 'em_analise' | 'acao_definida' | 'em_correcao' | 'aguardando_validacao' | 'resolvida' | 'reaberta'

export type NonConformityCriticality = 'alta' | 'media' | 'baixa'

export interface NonConformity {
  id: string
  numero: string
  origem: string
  origemId?: string
  unitId: string
  area: KnowledgeArea
  descricao: string
  criticidade: NonConformityCriticality
  responsavel: string
  prazo: string
  registradaEm: string
  evidencias: Evidence[]
  acaoImediata: string
  acaoCorretiva?: CorrectiveAction
  status: NonConformityStatus
  recorrente: boolean
  procedimentoRelacionado?: string
  treinamentoRelacionado?: string
  checklistRelacionado?: string
}

export interface CorrectiveAction {
  id: string
  descricao: string
  causaProvavel: string
  contencaoImediata: string
  responsavel: string
  prazo: string
  status: 'planejada' | 'em_execucao' | 'aguardando_validacao' | 'concluida' | 'atrasada'
  evidenciaValidacao?: string
  planoAcaoId?: string
}

export interface ComplianceScore {
  unitId: string
  conformidadeGeral: number
  conformidadeCritica: number
  checklistsExecutados: number
  checklistsAtrasados: number
  naoConformidades: number
  naoConformidadesCriticas: number
  acoesAbertas: number
  treinamentosPendentes: number
  tendencia: 'melhorando' | 'piorando' | 'estavel'
}

export interface AreaCompliance {
  area: KnowledgeArea
  label: string
  conformidade: number
  naoConformidades: number
  unidadeCritica: string
}

export type RevisionRequestStatus = 'solicitada' | 'em_elaboracao' | 'aguardando_aprovacao' | 'aprovada' | 'publicada' | 'rejeitada'

export interface RevisionRequest {
  id: string
  documentId: string
  versaoOrigem: string
  novaVersao: string
  motivo: string
  solicitadaPor: string
  solicitadaEm: string
  status: RevisionRequestStatus
  aprovadores: { nome: string; papel: string; status: 'pendente' | 'aprovado' | 'rejeitado' }[]
  vigenciaPrevista?: string
  alteracoes: VersionChange[]
  /** Escopo impactado pela revisao — calculado a partir do documento de origem. */
  impacto?: RevisionImpact
}

export interface RevisionImpact {
  unidadesAfetadas: string[]
  funcoesAfetadas: string[]
  treinamentosAfetados: string[]
  checklistsAfetados: string[]
  fichasAfetadas: string[]
  ocorrenciasRelacionadas: string[]
  pessoasParaConfirmar: number
}

/** Atalho de acesso rapido por atividade operacional (secao 17). */
export interface QuickActivity {
  id: string
  label: string
  procedimentoId?: string
  checklistId?: string
  treinamentoId?: string
  responsavel: string
  versaoLabel: string
}
