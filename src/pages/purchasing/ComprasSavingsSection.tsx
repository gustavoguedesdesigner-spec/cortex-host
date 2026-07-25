import { SectionHeader } from '@/components/ui/SectionHeader'
import { savingsOpportunities, savingsOpportunitiesDisclaimer } from '@/data/purchasing/savingsOpportunities'
import { formatCurrencyBRL } from '@/utils/format'

export function ComprasSavingsSection() {
  return (
    <section id="economia">
      <SectionHeader title="Oportunidades de economia" description="Estimativas construídas a partir de cotações, histórico de preços e consolidação de pedidos." />
      <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
        {savingsOpportunities.map((o) => (
          <div key={o.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="text-support font-medium text-ink-primary">{o.titulo}</p>
              <p className="text-caption text-ink-tertiary">{o.descricao}</p>
            </div>
            <span className="shrink-0 tabular text-support font-medium text-success">{formatCurrencyBRL(o.valor)}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-caption text-ink-tertiary">{savingsOpportunitiesDisclaimer}</p>
    </section>
  )
}
