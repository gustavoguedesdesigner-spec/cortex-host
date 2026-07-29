import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { SuppliersBreadcrumb } from '@/components/suppliers/SuppliersBreadcrumb'
import { SuppliersInternalNav } from '@/components/suppliers/SuppliersInternalNav'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { EmptyState } from '@/components/ui/EmptyState'
import { SupplierDivergenceBadge } from '@/components/suppliers/SupplierBadges'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { getUnitById } from '@/data/units'
import { useSuppliers } from '@/hooks/useSuppliers'
import { calcularValorDivergencias } from '@/utils/supplierPerformance'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'

type Filtro = 'todas' | 'aberta' | 'em_negociacao' | 'credito_solicitado' | 'resolvida'

const filtros: { value: Filtro; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'aberta', label: 'Abertas' },
  { value: 'em_negociacao', label: 'Em negociação' },
  { value: 'credito_solicitado', label: 'Crédito solicitado' },
  { value: 'resolvida', label: 'Resolvidas' },
]

export default function FornecedoresDivergencias() {
  const navigate = useNavigate()
  const { allDivergences } = useSuppliers()
  const [filtro, setFiltro] = useState<Filtro>('todas')

  const filtradas = useMemo(() => (filtro === 'todas' ? allDivergences : allDivergences.filter((d) => d.status === filtro)), [allDivergences, filtro])
  const valorTotal = calcularValorDivergencias(filtradas)

  return (
    <div className="flex flex-col gap-8">
      <SuppliersBreadcrumb trail={[{ label: 'Divergências' }]} />
      <PageHero eyebrow="Fornecedores" title="Divergências" description="Diferenças de quantidade, preço, prazo ou qualidade identificadas no recebimento — nunca aceitas apenas porque a entrega chegou." />
      <SuppliersInternalNav active="divergencias" />

      <SectionHeader
        title={`${filtradas.length} divergências · ${formatCurrencyBRL(valorTotal)}`}
        actions={<SegmentedControl value={filtro} onChange={setFiltro} options={filtros} />}
      />

      {filtradas.length === 0 ? (
        <EmptyState icon={<AlertTriangle className="h-5 w-5" />} title="Nenhuma divergência encontrada" description="Ajuste o filtro para ver outras ocorrências." />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {filtradas.map((d) => {
            const supplier = getSupplierById(d.supplierId)
            return (
              <button key={d.id} onClick={() => navigate(`/fornecedores/${d.supplierId}`)} className="flex flex-col gap-2 px-5 py-4 text-left transition-colors hover:bg-surface-hover sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-support font-medium uppercase text-ink-primary">
                    {d.receiptId.toUpperCase()} · {supplier?.nome} · {getUnitById(d.unitId)?.nomeCurto}
                  </p>
                  <p className="mt-0.5 text-caption text-ink-tertiary">{d.descricao}</p>
                  <p className="mt-0.5 text-caption text-ink-tertiary">{formatDateFull(d.data)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-support font-medium tabular text-danger">{formatCurrencyBRL(d.valorEnvolvido)}</span>
                  <SupplierDivergenceBadge status={d.status} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
