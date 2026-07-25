export interface InventoryCmvImpactRow {
  id: string
  itemId: string
  unitId: string
  diferenca: number
  unidadeMedida: string
  impacto: number
  confianca: 'alta' | 'media' | 'baixa'
  causaProvavel: string
}

/**
 * Divergências com impacto identificado no CMV (seção 18 do briefing).
 * O impacto aqui reflete a análise de causa já publicada no módulo de
 * CMV (src/data/cmv/cmvCauses.ts) — não é uma reconstituição literal de
 * "quantidade × custo médio do item", da mesma forma que o módulo de
 * CMV já trata "impacto" como o valor atribuído à causa, não como
 * avaliação simples de estoque.
 */
export const inventoryCmvImpactRows: InventoryCmvImpactRow[] = [
  {
    id: 'cmv-impact-carne-moinhos',
    itemId: 'carne-bovina-blend',
    unitId: 'moinhos',
    diferenca: -38,
    unidadeMedida: 'kg',
    impacto: 2430,
    confianca: 'alta',
    causaProvavel: 'Consumo acima do teórico — ver causa "Porcionamento de carnes acima da ficha técnica" no módulo de CMV',
  },
  {
    id: 'cmv-impact-chope-zona-norte',
    itemId: 'chope-ipa',
    unitId: 'zona-norte',
    diferenca: -52,
    unidadeMedida: 'litros',
    impacto: 1280,
    confianca: 'media',
    causaProvavel: 'Transferência pendente — TR-2041 ainda em trânsito',
  },
  {
    id: 'cmv-impact-oleo-moinhos',
    itemId: 'oleo-soja',
    unitId: 'moinhos',
    diferenca: -18,
    unidadeMedida: 'unidades',
    impacto: 610,
    confianca: 'media',
    causaProvavel: 'Divergência de contagem ainda sem justificativa',
  },
]

export const inventoryCmvImpactTotal = inventoryCmvImpactRows.reduce((sum, r) => sum + r.impacto, 0)
