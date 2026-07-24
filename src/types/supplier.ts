export type SupplierStatus = 'critico' | 'atencao'

export interface SupplierAlert {
  id: string
  nome: string
  aumentoPreco?: number
  divergencias?: number
  atrasoMedioDias?: number
  entregasIncompletas?: number
  atrasoRecorrente?: boolean
  status: SupplierStatus
}

export interface PurchaseSummary {
  totalComprado: number
  pedidosEmAberto: number
  requisicoesAguardandoAprovacao: number
  comprasEmergenciais: number
  valorEmDivergencia: number
}
