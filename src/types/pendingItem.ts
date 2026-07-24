export type PendingPriority = 'alta' | 'media' | 'baixa'
export type PendingBucket = 'atrasada' | 'hoje' | 'esta_semana'

export interface PendingItem {
  id: string
  tipo: string
  unidade: string
  responsavel: string
  prazoLabel: string
  bucket: PendingBucket
  prioridade: PendingPriority
  acaoRapida: string
  minha: boolean
}
