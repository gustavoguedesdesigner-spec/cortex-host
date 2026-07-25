import type { RecipeCostItem } from '@/types'

/**
 * Visão de custos dos insumos — Óleo de soja recebe profundidade total
 * (seção 43): variação de +9,4%, 12 fichas afetadas, impacto mensal de
 * R$ 4.620. Reaproveita a mesma variação de preço já publicada no
 * módulo de CMV (Distribuidora Gaúcha, +9,4% no óleo).
 */
export const recipeCostItems: RecipeCostItem[] = [
  {
    id: 'oleo-de-soja',
    nome: 'Óleo de soja',
    unidadeMedida: 'unidade',
    custoAtual: 33.9,
    custoAnterior: 30.98,
    origem: 'ultimo_custo',
    fornecedor: 'Distribuidora Gaúcha',
    fichasAfetadas: ['batata-cheddar', 'porcao-onion-rings', 'burger-costela', 'tomahawk-burger', 'burger-bacon', 'burger-classico', 'burger-duplo', 'porcao-entrecot', 'costelinha-suina', 'salada-caesar', 'combo-costela-chope', 'sobremesa-especial'],
    ultimaAtualizacaoIso: '2026-07-15T10:00:00-03:00',
    confianca: 'alta',
    diasSemAtualizacao: 8,
  },
  {
    id: 'carne-bovina-blend',
    nome: 'Carne bovina — blend para hambúrguer',
    unidadeMedida: 'kg',
    custoAtual: 32.8,
    custoAnterior: 30.15,
    origem: 'custo_medio',
    fornecedor: 'Serra Alimentos',
    fichasAfetadas: ['burger-costela', 'tomahawk-burger', 'burger-bacon', 'burger-classico', 'burger-duplo'],
    ultimaAtualizacaoIso: '2026-06-01T10:00:00-03:00',
    confianca: 'alta',
    diasSemAtualizacao: 52,
  },
  {
    id: 'queijo-cheddar-custo',
    nome: 'Queijo cheddar',
    unidadeMedida: 'kg',
    custoAtual: 37,
    custoAnterior: 35.8,
    origem: 'ultimo_custo',
    fornecedor: 'Laticínios do Vale',
    fichasAfetadas: ['burger-costela', 'burger-duplo', 'batata-cheddar'],
    ultimaAtualizacaoIso: '2026-06-01T10:00:00-03:00',
    confianca: 'alta',
    diasSemAtualizacao: 52,
  },
  {
    id: 'bacon-custo',
    nome: 'Bacon',
    unidadeMedida: 'kg',
    custoAtual: 54.9,
    custoAnterior: 54.9,
    origem: 'custo_contratado',
    fornecedor: 'Serra Alimentos',
    fichasAfetadas: ['burger-costela', 'burger-bacon'],
    ultimaAtualizacaoIso: '2026-05-10T10:00:00-03:00',
    confianca: 'media',
    diasSemAtualizacao: 74,
  },
  {
    id: 'pao-brioche-custo',
    nome: 'Pão brioche',
    unidadeMedida: 'unidade',
    custoAtual: 2.1,
    custoAnterior: 1.95,
    origem: 'ultimo_custo',
    fornecedor: 'Panificadora Central',
    fichasAfetadas: ['burger-costela', 'tomahawk-burger', 'burger-bacon', 'burger-classico', 'burger-duplo'],
    ultimaAtualizacaoIso: '2026-05-20T10:00:00-03:00',
    confianca: 'alta',
    diasSemAtualizacao: 64,
  },
  {
    id: 'entrecot-custo',
    nome: 'Entrecot bovino',
    unidadeMedida: 'kg',
    custoAtual: 68.5,
    custoAnterior: 62.4,
    origem: 'custo_medio',
    fornecedor: 'Serra Alimentos',
    fichasAfetadas: ['porcao-entrecot'],
    ultimaAtualizacaoIso: '2026-05-03T10:00:00-03:00',
    confianca: 'media',
    diasSemAtualizacao: 81,
  },
  {
    id: 'batata-congelada-custo',
    nome: 'Batata congelada',
    unidadeMedida: 'kg',
    custoAtual: 8.6,
    custoAnterior: 8.6,
    origem: 'custo_definido_empresa',
    fornecedor: 'Hortifruti Bahia',
    fichasAfetadas: ['batata-cheddar', 'porcao-onion-rings'],
    ultimaAtualizacaoIso: '2026-03-01T10:00:00-03:00',
    confianca: 'baixa',
    diasSemAtualizacao: 144,
  },
]

export function getRecipeCostItemById(id: string): RecipeCostItem | undefined {
  return recipeCostItems.find((c) => c.id === id)
}

/** Custos desatualizados — sem atualização há mais de 30 dias (seção 41). */
export const staleCostItems = recipeCostItems.filter((c) => c.diasSemAtualizacao > 30)

export const oleoDeSojaImpactoMensal = 4620
