import type { AdminModuleId } from '@/types'

export const adminModuleLabel: Record<AdminModuleId, string> = {
  cmv: 'CMV',
  estoque: 'Estoque',
  inventarios: 'Inventários',
  compras: 'Compras',
  recebimentos: 'Recebimentos',
  fornecedores: 'Fornecedores',
  fichas_tecnicas: 'Fichas Técnicas',
  biblioteca: 'Biblioteca',
  treinamentos: 'Treinamentos',
  checklists: 'Checklists',
  assistente: 'Assistente',
}

export const allAdminModules: AdminModuleId[] = ['cmv', 'estoque', 'inventarios', 'compras', 'recebimentos', 'fornecedores', 'fichas_tecnicas', 'biblioteca', 'treinamentos', 'checklists', 'assistente']
