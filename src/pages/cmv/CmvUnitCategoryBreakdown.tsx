import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CmvConfidenceBadge } from '@/components/cmv/CmvConfidenceBadge'
import { cmvMatrixCells } from '@/data/cmv/cmvMatrix'
import { cmvCategoriesDestacadas } from '@/data/cmv/cmvCategories'
import { formatCurrencyBRL } from '@/utils/format'

/**
 * Composição do desvio por categoria — disponível para todas as
 * unidades (a partir da matriz unidade × categoria), mesmo quando a
 * unidade não tem uma decomposição de causas tão profunda quanto a de
 * Moinhos.
 */
export function CmvUnitCategoryBreakdown({ unitId }: { unitId: string }) {
  const navigate = useNavigate()
  const cells = cmvMatrixCells.filter((c) => c.unitId === unitId && c.impacto > 0).sort((a, b) => b.impacto - a.impacto)

  if (cells.length === 0) return null

  return (
    <section>
      <SectionHeader title="Composição do desvio por categoria" description="Impacto financeiro desta unidade, decomposto por categoria de insumo" />
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
        {cells.map((cell) => {
          const categoria = cmvCategoriesDestacadas.find((c) => c.id === cell.categoriaId)
          if (!categoria) return null
          return (
            <button
              key={cell.categoriaId}
              onClick={() => navigate(`/cmv/categorias/${cell.categoriaId}`)}
              className="flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink-primary">{categoria.categoria}</span>
                <CmvConfidenceBadge nivel={cell.confianca} />
              </div>
              <span className="tabular text-support font-medium text-danger">{formatCurrencyBRL(cell.impacto)}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
