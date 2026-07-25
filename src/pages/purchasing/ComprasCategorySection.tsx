import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { purchaseCategories } from '@/data/purchasing/categories'
import { formatCurrencyCompactBRL, formatPercent, formatPercentPoints } from '@/utils/format'

/** Compras por categoria — barras horizontais compactas, não um gráfico pesado. */
export function ComprasCategorySection() {
  const navigate = useNavigate()
  const maxValor = Math.max(...purchaseCategories.map((c) => c.valor))

  return (
    <section id="categorias">
      <SectionHeader title="Compras por categoria" description="Participação, variação e alertas de cada categoria no período." />
      <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
        {purchaseCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/compras/necessidades?categoria=${c.id}`)}
            className="flex flex-col gap-2 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-support font-medium text-ink-primary">{c.categoria}</span>
              <div className="flex items-baseline gap-3 text-caption text-ink-tertiary">
                <span className="tabular text-support text-ink-primary">{formatCurrencyCompactBRL(c.valor)}</span>
                <span className="tabular">{formatPercent(c.participacao)}</span>
                <span className={`tabular ${c.variacao >= 0 ? 'text-danger' : 'text-success'}`}>{formatPercentPoints(c.variacao)}</span>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
              <div className="h-full rounded-full bg-navy" style={{ width: `${(c.valor / maxValor) * 100}%` }} />
            </div>
            <div className="flex items-center gap-3 text-caption text-ink-tertiary">
              <span>{c.fornecedores} fornecedor{c.fornecedores > 1 ? 'es' : ''}</span>
              <span>{c.unidades} unidades</span>
              {c.alertas > 0 && <span className="text-warning">{c.alertas} alerta{c.alertas > 1 ? 's' : ''}</span>}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
