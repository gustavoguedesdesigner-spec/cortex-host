import type { CmvConfidenceLevel, CmvMatrixCell } from '@/types'
import { cmvCategories } from './cmvCategories'

/**
 * Matriz unidade x categoria. Cada linha soma exatamente ao impacto por
 * unidade (src/data/cmv/cmvUnitImpact.ts) e cada coluna soma exatamente
 * ao impacto por categoria (src/data/cmv/cmvCategories.ts) — os mesmos
 * R$ 27.460 consolidados em ambas as direções. Linha de Moinhos reaproveita
 * exatamente os valores já publicados em unit-profiles.ts (causas: carnes
 * 5.680, chope 2.460, óleo 1.740, outros 1.440).
 */
const rawCells: Record<string, Record<string, number>> = {
  moinhos: { carnes: 5680, chope: 2460, oleos: 1740, hortifruti: 0, laticinios: 0, outros: 1440 },
  'caxias-centro': { carnes: 4500, chope: 2200, oleos: 300, hortifruti: 150, laticinios: 50, outros: 10 },
  'zona-norte': { carnes: 300, chope: 400, oleos: 1800, hortifruti: 400, laticinios: 270, outros: 10 },
  'caxias-norte': { carnes: 340, chope: 100, oleos: 280, hortifruti: 1200, laticinios: 1100, outros: 0 },
  'cidade-baixa': { carnes: 0, chope: 200, oleos: 300, hortifruti: 1190, laticinios: 520, outros: 0 },
  serra: { carnes: 0, chope: 100, oleos: 200, hortifruti: 0, laticinios: 220, outros: 0 },
}

const categoriaTendencia: Record<string, 'up' | 'down' | 'flat'> = Object.fromEntries(
  cmvCategories.map((c) => [c.id, c.tendencia]),
)

/** Caxias Norte tem confiança limitada em toda a matriz — inventário semanal pendente. */
function confiancaCelula(unitId: string, valor: number): CmvConfidenceLevel {
  if (valor === 0) return 'insuficiente'
  if (unitId === 'caxias-norte') return 'baixa'
  if (valor >= 2000) return 'alta'
  if (valor >= 500) return 'media'
  return 'baixa'
}

export const cmvMatrixCells: CmvMatrixCell[] = Object.entries(rawCells).flatMap(([unitId, categorias]) =>
  Object.entries(categorias).map(([categoriaId, impacto]) => ({
    unitId,
    categoriaId,
    impacto,
    tendencia: categoriaTendencia[categoriaId] ?? 'flat',
    confianca: confiancaCelula(unitId, impacto),
  })),
)

export function getCmvMatrixCell(unitId: string, categoriaId: string): CmvMatrixCell | undefined {
  return cmvMatrixCells.find((c) => c.unitId === unitId && c.categoriaId === categoriaId)
}
