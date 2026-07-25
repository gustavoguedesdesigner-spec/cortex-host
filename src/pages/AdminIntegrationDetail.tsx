import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, Pause, Plug, RefreshCw, XCircle } from 'lucide-react'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminIntegrationStatusBadge } from '@/components/administration/AdminIntegrationStatusBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { useAdminIntegrations } from '@/hooks/useAdminIntegrations'
import { getIntegrationErrors } from '@/data/administration/integrations'
import { units } from '@/data/units'
import { formatDateFull, formatPercent } from '@/utils/format'
import NotFound from './NotFound'

export default function AdminIntegrationDetail() {
  const { integrationId } = useParams<{ integrationId: string }>()
  const { getEffectiveIntegration, testConnection, sync, pause, reconnect } = useAdminIntegrations()
  const [testResult, setTestResult] = useState<boolean | null>(null)

  const integration = integrationId ? getEffectiveIntegration(integrationId) : undefined
  if (!integration) return <NotFound />

  const errors = getIntegrationErrors(integration.id)

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Integrações', path: '/configuracoes/integracoes' }, { label: integration.nome }]} />

      <PageHeader
        eyebrow="Administração"
        title={integration.nome}
        description={integration.tipo}
        meta={<AdminIntegrationStatusBadge status={integration.status} />}
        actions={
          <>
            <Button size="sm" variant="secondary" leftIcon={<Plug className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setTestResult(testConnection(integration.id).success)}>
              Testar conexão
            </Button>
            <Button size="sm" variant="navy" leftIcon={<RefreshCw className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => sync(integration.id)}>
              Sincronizar agora
            </Button>
            {integration.status === 'pausada' ? (
              <Button size="sm" variant="secondary" onClick={() => reconnect(integration.id)}>
                Reconectar
              </Button>
            ) : (
              <Button size="sm" variant="ghost" leftIcon={<Pause className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => pause(integration.id)}>
                Pausar
              </Button>
            )}
          </>
        }
      />

      {testResult !== null && (
        <div className={`flex items-center gap-2 rounded-md p-3 text-support ${testResult ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'}`}>
          {testResult ? <CheckCircle2 className="h-4 w-4" strokeWidth={1.7} /> : <XCircle className="h-4 w-4" strokeWidth={1.7} />}
          {testResult ? 'Conexão estabelecida com sucesso.' : 'Falha ao conectar — verifique as credenciais e tente novamente.'}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-6">
          <SectionHeader title="Detalhes" />
          <DataList
            items={[
              { label: 'Módulos', value: integration.modulos.join(', ') || '—' },
              { label: 'Unidades', value: integration.unidades.length > 0 ? integration.unidades.map((id) => units.find((u) => u.id === id)?.nomeCurto ?? id).join(', ') : 'Não configurado' },
              { label: 'Frequência', value: integration.frequencia },
              { label: 'Última sincronização', value: integration.ultimaSincronizacaoIso ? formatDateFull(integration.ultimaSincronizacaoIso) : '—' },
              { label: 'Próxima sincronização', value: integration.proximaSincronizacaoIso ? formatDateFull(integration.proximaSincronizacaoIso) : '—' },
              { label: 'Registros processados', value: integration.registrosProcessados?.toLocaleString('pt-BR') ?? '—' },
              { label: 'Erros', value: integration.errosCount },
              { label: 'Responsável', value: integration.responsavel },
              { label: 'Autenticação', value: integration.autenticacaoMascarada ?? 'Não configurada' },
            ]}
          />
        </section>

        {integration.qualidade && (
          <section className="xl:col-span-6">
            <SectionHeader title="Qualidade de sincronização" />
            <DataList
              items={[
                { label: 'Completude', value: formatPercent(integration.qualidade.completude, 0) },
                { label: 'Pontualidade', value: formatPercent(integration.qualidade.pontualidade, 0) },
                { label: 'Consistência', value: formatPercent(integration.qualidade.consistencia, 0) },
                { label: 'Confiança', value: formatPercent(integration.qualidade.confianca, 0) },
              ]}
            />
          </section>
        )}
      </div>

      {integration.mapeamentos && integration.mapeamentos.length > 0 && (
        <section>
          <SectionHeader title="Mapeamento de dados" description="Origem → campo externo → campo do CORTEX → transformação → status" />
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full border-collapse text-support">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Campo de origem</th>
                  <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Campo externo</th>
                  <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Campo do CORTEX</th>
                  <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Transformação</th>
                  <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Status</th>
                </tr>
              </thead>
              <tbody>
                {integration.mapeamentos.map((m, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0">
                    <td className="h-11 px-4 text-ink-primary">{m.campoOrigem}</td>
                    <td className="h-11 px-4 text-ink-secondary">{m.campoExterno}</td>
                    <td className="h-11 px-4 text-ink-secondary">{m.campoCortex}</td>
                    <td className="h-11 px-4 text-ink-secondary">{m.transformacao}</td>
                    <td className="h-11 px-4">
                      <IndicatorBadge status={m.status === 'mapeado' ? 'success' : m.status === 'pendente' ? 'attention' : 'critical'}>
                        {m.status === 'mapeado' ? 'Mapeado' : m.status === 'pendente' ? 'Pendente' : 'Erro'}
                      </IndicatorBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {errors.length > 0 && (
        <section>
          <SectionHeader title="Erros" />
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
            {errors.map((e) => (
              <div key={e.id} className="flex flex-col gap-1 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-support font-medium text-ink-primary">
                    {e.codigo} — {e.tipo}
                  </p>
                  <IndicatorBadge status={e.status === 'aberto' ? 'critical' : 'success'}>{e.status === 'aberto' ? 'Aberto' : 'Resolvido'}</IndicatorBadge>
                </div>
                <p className="text-caption text-ink-tertiary">
                  {e.unidade && `${e.unidade} · `}
                  {formatDateFull(e.dataIso)} · {e.registrosAfetados} registros afetados
                </p>
                <p className="text-caption text-ink-secondary">{e.impacto}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
