import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { CmvConfidenceBadge } from '@/components/cmv/CmvConfidenceBadge'
import { cmvCategories } from '@/data/cmv/cmvCategories'
import { calcularParticipacao } from '@/utils/cmvCalculations'
import { financialImpactTotal } from '@/data/financial-impact'
import { formatCurrencyBRL, formatCurrencyCompactBRL, formatPercent } from '@/utils/format'
import type { CmvCategoryData } from '@/types'

const trendLabel = { up: 'Piorando', down: 'Melhorando', flat: 'Estável' }

export function CmvCategoriesTab() {
  const navigate = useNavigate()

  const columns: TableColumn<CmvCategoryData>[] = [
    { key: 'categoria', header: 'Categoria', render: (c) => <span className="font-medium">{c.categoria}</span> },
    { key: 'custoTeorico', header: 'Custo teórico', align: 'right', render: (c) => formatCurrencyCompactBRL(c.custoTeorico) },
    { key: 'custoReal', header: 'Custo real', align: 'right', render: (c) => formatCurrencyCompactBRL(c.custoReal) },
    {
      key: 'impacto',
      header: 'Diferença / impacto',
      align: 'right',
      render: (c) => (c.impacto > 0 ? <span className="font-medium text-danger">{formatCurrencyBRL(c.impacto)}</span> : <span className="text-ink-tertiary">—</span>),
    },
    {
      key: 'participacao',
      header: 'Participação',
      align: 'right',
      render: (c) => (c.impacto > 0 ? formatPercent(calcularParticipacao(c.impacto, financialImpactTotal), 1) : '—'),
    },
    { key: 'unidades', header: 'Unidades afetadas', render: (c) => (c.unidadesAfetadas.length > 0 ? c.unidadesAfetadas.join(', ') : '—') },
    { key: 'tendencia', header: 'Tendência', render: (c) => trendLabel[c.tendencia] },
    { key: 'confianca', header: 'Confiança', render: (c) => <CmvConfidenceBadge nivel={c.confianca} /> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Categorias" description="As seis primeiras categorias compõem o impacto financeiro consolidado da rede" />
      <Table columns={columns} data={cmvCategories} getRowId={(c) => c.id} onRowClick={(c) => navigate(`/cmv/categorias/${c.id}`)} />
    </div>
  )
}
