import type { PurchaseSummary, SupplierAlert } from '@/types'

export const purchaseSummary: PurchaseSummary = {
  totalComprado: 428700,
  pedidosEmAberto: 14,
  requisicoesAguardandoAprovacao: 4,
  comprasEmergenciais: 3,
  valorEmDivergencia: 18400,
}

export const supplierAlerts: SupplierAlert[] = [
  {
    id: 'sup1',
    nome: 'Serra Alimentos',
    aumentoPreco: 0.087,
    divergencias: 4,
    atrasoMedioDias: 1.8,
    status: 'critico',
  },
  {
    id: 'sup2',
    nome: 'Distribuidora Gaúcha',
    aumentoPreco: 0.052,
    divergencias: 2,
    status: 'atencao',
  },
  {
    id: 'sup3',
    nome: 'Vale Hortifruti',
    atrasoRecorrente: true,
    entregasIncompletas: 2,
    status: 'atencao',
  },
]
