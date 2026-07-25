import { useState } from 'react'
import { units } from '@/data/units'
import { cmvCategoriesDestacadas } from '@/data/cmv/cmvCategories'
import { cmvMatrixCells } from '@/data/cmv/cmvMatrix'
import { formatCurrencyCompactBRL } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { CmvMatrixCell } from '@/types'

const maxImpacto = Math.max(...cmvMatrixCells.map((c) => c.impacto))

function intensityClass(valor: number): string {
  if (valor === 0) return 'bg-surface'
  const ratio = valor / maxImpacto
  if (ratio > 0.6) return 'bg-accent/30'
  if (ratio > 0.35) return 'bg-accent/20'
  if (ratio > 0.15) return 'bg-accent/10'
  return 'bg-accent/5'
}

/**
 * Matriz de desvios unidade × categoria. Escala visual suave (nunca
 * cores saturadas em toda a matriz); a célula selecionada usa laranja
 * sólido. Clique abre o drawer de investigação da célula.
 */
export function CmvUnitCategoryMatrix({ onSelectCell }: { onSelectCell: (cell: CmvMatrixCell, unitName: string, categoriaLabel: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const categorias = cmvCategoriesDestacadas

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-support">
        <thead>
          <tr>
            <th className="sticky left-0 bg-surface px-3 py-2 text-left text-label text-ink-tertiary">Unidade</th>
            {categorias.map((cat) => (
              <th key={cat.id} className="px-2 py-2 text-center text-label text-ink-tertiary whitespace-nowrap">
                {cat.categoria}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id} className="border-t border-border">
              <td className="sticky left-0 bg-surface px-3 py-2 font-medium text-ink-primary whitespace-nowrap">{unit.nomeCurto}</td>
              {categorias.map((cat) => {
                const cell = cmvMatrixCells.find((c) => c.unitId === unit.id && c.categoriaId === cat.id)
                const key = `${unit.id}:${cat.id}`
                const isSelected = selected === key
                if (!cell || cell.impacto === 0) {
                  return (
                    <td key={cat.id} className="px-2 py-2 text-center text-ink-tertiary/50">
                      —
                    </td>
                  )
                }
                return (
                  <td key={cat.id} className="p-1 text-center">
                    <button
                      onClick={() => {
                        setSelected(key)
                        onSelectCell(cell, unit.nomeCurto, cat.categoria)
                      }}
                      className={cn(
                        'w-full rounded-md px-2 py-2 tabular font-medium transition-colors',
                        isSelected ? 'bg-accent text-white' : cn(intensityClass(cell.impacto), 'text-ink-primary hover:bg-accent/25'),
                      )}
                    >
                      {formatCurrencyCompactBRL(cell.impacto)}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
