import type { InventoryPosition } from '@/types'

const now = '2026-07-23T14:20:00-03:00'

/**
 * Posições demonstrativas item × unidade × local. A posição de Carne
 * bovina soma exatamente 1.240 kg / R$ 40.672 e estoque mínimo
 * consolidado de 860 kg (seção 24 do briefing); Chope IPA — Zona Norte
 * e o cenário de transferência de Serra reproduzem os exemplos exatos
 * das seções 16 e 40; Óleo de soja — Moinhos reproduz a seção 18
 * (−18 unidades × R$ 33,90 = R$ 610,20 ≈ R$ 610).
 */
export const inventoryPositions: InventoryPosition[] = [
  // Carne bovina — blend para hambúrguer (total: 1.240 kg | mínimo: 860 kg)
  {
    itemId: 'carne-bovina-blend', unitId: 'moinhos', localId: 'moinhos-estoque_refrigerado',
    saldoSistemico: 210, saldoContado: 172, quantidadeReservada: 8, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 180, estoqueMaximo: 260, consumoMedioDiario: 96, prazoMedioReposicaoDias: 2, estoqueSeguranca: 40,
    ultimaMovimentacao: '2026-07-22T19:10:00-03:00', ultimaContagem: '2026-07-17T18:00:00-03:00',
    confianca: 'baixa', motivosConfianca: ['Última contagem há 6 dias', 'Divergência de 38 kg ainda sem justificativa'],
    status: 'divergente',
  },
  {
    itemId: 'carne-bovina-blend', unitId: 'caxias-centro', localId: 'caxias-centro-estoque_refrigerado',
    saldoSistemico: 185, saldoContado: 179, quantidadeReservada: 5, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 150, estoqueMaximo: 220, consumoMedioDiario: 28, prazoMedioReposicaoDias: 2, estoqueSeguranca: 30,
    ultimaMovimentacao: '2026-07-22T17:40:00-03:00', ultimaContagem: '2026-07-19T18:00:00-03:00',
    confianca: 'media', motivosConfianca: ['Pequena divergência de 6 kg dentro da tolerância'],
    status: 'normal',
  },
  {
    itemId: 'carne-bovina-blend', unitId: 'zona-norte', localId: 'zona-norte-estoque_refrigerado',
    saldoSistemico: 140, saldoContado: 138, quantidadeReservada: 4, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 110, estoqueMaximo: 180, consumoMedioDiario: 18, prazoMedioReposicaoDias: 2, estoqueSeguranca: 25,
    ultimaMovimentacao: '2026-07-22T16:20:00-03:00', ultimaContagem: '2026-07-21T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'normal',
  },
  {
    itemId: 'carne-bovina-blend', unitId: 'cidade-baixa', localId: 'cidade-baixa-estoque_refrigerado',
    saldoSistemico: 230, saldoContado: 228, quantidadeReservada: 6, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 170, estoqueMaximo: 260, consumoMedioDiario: 22, prazoMedioReposicaoDias: 2, estoqueSeguranca: 30,
    ultimaMovimentacao: '2026-07-22T15:50:00-03:00', ultimaContagem: '2026-07-21T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'normal',
  },
  {
    itemId: 'carne-bovina-blend', unitId: 'serra', localId: 'serra-estoque_refrigerado',
    saldoSistemico: 260, saldoContado: 259, quantidadeReservada: 5, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 150, estoqueMaximo: 280, consumoMedioDiario: 20, prazoMedioReposicaoDias: 2, estoqueSeguranca: 25,
    ultimaMovimentacao: '2026-07-22T14:30:00-03:00', ultimaContagem: '2026-07-22T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'normal',
  },
  {
    itemId: 'carne-bovina-blend', unitId: 'caxias-norte', localId: 'caxias-norte-estoque_refrigerado',
    saldoSistemico: 215, saldoContado: null, quantidadeReservada: 6, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 100, estoqueMaximo: 200, consumoMedioDiario: 19, prazoMedioReposicaoDias: 2, estoqueSeguranca: 20,
    ultimaMovimentacao: '2026-07-20T12:00:00-03:00', ultimaContagem: null,
    confianca: 'insuficiente', motivosConfianca: ['Inventário semanal pendente há 7 dias'],
    status: 'dados_insuficientes',
  },

  // Chope IPA — cenário de risco de ruptura (Zona Norte) e transferência (Serra → Zona Norte)
  {
    itemId: 'chope-ipa', unitId: 'zona-norte', localId: 'zona-norte-camara_bebidas',
    saldoSistemico: 170, saldoContado: 170, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 200, estoqueMaximo: 500, consumoMedioDiario: 100, prazoMedioReposicaoDias: 3, estoqueSeguranca: 100,
    ultimaMovimentacao: '2026-07-23T11:00:00-03:00', ultimaContagem: '2026-07-21T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'risco_ruptura',
  },
  {
    itemId: 'chope-ipa', unitId: 'serra', localId: 'serra-camara_bebidas',
    saldoSistemico: 525, saldoContado: 522, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 200, estoqueMaximo: 600, consumoMedioDiario: 86, prazoMedioReposicaoDias: 3, estoqueSeguranca: 120,
    ultimaMovimentacao: '2026-07-22T20:00:00-03:00', ultimaContagem: '2026-07-22T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'normal',
  },
  {
    itemId: 'chope-ipa', unitId: 'cidade-baixa', localId: 'cidade-baixa-camara_bebidas',
    saldoSistemico: 300, saldoContado: null, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 180, estoqueMaximo: 450, consumoMedioDiario: 40, prazoMedioReposicaoDias: 3, estoqueSeguranca: 90,
    ultimaMovimentacao: '2026-07-22T18:30:00-03:00', ultimaContagem: '2026-07-15T18:00:00-03:00',
    confianca: 'media', motivosConfianca: ['Transferência TR-2038 aguardando conciliação'], status: 'divergente',
  },
  {
    itemId: 'chope-ipa', unitId: 'moinhos', localId: 'moinhos-camara_bebidas',
    saldoSistemico: 90, saldoContado: null, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 72,
    estoqueMinimo: 100, estoqueMaximo: 300, consumoMedioDiario: 35, prazoMedioReposicaoDias: 3, estoqueSeguranca: 60,
    ultimaMovimentacao: '2026-07-23T09:15:00-03:00', ultimaContagem: '2026-07-17T18:00:00-03:00',
    confianca: 'media', motivosConfianca: ['Transferência TR-2038 recebida com divergência de 8 L'], status: 'divergente',
  },
  {
    itemId: 'chope-ipa', unitId: 'caxias-centro', localId: 'caxias-centro-camara_bebidas',
    saldoSistemico: 150, saldoContado: 149, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 120, estoqueMaximo: 350, consumoMedioDiario: 30, prazoMedioReposicaoDias: 3, estoqueSeguranca: 70,
    ultimaMovimentacao: '2026-07-22T19:00:00-03:00', ultimaContagem: '2026-07-19T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'normal',
  },
  {
    itemId: 'chope-ipa', unitId: 'caxias-norte', localId: 'caxias-norte-camara_bebidas',
    saldoSistemico: 110, saldoContado: null, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 100, estoqueMaximo: 260, consumoMedioDiario: 22, prazoMedioReposicaoDias: 3, estoqueSeguranca: 50,
    ultimaMovimentacao: '2026-07-19T16:00:00-03:00', ultimaContagem: null,
    confianca: 'insuficiente', motivosConfianca: ['Inventário semanal pendente há 7 dias'], status: 'dados_insuficientes',
  },

  // Chope Pilsen — cobertura saudável
  {
    itemId: 'chope-pilsen', unitId: 'serra', localId: 'serra-camara_bebidas',
    saldoSistemico: 410, saldoContado: 408, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 180, estoqueMaximo: 480, consumoMedioDiario: 52, prazoMedioReposicaoDias: 3, estoqueSeguranca: 90,
    ultimaMovimentacao: '2026-07-22T20:10:00-03:00', ultimaContagem: '2026-07-22T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'normal',
  },
  {
    itemId: 'chope-pilsen', unitId: 'moinhos', localId: 'moinhos-camara_bebidas',
    saldoSistemico: 180, saldoContado: 178, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 120, estoqueMaximo: 320, consumoMedioDiario: 30, prazoMedioReposicaoDias: 3, estoqueSeguranca: 60,
    ultimaMovimentacao: '2026-07-22T18:40:00-03:00', ultimaContagem: '2026-07-17T18:00:00-03:00',
    confianca: 'media', motivosConfianca: ['Última contagem há 6 dias'], status: 'normal',
  },

  // Lúpulo demonstrativo
  {
    itemId: 'lupulo-demonstrativo', unitId: 'serra', localId: 'serra-estoque_seco',
    saldoSistemico: 28, saldoContado: 28, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 15, estoqueMaximo: 40, consumoMedioDiario: 1.2, prazoMedioReposicaoDias: 10, estoqueSeguranca: 5,
    ultimaMovimentacao: '2026-07-18T10:00:00-03:00', ultimaContagem: '2026-07-22T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'normal',
  },

  // Refrigerante cola
  {
    itemId: 'refrigerante-cola', unitId: 'cidade-baixa', localId: 'cidade-baixa-camara_bebidas',
    saldoSistemico: 480, saldoContado: 476, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 300, estoqueMaximo: 700, consumoMedioDiario: 68, prazoMedioReposicaoDias: 4, estoqueSeguranca: 120,
    ultimaMovimentacao: '2026-07-22T21:00:00-03:00', ultimaContagem: '2026-07-21T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'normal',
  },
  {
    itemId: 'refrigerante-cola', unitId: 'moinhos', localId: 'moinhos-camara_bebidas',
    saldoSistemico: 210, saldoContado: 205, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 240, estoqueMaximo: 600, consumoMedioDiario: 58, prazoMedioReposicaoDias: 4, estoqueSeguranca: 110,
    ultimaMovimentacao: '2026-07-22T19:30:00-03:00', ultimaContagem: '2026-07-17T18:00:00-03:00',
    confianca: 'media', motivosConfianca: ['Última contagem há 6 dias'], status: 'abaixo_minimo',
  },

  // Óleo de soja — Moinhos reproduz a seção 18 (−18 unidades × R$ 33,90 ≈ R$ 610)
  {
    itemId: 'oleo-soja', unitId: 'moinhos', localId: 'moinhos-estoque_seco',
    saldoSistemico: 140, saldoContado: 122, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 100, estoqueMaximo: 220, consumoMedioDiario: 12, prazoMedioReposicaoDias: 4, estoqueSeguranca: 30,
    ultimaMovimentacao: '2026-07-22T13:00:00-03:00', ultimaContagem: '2026-07-17T18:00:00-03:00',
    confianca: 'media', motivosConfianca: ['Divergência de 18 unidades ainda sem justificativa'], status: 'divergente',
  },
  {
    itemId: 'oleo-soja', unitId: 'cidade-baixa', localId: 'cidade-baixa-estoque_seco',
    saldoSistemico: 95, saldoContado: 94, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 90, estoqueMaximo: 180, consumoMedioDiario: 40, prazoMedioReposicaoDias: 4, estoqueSeguranca: 24,
    ultimaMovimentacao: '2026-07-22T14:00:00-03:00', ultimaContagem: '2026-07-21T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'risco_ruptura',
  },

  // Batata congelada
  {
    itemId: 'batata-congelada', unitId: 'caxias-centro', localId: 'caxias-centro-estoque_congelado',
    saldoSistemico: 240, saldoContado: 236, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 260, estoqueMaximo: 520, consumoMedioDiario: 92, prazoMedioReposicaoDias: 4, estoqueSeguranca: 100,
    ultimaMovimentacao: '2026-07-22T17:00:00-03:00', ultimaContagem: '2026-07-19T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'abaixo_minimo',
  },

  // Queijo cheddar
  {
    itemId: 'queijo-cheddar', unitId: 'moinhos', localId: 'moinhos-estoque_refrigerado',
    saldoSistemico: 68, saldoContado: 66, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 50, estoqueMaximo: 120, consumoMedioDiario: 8, prazoMedioReposicaoDias: 3, estoqueSeguranca: 18,
    ultimaMovimentacao: '2026-07-22T18:10:00-03:00', ultimaContagem: '2026-07-17T18:00:00-03:00',
    confianca: 'media', motivosConfianca: ['Última contagem há 6 dias'], status: 'normal',
  },

  // Alface americana
  {
    itemId: 'alface-americana', unitId: 'cidade-baixa', localId: 'cidade-baixa-estoque_seco',
    saldoSistemico: 32, saldoContado: 30, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 20, estoqueMaximo: 60, consumoMedioDiario: 6, prazoMedioReposicaoDias: 2, estoqueSeguranca: 8,
    ultimaMovimentacao: '2026-07-23T08:00:00-03:00', ultimaContagem: '2026-07-21T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'normal',
  },

  // Embalagem delivery
  {
    itemId: 'embalagem-delivery', unitId: 'cidade-baixa', localId: 'cidade-baixa-estoque_embalagens',
    saldoSistemico: 2400, saldoContado: 2380, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 1500, estoqueMaximo: 4000, consumoMedioDiario: 210, prazoMedioReposicaoDias: 5, estoqueSeguranca: 600,
    ultimaMovimentacao: '2026-07-23T10:00:00-03:00', ultimaContagem: '2026-07-21T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'normal',
  },

  // Itens de capital imobilizado — excesso / sem movimentação (seção 17)
  {
    itemId: 'molho-especial-5kg', unitId: 'cidade-baixa', localId: 'cidade-baixa-estoque_seco',
    saldoSistemico: 46, saldoContado: 46, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 6, estoqueMaximo: 12, consumoMedioDiario: 0.4, prazoMedioReposicaoDias: 7, estoqueSeguranca: 3,
    ultimaMovimentacao: '2026-06-02T10:00:00-03:00', ultimaContagem: '2026-07-21T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'sem_movimentacao',
  },
  {
    itemId: 'embalagem-promocional', unitId: 'caxias-centro', localId: 'caxias-centro-estoque_embalagens',
    saldoSistemico: 3200, saldoContado: 3200, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 200, estoqueMaximo: 600, consumoMedioDiario: 5, prazoMedioReposicaoDias: 6, estoqueSeguranca: 100,
    ultimaMovimentacao: '2026-05-28T10:00:00-03:00', ultimaContagem: '2026-07-19T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'excesso',
  },
  {
    itemId: 'cerveja-sazonal', unitId: 'cidade-baixa', localId: 'cidade-baixa-camara_bebidas',
    saldoSistemico: 340, saldoContado: 340, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 40, estoqueMaximo: 100, consumoMedioDiario: 2, prazoMedioReposicaoDias: 8, estoqueSeguranca: 15,
    ultimaMovimentacao: '2026-06-10T10:00:00-03:00', ultimaContagem: '2026-07-21T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'excesso',
  },
  {
    itemId: 'xarope', unitId: 'caxias-centro', localId: 'caxias-centro-bar',
    saldoSistemico: 58, saldoContado: 58, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 8, estoqueMaximo: 16, consumoMedioDiario: 0.3, prazoMedioReposicaoDias: 6, estoqueSeguranca: 3,
    ultimaMovimentacao: '2026-05-30T10:00:00-03:00', ultimaContagem: '2026-07-19T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'sem_movimentacao',
  },
  {
    itemId: 'produto-limpeza-especifico', unitId: 'cidade-baixa', localId: 'cidade-baixa-deposito_limpeza',
    saldoSistemico: 62, saldoContado: 62, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 10, estoqueMaximo: 20, consumoMedioDiario: 0.5, prazoMedioReposicaoDias: 7, estoqueSeguranca: 4,
    ultimaMovimentacao: '2026-06-05T10:00:00-03:00', ultimaContagem: '2026-07-21T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: [], status: 'excesso',
  },
  {
    itemId: 'insumo-descontinuado', unitId: 'caxias-centro', localId: 'caxias-centro-estoque_seco',
    saldoSistemico: 210, saldoContado: 210, quantidadeReservada: 0, quantidadeBloqueada: 0, quantidadeEmTransito: 0,
    estoqueMinimo: 0, estoqueMaximo: 0, consumoMedioDiario: 0, prazoMedioReposicaoDias: 0, estoqueSeguranca: 0,
    ultimaMovimentacao: '2026-04-14T10:00:00-03:00', ultimaContagem: '2026-07-19T18:00:00-03:00',
    confianca: 'alta', motivosConfianca: ['Insumo descontinuado — sem previsão de reposição'], status: 'sem_movimentacao',
  },
]

export function getPositionsByItem(itemId: string): InventoryPosition[] {
  return inventoryPositions.filter((p) => p.itemId === itemId)
}

export function getPositionsByUnit(unitId: string): InventoryPosition[] {
  return inventoryPositions.filter((p) => p.unitId === unitId)
}

export function getPosition(itemId: string, unitId: string): InventoryPosition | undefined {
  return inventoryPositions.find((p) => p.itemId === itemId && p.unitId === unitId)
}

export const inventoryNow = now
