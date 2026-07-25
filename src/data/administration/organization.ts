import type { AdminUnitSummary, Brand, OperationalArea, Organization, UnitModuleConfig } from '@/types'

/**
 * Organização e Marca demonstrativas (seções 16-18). CNPJ não preenchido —
 * dado jurídico real não deve ser inventado sem confirmação do cliente.
 */
export const organization: Organization = {
  id: 'org-salvador-brewing',
  razaoSocial: 'Salvador Brewing Co.',
  nomeFantasia: 'Salvador Brewing Co.',
  setor: 'Bares, restaurantes e cervejarias',
  moeda: 'BRL',
  idioma: 'Português do Brasil',
  fusoHorario: 'América/Bahia (UTC-3)',
  calendarioFiscal: 'Janeiro a dezembro',
  inicioSemana: 'Segunda-feira',
  unidadePeso: 'Quilograma (kg)',
  unidadeVolume: 'Litro (L)',
  separadorDecimal: 'Vírgula',
  horarioFechamento: '00h',
  diasUteis: 'Terça a domingo (varia por unidade)',
  responsavelAdministrativo: 'Leo',
  endereco: 'Salvador/BA',
  status: 'ativa',
  plano: 'CORTEX HOST — Piloto',
  contatoEmail: 'contato@salvadorbrewing.com.br',
  contatoTelefone: '(71) 3245-1100',
  criadaEmIso: '2014-06-01T00:00:00-03:00',
}

export const tenantLabel = 'ZAKA Platform'

export const brands: Brand[] = [
  {
    id: 'salvador',
    nome: 'Salvador',
    organizacaoId: organization.id,
    status: 'ativa',
    responsavel: 'Leo',
    unidades: ['moinhos', 'caxias-centro', 'zona-norte', 'cidade-baixa', 'serra', 'caxias-norte'],
    produtosVinculados: 40,
    criadaEmIso: '2014-06-01T00:00:00-03:00',
  },
]

const areaTemplate: { tipo: OperationalArea['tipo']; nome: string }[] = [
  { tipo: 'administracao', nome: 'Administração' },
  { tipo: 'cozinha', nome: 'Cozinha' },
  { tipo: 'bar', nome: 'Bar' },
  { tipo: 'estoque_seco', nome: 'Estoque seco' },
  { tipo: 'estoque_refrigerado', nome: 'Estoque refrigerado' },
  { tipo: 'estoque_congelado', nome: 'Estoque congelado' },
  { tipo: 'recebimento', nome: 'Recebimento' },
  { tipo: 'compras', nome: 'Compras' },
  { tipo: 'atendimento', nome: 'Atendimento' },
  { tipo: 'financeiro', nome: 'Financeiro' },
  { tipo: 'limpeza', nome: 'Limpeza' },
  { tipo: 'manutencao', nome: 'Manutenção' },
]

/** Áreas operacionais — geradas para cada unidade a partir do mesmo template (seção 21). */
export const operationalAreas: OperationalArea[] = brands[0].unidades.flatMap((unitId) =>
  areaTemplate.map((a) => ({
    id: `${unitId}-${a.tipo}`,
    unitId,
    tipo: a.tipo,
    nome: a.nome,
    responsavel: a.tipo === 'administracao' ? 'Gerente da unidade' : 'Responsável de área',
    usuariosCount: a.tipo === 'cozinha' || a.tipo === 'bar' ? 6 : a.tipo === 'atendimento' ? 8 : 2,
    checklistsCount: ['cozinha', 'bar', 'estoque_seco', 'estoque_refrigerado', 'estoque_congelado', 'recebimento', 'limpeza'].includes(a.tipo) ? 3 : 1,
    procedimentosCount: ['cozinha', 'bar', 'recebimento', 'compras'].includes(a.tipo) ? 4 : 1,
  })),
)

/** Módulos ativos por unidade (seção 22) — desativar um módulo restringe acesso, não apaga dados. */
export const unitModuleConfigs: UnitModuleConfig[] = brands[0].unidades.map((unitId) => ({
  unitId,
  modulosAtivos:
    unitId === 'caxias-norte'
      ? ['cmv', 'estoque', 'inventarios', 'compras', 'recebimentos', 'fornecedores', 'fichas_tecnicas', 'biblioteca', 'checklists', 'assistente']
      : ['cmv', 'estoque', 'inventarios', 'compras', 'recebimentos', 'fornecedores', 'fichas_tecnicas', 'biblioteca', 'treinamentos', 'checklists', 'assistente'],
}))

export const adminUnitSummaries: AdminUnitSummary[] = [
  { unitId: 'moinhos', usuariosCount: 16, integracoesAtivas: 3, integracoesAtencao: 0, qualidadeDados: 0.96, aprovadores: ['Rafael Martins', 'Leo'] },
  { unitId: 'caxias-centro', usuariosCount: 13, integracoesAtivas: 3, integracoesAtencao: 0, qualidadeDados: 0.94, aprovadores: ['Juliana Prado', 'Leo'] },
  { unitId: 'zona-norte', usuariosCount: 12, integracoesAtivas: 3, integracoesAtencao: 0, qualidadeDados: 0.95, aprovadores: ['Patricia Lins', 'Leo'] },
  { unitId: 'cidade-baixa', usuariosCount: 12, integracoesAtivas: 3, integracoesAtencao: 0, qualidadeDados: 0.97, aprovadores: ['Diego Andrade', 'Leo'] },
  { unitId: 'serra', usuariosCount: 10, integracoesAtivas: 3, integracoesAtencao: 0, qualidadeDados: 0.98, aprovadores: ['Rafael Nunes', 'Leo'] },
  { unitId: 'caxias-norte', usuariosCount: 8, integracoesAtivas: 2, integracoesAtencao: 1, qualidadeDados: 0.81, aprovadores: ['Bruno Teles', 'Leo'] },
]

export function getAdminUnitSummary(unitId: string): AdminUnitSummary | undefined {
  return adminUnitSummaries.find((u) => u.unitId === unitId)
}

export function getOperationalAreasByUnit(unitId: string): OperationalArea[] {
  return operationalAreas.filter((a) => a.unitId === unitId)
}

export function getUnitModuleConfig(unitId: string): UnitModuleConfig | undefined {
  return unitModuleConfigs.find((c) => c.unitId === unitId)
}
