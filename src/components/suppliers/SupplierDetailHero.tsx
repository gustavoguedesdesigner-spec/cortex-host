import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilePlus2, MessageSquareText, MoreHorizontal, ShoppingCart, Star } from 'lucide-react'
import { SuppliersBreadcrumb } from './SuppliersBreadcrumb'
import { SupplierOperationalBadge, SupplierScorePill } from './SupplierBadges'
import { categoryLabels } from '@/data/suppliers/supplierSummary'
import { Button } from '@/components/ui/Button'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'
import { useAppState } from '@/context/AppStateContext'
import type { Supplier } from '@/types'

export function SupplierDetailHero({ supplier }: { supplier: Supplier }) {
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const [showMore, setShowMore] = useState(false)

  return (
    <div className="flex flex-col gap-5 border-b border-border pb-8">
      <SuppliersBreadcrumb trail={[{ label: supplier.nome }]} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy text-body font-semibold text-white">{supplier.iniciais}</div>
            <div>
              <p className="text-label uppercase tracking-[0.06em] text-ink-tertiary">
                {supplier.codigo} · {categoryLabels[supplier.categoriaPrincipalId]}
              </p>
              <h1 className="text-page-title-sm lg:text-page-title">{supplier.nome}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <SupplierOperationalBadge status={supplier.statusOperacional} />
                <SupplierScorePill score={supplier.scoreGeral} />
                {supplier.estrategico && <span className="text-caption text-ink-tertiary">Fornecedor estratégico</span>}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button size="sm" leftIcon={<ShoppingCart className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/compras/necessidades')}>
              Criar pedido
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/compras/cotacoes')}>
              Criar cotação
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/fornecedores/negociacoes')}>
              Registrar negociação
            </Button>
            <Button size="sm" variant="ghost" leftIcon={<MessageSquareText className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex(`O que devo cobrar da ${supplier.nome}?`, supplier.nome)}>
              Notificar fornecedor
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowMore((v) => !v)} leftIcon={<MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.7} />}>
              Mais opções
            </Button>
          </div>
          {showMore && (
            <div className="flex flex-wrap gap-2 text-support text-ink-secondary">
              <button className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 hover:bg-surface-hover" onClick={() => navigate('/fornecedores/documentos')}>
                <FilePlus2 className="h-3.5 w-3.5" strokeWidth={1.7} />
                Solicitar documento
              </button>
              <button className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 hover:bg-surface-hover" onClick={() => navigate('/fornecedores/riscos')}>
                <Star className="h-3.5 w-3.5" strokeWidth={1.7} />
                Ver riscos
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface-subtle p-5 lg:col-span-5">
          <p className="text-label text-ink-tertiary">Relação com a rede</p>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-metric tabular text-ink-primary">{formatCurrencyBRL(supplier.valorCompradoPeriodo)}</p>
              <p className="text-caption text-ink-tertiary">Comprado no período</p>
            </div>
            <div>
              <p className="text-metric tabular text-ink-primary">{supplier.unidadesAtendidas.length}</p>
              <p className="text-caption text-ink-tertiary">Unidades atendidas</p>
            </div>
          </div>
          <p className="mt-4 text-caption text-ink-tertiary">Relação desde {formatDateFull(supplier.desde)}</p>
        </div>
      </div>
    </div>
  )
}
