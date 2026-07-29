import type { PurchaseSummary, SupplierAlert } from '@/types'

export const purchaseSummary: PurchaseSummary = {
  totalComprado: 428700,
  pedidosEmAberto: 14,
  requisicoesAguardandoAprovacao: 4,
  comprasEmergenciais: 3,
  valorEmDivergencia: 18400,
}

/** id bate com src/data/suppliers/suppliers.ts (módulo Fornecedores) — permite navegar direto ao cadastro completo. */
export const supplierAlerts: SupplierAlert[] = [
  {
    id: 'serra-alimentos',
    nome: 'Serra Alimentos',
    aumentoPreco: 0.087,
    divergencias: 4,
    atrasoMedioDias: 1.8,
    status: 'critico',
  },
  {
    id: 'distribuidora-gaucha',
    nome: 'Distribuidora Gaúcha',
    aumentoPreco: 0.052,
    divergencias: 2,
    status: 'atencao',
  },
  {
    id: 'hortifruti-bahia',
    nome: 'Hortifruti Bahia',
    atrasoRecorrente: true,
    entregasIncompletas: 2,
    status: 'atencao',
  },
]
