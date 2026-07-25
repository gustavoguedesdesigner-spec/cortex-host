import type { BackupSnapshot, DataRequest, DataRetentionPolicy } from '@/types'

/** Retenção demonstrativa (seção 80) — períodos configuráveis, sujeitos a validação jurídica. */
export const dataRetentionPolicies: DataRetentionPolicy[] = [
  { categoria: 'Dados operacionais', periodo: '5 anos', observacao: 'Vendas, estoque, compras e recebimentos' },
  { categoria: 'Auditoria', periodo: '7 anos' },
  { categoria: 'Sessões', periodo: '180 dias' },
  { categoria: 'Notificações', periodo: '1 ano' },
  { categoria: 'Documentos substituídos', periodo: '5 anos', observacao: 'Versões anteriores de fichas técnicas e procedimentos' },
  { categoria: 'Convites expirados', periodo: '90 dias' },
]

export const backupSnapshot: BackupSnapshot = {
  ultimoBackupIso: '2026-07-25T03:00:00-03:00',
  frequencia: 'Diária',
  status: 'concluido',
  retencao: '30 dias',
  proximaExecucaoIso: '2026-07-26T03:00:00-03:00',
  restauracaoTestada: true,
  responsavel: 'Leo',
}

export const dataRequests: DataRequest[] = [
  { id: 'req-exportar-mariana', tipo: 'exportar', solicitante: 'Mariana Costa', dataIso: '2026-07-15T10:00:00-03:00', status: 'concluida' },
  { id: 'req-corrigir-cadastro', tipo: 'corrigir', solicitante: 'Vanessa Rocha', dataIso: '2026-07-18T14:00:00-03:00', status: 'concluida' },
  { id: 'req-restringir-acesso-carlos', tipo: 'restringir', solicitante: 'Leo', dataIso: '2026-07-20T09:00:00-03:00', status: 'em_andamento' },
]

export const dataPolicyDisclaimer =
  'Os períodos de retenção e os fluxos de solicitação de dados são configuráveis neste protótipo, mas não substituem uma revisão jurídica formal antes de qualquer implementação em produção.'
