import { useParams } from 'react-router-dom'
import { CmvBreadcrumb } from '@/components/cmv/CmvBreadcrumb'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { DataList } from '@/components/ui/DataList'
import { getCmvClosingRecordById } from '@/data/cmv/cmvClosings'
import { useCmvPeriodClosing } from '@/hooks/useCmvPeriodClosing'
import { cmvNetworkPeriod } from '@/data/cmv/cmvPeriod'
import { formatCurrencyBRL, formatDateFull, formatPercent, formatPercentPoints } from '@/utils/format'
import NotFound from './NotFound'

const statusLabel = { aberto: 'Aberto', em_revisao: 'Em revisão', aguardando_dados: 'Aguardando dados', pronto_para_fechar: 'Pronto para fechar', fechado: 'Fechado', reaberto: 'Reaberto' }

export default function CmvClosingPeriodDetail() {
  const { periodId } = useParams<{ periodId: string }>()
  const { record } = useCmvPeriodClosing()
  const base = periodId ? getCmvClosingRecordById(periodId) : undefined
  if (!base) return <NotFound />

  const isCurrent = base.periodId === cmvNetworkPeriod.periodId
  const snapshot = isCurrent && record ? { ...base, status: 'fechado' as const, fechadoPor: record.fechadoPor, dataFechamento: record.dataFechamento, observacao: record.observacao } : base

  return (
    <div className="flex flex-col gap-6">
      <CmvBreadcrumb trail={[{ label: 'Fechamento', path: '/cmv/fechamentos' }, { label: snapshot.periodoLabel }]} />

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-page-title">{snapshot.periodoLabel}</h1>
        <IndicatorBadge status={snapshot.status === 'fechado' ? 'success' : 'attention'}>{statusLabel[snapshot.status]}</IndicatorBadge>
      </div>

      <DataList
        items={[
          { label: 'CMV real', value: formatPercent(snapshot.cmvReal) },
          { label: 'CMV teórico', value: formatPercent(snapshot.cmvTeorico) },
          { label: 'Meta', value: formatPercent(snapshot.meta) },
          { label: 'Diferença vs. teórico', value: formatPercentPoints(snapshot.cmvReal - snapshot.cmvTeorico) },
          { label: 'Impacto financeiro', value: formatCurrencyBRL(snapshot.impacto) },
          { label: 'Qualidade dos dados', value: formatPercent(snapshot.qualidadeDados, 0) },
          { label: 'Fechado por', value: snapshot.fechadoPor ?? '—' },
          { label: 'Data de fechamento', value: snapshot.dataFechamento ? formatDateFull(snapshot.dataFechamento) : '—' },
          { label: 'Observação', value: snapshot.observacao ?? '—' },
        ]}
      />

      <p className="text-caption text-ink-tertiary border-t border-border pt-3">
        Snapshot demonstrativo do período — sem efeito contábil. Os valores não são alterados após o fechamento.
      </p>
    </div>
  )
}
