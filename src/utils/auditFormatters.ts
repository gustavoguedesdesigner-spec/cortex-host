import type { AuditCriticality, AuditResult } from '@/types'

export const auditCriticalityLabel: Record<AuditCriticality, string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
}

export const auditCriticalityStatus: Record<AuditCriticality, 'critical' | 'attention' | 'info' | 'neutral'> = {
  critica: 'critical',
  alta: 'attention',
  media: 'info',
  baixa: 'neutral',
}

export const auditResultLabel: Record<AuditResult, string> = {
  sucesso: 'Sucesso',
  falha: 'Falha',
  pendente: 'Pendente',
}

export const auditResultStatus: Record<AuditResult, 'success' | 'critical' | 'attention'> = {
  sucesso: 'success',
  falha: 'critical',
  pendente: 'attention',
}
