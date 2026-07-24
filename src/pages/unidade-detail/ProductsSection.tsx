import { useState } from 'react'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Drawer } from '@/components/ui/Drawer'
import { DataList } from '@/components/ui/DataList'
import { cn } from '@/utils/cn'
import { formatCurrencyBRL } from '@/utils/format'
import type { CriticalProduct } from '@/types'

const trendIcon = { up: ArrowUp, down: ArrowDown, flat: Minus }
const trendColor = { up: 'text-status-critical', down: 'text-status-success', flat: 'text-content-tertiary' }
const confidenceLabel = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }

export function ProductsSection({ produtos, unitName }: { produtos: CriticalProduct[]; unitName: string }) {
  const [selected, setSelected] = useState<CriticalProduct | null>(null)

  const columns: TableColumn<CriticalProduct>[] = [
    { key: 'nome', header: 'Produto', render: (p) => <span className="font-medium">{p.nome}</span> },
    { key: 'categoria', header: 'Categoria', render: (p) => p.categoria },
    { key: 'venda', header: 'Venda', align: 'right', render: (p) => formatCurrencyBRL(p.venda) },
    { key: 'consumoTeorico', header: 'Consumo teórico', align: 'right', render: (p) => p.consumoTeorico },
    { key: 'consumoReal', header: 'Consumo real', align: 'right', render: (p) => p.consumoReal },
    { key: 'impacto', header: 'Impacto', align: 'right', render: (p) => <span className="text-status-critical font-medium">{formatCurrencyBRL(p.impacto)}</span> },
    {
      key: 'tendencia',
      header: 'Tendência',
      align: 'right',
      render: (p) => {
        const Icon = trendIcon[p.tendencia]
        return <Icon className={cn('h-3.5 w-3.5 inline', trendColor[p.tendencia])} />
      },
    },
    { key: 'confianca', header: 'Confiança', align: 'right', render: (p) => confidenceLabel[p.confianca] },
  ]

  return (
    <section>
      <SectionHeader title="Produtos que mais impactam a unidade" description={`Itens com maior desvio entre consumo teórico e real em ${unitName}`} />
      <Table columns={columns} data={produtos} getRowId={(p) => p.id} onRowClick={setSelected} />

      <Drawer isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.nome ?? ''} widthClassName="w-full max-w-md">
        {selected && (
          <div className="flex flex-col gap-4">
            <DataList
              items={[
                { label: 'Categoria', value: selected.categoria },
                { label: 'Venda no período', value: formatCurrencyBRL(selected.venda) },
                { label: 'Consumo teórico', value: selected.consumoTeorico },
                { label: 'Consumo real', value: selected.consumoReal },
                { label: 'Impacto financeiro', value: formatCurrencyBRL(selected.impacto) },
                { label: 'Nível de confiança', value: confidenceLabel[selected.confianca] },
              ]}
            />
            <div className="rounded-md bg-surface-3/60 p-3">
              <p className="text-caption text-content-tertiary mb-0.5">Ação recomendada</p>
              <p className="text-support text-content-primary">{selected.acaoRecomendada}</p>
            </div>
          </div>
        )}
      </Drawer>
    </section>
  )
}
