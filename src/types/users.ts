/** Tipos de Usuários — módulo de Administração. */

export type UserStatus = 'ativo' | 'convidado' | 'aguardando_ativacao' | 'acesso_temporario' | 'bloqueado' | 'suspenso' | 'inativo' | 'removido'

export interface TemporaryAccess {
  inicioIso: string
  fimIso: string
  escopo: string
}

export interface UserSession {
  id: string
  dispositivo: string
  navegador: string
  localizacaoAproximada: string
  ultimoAcessoIso: string
  status: 'ativa' | 'encerrada'
}

export interface UserActivityEntry {
  id: string
  dataIso: string
  descricao: string
  modulo: string
}

export interface User {
  id: string
  nome: string
  email: string
  telefone?: string
  cargo: string
  area?: string
  status: UserStatus
  roleId: string
  unidades: string[]
  ultimoAcessoIso?: string
  autenticacaoDoisFatores: boolean
  acessoTemporario?: TemporaryAccess
  responsavelId?: string
  criadoEmIso: string
  removidoEmIso?: string
  motivoRemocao?: string
  substitutoId?: string
  permissoesDiretasCount: number
  permissoesCriticasCount: number
  precisaRevisao: boolean
  motivoRevisao?: string
}

export interface UserInvite {
  id: string
  userId: string
  email: string
  status: 'pendente' | 'expirado' | 'aceito' | 'cancelado'
  enviadoEmIso: string
  validoAteIso: string
}
