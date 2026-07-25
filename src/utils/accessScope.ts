import type { AccessScope, PermissionAction, PermissionState } from '@/types'

export const accessScopeLabel: Record<AccessScope, string> = {
  organizacao: 'Toda a organização',
  marca: 'Marca',
  regiao: 'Região',
  unidades_selecionadas: 'Unidades selecionadas',
  propria_unidade: 'Própria unidade',
  propria_area: 'Própria área',
  proprios_registros: 'Próprios registros',
  somente_leitura: 'Apenas leitura',
  temporario: 'Acesso temporário',
}

export const permissionStateLabel: Record<PermissionState, string> = {
  permitido: 'Permitido',
  negado: 'Negado',
  condicionado: 'Condicionado',
  somente_leitura: 'Somente leitura',
  exige_aprovacao: 'Exige aprovação',
}

export const permissionActionLabel: Record<PermissionAction, string> = {
  visualizar: 'Visualizar',
  criar: 'Criar',
  editar: 'Editar',
  excluir_rascunho: 'Excluir rascunho',
  aprovar: 'Aprovar',
  publicar: 'Publicar',
  concluir: 'Concluir',
  reabrir: 'Reabrir',
  estornar: 'Estornar',
  exportar: 'Exportar',
  administrar: 'Administrar',
  visualizar_custos: 'Visualizar custos',
  visualizar_margens: 'Visualizar margens',
  visualizar_rede: 'Visualizar toda a rede',
  alterar_configuracoes: 'Alterar configurações',
  gerenciar_usuarios: 'Gerenciar usuários',
}
