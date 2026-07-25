/**
 * Tipos do modulo de Estoque e Inventarios. Independentes dos tipos de
 * CMV/unitProfile — o modulo tem seu proprio vocabulario de confianca e
 * status, mais granular que o generico IndicatorStatus.
 */

export type InventoryConfidenceLevel = 'alta' | 'media' | 'baixa' | 'insuficiente'

export type InventoryItemStatus =
  | 'normal'
  | 'abaixo_minimo'
  | 'risco_ruptura'
  | 'excesso'
  | 'sem_movimentacao'
  | 'divergente'
  | 'dados_insuficientes'

export type InventoryLocationType =
  | 'estoque_seco'
  | 'estoque_refrigerado'
  | 'estoque_congelado'
  | 'camara_bebidas'
  | 'bar'
  | 'cozinha'
  | 'deposito_limpeza'
  | 'estoque_embalagens'

export type UnitOfMeasureId = 'kg' | 'g' | 'litro' | 'ml' | 'unidade' | 'caixa' | 'pacote' | 'fardo' | 'barril' | 'porcao'

export type MovementType =
  | 'entrada_recebimento'
  | 'saida_consumo'
  | 'saida_venda_teorica'
  | 'perda'
  | 'transferencia_enviada'
  | 'transferencia_recebida'
  | 'ajuste_positivo'
  | 'ajuste_negativo'
  | 'devolucao_fornecedor'
  | 'producao'
  | 'consumo_interno'
  | 'bloqueio'
  | 'desbloqueio'
  | 'inventario'
  | 'estorno'

export type MovementStatus = 'confirmado' | 'pendente' | 'estornado' | 'aguardando_aprovacao'

export type TransferStatus = 'solicitada' | 'aprovada' | 'separada' | 'enviada' | 'em_transito' | 'recebida' | 'conferida' | 'concluida' | 'divergente'

export type LossReason =
  | 'validade'
  | 'quebra'
  | 'armazenamento'
  | 'preparo'
  | 'rendimento'
  | 'descarte'
  | 'avaria'
  | 'erro_operacional'
  | 'consumo_interno'
  | 'causa_nao_identificada'

export type LossStatus = 'registrada' | 'aguardando_validacao' | 'validada'

export type InventoryCountStatus = 'planejado' | 'preparado' | 'em_contagem' | 'em_conferencia' | 'com_divergencias' | 'aprovado' | 'fechado' | 'interrompido'

export type InventoryCountType = 'diario' | 'semanal' | 'mensal' | 'rotativo' | 'extraordinario' | 'por_categoria' | 'por_local' | 'por_item_critico'

export type CountItemStatus = 'pendente' | 'contado' | 'recontagem_solicitada' | 'nao_encontrado' | 'inacessivel' | 'justificado' | 'aprovado'

export interface UnitConversion {
  de: UnitOfMeasureId
  para: UnitOfMeasureId
  fator: number
  observacao?: string
}

export interface InventoryLocation {
  id: string
  unitId: string
  tipo: InventoryLocationType
  nome: string
  valor: number
  itens: number
  ultimaContagem: string
  responsavel: string
  confianca: InventoryConfidenceLevel
  divergencias: number
  temperaturaSimulada?: string
}

export interface InventoryItem {
  id: string
  nome: string
  categoriaId: string
  categoria: string
  unidadeMedida: UnitOfMeasureId
  custoMedio: number
  fornecedorPrincipal: string
  produtosRelacionados: string[]
}

export interface InventoryPosition {
  itemId: string
  unitId: string
  localId: string
  saldoSistemico: number
  saldoContado: number | null
  quantidadeReservada: number
  quantidadeBloqueada: number
  quantidadeEmTransito: number
  estoqueMinimo: number
  estoqueMaximo: number
  consumoMedioDiario: number
  prazoMedioReposicaoDias: number
  estoqueSeguranca: number
  ultimaMovimentacao: string
  ultimaContagem: string | null
  confianca: InventoryConfidenceLevel
  motivosConfianca: string[]
  status: InventoryItemStatus
}

export interface InventoryMovement {
  id: string
  itemId: string
  quantidade: number
  unidadeMedida: UnitOfMeasureId
  custoUnitario: number
  valorTotal: number
  tipo: MovementType
  unitId: string
  localId: string
  data: string
  usuario: string
  origem: string
  documentoRelacionado?: string
  motivo?: string
  observacao?: string
  status: MovementStatus
  reversaoDeId?: string
}

export interface InventoryCountItem {
  itemId: string
  saldoSistemico: number
  primeiraContagem: number | null
  segundaContagem: number | null
  custo: number
  status: CountItemStatus
  justificativa?: string
  observacao?: string
  lote?: string
  validade?: string
}

export interface InventoryCount {
  id: string
  titulo: string
  unitId: string
  localId: string
  tipo: InventoryCountType
  status: InventoryCountStatus
  dataPrevista: string
  inicio?: string
  prazo: string
  responsavel: string
  contadores: string[]
  itensPrevistos: number
  /** Totais oficiais do inventário — a amostra em `itens` é demonstrativa, não a enumeração completa. */
  itensContados: number
  itensRecontagem: number
  divergenciaProvisoria: number
  contagemCega: boolean
  itens: InventoryCountItem[]
  fechamento?: {
    fechadoPor: string
    dataFechamento: string
    observacao?: string
  }
}

export interface InventoryTransfer {
  id: string
  itemId: string
  origemUnitId: string
  destinoUnitId: string
  quantidadeEnviada: number
  quantidadeRecebida: number | null
  unidadeMedida: UnitOfMeasureId
  valor: number
  solicitante: string
  prioridade: 'critica' | 'alta' | 'media'
  prazoLabel: string
  status: TransferStatus
  motivo: string
  observacao?: string
  criadaEm: string
}

export interface InventoryLoss {
  id: string
  itemId: string
  unitId: string
  localId: string
  quantidade: number
  unidadeMedida: UnitOfMeasureId
  custoUnitario: number
  valor: number
  motivo: LossReason
  descricao: string
  responsavel: string
  data: string
  lote?: string
  validade?: string
  status: LossStatus
  acaoCorretiva?: string
}

export interface InventoryCategorySummary {
  id: string
  categoria: string
  valor: number
  itens: number
  tendencia: 'up' | 'down' | 'flat'
  giroMedio: number
  alertas: number
}
