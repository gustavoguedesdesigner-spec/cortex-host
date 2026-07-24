/**
 * Tipos relacionados a unidades operacionais (lojas/filiais).
 */

export type AttentionLevel = 'saudavel' | 'atencao' | 'critico'

export type UnitStatus = 'ativa' | 'inativa' | 'em_implantacao'

export type OperationalTrend = 'melhorando' | 'piorando' | 'estavel'

export interface Unit {
  id: string
  nome: string
  nomeCurto: string
  cidade: string
  endereco: string
  regiao: string
  gerente: string
  telefone: string
  status: UnitStatus
  nivelAtencao: AttentionLevel
  dataAbertura: string
  horarioFuncionamento: string
  areaEstoqueM2: number
  ultimaSincronizacao: string
  ultimaContagem: string
  proximaContagem: string
  /** CMV teorico esperado, em percentual (ex.: 0.312 = 31,2%) */
  cmvTeorico: number
  /** CMV real apurado, em percentual */
  cmvReal: number
  metaCmv: number
  /** Vendas do periodo selecionado, em reais */
  vendas: number
  numeroPedidos: number
  ticketMedio: number
  /** Impacto financeiro estimado da diferenca CMV real/teorico, em reais */
  impactoFinanceiro: number
  /** Compras do periodo selecionado, em reais */
  compras: number
  /** Valor total em estoque, em reais */
  valorEstoque: number
  /** Perdas apuradas no periodo, em reais */
  perdas: number
  perdasEstimadas: number
  /** Numero de alertas ativos para a unidade */
  numeroAlertas: number
  pendencias: number
  divergenciasRecebimento: number
  produtosCriticos: number
  estoqueExcesso: number
  fornecedoresAtencao: number
  acoesAbertas: number
  acoesAtrasadas: number
  tendenciaOperacional: OperationalTrend
  principalOcorrencia?: string
  /** Serie curta (8 semanas) de CMV real, usada na mini-tendência dos cards de unidade */
  tendenciaCmvReal: number[]
}
