import { useState } from 'react'
import { Eye } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/utils/cn'
import { formatCurrencyBRL } from '@/utils/format'
import type { DeviationCause } from '@/types'

const confidenceConfig = {
  alta: { label: 'Confiança alta', classes: 'bg-success-soft text-success border-success/30' },
  media: { label: 'Confiança média', classes: 'bg-warning-soft text-warning border-warning/30' },
  baixa: { label: 'Confiança baixa', classes: 'bg-surface-subtle text-ink-tertiary border-border-strong/30' },
}

export function CausesSection({ causas }: { causas: DeviationCause[] }) {
  const [openCause, setOpenCause] = useState<DeviationCause | null>(null)

  return (
    <section>
      <SectionHeader title="O que está explicando o desvio" description="Decomposição do impacto financeiro por categoria, com nível de confiança" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {causas.map((causa) => {
          const conf = confidenceConfig[causa.confianca]
          return (
            <Card key={causa.id} className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-card-title text-ink-primary">{causa.categoria}</p>
                <Tooltip content={causa.justificativaConfianca}>
                  <span className={cn('rounded-full border px-2 py-0.5 text-badge cursor-help', conf.classes)}>{conf.label}</span>
                </Tooltip>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-metric-sm text-danger">{formatCurrencyBRL(causa.impacto)}</span>
                <span className="text-support text-ink-tertiary">{(causa.participacao * 100).toFixed(1)}% do impacto</span>
              </div>
              <ul className="flex flex-col gap-1 text-support text-ink-secondary list-disc list-inside">
                {causa.evidenciasResumo.slice(0, 3).map((ev, i) => (
                  <li key={i}>{ev}</li>
                ))}
              </ul>
              {causa.evidencias.length > 0 && (
                <Button size="sm" variant="secondary" leftIcon={<Eye className="h-3.5 w-3.5" />} className="self-start mt-1" onClick={() => setOpenCause(causa)}>
                  Ver evidências
                </Button>
              )}
            </Card>
          )
        })}
      </div>

      <Drawer isOpen={Boolean(openCause)} onClose={() => setOpenCause(null)} title={openCause ? `Evidências — ${openCause.categoria}` : ''} widthClassName="w-full max-w-lg">
        {openCause && (
          <div className="flex flex-col gap-4">
            <p className="text-support text-ink-tertiary rounded-md bg-surface-subtle p-3">
              As conclusões do CORTEX apoiam a investigação, mas devem ser validadas pelos responsáveis antes de qualquer ajuste definitivo.
            </p>
            {openCause.evidencias.map((ev, i) => (
              <div key={i} className="rounded-md border border-border bg-surface p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className={cn('rounded-full border px-2 py-0.5 text-badge', confidenceConfig[ev.confianca].classes)}>
                    {confidenceConfig[ev.confianca].label}
                  </span>
                  <span className="text-caption text-ink-tertiary">{ev.data}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-support">
                  <div><p className="text-caption text-ink-tertiary">Observado</p><p className="text-ink-primary">{ev.dadoObservado}</p></div>
                  <div><p className="text-caption text-ink-tertiary">Esperado</p><p className="text-ink-primary">{ev.dadoEsperado}</p></div>
                </div>
                <div className="text-support"><span className="text-caption text-ink-tertiary">Diferença: </span>{ev.diferenca}</div>
                <div className="flex items-center justify-between text-caption text-ink-tertiary">
                  <span>Origem: {ev.origem}</span>
                  <span>Responsável: {ev.responsavel}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </section>
  )
}
