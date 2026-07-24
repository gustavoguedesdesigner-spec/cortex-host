import type { FinancialImpactCategory } from '@/types'

/**
 * Composicao do impacto financeiro total (R$ 27.460) entre CMV real e
 * teorico no periodo. A soma das categorias corresponde exatamente ao
 * total apresentado no indicador "Diferenca financeira".
 */
export const financialImpactCategories: FinancialImpactCategory[] = [
  { id: 'carnes', categoria: 'Carnes', valor: 10820, tendencia: 'up', unidadePrincipal: 'Salvador Moinhos' },
  { id: 'chope', categoria: 'Chope', valor: 5460, tendencia: 'up', unidadePrincipal: 'Salvador Caxias Centro' },
  { id: 'oleos', categoria: 'Óleos e frituras', valor: 4620, tendencia: 'up', unidadePrincipal: 'Salvador Zona Norte' },
  { id: 'hortifruti', categoria: 'Hortifrúti', valor: 2940, tendencia: 'flat', unidadePrincipal: 'Salvador Cidade Baixa' },
  { id: 'laticinios', categoria: 'Laticínios', valor: 2160, tendencia: 'down', unidadePrincipal: 'Salvador Serra' },
  { id: 'outros', categoria: 'Outros', valor: 1460, tendencia: 'flat', unidadePrincipal: 'Salvador Caxias Norte' },
]

export const financialImpactTotal = financialImpactCategories.reduce((sum, c) => sum + c.valor, 0)
