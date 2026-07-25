/** Tipos de Auditoria e Segurança — módulo de Administração. */

export type AuditCriticality = 'critica' | 'alta' | 'media' | 'baixa'
export type AuditResult = 'sucesso' | 'falha' | 'pendente'

export interface AuditEvent {
  id: string
  dataIso: string
  usuario: string
  acao: string
  modulo: string
  recurso: string
  unidade?: string
  criticidade: AuditCriticality
  resultado: AuditResult
  origem: string
  dispositivo?: string
  antes?: string
  depois?: string
  justificativa?: string
  aprovador?: string
  correlacaoId?: string
  descricao: string
}

export interface SecurityEvent {
  id: string
  tipo: string
  usuario: string
  dataIso: string
  detalhe: string
}
