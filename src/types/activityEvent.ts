import type { LucideIcon } from 'lucide-react'

export interface ActivityEvent {
  id: string
  icon: LucideIcon
  usuario: string
  acao: string
  unidade?: string
  horario: string
}
