import type { AccessConflict, AccessScope, Permission, PermissionAction, PermissionGroupId, PermissionState } from '@/types'

export interface PermissionCell {
  roleId: string
  estado: PermissionState
  escopo: AccessScope
}

export interface PermissionRow {
  permission: Permission
  /** Perfis não listados aqui são considerados negados por padrão — evita saturar a matriz com "negado" repetido. */
  allowed: PermissionCell[]
}

let seq = 0
function perm(grupo: PermissionGroupId, recurso: string, acao: PermissionAction, critica: boolean, allowed: PermissionCell[]): PermissionRow {
  seq += 1
  return { permission: { id: `perm-${seq.toString().padStart(3, '0')}`, grupo, recurso, acao, critica }, allowed }
}

/**
 * Catálogo demonstrativo de permissões (seção 33-35) — amostra representativa dos 19 grupos,
 * não a enumeração completa das 146 permissões configuradas (constante em administrationSituation).
 * Perfis não listados em `allowed` são negados por padrão.
 */
export const permissionRows: PermissionRow[] = [
  perm('central', 'Central de Operações — visão consolidada', 'visualizar_rede', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gestor-regional', estado: 'permitido', escopo: 'regiao' },
  ]),
  perm('unidades', 'Unidades — visão comparativa', 'visualizar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gestor-regional', estado: 'permitido', escopo: 'regiao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('cmv', 'CMV — visualizar custos', 'visualizar_custos', true, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'financeiro', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('cmv', 'CMV — visualizar margens consolidadas da rede', 'visualizar_margens', true, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'financeiro', estado: 'permitido', escopo: 'organizacao' },
  ]),
  perm('cmv', 'CMV — fechar período', 'concluir', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gerente-unidade', estado: 'condicionado', escopo: 'propria_unidade' },
  ]),
  perm('cmv', 'CMV — reabrir período fechado', 'reabrir', true, [
    { roleId: 'administrador-corporativo', estado: 'exige_aprovacao', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'exige_aprovacao', escopo: 'organizacao' },
  ]),
  perm('estoque', 'Estoque — visualizar posição', 'visualizar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gestor-regional', estado: 'permitido', escopo: 'regiao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
    { roleId: 'estoquista', estado: 'permitido', escopo: 'propria_area' },
  ]),
  perm('estoque', 'Estoque — ajustar saldo', 'editar', false, [
    { roleId: 'gerente-unidade', estado: 'condicionado', escopo: 'propria_unidade' },
    { roleId: 'estoquista', estado: 'exige_aprovacao', escopo: 'propria_area' },
  ]),
  perm('inventarios', 'Inventários — executar contagem', 'criar', false, [
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
    { roleId: 'estoquista', estado: 'permitido', escopo: 'propria_area' },
  ]),
  perm('inventarios', 'Inventários — aprovar divergência', 'aprovar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('inventarios', 'Inventários — reabrir inventário fechado', 'reabrir', true, [
    { roleId: 'administrador-corporativo', estado: 'exige_aprovacao', escopo: 'organizacao' },
    { roleId: 'gerente-unidade', estado: 'condicionado', escopo: 'propria_unidade' },
  ]),
  perm('compras', 'Compras — criar pedido', 'criar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
    { roleId: 'comprador', estado: 'permitido', escopo: 'unidades_selecionadas' },
  ]),
  perm('compras', 'Compras — aprovar pedido', 'aprovar', true, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gestor-regional', estado: 'condicionado', escopo: 'regiao' },
    { roleId: 'gerente-unidade', estado: 'condicionado', escopo: 'propria_unidade' },
    { roleId: 'comprador', estado: 'condicionado', escopo: 'unidades_selecionadas' },
  ]),
  perm('compras', 'Compras — aprovar compra emergencial', 'aprovar', true, [
    { roleId: 'administrador-corporativo', estado: 'exige_aprovacao', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'exige_aprovacao', escopo: 'organizacao' },
  ]),
  perm('aprovacoes', 'Aprovações — visualizar fila', 'visualizar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gestor-regional', estado: 'permitido', escopo: 'regiao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('recebimentos', 'Recebimentos — conferir pedido', 'criar', false, [
    { roleId: 'recebimento', estado: 'permitido', escopo: 'propria_unidade' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('recebimentos', 'Recebimentos — aprovar divergência', 'aprovar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gerente-unidade', estado: 'condicionado', escopo: 'propria_unidade' },
    { roleId: 'recebimento', estado: 'condicionado', escopo: 'propria_unidade' },
  ]),
  perm('fornecedores', 'Fornecedores — cadastrar', 'criar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'comprador', estado: 'condicionado', escopo: 'unidades_selecionadas' },
  ]),
  perm('fornecedores', 'Fornecedores — homologar', 'aprovar', true, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
  ]),
  perm('fichas_tecnicas', 'Fichas técnicas — criar e editar', 'criar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'financeiro', estado: 'somente_leitura', escopo: 'organizacao' },
  ]),
  perm('fichas_tecnicas', 'Fichas técnicas — publicar', 'publicar', true, [
    { roleId: 'administrador-corporativo', estado: 'exige_aprovacao', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'condicionado', escopo: 'organizacao' },
  ]),
  perm('fichas_tecnicas', 'Fichas técnicas — visualizar custo por porção', 'visualizar_custos', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'financeiro', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('biblioteca', 'Biblioteca — autoria de procedimento', 'criar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('biblioteca', 'Biblioteca — aprovar publicação', 'publicar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
  ]),
  perm('treinamentos', 'Treinamentos — atribuir', 'criar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('checklists', 'Checklists — executar', 'criar', false, [
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
    { roleId: 'estoquista', estado: 'permitido', escopo: 'propria_area' },
    { roleId: 'cozinha', estado: 'permitido', escopo: 'propria_area' },
    { roleId: 'recebimento', estado: 'permitido', escopo: 'propria_area' },
  ]),
  perm('planos_de_acao', 'Planos de ação — criar', 'criar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gestor-regional', estado: 'permitido', escopo: 'regiao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('planos_de_acao', 'Planos de ação — concluir', 'concluir', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('usuarios', 'Usuários — gerenciar cadastro e perfis', 'gerenciar_usuarios', true, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
  ]),
  perm('usuarios', 'Usuários — visualizar equipe', 'visualizar', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gestor-regional', estado: 'permitido', escopo: 'regiao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('configuracoes', 'Configurações — alterar parâmetros corporativos', 'alterar_configuracoes', true, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
  ]),
  perm('auditoria', 'Auditoria — visualizar eventos', 'visualizar', true, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
  ]),
  perm('auditoria', 'Auditoria — exportar eventos', 'exportar', true, [
    { roleId: 'administrador-corporativo', estado: 'exige_aprovacao', escopo: 'organizacao' },
  ]),
  perm('dados_financeiros', 'Dados financeiros — exportar', 'exportar', true, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'financeiro', estado: 'permitido', escopo: 'organizacao' },
  ]),
  perm('assistente', 'Assistente — exibir custos nas respostas', 'visualizar_custos', false, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'diretor-operacoes', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'financeiro', estado: 'permitido', escopo: 'organizacao' },
    { roleId: 'gerente-unidade', estado: 'permitido', escopo: 'propria_unidade' },
  ]),
  perm('assistente', 'Assistente — sugerir ações administrativas', 'administrar', true, [
    { roleId: 'administrador-corporativo', estado: 'permitido', escopo: 'organizacao' },
  ]),
]

export function getPermissionState(roleId: string, permissionId: string): PermissionCell | null {
  const row = permissionRows.find((r) => r.permission.id === permissionId)
  return row?.allowed.find((a) => a.roleId === roleId) ?? null
}

export function getPermissionRowsByGroup(grupo: PermissionGroupId): PermissionRow[] {
  return permissionRows.filter((r) => r.permission.grupo === grupo)
}

export const permissionGroupLabel: Record<PermissionGroupId, string> = {
  central: 'Central',
  unidades: 'Unidades',
  cmv: 'CMV',
  estoque: 'Estoque',
  inventarios: 'Inventários',
  compras: 'Compras',
  aprovacoes: 'Aprovações',
  recebimentos: 'Recebimentos',
  fornecedores: 'Fornecedores',
  fichas_tecnicas: 'Fichas Técnicas',
  biblioteca: 'Biblioteca',
  treinamentos: 'Treinamentos',
  checklists: 'Checklists',
  planos_de_acao: 'Planos de ação',
  usuarios: 'Usuários',
  configuracoes: 'Configurações',
  auditoria: 'Auditoria',
  dados_financeiros: 'Dados financeiros',
  assistente: 'Assistente CORTEX',
}

/** Conflitos de acesso detectados (seção 37) — mesmos três exemplos citados na resposta rápida do CORTEX. */
export const accessConflicts: AccessConflict[] = [
  {
    id: 'conflito-comprador-aprova',
    roleId: 'comprador',
    titulo: 'Compra pode ser criada e aprovada pelo mesmo perfil',
    descricao: 'Dois usuários com o perfil Comprador possuem, por exceção individual, permissão de aprovação — permitindo criar e aprovar o próprio pedido.',
    severidade: 'alta',
    recomendacao: 'Remover a exceção de aprovação ou exigir um segundo aprovador para este perfil.',
  },
  {
    id: 'conflito-gerente-reabre-proprio-inventario',
    roleId: 'gerente-unidade',
    titulo: 'Gerente pode reabrir o próprio inventário',
    descricao: 'O perfil Gerente de Unidade permite reabrir inventários fechados na própria unidade sem um segundo aprovador corporativo.',
    severidade: 'alta',
    recomendacao: 'Exigir aprovação corporativa para reabertura de inventário.',
  },
  {
    id: 'conflito-diretor-publica-propria-ficha',
    roleId: 'diretor-operacoes',
    titulo: 'Mesmo perfil edita e publica fichas técnicas',
    descricao: 'O perfil Diretor de Operações possui permissão de edição e de publicação de fichas técnicas — pode publicar uma ficha que ele próprio alterou.',
    severidade: 'media',
    recomendacao: 'Separar a publicação para o Administrador Corporativo ou exigir validação financeira prévia.',
  },
]

export function getAccessConflictsByRole(roleId: string): AccessConflict[] {
  return accessConflicts.filter((c) => c.roleId === roleId)
}
