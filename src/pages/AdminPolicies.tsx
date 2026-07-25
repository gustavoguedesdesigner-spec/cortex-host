import { useState } from 'react'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataList } from '@/components/ui/DataList'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Drawer } from '@/components/ui/Drawer'
import { governancePolicies, configurationGovernance } from '@/data/administration/governancePolicies'
import { governancePolicyStatusLabel, readConfirmationRate } from '@/utils/governanceValidation'
import { formatDateFull, formatPercent } from '@/utils/format'
import type { GovernancePolicy } from '@/types'

const statusIndicator = { vigente: 'success', em_revisao: 'attention', vencida: 'critical' } as const
const govStatusLabel = { aplicada: 'Aplicada', pendente: 'Pendente', em_analise: 'Em análise' }

export default function AdminPolicies() {
  const [selected, setSelected] = useState<GovernancePolicy | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Políticas' }]} />

      <PageHeader eyebrow="Administração" title="Políticas" description="Versão, responsável, aprovador, vigência e confirmação de leitura por política." />

      <AdminInternalNav active="politicas" />

      <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
        {governancePolicies.map((p) => (
          <button key={p.id} onClick={() => setSelected(p)} className="flex flex-col gap-1.5 px-4 py-3 text-left transition-colors hover:bg-surface-hover sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-support font-medium text-ink-primary">{p.nome}</p>
                <span className="text-caption text-ink-tertiary">v{p.versao}</span>
                <IndicatorBadge status={statusIndicator[p.status]}>{governancePolicyStatusLabel[p.status]}</IndicatorBadge>
              </div>
              <p className="mt-0.5 text-caption text-ink-tertiary">
                {p.categoria} · Responsável: {p.responsavel} · Revisão em {formatDateFull(p.revisaoIso)}
              </p>
            </div>
            <span className="shrink-0 text-caption text-ink-tertiary">{formatPercent(readConfirmationRate(p), 0)} de leitura confirmada</span>
          </button>
        ))}
      </div>

      <section>
        <SectionHeader title="Governança da configuração" description="Alterações pendentes e responsáveis" />
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
          {configurationGovernance.alteracoesPendentes.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-support font-medium text-ink-primary">{a.descricao}</p>
                <p className="text-caption text-ink-tertiary">Responsável: {a.responsavel}</p>
              </div>
              <IndicatorBadge status={a.status === 'aplicada' ? 'success' : a.status === 'em_analise' ? 'attention' : 'neutral'}>{govStatusLabel[a.status as keyof typeof govStatusLabel]}</IndicatorBadge>
            </div>
          ))}
        </div>
        <p className="mt-2 text-caption text-ink-tertiary">{configurationGovernance.ambiente}</p>
      </section>

      <Drawer isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.nome ?? ''} widthClassName="w-full max-w-lg">
        {selected && (
          <div className="flex flex-col gap-5">
            <DataList
              items={[
                { label: 'Categoria', value: selected.categoria },
                { label: 'Versão', value: selected.versao },
                { label: 'Status', value: <IndicatorBadge status={statusIndicator[selected.status]}>{governancePolicyStatusLabel[selected.status]}</IndicatorBadge> },
                { label: 'Responsável', value: selected.responsavel },
                { label: 'Aprovador', value: selected.aprovador },
                { label: 'Vigência', value: formatDateFull(selected.vigenciaIso) },
                { label: 'Próxima revisão', value: formatDateFull(selected.revisaoIso) },
                { label: 'Pessoas impactadas', value: selected.pessoasImpactadas },
                { label: 'Confirmações de leitura', value: `${selected.confirmacoesLeitura} (${formatPercent(readConfirmationRate(selected), 0)})` },
              ]}
            />
            <div>
              <p className="mb-1 text-label text-ink-tertiary">Resumo</p>
              <p className="text-support text-ink-secondary">{selected.resumo}</p>
            </div>
            {selected.principios && (
              <div>
                <p className="mb-2 text-label text-ink-tertiary">Princípios</p>
                <ul className="flex flex-col gap-1.5 text-support text-ink-secondary">
                  {selected.principios.map((p) => (
                    <li key={p}>· {p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}
