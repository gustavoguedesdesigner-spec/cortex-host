import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SupplierOperationalBadge, SupplierScorePill } from './SupplierBadges'
import { categoryLabels } from '@/data/suppliers/supplierSummary'
import { getContactsBySupplier } from '@/data/suppliers/supplierContacts'
import { formatCurrencyCompactBRL, formatPercent } from '@/utils/format'
import type { Supplier } from '@/types'

/**
 * Card amplo da base visual de fornecedores — cabecalho escuro com iniciais
 * em destaque (inspirado no JBL Trade Hub), corpo com prioridade visual
 * nome > categoria > status > score > contato > acoes. Metricas secundarias
 * (valor comprado, pontualidade, divergencias) ficam num rodape compacto em
 * vez de repetidas em cada linha do card.
 */
export function SupplierCard({ supplier }: { supplier: Supplier }) {
  const navigate = useNavigate()
  const contatoPrincipal = getContactsBySupplier(supplier.id).find((c) => c.principal)

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-border-strong hover:shadow-card">
      <button onClick={() => navigate(`/fornecedores/${supplier.id}`)} className="relative flex h-32 flex-col justify-between overflow-hidden bg-navy px-4 pt-3 pb-3 text-left">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
          <pattern id={`dots-${supplier.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#dots-${supplier.id})`} />
        </svg>
        <div className="relative flex items-center justify-between text-badge uppercase tracking-[0.06em] text-white/60">
          <span>{categoryLabels[supplier.categoriaPrincipalId]}</span>
          {supplier.estrategico && <span className="text-accent">Estratégico</span>}
        </div>
        <span className="relative text-center text-[2.25rem] font-semibold leading-none text-white">{supplier.iniciais}</span>
        <span className="relative text-caption text-white/50">{supplier.codigo}</span>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <button onClick={() => navigate(`/fornecedores/${supplier.id}`)} className="text-card-title text-ink-primary hover:text-accent">
            {supplier.nome}
          </button>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <SupplierOperationalBadge status={supplier.statusOperacional} />
            <SupplierScorePill score={supplier.scoreGeral} />
          </div>
        </div>

        {contatoPrincipal && (
          <div className="text-caption text-ink-tertiary">
            <p className="text-support text-ink-secondary">{contatoPrincipal.nome}</p>
            <p className="truncate">{contatoPrincipal.email}</p>
            <p>{contatoPrincipal.telefone}</p>
          </div>
        )}

        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
          <div>
            <p className="text-support font-medium tabular text-ink-primary">{formatCurrencyCompactBRL(supplier.valorCompradoPeriodo)}</p>
            <p className="text-caption text-ink-tertiary">Comprado</p>
          </div>
          <div>
            <p className="text-support font-medium tabular text-ink-primary">{formatPercent(supplier.pontualidade, 0)}</p>
            <p className="text-caption text-ink-tertiary">Pontualidade</p>
          </div>
          <div>
            <p className={`text-support font-medium tabular ${supplier.divergenciasAbertas > 0 ? 'text-danger' : 'text-ink-primary'}`}>{supplier.divergenciasAbertas}</p>
            <p className="text-caption text-ink-tertiary">Divergências</p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/fornecedores/${supplier.id}`)}
          className="flex items-center justify-between gap-2 rounded-full bg-surface-subtle px-3.5 py-2 text-support font-medium text-ink-primary transition-colors hover:bg-surface-hover"
        >
          Ver fornecedor
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />
        </button>
      </div>
    </div>
  )
}
