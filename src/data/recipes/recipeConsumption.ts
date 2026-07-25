import type { RecipeConsumptionComparison, RecipeUnitComparisonRow } from '@/types'

/**
 * Consumo teórico versus real — Burger Costela (seção 30). 8.400
 * unidades vendidas × 180 g de blend = 1.512 kg teórico (bate
 * exatamente com a ficha técnica vigente); consumo real 1.672 kg;
 * diferença de 160 kg; impacto estimado R$ 3.420.
 */
export const burgerCostelaConsumption: RecipeConsumptionComparison = {
  recipeId: 'burger-costela',
  unidadesVendidas: 8400,
  consumoTeoricoKg: 1512,
  consumoRealKg: 1672,
  impacto: 3420,
  unidadesMaisAfetadas: ['Moinhos', 'Caxias Centro'],
  confianca: 'alta',
  historicoSemanal: [
    { semana: 'Sem. 1', teorico: 138, real: 142 },
    { semana: 'Sem. 2', teorico: 140, real: 148 },
    { semana: 'Sem. 3', teorico: 142, real: 158 },
    { semana: 'Sem. 4', teorico: 145, real: 162 },
    { semana: 'Sem. 5', teorico: 147, real: 168 },
    { semana: 'Sem. 6', teorico: 148, real: 172 },
    { semana: 'Sem. 7', teorico: 149, real: 174 },
    { semana: 'Sem. 8', teorico: 171, real: 173 },
  ],
}

/**
 * Comparação entre unidades (seção 31) — Serra é a referência interna
 * (menor diferença, porcionamento mais próximo da ficha).
 */
export const burgerCostelaUnitComparison: RecipeUnitComparisonRow[] = [
  { unitId: 'moinhos', quantidadePrevistaG: 432000, consumoEstimadoG: 502000, diferencaG: 70000, perdasG: 8000, cmvTeorico: 0.321, impacto: 1496 },
  { unitId: 'caxias-centro', quantidadePrevistaG: 360000, consumoEstimadoG: 415000, diferencaG: 55000, perdasG: 6000, cmvTeorico: 0.321, impacto: 1177 },
  { unitId: 'caxias-norte', quantidadePrevistaG: 108000, consumoEstimadoG: 123000, diferencaG: 15000, perdasG: 2000, cmvTeorico: 0.321, impacto: 321 },
  { unitId: 'cidade-baixa', quantidadePrevistaG: 234000, consumoEstimadoG: 244000, diferencaG: 10000, perdasG: 2500, cmvTeorico: 0.321, impacto: 214 },
  { unitId: 'zona-norte', quantidadePrevistaG: 216000, consumoEstimadoG: 224000, diferencaG: 8000, perdasG: 1800, cmvTeorico: 0.321, impacto: 171 },
  { unitId: 'serra', quantidadePrevistaG: 162000, consumoEstimadoG: 164000, diferencaG: 2000, perdasG: 900, cmvTeorico: 0.321, impacto: 43 },
]

export const burgerCostelaUnitComparisonInsight =
  'Serra apresenta consumo médio mais próximo da ficha. A diferença pode estar relacionada à rotina de porcionamento e inventário refrigerado.'
