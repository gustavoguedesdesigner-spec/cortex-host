import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/utils/cn'
import type { NetworkComparisonRow } from '@/types'

export function NetworkComparisonSection({ unitName, rows, insight }: { unitName: string; rows: NetworkComparisonRow[]; insight?: string }) {
  return (
    <section>
      <SectionHeader title={`${unitName} versus média da rede`} description="Como esta unidade se posiciona frente ao restante da rede" />
      <Card padded={false}>
        <div className="flex flex-col divide-y divide-border">
          {rows.map((row) => (
            <div key={row.metrica} className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-support text-ink-secondary">{row.metrica}</span>
              <span className="flex items-center gap-3 text-support">
                <span className={cn('font-semibold', row.unidadeMelhor ? 'text-success' : 'text-danger')}>{row.unidade}</span>
                <span className="text-ink-tertiary">vs. {row.rede} (rede)</span>
              </span>
            </div>
          ))}
        </div>
        {insight && <p className="text-support text-ink-secondary leading-relaxed p-4 border-t border-border">{insight}</p>}
      </Card>
    </section>
  )
}
