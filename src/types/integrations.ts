/** Tipos de Integrações — módulo de Administração (arquivo distinto de types/integration.ts, usado pelos badges de PDV/Estoque da Central). */

export type IntegrationStatus = 'ativa' | 'atualizando' | 'atencao' | 'erro' | 'pausada' | 'nao_configurada' | 'expirada' | 'desconectada'

export interface IntegrationMapping {
  campoOrigem: string
  campoExterno: string
  campoCortex: string
  transformacao: string
  status: 'mapeado' | 'pendente' | 'erro'
}

export interface IntegrationErrorEntry {
  id: string
  integrationId: string
  codigo: string
  unidade?: string
  dataIso: string
  tipo: string
  registrosAfetados: number
  impacto: string
  status: 'aberto' | 'resolvido'
  responsavel: string
}

export interface IntegrationQuality {
  completude: number
  pontualidade: number
  consistencia: number
  confianca: number
}

export interface Integration {
  id: string
  nome: string
  tipo: string
  modulos: string[]
  unidades: string[]
  status: IntegrationStatus
  frequencia: string
  ultimaSincronizacaoIso?: string
  proximaSincronizacaoIso?: string
  registrosProcessados?: number
  errosCount: number
  responsavel: string
  autenticacaoMascarada?: string
  mapeamentos?: IntegrationMapping[]
  qualidade?: IntegrationQuality
}
