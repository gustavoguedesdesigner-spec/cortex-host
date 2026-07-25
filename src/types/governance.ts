import type { AuditCriticality } from './audit'

/** Tipos de Alçadas, Notificações, Dados e Governança — módulo de Administração. */

export interface ApprovalLimitRule {
  id: string
  modulo: string
  evento: string
  condicao: string
  valorMin?: number
  valorMax?: number
  aprovadorPerfil: string
  etapas: number
  excecao?: string
  vigencia: string
  status: 'ativa' | 'inativa'
  cadeia: 'sequencial' | 'paralela' | 'qualquer_um' | 'todos'
}

export interface ApprovalDelegation {
  id: string
  aprovadorPrincipal: string
  substituto: string
  inicioIso: string
  fimIso: string
  escopo: string
}

export interface NotificationRule {
  id: string
  evento: string
  categoria: string
  criticidade: AuditCriticality
  perfil?: string
  unidade?: string
  canal: string
  horario?: string
  frequencia: string
  escalonamento?: string
}

export interface DataRetentionPolicy {
  categoria: string
  periodo: string
  observacao?: string
}

export interface BackupSnapshot {
  ultimoBackupIso: string
  frequencia: string
  status: 'concluido' | 'em_andamento' | 'falhou'
  retencao: string
  proximaExecucaoIso: string
  restauracaoTestada: boolean
  responsavel: string
}

export interface DataRequest {
  id: string
  tipo: 'exportar' | 'corrigir' | 'restringir' | 'anonimizar' | 'excluir' | 'revisar_consentimento'
  solicitante: string
  dataIso: string
  status: 'pendente' | 'em_andamento' | 'concluida' | 'negada'
}

export interface GovernancePolicy {
  id: string
  categoria: string
  nome: string
  versao: string
  responsavel: string
  aprovador: string
  vigenciaIso: string
  revisaoIso: string
  status: 'vigente' | 'em_revisao' | 'vencida'
  pessoasImpactadas: number
  confirmacoesLeitura: number
  resumo: string
  principios?: string[]
}
