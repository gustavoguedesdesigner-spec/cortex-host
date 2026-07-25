import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import {
  alertFatigueInsight,
  notificationCategories,
  notificationChannels,
  notificationRules,
  userNotificationPreferences,
} from '@/data/administration/notificationSettings'
import { auditCriticalityLabel, auditCriticalityStatus } from '@/utils/auditFormatters'

export default function AdminNotifications() {
  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Notificações' }]} />

      <PageHeader eyebrow="Administração" title="Notificações" description="Canais, categorias e regras de notificação — sem envio real." />

      <AdminInternalNav active="notificacoes" />

      <section>
        <SectionHeader title="Canais" />
        <div className="flex flex-wrap gap-2">
          {notificationChannels.map((c) => (
            <IndicatorBadge key={c.id} status={c.disponivel ? 'success' : 'neutral'}>
              {c.label}
              {!c.disponivel && ' (futuro)'}
            </IndicatorBadge>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Categorias" />
        <div className="flex flex-wrap gap-1.5">
          {notificationCategories.map((c) => (
            <span key={c} className="rounded-full border border-border bg-surface px-2.5 py-1 text-caption font-medium text-ink-secondary">
              {c}
            </span>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Regras de notificação" />
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full border-collapse text-support">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Evento</th>
                <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Categoria</th>
                <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Criticidade</th>
                <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Canal</th>
                <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Frequência</th>
              </tr>
            </thead>
            <tbody>
              {notificationRules.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-b-0">
                  <td className="h-12 px-4 text-ink-primary">{r.evento}</td>
                  <td className="h-12 px-4 text-ink-secondary">{r.categoria}</td>
                  <td className="h-12 px-4">
                    <IndicatorBadge status={auditCriticalityStatus[r.criticidade]}>{auditCriticalityLabel[r.criticidade]}</IndicatorBadge>
                  </td>
                  <td className="h-12 px-4 text-ink-secondary">{r.canal}</td>
                  <td className="h-12 px-4 text-ink-secondary">{r.frequencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <SectionHeader title="Preferências — Leo" />
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 text-support text-ink-secondary">
          <p>Notificações imediatas: {userNotificationPreferences.imediatas ? 'ativadas' : 'desativadas'}</p>
          <p>Resumo diário: {userNotificationPreferences.resumoDiario ? 'ativado' : 'desativado'}</p>
          <p>Resumo semanal: {userNotificationPreferences.resumoSemanal ? 'ativado' : 'desativado'}</p>
          <p>Horário de silêncio: {userNotificationPreferences.horarioSilencio}</p>
          <p>Criticidade mínima: {userNotificationPreferences.criticidadeMinima}</p>
          <p className="text-caption text-ink-tertiary">Notificações críticas obrigatórias não podem ser totalmente desativadas sem uma política que autorize a exceção.</p>
        </div>
      </section>

      <section>
        <SectionHeader title="Fadiga de alertas" />
        <div className="rounded-lg border border-warning/30 bg-warning-soft/40 p-4">
          <p className="text-support font-medium text-warning">Excesso de notificações</p>
          <p className="mt-1 text-support text-ink-secondary">
            O perfil {alertFatigueInsight.perfil} recebe em média {alertFatigueInsight.mediaNotificacoesPorDia} notificações por dia. {alertFatigueInsight.baixaPrioridade} são de baixa
            prioridade e podem ser consolidadas.
          </p>
          <p className="mt-1 text-caption text-ink-tertiary">{alertFatigueInsight.recomendacao}</p>
        </div>
      </section>
    </div>
  )
}
