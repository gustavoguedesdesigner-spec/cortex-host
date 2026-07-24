export type IntegrationState = 'atualizado' | 'pendente' | 'atrasado'

export interface IntegrationStatusItem {
  nome: string
  estado: IntegrationState
  detalhe?: string
}
