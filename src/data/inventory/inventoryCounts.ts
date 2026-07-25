import type { InventoryCount } from '@/types'

/**
 * Inventário de demonstração principal — reproduz exatamente a seção 30
 * do briefing (42 previstos, 31 contados, 11 pendentes, progresso 74%,
 * responsável Rafael Martins, dois contadores, divergência provisória
 * de R$ 3.280, cinco itens exigindo recontagem, contagem cega ativada).
 * `itens` é uma amostra demonstrativa — os totais acima são os valores
 * oficiais exibidos na UI.
 */
export const inventoryCounts: InventoryCount[] = [
  {
    id: 'inv-moinhos-0726',
    titulo: 'Inventário semanal — Estoque refrigerado — Moinhos',
    unitId: 'moinhos',
    localId: 'moinhos-estoque_refrigerado',
    tipo: 'semanal',
    status: 'em_contagem',
    dataPrevista: '2026-07-23T16:00:00-03:00',
    inicio: '2026-07-23T16:20:00-03:00',
    prazo: '2026-07-23T18:00:00-03:00',
    responsavel: 'Rafael Martins',
    contadores: ['Rafael Martins', 'Equipe da cozinha'],
    itensPrevistos: 42,
    itensContados: 31,
    itensRecontagem: 5,
    divergenciaProvisoria: 3280,
    contagemCega: true,
    itens: [
      { itemId: 'carne-bovina-blend', saldoSistemico: 210, primeiraContagem: 172, segundaContagem: null, custo: 32.8, status: 'recontagem_solicitada' },
      { itemId: 'queijo-cheddar', saldoSistemico: 68, primeiraContagem: 60, segundaContagem: null, custo: 38.4, status: 'recontagem_solicitada' },
      { itemId: 'oleo-soja', saldoSistemico: 140, primeiraContagem: 120, segundaContagem: null, custo: 33.9, status: 'recontagem_solicitada' },
      { itemId: 'batata-congelada', saldoSistemico: 90, primeiraContagem: 55, segundaContagem: null, custo: 8.6, status: 'recontagem_solicitada' },
      { itemId: 'molho-especial-5kg', saldoSistemico: 10, primeiraContagem: 4, segundaContagem: null, custo: 84, status: 'recontagem_solicitada' },
      { itemId: 'chope-pilsen', saldoSistemico: 180, primeiraContagem: 178, segundaContagem: null, custo: 9.8, status: 'contado' },
      { itemId: 'porco-suino-corte', saldoSistemico: 40, primeiraContagem: 39, segundaContagem: null, custo: 24.5, status: 'contado' },
      { itemId: 'refrigerante-cola', saldoSistemico: 210, primeiraContagem: 205, segundaContagem: null, custo: 3.9, status: 'contado' },
      { itemId: 'embalagem-delivery', saldoSistemico: 320, primeiraContagem: null, segundaContagem: null, custo: 1.8, status: 'pendente' },
      { itemId: 'xarope', saldoSistemico: 18, primeiraContagem: null, segundaContagem: null, custo: 22, status: 'pendente' },
    ],
  },
  {
    id: 'inv-caxias-norte-0716',
    titulo: 'Inventário semanal — Estoque geral — Caxias Norte',
    unitId: 'caxias-norte',
    localId: 'caxias-norte-estoque_seco',
    tipo: 'semanal',
    status: 'planejado',
    dataPrevista: '2026-07-16T18:00:00-03:00',
    prazo: '2026-07-16T20:00:00-03:00',
    responsavel: 'Bruno Teles',
    contadores: ['Bruno Teles'],
    itensPrevistos: 38,
    itensContados: 0,
    itensRecontagem: 0,
    divergenciaProvisoria: 0,
    contagemCega: true,
    itens: [],
  },
  {
    id: 'inv-cidade-baixa-0722',
    titulo: 'Inventário rotativo — Câmara de bebidas — Cidade Baixa',
    unitId: 'cidade-baixa',
    localId: 'cidade-baixa-camara_bebidas',
    tipo: 'rotativo',
    status: 'com_divergencias',
    dataPrevista: '2026-07-22T15:00:00-03:00',
    inicio: '2026-07-22T15:10:00-03:00',
    prazo: '2026-07-22T17:00:00-03:00',
    responsavel: 'Diego Andrade',
    contadores: ['Diego Andrade', 'Equipe do bar'],
    itensPrevistos: 18,
    itensContados: 18,
    itensRecontagem: 1,
    divergenciaProvisoria: 640,
    contagemCega: true,
    itens: [{ itemId: 'chope-ipa', saldoSistemico: 300, primeiraContagem: 284, segundaContagem: 286, custo: 12.4, status: 'justificado', justificativa: 'transferencia_pendente' }],
  },
  {
    id: 'inv-zona-norte-0721',
    titulo: 'Inventário por item crítico — Chope IPA — Zona Norte',
    unitId: 'zona-norte',
    localId: 'zona-norte-camara_bebidas',
    tipo: 'por_item_critico',
    status: 'fechado',
    dataPrevista: '2026-07-21T18:00:00-03:00',
    inicio: '2026-07-21T18:00:00-03:00',
    prazo: '2026-07-21T19:00:00-03:00',
    responsavel: 'Patrícia Lins',
    contadores: ['Patrícia Lins'],
    itensPrevistos: 1,
    itensContados: 1,
    itensRecontagem: 0,
    divergenciaProvisoria: 0,
    contagemCega: true,
    itens: [{ itemId: 'chope-ipa', saldoSistemico: 170, primeiraContagem: 170, segundaContagem: null, custo: 12.4, status: 'aprovado' }],
    fechamento: { fechadoPor: 'Patrícia Lins', dataFechamento: '2026-07-21T19:05:00-03:00', observacao: 'Sem divergências — confirma risco de ruptura real.' },
  },
  {
    id: 'inv-serra-0722',
    titulo: 'Inventário semanal — Estoque refrigerado — Serra',
    unitId: 'serra',
    localId: 'serra-estoque_refrigerado',
    tipo: 'semanal',
    status: 'fechado',
    dataPrevista: '2026-07-22T18:00:00-03:00',
    inicio: '2026-07-22T18:00:00-03:00',
    prazo: '2026-07-22T19:00:00-03:00',
    responsavel: 'Rafael Nunes',
    contadores: ['Rafael Nunes'],
    itensPrevistos: 22,
    itensContados: 22,
    itensRecontagem: 0,
    divergenciaProvisoria: 40,
    contagemCega: true,
    itens: [],
    fechamento: { fechadoPor: 'Rafael Nunes', dataFechamento: '2026-07-22T19:10:00-03:00' },
  },
  {
    id: 'inv-caxias-centro-0719',
    titulo: 'Inventário mensal — Estoque de embalagens — Caxias Centro',
    unitId: 'caxias-centro',
    localId: 'caxias-centro-estoque_embalagens',
    tipo: 'mensal',
    status: 'aprovado',
    dataPrevista: '2026-07-19T18:00:00-03:00',
    inicio: '2026-07-19T18:00:00-03:00',
    prazo: '2026-07-19T20:00:00-03:00',
    responsavel: 'Juliana Prado',
    contadores: ['Juliana Prado'],
    itensPrevistos: 12,
    itensContados: 12,
    itensRecontagem: 1,
    divergenciaProvisoria: 0,
    contagemCega: true,
    itens: [{ itemId: 'embalagem-promocional', saldoSistemico: 3200, primeiraContagem: 3200, segundaContagem: 3200, custo: 2.4, status: 'aprovado', justificativa: 'erro_contagem' }],
  },
]

export function getInventoryCountById(id: string): InventoryCount | undefined {
  return inventoryCounts.find((c) => c.id === id)
}

export function getInventoryCountsByUnit(unitId: string): InventoryCount[] {
  return inventoryCounts.filter((c) => c.unitId === unitId)
}

/** Tolerância demonstrativa para exigir recontagem (seção 32). */
export const recountTolerance = { percentual: 0.03, valor: 100 }
