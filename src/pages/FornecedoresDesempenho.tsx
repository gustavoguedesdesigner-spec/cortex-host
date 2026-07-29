import { useMemo, useState } from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { SuppliersBreadcrumb } from '@/components/suppliers/SuppliersBreadcrumb'
import { SuppliersInternalNav } from '@/components/suppliers/SuppliersInternalNav'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { SuppliersTable } from '@/components/suppliers/SuppliersTable'
import { networkPerformanceOverview } from '@/data/suppliers/supplierPerformance'
import { useSuppliers } from '@/hooks/useSuppliers'
import { ordenarFornecedores, type SupplierSortKey } from '@/utils/supplierPerformance'
import { formatPercent, formatPercentPoints } from '@/utils/format'

const performanceLabels = {
  pontualidade: 'Pontualidade',
  conformidadeQuantidade: 'Conformidade de quantidade',
  conformidadePreco: 'Conformidade de preço',
  conformidadeQualidade: 'Conformidade de qualidade',
} as const

export default function FornecedoresDesempenho() {
  const { allSuppliers } = useSuppliers()
  const [sort, setSort] = useState<SupplierSortKey>('score')

  const sorted = useMemo(() => ordenarFornecedores(allSuppliers, sort), [allSuppliers, sort])

  return (
    <div className="flex flex-col gap-8">
      <SuppliersBreadcrumb trail={[{ label: 'Desempenho' }]} />
      <PageHero eyebrow="Fornecedores" title="Desempenho" description="Pontualidade e conformidade de quantidade, preço e qualidade — média da rede e comparação entre fornecedores." />
      <SuppliersInternalNav active="desempenho" />

      <section>
        <SectionHeader title="Desempenho geral da rede" description="Média atual frente à meta e ao período anterior" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(performanceLabels) as (keyof typeof performanceLabels)[]).map((key) => {
            const m = networkPerformanceOverview[key]
            const diff = m.atual - m.periodoAnterior
            return (
              <Card key={key}>
                <p className="text-label text-ink-tertiary">{performanceLabels[key]}</p>
                <p className="mt-1.5 text-metric tabular text-ink-primary">{formatPercent(m.atual, 1)}</p>
                <p className="mt-1 text-caption text-ink-tertiary">Meta {formatPercent(m.meta, 0)}</p>
                <p className={`mt-2 text-caption font-medium tabular ${diff >= 0 ? 'text-success' : 'text-danger'}`}>{formatPercentPoints(diff)} vs. período anterior</p>
              </Card>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeader
          title={`${sorted.length} fornecedores`}
          actions={
            <Select
              aria-label="Ordenar por"
              value={sort}
              onChange={(e) => setSort(e.target.value as SupplierSortKey)}
              options={[
                { value: 'score', label: 'Melhor score' },
                { value: 'pontualidade', label: 'Maior pontualidade' },
                { value: 'valor', label: 'Maior valor comprado' },
                { value: 'divergencias', label: 'Menor divergência' },
                { value: 'conformidade', label: 'Maior conformidade' },
                { value: 'nome', label: 'Ordem alfabética' },
              ]}
              className="w-48"
            />
          }
        />
        <SuppliersTable suppliers={sorted} />
      </section>
    </div>
  )
}
