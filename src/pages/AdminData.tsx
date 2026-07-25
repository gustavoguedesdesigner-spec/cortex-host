import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataList } from '@/components/ui/DataList'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { backupSnapshot, dataPolicyDisclaimer, dataRequests, dataRetentionPolicies } from '@/data/administration/dataPolicies'
import { formatDateFull } from '@/utils/format'

const requestTypeLabel = { exportar: 'Exportar', corrigir: 'Corrigir', restringir: 'Restringir acesso', anonimizar: 'Anonimizar', excluir: 'Excluir', revisar_consentimento: 'Revisar consentimento' }
const requestStatusLabel = { pendente: 'Pendente', em_andamento: 'Em andamento', concluida: 'Concluída', negada: 'Negada' }

export default function AdminData() {
  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Dados e retenção' }]} />

      <PageHeader eyebrow="Administração" title="Dados e retenção" description={dataPolicyDisclaimer} />

      <AdminInternalNav active="dados" />

      <section>
        <SectionHeader title="Retenção por categoria" />
        <DataList items={dataRetentionPolicies.map((p) => ({ label: p.categoria, value: p.observacao ? `${p.periodo} — ${p.observacao}` : p.periodo }))} />
      </section>

      <section>
        <SectionHeader title="Backups" />
        <DataList
          items={[
            { label: 'Último backup', value: formatDateFull(backupSnapshot.ultimoBackupIso) },
            { label: 'Frequência', value: backupSnapshot.frequencia },
            { label: 'Status', value: <IndicatorBadge status="success">Concluído</IndicatorBadge> },
            { label: 'Retenção', value: backupSnapshot.retencao },
            { label: 'Próxima execução', value: formatDateFull(backupSnapshot.proximaExecucaoIso) },
            { label: 'Restauração testada', value: backupSnapshot.restauracaoTestada ? 'Sim' : 'Não' },
            { label: 'Responsável', value: backupSnapshot.responsavel },
          ]}
        />
      </section>

      <section>
        <SectionHeader title="Solicitações de dados" description="Exportar, corrigir, restringir, anonimizar, excluir ou revisar consentimento" />
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
          {dataRequests.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-support font-medium text-ink-primary">{requestTypeLabel[r.tipo]}</p>
                <p className="text-caption text-ink-tertiary">
                  {r.solicitante} · {formatDateFull(r.dataIso)}
                </p>
              </div>
              <IndicatorBadge status={r.status === 'concluida' ? 'success' : r.status === 'negada' ? 'critical' : 'attention'}>{requestStatusLabel[r.status]}</IndicatorBadge>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
