import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { DataList } from '@/components/ui/DataList'
import { CmvConfidenceBadge } from './CmvConfidenceBadge'
import { cmvCauses } from '@/data/cmv/cmvCauses'
import { cmvProducts } from '@/data/cmv/cmvProducts'
import { getCmvCategoryById } from '@/data/cmv/cmvCategories'
import { getUnitById } from '@/data/units'
import { formatCurrencyBRL } from '@/utils/format'
import type { CmvMatrixCell } from '@/types'

export function CmvMatrixCellDrawer({ cell, onClose }: { cell: CmvMatrixCell | null; onClose: () => void }) {
  const navigate = useNavigate()
  if (!cell) return null

  const unit = getUnitById(cell.unitId)
  const categoria = getCmvCategoryById(cell.categoriaId)
  if (!unit || !categoria) return null

  const causasRelacionadas = cmvCauses.filter((c) => c.categorias.includes(categoria.categoria) && c.unidades.includes(unit.nomeCurto))
  const produtosRelacionados = cmvProducts.filter((p) => p.categoriaId === categoria.id).slice(0, 4)
  const mediaRede = categoria.impacto / 6

  return (
    <Drawer isOpen={Boolean(cell)} onClose={onClose} title={`${categoria.categoria} — ${unit.nomeCurto}`} widthClassName="w-full max-w-lg">
      <div className="flex flex-col gap-5">
        <DataList
          items={[
            { label: 'Impacto nesta célula', value: <span className="text-danger font-medium">{formatCurrencyBRL(cell.impacto)}</span> },
            { label: 'Média da rede na categoria', value: formatCurrencyBRL(mediaRede) },
            { label: 'Confiança', value: <CmvConfidenceBadge nivel={cell.confianca} /> },
          ]}
        />

        {causasRelacionadas.length > 0 && (
          <div>
            <p className="text-label text-ink-tertiary mb-2">Causa provável</p>
            <div className="flex flex-col gap-2">
              {causasRelacionadas.map((c) => (
                <div key={c.id} className="rounded-md border border-border bg-surface-subtle p-3">
                  <p className="text-support font-medium text-ink-primary">{c.titulo}</p>
                  <p className="mt-1 text-caption text-ink-tertiary">{c.acaoRecomendada}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {produtosRelacionados.length > 0 && (
          <div>
            <p className="text-label text-ink-tertiary mb-2">Produtos relacionados</p>
            <ul className="flex flex-col divide-y divide-border">
              {produtosRelacionados.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-support">
                  <span className="text-ink-primary">{p.nome}</span>
                  <span className="tabular text-ink-tertiary">{formatCurrencyBRL(p.impacto)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/cmv/unidades/${unit.id}`)}>
            Abrir {unit.nomeCurto}
          </Button>
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/cmv/categorias/${categoria.id}`)}>
            Abrir {categoria.categoria}
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
