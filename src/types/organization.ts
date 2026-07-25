/** Tipos de Organização, Marca, Áreas Operacionais e Módulos por Unidade — módulo de Administração. */

export interface Organization {
  id: string
  razaoSocial: string
  nomeFantasia: string
  cnpj?: string
  setor: string
  moeda: string
  idioma: string
  fusoHorario: string
  calendarioFiscal: string
  inicioSemana: string
  unidadePeso: string
  unidadeVolume: string
  separadorDecimal: string
  horarioFechamento: string
  diasUteis: string
  responsavelAdministrativo: string
  endereco: string
  status: 'ativa' | 'suspensa'
  plano: string
  contatoEmail: string
  contatoTelefone: string
  criadaEmIso: string
}

export interface Brand {
  id: string
  nome: string
  organizacaoId: string
  status: 'ativa' | 'inativa'
  responsavel: string
  unidades: string[]
  produtosVinculados: number
  criadaEmIso: string
}

export type OperationalAreaType =
  | 'administracao'
  | 'cozinha'
  | 'bar'
  | 'estoque_seco'
  | 'estoque_refrigerado'
  | 'estoque_congelado'
  | 'recebimento'
  | 'compras'
  | 'atendimento'
  | 'financeiro'
  | 'limpeza'
  | 'manutencao'

export interface OperationalArea {
  id: string
  unitId: string
  tipo: OperationalAreaType
  nome: string
  responsavel: string
  usuariosCount: number
  checklistsCount: number
  procedimentosCount: number
}

export type AdminModuleId =
  | 'cmv'
  | 'estoque'
  | 'inventarios'
  | 'compras'
  | 'recebimentos'
  | 'fornecedores'
  | 'fichas_tecnicas'
  | 'biblioteca'
  | 'treinamentos'
  | 'checklists'
  | 'assistente'

export interface UnitModuleConfig {
  unitId: string
  modulosAtivos: AdminModuleId[]
}

export interface AdminUnitSummary {
  unitId: string
  usuariosCount: number
  integracoesAtivas: number
  integracoesAtencao: number
  qualidadeDados: number
  aprovadores: string[]
}
