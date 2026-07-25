import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, CircleCheckBig, Lock, RotateCcw } from 'lucide-react'
import { CmvBreadcrumb } from '@/components/cmv/CmvBreadcrumb'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { cmvClosingBlockingMessage, cmvClosingHistory, cmvDemonstrativeClosingNotice } from '@/data/cmv/cmvClosings'
import { cmvDataQuality, cmvNetworkPeriod } from '@/data/cmv/cmvPeriod'
import { computeNetworkPeriod } from '@/utils/cmvCalculations'
import { useCmvClosingOverrides } from '@/hooks/useCmvClosingOverrides'
import { useCmvPeriodClosing } from '@/hooks/useCmvPeriodClosing'
import { units } from '@/data/units'
import { formatCurrencyBRL, formatDateFull, formatPercent } from '@/utils/format'
import type { CmvClosingRecord } from '@/types'

const statusLabel = { concluido: 'Concluído', pendente: 'Pendente', bloqueado: 'Bloqueado' }

export default function CmvClosing() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { checklist, podeFechar, markResolved, isResolved } = useCmvClosingOverrides()
  const { record, fechar, reabrir } = useCmvPeriodClosing()
  const computed = computeNetworkPeriod(cmvNetworkPeriod)

  const [simulating, setSimulating] = useState(false)
  const [simulated, setSimulated] = useState(false)
  const [responsavel, setResponsavel] = useState('Leo')
  const [observacao, setObservacao] = useState('')

  const historyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchParams.get('section') === 'historico') {
      historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [searchParams])

  function handleSimulate() {
    setSimulating(true)
    window.setTimeout(() => {
      setSimulating(false)
      setSimulated(true)
    }, 900)
  }

  const status = record ? 'fechado' : podeFechar ? 'pronto_para_fechar' : 'em_revisao'
  const statusText = record ? 'Fechado' : podeFechar ? 'Pronto para fechar' : 'Em revisão'
  const statusVariant = record ? 'success' : podeFechar ? 'info' : 'attention'

  const currentRow: CmvClosingRecord = {
    periodId: cmvNetworkPeriod.periodId,
    periodoLabel: cmvNetworkPeriod.periodoLabel,
    cmvReal: computed.cmvReal,
    cmvTeorico: computed.cmvTeorico,
    meta: cmvNetworkPeriod.metaCmv,
    impacto: computed.impactoVsTeorico,
    qualidadeDados: cmvDataQuality.percentual,
    status,
    fechadoPor: record?.fechadoPor,
    dataFechamento: record?.dataFechamento,
    observacao: record?.observacao,
  }

  const history = [currentRow, ...cmvClosingHistory.slice(1)]

  const columns: TableColumn<CmvClosingRecord>[] = [
    { key: 'periodo', header: 'Período', render: (r) => <span className="font-medium">{r.periodoLabel}</span> },
    { key: 'real', header: 'CMV real', align: 'right', render: (r) => formatPercent(r.cmvReal) },
    { key: 'teorico', header: 'CMV teórico', align: 'right', render: (r) => formatPercent(r.cmvTeorico) },
    { key: 'meta', header: 'Meta', align: 'right', render: (r) => formatPercent(r.meta) },
    { key: 'impacto', header: 'Impacto', align: 'right', render: (r) => formatCurrencyBRL(r.impacto) },
    { key: 'qualidade', header: 'Qualidade', align: 'right', render: (r) => formatPercent(r.qualidadeDados, 0) },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (r.status === 'fechado' ? 'Fechado' : r.status === 'pronto_para_fechar' ? 'Pronto para fechar' : 'Em revisão'),
    },
    { key: 'fechadoPor', header: 'Fechado por', render: (r) => r.fechadoPor ?? '—' },
    { key: 'data', header: 'Data', render: (r) => (r.dataFechamento ? formatDateFull(r.dataFechamento) : '—') },
    {
      key: 'acao',
      header: '',
      align: 'right',
      render: (r) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/cmv/fechamentos/${r.periodId}`)}>
          Ver
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <CmvBreadcrumb trail={[{ label: 'Fechamento' }]} />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-page-title">Fechamento do período</h1>
          <IndicatorBadge status={statusVariant}>{statusText}</IndicatorBadge>
        </div>
        <p className="text-support text-ink-secondary">{cmvNetworkPeriod.periodoLabel}</p>
      </div>

      {!record && (
        <div className="rounded-lg border border-warning/30 bg-warning-soft/40 p-4">
          <p className="text-support font-medium text-ink-primary">{cmvClosingBlockingMessage}</p>
        </div>
      )}

      <section>
        <SectionHeader title="Checklist de fechamento" description="Cada etapa precisa estar concluída para liberar o fechamento do período" />
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
          {checklist.map((item) => {
            const status = item.id === 'fechar-periodo' && record ? 'concluido' : item.status
            return (
            <div key={item.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="tabular text-caption text-ink-tertiary">{String(item.ordem).padStart(2, '0')}</span>
                  <p className="text-support font-medium text-ink-primary">{item.titulo}</p>
                  <IndicatorBadge status={status === 'concluido' ? 'success' : status === 'bloqueado' ? 'critical' : 'attention'}>
                    {statusLabel[status]}
                  </IndicatorBadge>
                </div>
                <p className="mt-0.5 text-caption text-ink-tertiary">
                  {item.responsavel} · {item.prazoLabel}
                  {item.impacto && <span className="text-warning"> · {item.impacto}</span>}
                </p>
                {item.pendencias.length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-caption text-ink-tertiary">
                    {item.pendencias.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
              {item.status === 'pendente' && !isResolved(item.id) && ['confirmar-inventarios', 'conciliar-transferencias', 'conferir-recebimentos', 'verificar-fichas-tecnicas'].includes(item.id) && (
                <Button size="sm" variant="secondary" leftIcon={<Check className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => markResolved(item.id)}>
                  Marcar como resolvido
                </Button>
              )}
            </div>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeader title="Simular fechamento" description="Recalcula deterministicamente o status do período sem alterar os dados oficiais" />
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
          <Button size="sm" variant="secondary" isLoading={simulating} onClick={handleSimulate} className="self-start">
            Simular fechamento
          </Button>
          {simulated && (
            <p className="text-support text-ink-secondary leading-relaxed">
              {podeFechar
                ? 'O período pode ser fechado — todas as etapas do checklist foram concluídas.'
                : cmvClosingBlockingMessage}
            </p>
          )}
        </div>
      </section>

      <section>
        <SectionHeader title="Fechamento demonstrativo" description={cmvDemonstrativeClosingNotice} />
        {record ? (
          <div className="flex flex-col gap-3 rounded-lg border border-success/30 bg-success-soft/40 p-5">
            <div className="flex items-center gap-2">
              <CircleCheckBig className="h-4 w-4 text-success" />
              <p className="text-support font-medium text-ink-primary">Período fechado por {record.fechadoPor}</p>
            </div>
            <p className="text-support text-ink-secondary">{formatDateFull(record.dataFechamento)}</p>
            {record.observacao && <p className="text-support text-ink-secondary">{record.observacao}</p>}
            <Button size="sm" variant="secondary" leftIcon={<RotateCcw className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={reabrir} className="self-start">
              Reabrir com justificativa
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Select label="Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} options={[{ value: 'Leo', label: 'Leo' }, ...units.map((u) => ({ value: u.gerente, label: u.gerente }))]} />
              <Input label="Observação (opcional)" value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Ex.: fechado após conclusão do inventário" />
            </div>
            <Button
              size="sm"
              variant="navy"
              leftIcon={<Lock className="h-3.5 w-3.5" strokeWidth={1.7} />}
              disabled={!podeFechar}
              onClick={() => fechar(responsavel, observacao)}
              className="self-start"
            >
              Fechar período
            </Button>
            {!podeFechar && <p className="text-caption text-ink-tertiary">Bloqueado enquanto existirem pendências críticas no checklist.</p>}
          </div>
        )}
      </section>

      <div ref={historyRef}>
        <SectionHeader title="Histórico de fechamentos" description="Compare o período atual com fechamentos anteriores" />
        <Table columns={columns} data={history} getRowId={(r) => r.periodId} />
      </div>
    </div>
  )
}
