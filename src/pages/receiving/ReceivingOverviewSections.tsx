import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { ReceiptStatusBadge, QuarantineStatusBadge } from '@/components/receiving/ReceivingBadges'
import { receivingSummary, receivingExecutiveSummaryText, receivingExecutiveRecommendations } from '@/data/receiving/receivingSituation'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { getUnitById } from '@/data/units'
import { formatCurrencyBRL, formatCurrencyCompactBRL, formatPercent } from '@/utils/format'
import { useAppState } from '@/context/AppStateContext'
import type { Receipt, QuarantineRecord } from '@/types'

export function ReceivingCortexSummarySection() {
  const navigate = useNavigate()
  const { askCortex } = useAppState()

  return (
    <section>
      <Card elevation="raised" className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-label uppercase tracking-[0.06em] text-accent">
          <Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />
          Entendimento do CORTEX
        </div>
        <p className="text-body leading-relaxed text-ink-secondary">{receivingExecutiveSummaryText}</p>
        <ol className="flex flex-col gap-1.5 text-support text-ink-secondary">
          {receivingExecutiveRecommendations.map((r, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="font-semibold tabular text-ink-tertiary">{String(i + 1).padStart(2, '0')}</span>
              {r}
            </li>
          ))}
        </ol>
        <div className="mt-1 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => navigate('/recebimentos/divergencias')}>
            Ver divergências
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate('/recebimentos/quarentena')}>
            Ver quarentena
          </Button>
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Por que a NF 9821 está divergente?', 'Recebimentos')}>
            Perguntar ao CORTEX
          </Button>
        </div>
      </Card>
    </section>
  )
}

export function ReceivingIndicatorsStrip() {
  const navigate = useNavigate()
  const s = receivingSummary

  return (
    <MetricStrip>
      <MetricCard titulo="Agendados hoje" valor={String(s.agendadosHoje)} status="neutral" comparacao="ver agenda" onClick={() => navigate('/recebimentos/agenda')} />
      <MetricCard titulo="Aguardando conferência" valor={String(s.aguardandoConferencia)} status="info" comparacao="ver lista" onClick={() => navigate('/recebimentos/aguardando')} />
      <MetricCard titulo="Em conferência" valor={String(s.emConferencia)} status="info" comparacao="ver todos" onClick={() => navigate('/recebimentos')} />
      <MetricCard titulo="Divergências abertas" valor={String(s.divergenciasAbertas)} status="critical" comparacao="ver divergências" onClick={() => navigate('/recebimentos/divergencias')} />
      <MetricCard titulo="Em quarentena" valor={String(s.emQuarentena)} status="attention" comparacao="ver quarentena" onClick={() => navigate('/recebimentos/quarentena')} />
      <MetricCard titulo="Concluídos no período" valor={String(s.concluidosNoPeriodo)} status="success" comparacao="ver histórico" onClick={() => navigate('/recebimentos/historico')} />
      <MetricCard titulo="Valor em divergência" valor={formatCurrencyCompactBRL(s.valorEmDivergencia)} status="critical" comparacao="ver Compras" onClick={() => navigate('/compras')} />
      <MetricCard titulo="Taxa de conformidade" valor={formatPercent(s.taxaConformidade, 0)} status="neutral" comparacao={`${s.tempoMedioConferenciaMin} min em média`} />
    </MetricStrip>
  )
}

export function ReceivingDivergencesPreviewSection({ divergentes }: { divergentes: Receipt[] }) {
  const navigate = useNavigate()

  return (
    <section>
      <SectionHeader title="Divergências recentes" description="Recebimentos com pedido, documento ou físico fora de conformidade" actions={<Button size="sm" variant="ghost" onClick={() => navigate('/recebimentos/divergencias')}>Ver todas</Button>} />
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
        {divergentes.slice(0, 4).map((r) => {
          const supplier = getSupplierById(r.supplierId)
          return (
            <button key={r.id} onClick={() => navigate(`/recebimentos/${r.id}`)} className="flex items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
              <div className="min-w-0">
                <p className="text-support font-medium text-ink-primary">
                  NF {r.nfNumero || r.id.toUpperCase()} · {supplier?.nome} · {getUnitById(r.unitId)?.nomeCurto}
                </p>
                <p className="truncate text-caption text-ink-tertiary">{r.motivoDecisao ?? r.itens[0]?.observacao ?? 'Divergência registrada.'}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {r.impactoFinanceiro > 0 && <span className="text-support font-medium tabular text-danger">{formatCurrencyBRL(r.impactoFinanceiro)}</span>}
                <ReceiptStatusBadge status={r.status} />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function ReceivingQuarantinePreviewSection({ quarantine }: { quarantine: QuarantineRecord[] }) {
  const navigate = useNavigate()
  if (quarantine.length === 0) return null

  return (
    <section>
      <SectionHeader title="Em quarentena" description="Itens retidos até decisão explícita — nunca liberados automaticamente" actions={<Button size="sm" variant="ghost" onClick={() => navigate('/recebimentos/quarentena')}>Ver todos</Button>} />
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
        {quarantine.map((q) => (
          <button key={q.id} onClick={() => navigate(`/recebimentos/${q.receiptId}`)} className="flex items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
            <div className="min-w-0">
              <p className="text-support font-medium text-ink-primary">{q.itemNome}</p>
              <p className="truncate text-caption text-ink-tertiary">{q.motivo}</p>
            </div>
            <QuarantineStatusBadge status={q.status} />
          </button>
        ))}
      </div>
    </section>
  )
}
