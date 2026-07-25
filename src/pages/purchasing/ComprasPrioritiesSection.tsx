import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { UrgencyBadge } from '@/components/purchasing/UrgencyBadge'
import { purchasingPriorities } from '@/data/purchasing/priorities'
import { useAppState } from '@/context/AppStateContext'
import { formatCurrencyBRL } from '@/utils/format'

/** Prioridades de hoje — cinco casos concretos, não um resumo abstrato. */
export function ComprasPrioritiesSection() {
  const navigate = useNavigate()
  const { askCortex } = useAppState()

  return (
    <section id="prioridades">
      <SectionHeader title="Prioridades de hoje" description="Casos que exigem decisão — comprar, transferir, aprovar ou cobrar." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {purchasingPriorities.map((p) => (
          <Card key={p.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-card-title text-ink-primary">{p.titulo}</p>
                <p className="text-caption text-ink-tertiary">{p.unitLabel}</p>
              </div>
              <UrgencyBadge urgencia={p.urgencia} />
            </div>
            <p className="text-support leading-relaxed text-ink-secondary">{p.descricao}</p>
            <div className="flex items-baseline justify-between text-support">
              <span className="tabular font-medium text-ink-primary">{formatCurrencyBRL(p.valor)}</span>
              <span className="text-caption text-ink-tertiary">{p.prazoLabel}</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-2 border-t border-border pt-3">
              {p.acoesSecundarias.map((acao) => (
                <Button key={acao.label} size="sm" variant="secondary" onClick={() => navigate(acao.path)}>
                  {acao.label}
                </Button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />}
                onClick={() => askCortex(p.perguntaCortex, p.titulo, p.respostaCortex)}
              >
                Perguntar ao CORTEX
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
