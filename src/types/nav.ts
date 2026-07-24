import type { LucideIcon } from 'lucide-react'

export interface NavLeafItem {
  label: string
  path: string
  icon: LucideIcon
  /** Marca itens de modulos ainda em construcao nesta etapa do prototipo */
  emConstrucao?: boolean
}

export interface NavGroupData {
  label: string
  items: NavLeafItem[]
}
