import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { CmvConfidenceBadge } from '@/components/cmv/CmvConfidenceBadge'
import { cmvProducts, cmvTopImpactProducts } from '@/data/cmv/cmvProducts'
import { formatCurrencyBRL, formatCurrencyCompactBRL } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { CmvProductData } from '@/types'

const trendIcon = { up: ArrowUp, down: ArrowDown, flat: Minus }
const trendColor = { up: 'text-danger', down: 'text-success', flat: 'text-ink-tertiary' }

export function CmvProductsTab() {
  const navigate = useNavigate()

  const columns: TableColumn<CmvProductData>[] = [
    { key: 'nome', header: 'Produto', render: (p) => <span className="font-medium">{p.nome}</span> },
    { key: 'categoria', header: 'Categoria', render: (p) => p.categoria },
    { key: 'unidadesVendidas', header: 'Unidades vendidas', align: 'right', render: (p) => p.unidadesVendidas.toLocaleString('pt-BR') },
    { key: 'vendas', header: 'Vendas', align: 'right', render: (p) => formatCurrencyCompactBRL(p.vendas) },
    { key: 'custoTeorico', header: 'Custo teórico', align: 'right', render: (p) => formatCurrencyCompactBRL(p.custoTeorico) },
    { key: 'custoReal', header: 'Custo real estimado', align: 'right', render: (p) => formatCurrencyCompactBRL(p.custoRealEstimado) },
    { key: 'impacto', header: 'Impacto', align: 'right', render: (p) => <span className="font-medium text-danger">{formatCurrencyBRL(p.impacto)}</span> },
    {
      key: 'tendencia',
      header: 'Tendência',
      align: 'right',
      render: (p) => {
        const Icon = trendIcon[p.tendencia]
        return <Icon className={cn('inline h-3.5 w-3.5', trendColor[p.tendencia])} strokeWidth={1.7} />
      },
    },
    { key: 'confianca', header: 'Confiança', render: (p) => <CmvConfidenceBadge nivel={p.confianca} /> },
    { key: 'ficha', header: 'Ficha técnica', render: (p) => p.fichaTecnicaVersao },
  ]

  return (
    <div className="flex flex-col gap-8">
      <section>
        <SectionHeader title="Produtos com maior impacto" description="Lista parcial — não cobre todo o desvio consolidado do período" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cmvTopImpactProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/cmv/produtos/${p.id}`)}
              className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-border-strong hover:shadow-card"
            >
              <p className="truncate text-support font-medium text-ink-primary">{p.nome}</p>
              <p className="text-metric-sm tabular text-danger">{formatCurrencyBRL(p.impacto)}</p>
              <p className="text-caption text-ink-tertiary">{p.categoria}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Todos os produtos" description="Consumo teórico versus real por produto — ordenados pela tabela" />
        <Table columns={columns} data={[...cmvProducts].sort((a, b) => b.impacto - a.impacto)} getRowId={(p) => p.id} onRowClick={(p) => navigate(`/cmv/produtos/${p.id}`)} />
      </section>
    </div>
  )
}
