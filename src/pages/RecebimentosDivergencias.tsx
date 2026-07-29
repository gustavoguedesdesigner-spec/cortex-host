import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { ReceivingBreadcrumb } from '@/components/receiving/ReceivingBreadcrumb'
import { ReceivingInternalNav } from '@/components/receiving/ReceivingInternalNav'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { EmptyState } from '@/components/ui/EmptyState'
import { ReceiptStatusBadge } from '@/components/receiving/ReceivingBadges'
import { useReceiving } from '@/hooks/useReceiving'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { getUnitById } from '@/data/units'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'

type Filtro = 'todas' | 'quantidade' | 'preco' | 'qualidade'

const filtros: { value: Filtro; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'quantidade', label: 'Quantidade' },
  { value: 'preco', label: 'Preço' },
  { value: 'qualidade', label: 'Qualidade' },
]

export default function RecebimentosDivergencias() {
  const navigate = useNavigate()
  const { allReceipts } = useReceiving()
  const [filtro, setFiltro] = useState<Filtro>('todas')

  const divergentes = useMemo(() => allReceipts.filter((r) => r.status === 'divergente' || r.status === 'concluido'), [allReceipts])

  const filtradas = useMemo(() => {
    if (filtro === 'todas') return divergentes
    return divergentes.filter((r) => r.itens.some((i) => (filtro === 'quantidade' ? i.quantidadeStatus === 'divergente' : filtro === 'preco' ? i.precoStatus === 'divergente' : i.qualidadeStatus === 'divergente')))
  }, [divergentes, filtro])

  const valorTotal = filtradas.reduce((sum, r) => sum + r.impactoFinanceiro, 0)

  return (
    <div className="flex flex-col gap-8">
      <ReceivingBreadcrumb trail={[{ label: 'Divergências' }]} />
      <PageHero eyebrow="Recebimentos" title="Divergências" description="Diferenças entre pedido, documento e recebimento físico — registradas, nunca ignoradas." />
      <ReceivingInternalNav active="divergencias" />

      <SectionHeader title={`${filtradas.length} divergências · ${formatCurrencyBRL(valorTotal)}`} actions={<SegmentedControl value={filtro} onChange={setFiltro} options={filtros} />} />

      {filtradas.length === 0 ? (
        <EmptyState icon={<AlertTriangle className="h-5 w-5" />} title="Nenhuma divergência encontrada" />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {filtradas.map((r) => {
            const supplier = getSupplierById(r.supplierId)
            return (
              <button key={r.id} onClick={() => navigate(`/recebimentos/${r.id}`)} className="flex flex-col gap-2 px-5 py-4 text-left transition-colors hover:bg-surface-hover sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-support font-medium uppercase text-ink-primary">
                    NF {r.nfNumero} · {supplier?.nome} · {getUnitById(r.unitId)?.nomeCurto}
                  </p>
                  <p className="mt-0.5 text-caption text-ink-tertiary">{r.motivoDecisao ?? r.itens[0]?.observacao}</p>
                  <p className="mt-0.5 text-caption text-ink-tertiary">{formatDateFull(r.dataChegada ?? r.dataAgendada)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {r.impactoFinanceiro > 0 && <span className="text-support font-medium tabular text-danger">{formatCurrencyBRL(r.impactoFinanceiro)}</span>}
                  <ReceiptStatusBadge status={r.status} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
