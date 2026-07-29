import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { History } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { SuppliersBreadcrumb } from '@/components/suppliers/SuppliersBreadcrumb'
import { SuppliersInternalNav } from '@/components/suppliers/SuppliersInternalNav'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { supplierHistory } from '@/data/suppliers/supplierHistory'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { formatDateFull } from '@/utils/format'

export default function FornecedoresHistorico() {
  const navigate = useNavigate()

  const eventos = useMemo(() => [...supplierHistory].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()), [])

  return (
    <div className="flex flex-col gap-8">
      <SuppliersBreadcrumb trail={[{ label: 'Histórico' }]} />
      <PageHero eyebrow="Fornecedores" title="Histórico" description="Trilha de eventos da base de fornecedores — divergências, documentos, negociações e homologações." />
      <SuppliersInternalNav active="historico" />

      <SectionHeader title={`${eventos.length} eventos`} />

      {eventos.length === 0 ? (
        <EmptyState icon={<History className="h-5 w-5" />} title="Nenhum evento registrado" />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {eventos.map((e) => {
            const supplier = getSupplierById(e.supplierId)
            return (
              <button key={e.id} onClick={() => navigate(`/fornecedores/${e.supplierId}`)} className="flex items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
                <div className="min-w-0">
                  <p className="text-support font-medium text-ink-primary">
                    {e.titulo} · {supplier?.nome}
                  </p>
                  <p className="text-caption text-ink-tertiary">{e.descricao}</p>
                </div>
                <span className="shrink-0 text-caption text-ink-tertiary">{formatDateFull(e.data)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
