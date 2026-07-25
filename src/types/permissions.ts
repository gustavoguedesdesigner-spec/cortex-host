/** Tipos de Perfis, Permissões, Escopos e Conflitos — módulo de Administração. */

export type PermissionGroupId =
  | 'central'
  | 'unidades'
  | 'cmv'
  | 'estoque'
  | 'inventarios'
  | 'compras'
  | 'aprovacoes'
  | 'recebimentos'
  | 'fornecedores'
  | 'fichas_tecnicas'
  | 'biblioteca'
  | 'treinamentos'
  | 'checklists'
  | 'planos_de_acao'
  | 'usuarios'
  | 'configuracoes'
  | 'auditoria'
  | 'dados_financeiros'
  | 'assistente'

export type PermissionAction =
  | 'visualizar'
  | 'criar'
  | 'editar'
  | 'excluir_rascunho'
  | 'aprovar'
  | 'publicar'
  | 'concluir'
  | 'reabrir'
  | 'estornar'
  | 'exportar'
  | 'administrar'
  | 'visualizar_custos'
  | 'visualizar_margens'
  | 'visualizar_rede'
  | 'alterar_configuracoes'
  | 'gerenciar_usuarios'

export type AccessScope =
  | 'organizacao'
  | 'marca'
  | 'regiao'
  | 'unidades_selecionadas'
  | 'propria_unidade'
  | 'propria_area'
  | 'proprios_registros'
  | 'somente_leitura'
  | 'temporario'

export type PermissionState = 'permitido' | 'negado' | 'condicionado' | 'somente_leitura' | 'exige_aprovacao'

export interface Permission {
  id: string
  grupo: PermissionGroupId
  recurso: string
  acao: PermissionAction
  critica: boolean
}

export interface RolePermission {
  roleId: string
  permissionId: string
  estado: PermissionState
  escopo: AccessScope
}

export interface Role {
  id: string
  nome: string
  descricao: string
  usuariosCount: number
  escopoPadrao: AccessScope
  critico: boolean
  podeLista: string[]
  naoPodeLista: string[]
}

export interface AccessConflict {
  id: string
  roleId: string
  titulo: string
  descricao: string
  severidade: 'alta' | 'media' | 'baixa'
  recomendacao: string
}
