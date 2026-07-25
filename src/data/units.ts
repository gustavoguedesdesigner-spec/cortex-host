import type { Unit } from '@/types'

/**
 * DADOS SIMULADOS — UNIDADES (camada unica de mocks)
 * ---------------------------------------------------------------------
 * Os nomes de unidade sao DEMONSTRATIVOS e devem ser substituidos pelos
 * nomes reais da Salvador Brewing Co. apos validacao com o cliente.
 *
 * Os campos abaixo sao a fonte unica de verdade para toda a aplicacao —
 * Central de Operacoes, Visao das Unidades e Detalhe da Unidade leem
 * destes mesmos objetos. Nao duplicar numeros em outros arquivos.
 *
 * Valores fixos (nao gerados aleatoriamente). CMV, perdas e alertas
 * confirmam exatamente os numeros ja usados na Central de Operacoes:
 * soma de perdas = R$ 18.320, soma de alertas = 18, soma de estoque =
 * R$ 312.850. impactoFinanceiro por unidade bate exatamente com o
 * impacto por unidade do modulo de CMV (soma = R$ 27.460, identico ao
 * total de src/data/financial-impact.ts) — mesma fonte de verdade em
 * toda a aplicacao.
 * ---------------------------------------------------------------------
 */
export const units: Unit[] = [
  {
    id: 'moinhos',
    nome: 'Salvador Moinhos',
    nomeCurto: 'Moinhos',
    cidade: 'Salvador',
    endereco: 'Rua Fonte do Boi, 384 — Moinhos, Salvador/BA',
    regiao: 'Moinhos',
    gerente: 'Rafael Martins',
    telefone: '(71) 3245-1180',
    status: 'ativa',
    nivelAtencao: 'critico',
    dataAbertura: '2014-06-01',
    horarioFuncionamento: 'Todos os dias, 11h30 às 00h',
    areaEstoqueM2: 78,
    ultimaSincronizacao: '2026-07-23T14:20:00-03:00',
    ultimaContagem: '2026-07-17T18:00:00-03:00',
    proximaContagem: '2026-07-23T18:00:00-03:00',
    cmvTeorico: 0.321,
    cmvReal: 0.369,
    metaCmv: 0.325,
    vendas: 236400,
    numeroPedidos: 2570,
    ticketMedio: 92,
    impactoFinanceiro: 11320,
    compras: 92700,
    valorEstoque: 58600,
    perdas: 4860,
    perdasEstimadas: 5800,
    numeroAlertas: 5,
    pendencias: 2,
    divergenciasRecebimento: 3,
    produtosCriticos: 5,
    estoqueExcesso: 4,
    fornecedoresAtencao: 1,
    acoesAbertas: 2,
    acoesAtrasadas: 1,
    tendenciaOperacional: 'piorando',
    principalOcorrencia: 'Consumo de carne acima do previsto',
    tendenciaCmvReal: [0.324, 0.328, 0.339, 0.342, 0.351, 0.357, 0.363, 0.369],
  },
  {
    id: 'caxias-centro',
    nome: 'Salvador Caxias Centro',
    nomeCurto: 'Caxias Centro',
    cidade: 'Salvador',
    endereco: 'Av. Barros Reis, 900 — Caxias Centro, Salvador/BA',
    regiao: 'Caxias',
    gerente: 'Juliana Prado',
    telefone: '(71) 3245-2290',
    status: 'ativa',
    nivelAtencao: 'critico',
    dataAbertura: '2017-08-22',
    horarioFuncionamento: 'Ter. a dom., 11h30 às 23h30',
    areaEstoqueM2: 52,
    ultimaSincronizacao: '2026-07-23T14:18:00-03:00',
    ultimaContagem: '2026-07-19T18:00:00-03:00',
    proximaContagem: '2026-07-25T18:00:00-03:00',
    cmvTeorico: 0.318,
    cmvReal: 0.361,
    metaCmv: 0.325,
    vendas: 300000,
    numeroPedidos: 3846,
    ticketMedio: 78,
    impactoFinanceiro: 7210,
    compras: 52000,
    valorEstoque: 33000,
    perdas: 3940,
    perdasEstimadas: 4300,
    numeroAlertas: 4,
    pendencias: 2,
    divergenciasRecebimento: 2,
    produtosCriticos: 4,
    estoqueExcesso: 2,
    fornecedoresAtencao: 1,
    acoesAbertas: 1,
    acoesAtrasadas: 1,
    tendenciaOperacional: 'piorando',
    principalOcorrencia: 'Consumo de carne acima do previsto',
    tendenciaCmvReal: [0.325, 0.329, 0.334, 0.339, 0.345, 0.35, 0.356, 0.361],
  },
  {
    id: 'zona-norte',
    nome: 'Salvador Zona Norte',
    nomeCurto: 'Zona Norte',
    cidade: 'Salvador',
    endereco: 'Av. San Martin, 1500 — Zona Norte, Salvador/BA',
    regiao: 'Zona Norte',
    gerente: 'Patricia Lins',
    telefone: '(71) 3245-3310',
    status: 'ativa',
    nivelAtencao: 'atencao',
    dataAbertura: '2019-05-14',
    horarioFuncionamento: 'Ter. a dom., 11h30 às 23h30',
    areaEstoqueM2: 60,
    ultimaSincronizacao: '2026-07-23T14:25:00-03:00',
    ultimaContagem: '2026-07-21T18:00:00-03:00',
    proximaContagem: '2026-07-24T18:00:00-03:00',
    cmvTeorico: 0.32,
    cmvReal: 0.342,
    metaCmv: 0.325,
    vendas: 365000,
    numeroPedidos: 4345,
    ticketMedio: 84,
    impactoFinanceiro: 3180,
    compras: 63000,
    valorEstoque: 46000,
    perdas: 2870,
    perdasEstimadas: 3000,
    numeroAlertas: 3,
    pendencias: 1,
    divergenciasRecebimento: 0,
    produtosCriticos: 2,
    estoqueExcesso: 3,
    fornecedoresAtencao: 0,
    acoesAbertas: 1,
    acoesAtrasadas: 0,
    tendenciaOperacional: 'melhorando',
    principalOcorrencia: 'Risco de ruptura de chope IPA',
    tendenciaCmvReal: [0.352, 0.348, 0.344, 0.347, 0.343, 0.339, 0.34, 0.342],
  },
  {
    id: 'cidade-baixa',
    nome: 'Salvador Cidade Baixa',
    nomeCurto: 'Cidade Baixa',
    cidade: 'Salvador',
    endereco: 'Rua da Vala, 210 — Cidade Baixa, Salvador/BA',
    regiao: 'Cidade Baixa',
    gerente: 'Diego Andrade',
    telefone: '(71) 3245-4420',
    status: 'ativa',
    nivelAtencao: 'atencao',
    dataAbertura: '2015-11-02',
    horarioFuncionamento: 'Todos os dias, 11h30 às 00h',
    areaEstoqueM2: 70,
    ultimaSincronizacao: '2026-07-23T14:22:00-03:00',
    ultimaContagem: '2026-07-21T18:00:00-03:00',
    proximaContagem: '2026-07-26T18:00:00-03:00',
    cmvTeorico: 0.317,
    cmvReal: 0.336,
    metaCmv: 0.325,
    vendas: 510000,
    numeroPedidos: 5795,
    ticketMedio: 88,
    impactoFinanceiro: 2210,
    compras: 88000,
    valorEstoque: 68000,
    perdas: 2460,
    perdasEstimadas: 2600,
    numeroAlertas: 2,
    pendencias: 1,
    divergenciasRecebimento: 1,
    produtosCriticos: 2,
    estoqueExcesso: 6,
    fornecedoresAtencao: 0,
    acoesAbertas: 1,
    acoesAtrasadas: 0,
    tendenciaOperacional: 'estavel',
    principalOcorrencia: 'Risco de ruptura de chope IPA',
    tendenciaCmvReal: [0.319, 0.321, 0.324, 0.327, 0.33, 0.332, 0.334, 0.336],
  },
  {
    id: 'serra',
    nome: 'Salvador Serra',
    nomeCurto: 'Serra',
    cidade: 'Salvador',
    endereco: 'Rua Direita da Serra, 145 — Serra, Salvador/BA',
    regiao: 'Serra',
    gerente: 'Rafael Nunes',
    telefone: '(71) 3245-5530',
    status: 'ativa',
    nivelAtencao: 'saudavel',
    dataAbertura: '2020-02-18',
    horarioFuncionamento: 'Ter. a dom., 11h30 às 23h30',
    areaEstoqueM2: 64,
    ultimaSincronizacao: '2026-07-23T14:30:00-03:00',
    ultimaContagem: '2026-07-22T18:00:00-03:00',
    proximaContagem: '2026-07-29T18:00:00-03:00',
    cmvTeorico: 0.314,
    cmvReal: 0.318,
    metaCmv: 0.325,
    vendas: 430000,
    numeroPedidos: 4526,
    ticketMedio: 95,
    impactoFinanceiro: 520,
    compras: 75000,
    valorEstoque: 58000,
    perdas: 1620,
    perdasEstimadas: 1650,
    numeroAlertas: 1,
    pendencias: 0,
    divergenciasRecebimento: 0,
    produtosCriticos: 1,
    estoqueExcesso: 2,
    fornecedoresAtencao: 0,
    acoesAbertas: 0,
    acoesAtrasadas: 0,
    tendenciaOperacional: 'estavel',
    tendenciaCmvReal: [0.323, 0.321, 0.32, 0.319, 0.319, 0.318, 0.318, 0.318],
  },
  {
    id: 'caxias-norte',
    nome: 'Salvador Caxias Norte',
    nomeCurto: 'Caxias Norte',
    cidade: 'Salvador',
    endereco: 'Av. Caxias Norte, 610 — Caxias Norte, Salvador/BA',
    regiao: 'Caxias',
    gerente: 'Bruno Teles',
    telefone: '(71) 3245-6640',
    status: 'ativa',
    nivelAtencao: 'atencao',
    dataAbertura: '2021-09-07',
    horarioFuncionamento: 'Ter. a dom., 11h30 às 23h30',
    areaEstoqueM2: 46,
    ultimaSincronizacao: '2026-07-23T14:15:00-03:00',
    ultimaContagem: '2026-07-16T18:00:00-03:00',
    proximaContagem: '2026-07-23T18:00:00-03:00',
    cmvTeorico: 0.323,
    cmvReal: 0.339,
    metaCmv: 0.325,
    vendas: 250000,
    numeroPedidos: 3378,
    ticketMedio: 74,
    impactoFinanceiro: 3020,
    compras: 40700,
    valorEstoque: 23850,
    perdas: 2570,
    perdasEstimadas: 3200,
    numeroAlertas: 3,
    pendencias: 1,
    divergenciasRecebimento: 1,
    produtosCriticos: 3,
    estoqueExcesso: 2,
    fornecedoresAtencao: 1,
    acoesAbertas: 1,
    acoesAtrasadas: 0,
    tendenciaOperacional: 'estavel',
    principalOcorrencia: 'Contagem semanal pendente',
    tendenciaCmvReal: [0.32, 0.323, 0.327, 0.33, 0.333, 0.335, 0.337, 0.339],
  },
]

export function getUnitById(id: string): Unit | undefined {
  return units.find((u) => u.id === id)
}

/** Resolve o id da unidade a partir do nome completo (ex.: "Salvador Moinhos" -> "moinhos"). */
export function getUnitIdByName(nome: string): string | undefined {
  return units.find((u) => u.nome === nome)?.id
}

export function getTotals() {
  return units.reduce(
    (acc, u) => {
      acc.vendas += u.vendas
      acc.compras += u.compras
      acc.valorEstoque += u.valorEstoque
      acc.perdas += u.perdas
      acc.numeroAlertas += u.numeroAlertas
      acc.impactoFinanceiro += u.impactoFinanceiro
      return acc
    },
    { vendas: 0, compras: 0, valorEstoque: 0, perdas: 0, numeroAlertas: 0, impactoFinanceiro: 0 },
  )
}

/** CMV real medio ponderado por vendas (mais representativo que media simples) */
export function getCmvRealConsolidado(): number {
  const totalVendas = units.reduce((sum, u) => sum + u.vendas, 0)
  const custoRealTotal = units.reduce((sum, u) => sum + u.vendas * u.cmvReal, 0)
  return custoRealTotal / totalVendas
}

export function getCmvTeoricoConsolidado(): number {
  const totalVendas = units.reduce((sum, u) => sum + u.vendas, 0)
  const custoTeoricoTotal = units.reduce((sum, u) => sum + u.vendas * u.cmvTeorico, 0)
  return custoTeoricoTotal / totalVendas
}

export function getUnidadesOrdenadasPorCriticidade(): Unit[] {
  return [...units].sort((a, b) => b.cmvReal - b.cmvTeorico - (a.cmvReal - a.cmvTeorico))
}
