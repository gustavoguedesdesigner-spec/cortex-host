import { useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CmvUnitCategoryMatrix } from '@/components/cmv/CmvUnitCategoryMatrix'
import { CmvMatrixCellDrawer } from '@/components/cmv/CmvMatrixCellDrawer'
import type { CmvMatrixCell } from '@/types'

export function CmvMatrixSection() {
  const [selected, setSelected] = useState<CmvMatrixCell | null>(null)

  return (
    <section>
      <SectionHeader title="Matriz unidade × categoria" description="Intensidade do desvio por unidade e categoria de insumo — clique em uma célula para investigar" />
      <div className="rounded-lg border border-border bg-surface p-3">
        <CmvUnitCategoryMatrix onSelectCell={(cell) => setSelected(cell)} />
      </div>
      <CmvMatrixCellDrawer cell={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
