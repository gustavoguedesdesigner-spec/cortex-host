import { TriangleAlert, Award } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getUnitById } from '@/data/units'
import { attentionRankings, goodPracticeRankings } from '@/data/unit-rankings'

interface RankingsSectionProps {
  onOpenUnit: (unitId: string) => void
}

export function RankingsSection({ onOpenUnit }: RankingsSectionProps) {
  return (
    <section>
      <SectionHeader title="Destaques da rede" description="Pontos que exigem atenção e boas práticas que podem ser replicadas" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <TriangleAlert className="h-4 w-4 text-status-critical" />
            <p className="text-card-title text-content-primary">Exigem atenção</p>
          </div>
          <div className="flex flex-col divide-y divide-border-subtle">
            {attentionRankings.map((r, i) => {
              const unit = getUnitById(r.unitId)
              return (
                <button key={i} onClick={() => onOpenUnit(r.unitId)} className="flex items-center justify-between gap-3 py-2.5 text-left hover:opacity-80">
                  <span className="text-support text-content-secondary">{r.label}</span>
                  <span className="text-support font-medium text-content-primary shrink-0">
                    {unit?.nomeCurto} · <span className="text-status-critical">{r.valor}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-4 w-4 text-status-success" />
            <p className="text-card-title text-content-primary">Boas práticas</p>
          </div>
          <div className="flex flex-col divide-y divide-border-subtle">
            {goodPracticeRankings.map((r, i) => {
              const unit = getUnitById(r.unitId)
              return (
                <button key={i} onClick={() => onOpenUnit(r.unitId)} className="flex items-center justify-between gap-3 py-2.5 text-left hover:opacity-80">
                  <span className="text-support text-content-secondary">{r.label}</span>
                  <span className="text-support font-medium text-content-primary shrink-0">
                    {unit?.nomeCurto} · <span className="text-status-success">{r.valor}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </Card>
      </div>
    </section>
  )
}
