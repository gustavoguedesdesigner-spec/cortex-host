import type { UnitOfMeasureId } from './inventory'

/**
 * Base mestre de Fornecedores. Status cadastral (ciclo de vida do registro)
 * e status operacional (leitura de desempenho) são separados de propósito —
 * um fornecedor "Ativo" no cadastro pode estar "Em atenção" na operação.
 */
export type SupplierRegistrationStatus = 'ativo' | 'em_homologacao' | 'restrito' | 'bloqueado' | 'inativo' | 'arquivado'

export type SupplierOperationalStatus = 'estrategico' | 'ativo' | 'em_atencao'

export type SupplierCategoryId =
  | 'carnes'
  | 'chope_cervejas'
  | 'bebidas'
  | 'hortifruti'
  | 'laticinios'
  | 'secos'
  | 'oleos_frituras'
  | 'embalagens'
  | 'limpeza'
  | 'servicos'
  | 'manutencao'
  | 'tecnologia'

export type SupplierContactArea = 'comercial' | 'logistica' | 'financeiro' | 'qualidade' | 'emergencia'

export interface SupplierContact {
  id: string
  supplierId: string
  nome: string
  funcao: string
  area: SupplierContactArea
  email: string
  telefone: string
  whatsapp?: string
  horario?: string
  principal?: boolean
  emergencia?: boolean
  responsavelInterno?: string
}

export interface SupplierScoreBreakdown {
  precoCompetitivo: number
  pontualidade: number
  quantidade: number
  precoConformePedido: number
  qualidade: number
  capacidadeResposta: number
  documentacao: number
}

export interface SupplierScoreWeights {
  preco: number
  prazo: number
  quantidade: number
  precoConforme: number
  qualidade: number
  resposta: number
  documentacao: number
}

export interface SupplierScorePenalty {
  motivo: string
  pontos: number
}

export type SupplierRiskType =
  | 'dependencia'
  | 'preco'
  | 'qualidade'
  | 'prazo'
  | 'quantidade'
  | 'documentacao'
  | 'capacidade'
  | 'logistica'
  | 'financeiro'
  | 'reputacional'
  | 'continuidade'
  | 'concentracao_geografica'

export type SupplierRiskLevel = 'baixo' | 'medio' | 'alto'

export interface SupplierRiskItem {
  id: string
  supplierId: string
  tipo: SupplierRiskType
  titulo: string
  descricao: string
  probabilidade: SupplierRiskLevel
  impacto: SupplierRiskLevel
}

export interface Supplier {
  id: string
  codigo: string
  nome: string
  iniciais: string
  categoriaPrincipalId: SupplierCategoryId
  categoriasIds: SupplierCategoryId[]
  status: SupplierRegistrationStatus
  statusOperacional: SupplierOperationalStatus
  estrategico: boolean
  homologado: boolean
  scoreGeral: number
  scoreBreakdown: SupplierScoreBreakdown
  pesos: SupplierScoreWeights
  penalidades: SupplierScorePenalty[]
  valorCompradoPeriodo: number
  valorComprado12Meses: number
  participacaoCategoriaPrincipal: number
  unidadesAtendidas: string[]
  pedidosEmAberto: number
  recebimentosNoPeriodo: number
  divergenciasAbertas: number
  atrasoMedioDias: number
  pontualidade: number
  conformidadeQuantidade: number
  conformidadePreco: number
  conformidadeQualidade: number
  documentosObrigatorios: number
  documentosValidos: number
  negociacoesAbertas: number
  riscoDependencia: SupplierRiskLevel
  riscoDocumental: SupplierRiskLevel
  riscoOperacional: SupplierRiskLevel
  riscoFinanceiro: SupplierRiskLevel
  desde: string
  site?: string
  cidade: string
}

export interface SupplierProduct {
  id: string
  supplierId: string
  nome: string
  codigo: string
  categoria: SupplierCategoryId
  unidadeMedida: UnitOfMeasureId
  precoAtual: number
  precoAnterior: number
  prazoEntregaDias: number
  pedidoMinimo: number
  unidadesAtendidas: string[]
  comprasNoPeriodo: number
  divergencias: number
  status: 'ativo' | 'descontinuado' | 'em_negociacao'
}

export interface SupplierCategoryBreakdown {
  supplierId: string
  categoria: SupplierCategoryId
  valor: number
  itens: number
  unidades: number
  participacao: number
  variacaoPreco: number
  divergencias: number
  status: SupplierOperationalStatus
}

export interface SupplierPerformanceTrend {
  supplierId: string
  metrica: 'pontualidade' | 'conformidadeQuantidade' | 'conformidadePreco' | 'conformidadeQualidade'
  meta: number
  periodoAnterior: number
  serieSemanal: number[]
  tendencia: 'melhorando' | 'piorando' | 'estavel'
}

export interface SupplierPurchaseSummary {
  supplierId: string
  ticketMedio: number
  frequenciaPedidosMes: number
  tendencia: 'crescente' | 'decrescente' | 'estavel'
  serieMensal12Meses: number[]
}

export interface SupplierReceipt {
  id: string
  supplierId: string
  orderId?: string
  unitId: string
  data: string
  valor: number
  prazoStatus: 'no_prazo' | 'atrasado' | 'antecipado'
  quantidadeStatus: 'conforme' | 'divergente'
  precoStatus: 'conforme' | 'divergente'
  qualidadeStatus: 'conforme' | 'divergente'
  status: 'conforme' | 'divergente' | 'pendente'
}

export type SupplierDivergenceType = 'quantidade' | 'preco' | 'quantidade_e_preco' | 'atraso' | 'qualidade'
export type SupplierDivergenceStatus = 'aberta' | 'em_negociacao' | 'resolvida' | 'credito_solicitado'

export interface SupplierDivergence {
  id: string
  supplierId: string
  receiptId: string
  orderId?: string
  unitId: string
  tipo: SupplierDivergenceType
  descricao: string
  valorEnvolvido: number
  status: SupplierDivergenceStatus
  data: string
}

export interface SupplierPriceHistoryPoint {
  data: string
  preco: number
}

export interface SupplierPriceEntry {
  id: string
  supplierId: string
  itemId: string
  itemNome: string
  precoAtual: number
  precoMedio: number
  menor: number
  maior: number
  variacao: number
  historico: SupplierPriceHistoryPoint[]
  pedidoRelacionadoId?: string
  recebimentoRelacionadoId?: string
}

export type SupplierDocumentType =
  | 'contrato'
  | 'cadastro'
  | 'fiscal'
  | 'certificacao'
  | 'licenca'
  | 'dados_bancarios'
  | 'politica_qualidade'
  | 'termos_comerciais'
  | 'tabela_precos'
  | 'seguro'
  | 'transporte'

export type SupplierDocumentStatus = 'valido' | 'proximo_vencimento' | 'vencido' | 'pendente'

export interface SupplierDocument {
  id: string
  supplierId: string
  tipo: SupplierDocumentType
  nome: string
  obrigatorio: boolean
  status: SupplierDocumentStatus
  validade?: string
  responsavel?: string
}

export type SupplierNegotiationStatus = 'aberta' | 'em_andamento' | 'concluida' | 'cancelada'

export interface SupplierNegotiationHistoryEntry {
  data: string
  autor: string
  tipo: string
  descricao: string
}

export interface SupplierNegotiationScenario {
  titulo: string
  descricao: string
}

export interface SupplierNegotiation {
  id: string
  titulo: string
  supplierId: string
  categoria: string
  responsavel: string
  valorAnualRelacionado: number
  potencialEstimado: number
  objetivos: string[]
  inicio: string
  prazo: string
  status: SupplierNegotiationStatus
  historico: SupplierNegotiationHistoryEntry[]
  cenarios?: SupplierNegotiationScenario[]
}

export type SupplierEventType =
  | 'divergencia_registrada'
  | 'divergencia_resolvida'
  | 'documento_atualizado'
  | 'documento_vencendo'
  | 'negociacao_iniciada'
  | 'negociacao_concluida'
  | 'score_alterado'
  | 'status_alterado'
  | 'fornecedor_criado'
  | 'fornecedor_homologado'
  | 'contato_registrado'

export interface SupplierEvent {
  id: string
  supplierId: string
  data: string
  tipo: SupplierEventType
  titulo: string
  descricao: string
  link?: { label: string; path: string }
}

export interface SupplierDependencyRisk {
  categoria: SupplierCategoryId
  categoriaLabel: string
  supplierId: string
  supplierNome: string
  participacao: number
  risco: SupplierRiskLevel
}

export interface SupplierNetworkSummary {
  cadastrados: number
  ativos: number
  emAtencao: number
  bloqueados: number
  emHomologacao: number
  inativos: number
  categoriasAtendidas: number
  estrategicos: number
  comDivergenciasAbertas: number
  documentosProximosVencimento: number
  negociacoesAbertas: number
  valorCompradoPeriodo: number
  valorComprado12Meses: number
  pontualidadeMedia: number
  conformidadeQuantidadeMedia: number
  conformidadePrecoMedia: number
  conformidadeQualidadeMedia: number
}
