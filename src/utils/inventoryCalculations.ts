/**
 * Formulas do modulo de Estoque. Nenhum componente visual deve calcular
 * saldo disponivel, divergencia, acuracidade, cobertura ou giro
 * diretamente — sempre via estas funcoes.
 */
import type { InventoryPosition } from '@/types'

export function calcularSaldoDisponivel(saldoSistemico: number, quantidadeReservada: number, quantidadeBloqueada: number): number {
  return saldoSistemico - quantidadeReservada - quantidadeBloqueada
}

export function calcularDivergenciaInventario(saldoContado: number, saldoSistemico: number): number {
  return saldoContado - saldoSistemico
}

/** Protegida contra divisao por zero — retorna null quando o saldo sistemico for zero. */
export function calcularAcuracidade(saldoContado: number, saldoSistemico: number): number | null {
  if (saldoSistemico === 0) return null
  const divergencia = calcularDivergenciaInventario(saldoContado, saldoSistemico)
  return 1 - Math.abs(divergencia) / saldoSistemico
}

/** Retorna null (cobertura indefinida) quando o consumo medio diario for zero. */
export function calcularCobertura(saldoDisponivel: number, consumoMedioDiario: number): number | null {
  if (consumoMedioDiario <= 0) return null
  return saldoDisponivel / consumoMedioDiario
}

export function calcularGiro(consumoPeriodo: number, estoqueMedio: number): number | null {
  if (estoqueMedio <= 0) return null
  return consumoPeriodo / estoqueMedio
}

export function calcularEstoqueMedio(estoqueInicial: number, estoqueFinal: number): number {
  return (estoqueInicial + estoqueFinal) / 2
}

export function calcularPontoReposicao(consumoMedioDiario: number, prazoMedioReposicaoDias: number, estoqueSeguranca: number): number {
  return consumoMedioDiario * prazoMedioReposicaoDias + estoqueSeguranca
}

export function calcularValorPosicao(saldoSistemico: number, custoMedio: number): number {
  return saldoSistemico * custoMedio
}

export function calcularImpactoDivergencia(divergencia: number, custoUnitario: number): number {
  return divergencia * custoUnitario
}

/** Deriva o status operacional (normal/abaixo do minimo/risco de ruptura/...) a partir da posicao. */
export function classificarStatusPosicao(position: {
  saldoDisponivel: number
  estoqueMinimo: number
  estoqueMaximo: number
  cobertura: number | null
  prazoMedioReposicaoDias: number
  diasSemMovimentacao: number
  divergencia: number
  confianca: 'alta' | 'media' | 'baixa' | 'insuficiente'
}): 'normal' | 'abaixo_minimo' | 'risco_ruptura' | 'excesso' | 'sem_movimentacao' | 'divergente' | 'dados_insuficientes' {
  if (position.confianca === 'insuficiente') return 'dados_insuficientes'
  if (Math.abs(position.divergencia) > 0) return 'divergente'
  if (position.cobertura !== null && position.cobertura <= position.prazoMedioReposicaoDias) return 'risco_ruptura'
  if (position.saldoDisponivel < position.estoqueMinimo) return 'abaixo_minimo'
  if (position.diasSemMovimentacao >= 30) return 'sem_movimentacao'
  if (position.saldoDisponivel > position.estoqueMaximo) return 'excesso'
  return 'normal'
}

export function calcularDiasSemMovimentacao(ultimaMovimentacaoIso: string, agoraIso: string): number {
  const diffMs = new Date(agoraIso).getTime() - new Date(ultimaMovimentacaoIso).getTime()
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)))
}

/** Converte uma quantidade entre unidades de medida usando os fatores de conversao cadastrados (nunca genericos). */
export function converterQuantidade(quantidade: number, fator: number): number {
  return quantidade * fator
}

export interface InventoryPositionComputed {
  saldoDisponivel: number
  divergencia: number | null
  acuracidade: number | null
  cobertura: number | null
  valorSistemico: number
  valorContado: number | null
  impactoDivergencia: number | null
  pontoReposicao: number
}

export function computeInventoryPosition(position: InventoryPosition, custoMedio: number): InventoryPositionComputed {
  const saldoDisponivel = calcularSaldoDisponivel(position.saldoSistemico, position.quantidadeReservada, position.quantidadeBloqueada)
  const divergencia = position.saldoContado !== null ? calcularDivergenciaInventario(position.saldoContado, position.saldoSistemico) : null
  const acuracidade = position.saldoContado !== null ? calcularAcuracidade(position.saldoContado, position.saldoSistemico) : null
  const cobertura = calcularCobertura(saldoDisponivel, position.consumoMedioDiario)
  const valorSistemico = calcularValorPosicao(position.saldoSistemico, custoMedio)
  const valorContado = position.saldoContado !== null ? calcularValorPosicao(position.saldoContado, custoMedio) : null
  const impactoDivergencia = divergencia !== null ? calcularImpactoDivergencia(divergencia, custoMedio) : null
  const pontoReposicao = calcularPontoReposicao(position.consumoMedioDiario, position.prazoMedioReposicaoDias, position.estoqueSeguranca)

  return { saldoDisponivel, divergencia, acuracidade, cobertura, valorSistemico, valorContado, impactoDivergencia, pontoReposicao }
}
