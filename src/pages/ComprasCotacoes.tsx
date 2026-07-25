import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { ComprasBreadcrumb } from '@/components/purchasing/ComprasBreadcrumb'
import { ComprasInternalNav } from '@/components/purchasing/ComprasInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { EmptyState } from '@/components/ui/EmptyState'
import { QuotationStatusBadge } from '@/components/purchasing/QuotationStatusBadge'
import { usePurchasing } from '@/hooks/usePurchasing'
import { formatCurrencyBRL, formatDateShort } from '@/utils/format'
import type { Quotation, QuotationStatus } from '@/types'

const statusFilters: { value: QuotationStatus | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'aguardando_respostas', label: 'Aguardando respostas' },
  { value: 'pronta_para_decisao', label: 'Prontas para decisão' },
  { value: 'decidida', label: 'Decididas' },
]

export default function ComprasCotacoes() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { allQuotations } = usePurchasing()
  const [filtro, setFiltro] = useState<QuotationStatus | 'todas'>('todas')
  const isNova = searchParams.get('nova') === '1'

  const filtered = useMemo(() => (filtro === 'todas' ? allQuotations : allQuotations.filter((q) => q.status === filtro)), [allQuotations, filtro])

  const columns: TableColumn<Quotation>[] = [
    { key: 'id', header: 'Cotação', render: (q) => <span className="font-medium uppercase">{q.id}</span> },
    { key: 'categoria', header: 'Categoria', render: (q) => q.categoria },
    { key: 'fornecedores', header: 'Fornecedores convidados', align: 'right', render: (q) => q.fornecedoresConvidados.length },
    { key: 'respostas', header: 'Respostas', align: 'right', render: (q) => q.respostas.filter((r) => r.respondeu).length },
    { key: 'valor', header: 'Valor estimado', align: 'right', render: (q) => formatCurrencyBRL(q.valorEstimado) },
    { key: 'economia', header: 'Economia potencial', align: 'right', render: (q) => (q.economiaPotencial > 0 ? formatCurrencyBRL(q.economiaPotencial) : '—') },
    { key: 'prazo', header: 'Prazo de resposta', align: 'right', render: (q) => formatDateShort(q.prazoResposta) },
    { key: 'status', header: 'Status', render: (q) => <QuotationStatusBadge status={q.status} /> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <ComprasBreadcrumb trail={[{ label: 'Cotações' }]} />
      <PageHeader eyebrow="Suprimentos" title="Cotações" description="Comparação entre fornecedores por preço, prazo, conformidade e risco — nunca só pelo menor preço." />
      <ComprasInternalNav active="cotacoes" />

      {isNova && (
        <div className="rounded-md border border-border bg-info-soft px-4 py-3 text-support text-info">
          Criar uma nova cotação consolida itens de requisições aprovadas da mesma categoria. Nesta etapa do protótipo, use as cotações de exemplo abaixo para ver o fluxo completo de decisão.
        </div>
      )}

      <SectionHeader title="Todas as cotações" actions={<SegmentedControl value={filtro} onChange={setFiltro} options={statusFilters} />} />

      {filtered.length === 0 ? (
        <EmptyState icon={<SlidersHorizontal className="h-5 w-5" />} title="Nenhuma cotação encontrada" description="Ajuste os filtros para ver outras cotações." />
      ) : (
        <Table columns={columns} data={filtered} getRowId={(q) => q.id} onRowClick={(q) => navigate(`/compras/cotacoes/${q.id}`)} />
      )}
    </div>
  )
}
