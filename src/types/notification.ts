export type NotificationSeverity = 'critical' | 'attention' | 'info' | 'success'

export interface NotificationItemData {
  id: string
  titulo: string
  descricao: string
  unidade?: string
  severidade: NotificationSeverity
  horario: string
  lida: boolean
}
