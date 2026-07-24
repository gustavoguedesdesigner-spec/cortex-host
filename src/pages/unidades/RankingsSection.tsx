import { SectionHeader } from '@/components/ui/SectionHeader'
import { getUnitById } from '@/data/units'
import { attentionRankings, goodPracticeRankings } from '@/data/unit-rankings'

function RankingList({ title, rows, tone, onOpenUnit }: {
  title: string
  rows: { label: string; unitId: string; valor: string }[]
  tone: string
  onOpenUnit: (id: string) => void
}) {
  return (
    <div>
      <p className="mb-3 text-card-title text-ink-secondary">{title}</p>
      <ul className="flex flex-col divide-y divide-border border-t border-border">
        {rows.map((r, i) => {
          const unit = getUnitById(r.unitId)
          return (
            <li key={i}>
              <button onClick={() => onOpenUnit(r.unitId)} className="flex w-full items-center justify-between gap-4 py-3 text-left transition-colors hover:text-accent">
                <span className="text-support text-ink-secondary">{r.label}</span>
                <span className="shrink-0 text-support">
                  <span className="font-medium text-ink-primary">{unit?.nomeCurto}</span>
                  <span className={`ml-2 tabular ${tone}`}>{r.valor}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function RankingsSection({ onOpenUnit }: { onOpenUnit: (unitId: string) => void }) {
  return (
    <section>
      <SectionHeader title="Destaques da rede" description="Pontos que exigem atenção e boas práticas que podem ser replicadas" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RankingList title="Exigem atenção" rows={attentionRankings} tone="text-danger" onOpenUnit={onOpenUnit} />
        <RankingList title="Boas práticas" rows={goodPracticeRankings} tone="text-success" onOpenUnit={onOpenUnit} />
      </div>
    </section>
  )
}
