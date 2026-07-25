import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Ban, ShieldCheck, Sparkles, UserX } from 'lucide-react'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminUserStatusBadge } from '@/components/administration/AdminUserStatusBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataList } from '@/components/ui/DataList'
import { Tabs } from '@/components/ui/Tabs'
import { Button } from '@/components/ui/Button'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { getRoleById } from '@/data/administration/roles'
import { getAccessConflictsByRole, getPermissionState, permissionRows } from '@/data/administration/permissions'
import { approvalLimitRules } from '@/data/administration/approvalLimits'
import { getSessionsByUser } from '@/data/administration/securitySettings'
import { auditEvents as staticAuditEvents } from '@/data/administration/auditEvents'
import { units } from '@/data/units'
import { userNotificationPreferences } from '@/data/administration/notificationSettings'
import { accessScopeLabel, permissionStateLabel } from '@/utils/accessScope'
import { auditCriticalityLabel, auditCriticalityStatus } from '@/utils/auditFormatters'
import { formatDateFull, formatRelativeShort } from '@/utils/format'
import { useAppState } from '@/context/AppStateContext'
import NotFound from './NotFound'

export default function AdminUserDetail() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { allUsers, getEffectiveUser, auditLog, reviewAccess, setUserStatus, extendTemporaryAccess, endTemporaryAccess } = useAdminUsers()
  const [activeTab, setActiveTab] = useState('perfil')
  const [reviewOpen, setReviewOpen] = useState(false)
  const [deactivateOpen, setDeactivateOpen] = useState(false)
  const [justificativa, setJustificativa] = useState('')
  const [motivoRemocao, setMotivoRemocao] = useState('Desligamento')
  const [substitutoId, setSubstitutoId] = useState('')

  const user = userId ? getEffectiveUser(userId) : undefined
  if (!user) return <NotFound />

  const role = getRoleById(user.roleId)
  const conflicts = getAccessConflictsByRole(user.roleId)
  const rolePermissions = permissionRows.filter((r) => r.allowed.some((a) => a.roleId === user.roleId))
  const unitNames = user.unidades.includes('*') ? ['Todas as unidades'] : user.unidades.map((id) => units.find((u) => u.id === id)?.nomeCurto ?? id)
  const relatedAudit = [...auditLog, ...staticAuditEvents].filter((e) => e.recurso.includes(user.nome) || e.usuario === user.nome).sort((a, b) => new Date(b.dataIso).getTime() - new Date(a.dataIso).getTime())
  const userSessions = getSessionsByUser(user.id)

  const tabItems = [
    { id: 'perfil', label: 'Perfil e dados' },
    { id: 'permissoes', label: 'Perfis e permissões' },
    { id: 'seguranca', label: 'Segurança e sessões' },
    { id: 'atividade', label: 'Atividade e histórico' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Usuários', path: '/configuracoes/usuarios' }, { label: user.nome }]} />

      <PageHeader
        eyebrow="Administração"
        title={user.nome}
        description={`${user.cargo} · ${role?.nome ?? user.roleId}`}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <AdminUserStatusBadge status={user.status} />
            {user.autenticacaoDoisFatores ? <IndicatorBadge status="success">2FA ativada</IndicatorBadge> : <IndicatorBadge status="attention">Sem 2FA</IndicatorBadge>}
            {user.precisaRevisao && <IndicatorBadge status="critical">Aguardando revisão</IndicatorBadge>}
          </div>
        }
        actions={
          <>
            {user.precisaRevisao && (
              <Button size="sm" variant="navy" leftIcon={<ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setReviewOpen(true)}>
                Revisar acesso
              </Button>
            )}
            {user.acessoTemporario && (
              <>
                <Button size="sm" variant="secondary" onClick={() => endTemporaryAccess(user.id)}>
                  Encerrar
                </Button>
                <Button size="sm" variant="navy" onClick={() => extendTemporaryAccess(user.id, '2026-08-27T23:59:00-03:00')}>
                  Prorrogar
                </Button>
              </>
            )}
            {user.status !== 'removido' && (
              <Button size="sm" variant="secondary" leftIcon={<UserX className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setDeactivateOpen(true)}>
                Desativar
              </Button>
            )}
            <Button size="sm" variant="primary" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex(`O acesso de ${user.nome} está adequado?`, `Usuário — ${user.nome}`)}>
              Pergunte ao CORTEX
            </Button>
          </>
        }
      />

      <Tabs items={tabItems} defaultTabId={activeTab} onChange={setActiveTab} />

      {activeTab === 'perfil' && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section className="xl:col-span-6">
            <SectionHeader title="Dados" />
            <DataList
              items={[
                { label: 'E-mail', value: user.email },
                { label: 'Telefone', value: user.telefone ?? '—' },
                { label: 'Cargo', value: user.cargo },
                { label: 'Área', value: user.area ?? '—' },
                { label: 'Responsável', value: user.responsavelId ? getEffectiveUser(user.responsavelId)?.nome ?? '—' : '—' },
                { label: 'Criado em', value: formatDateFull(user.criadoEmIso) },
                { label: 'Último acesso', value: user.ultimoAcessoIso ? formatDateFull(user.ultimoAcessoIso) : '—' },
              ]}
            />
          </section>
          <section className="xl:col-span-6">
            <SectionHeader title="Função e unidades" />
            <DataList
              items={[
                { label: 'Perfil atribuído', value: role?.nome ?? user.roleId },
                { label: 'Escopo padrão do perfil', value: role ? accessScopeLabel[role.escopoPadrao] : '—' },
                { label: 'Unidades', value: unitNames.join(', ') },
                { label: 'Permissões críticas', value: user.permissoesCriticasCount },
                { label: 'Permissões diretas (exceções)', value: user.permissoesDiretasCount },
              ]}
            />
            {user.acessoTemporario && (
              <p className="mt-3 rounded-md bg-warning-soft p-3 text-support text-warning">
                Acesso temporário até {formatDateFull(user.acessoTemporario.fimIso)} — escopo: {user.acessoTemporario.escopo}
              </p>
            )}
            {user.status === 'removido' && (
              <p className="mt-3 rounded-md bg-surface-subtle p-3 text-support text-ink-secondary">
                Removido em {user.removidoEmIso ? formatDateFull(user.removidoEmIso) : '—'}. Motivo: {user.motivoRemocao ?? '—'}.
                {user.substitutoId && ` Pendências transferidas para ${getEffectiveUser(user.substitutoId)?.nome ?? user.substitutoId}.`}
              </p>
            )}
          </section>
        </div>
      )}

      {activeTab === 'permissoes' && (
        <div className="flex flex-col gap-6">
          {conflicts.length > 0 && (
            <section>
              <SectionHeader title="Conflitos de acesso" />
              <div className="flex flex-col gap-2">
                {conflicts.map((c) => (
                  <div key={c.id} className="rounded-lg border border-warning/30 bg-warning-soft/40 p-3">
                    <p className="text-support font-medium text-warning">{c.titulo}</p>
                    <p className="mt-1 text-caption text-ink-secondary">{c.descricao}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section>
            <SectionHeader title="Permissões do perfil" description="Herdadas do perfil atribuído — exceções individuais aparecem destacadas" />
            <div className="overflow-x-auto rounded-lg border border-border bg-surface">
              <table className="w-full border-collapse text-support">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Permissão</th>
                    <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Estado</th>
                    <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Escopo</th>
                  </tr>
                </thead>
                <tbody>
                  {rolePermissions.map((r) => {
                    const cell = getPermissionState(user.roleId, r.permission.id)
                    if (!cell) return null
                    return (
                      <tr key={r.permission.id} className="border-b border-border last:border-b-0">
                        <td className="h-11 px-4 text-ink-primary">{r.permission.recurso}</td>
                        <td className="h-11 px-4 text-ink-secondary">{permissionStateLabel[cell.estado]}</td>
                        <td className="h-11 px-4 text-ink-secondary">{accessScopeLabel[cell.escopo]}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <SectionHeader title="Alçadas aplicáveis ao perfil" />
            <DataList items={approvalLimitRules.filter((r) => r.aprovadorPerfil.includes(role?.nome ?? '')).map((r) => ({ label: `${r.modulo} — ${r.evento}`, value: r.condicao }))} />
          </section>
        </div>
      )}

      {activeTab === 'seguranca' && (
        <div className="flex flex-col gap-6">
          <section>
            <SectionHeader title="Segurança" />
            <DataList
              items={[
                { label: 'Autenticação em dois fatores', value: user.autenticacaoDoisFatores ? 'Ativada' : 'Pendente' },
                { label: 'Status da conta', value: <AdminUserStatusBadge status={user.status} /> },
              ]}
            />
          </section>
          <section>
            <SectionHeader title="Sessões" />
            {userSessions.length === 0 ? (
              <p className="text-support text-ink-tertiary">Nenhuma sessão ativa registrada nesta amostra.</p>
            ) : (
              <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
                {userSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div>
                      <p className="text-support font-medium text-ink-primary">
                        {s.dispositivo} · {s.navegador}
                      </p>
                      <p className="text-caption text-ink-tertiary">
                        {s.localizacaoAproximada} · {formatRelativeShort(s.ultimoAcessoIso)}
                      </p>
                    </div>
                    <IndicatorBadge status={s.status === 'ativa' ? 'success' : 'neutral'}>{s.status === 'ativa' ? 'Ativa' : 'Encerrada'}</IndicatorBadge>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section>
            <SectionHeader title="Notificações" />
            <DataList
              items={[
                { label: 'Notificações imediatas', value: userNotificationPreferences.imediatas ? 'Ativadas' : 'Desativadas' },
                { label: 'Resumo diário', value: userNotificationPreferences.resumoDiario ? 'Ativado' : 'Desativado' },
                { label: 'Horário de silêncio', value: userNotificationPreferences.horarioSilencio },
                { label: 'Criticidade mínima', value: userNotificationPreferences.criticidadeMinima },
              ]}
            />
          </section>
        </div>
      )}

      {activeTab === 'atividade' && (
        <section>
          <SectionHeader title="Atividade e ações administrativas" description="Eventos de auditoria relacionados a este usuário" />
          {relatedAudit.length === 0 ? (
            <p className="text-support text-ink-tertiary">Nenhum evento de auditoria registrado para este usuário na amostra demonstrativa.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
              {relatedAudit.map((e) => (
                <button
                  key={e.id}
                  onClick={() => navigate(`/configuracoes/auditoria?evento=${e.id}`)}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
                >
                  <div>
                    <p className="text-support font-medium text-ink-primary">{e.acao}</p>
                    <p className="text-caption text-ink-tertiary">
                      {e.recurso} · {formatRelativeShort(e.dataIso)}
                    </p>
                  </div>
                  <IndicatorBadge status={auditCriticalityStatus[e.criticidade]}>{auditCriticalityLabel[e.criticidade]}</IndicatorBadge>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <Modal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} title="Revisar acesso" description={user.motivoRevisao}>
        <div className="flex flex-col gap-4">
          <p className="text-support text-ink-secondary">
            Restringir {user.nome} ao escopo padrão do perfil {role?.nome} — remove exceções individuais de permissão.
          </p>
          <Input label="Justificativa" value={justificativa} onChange={(e) => setJustificativa(e.target.value)} placeholder="Descreva o motivo da revisão" />
        </div>
        <div className="flex items-center justify-end gap-2 pt-5">
          <Button variant="secondary" onClick={() => setReviewOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!justificativa.trim()}
            onClick={() => {
              reviewAccess(user.id, justificativa.trim())
              setJustificativa('')
              setReviewOpen(false)
            }}
          >
            Restringir e salvar
          </Button>
        </div>
      </Modal>

      <Modal isOpen={deactivateOpen} onClose={() => setDeactivateOpen(false)} title="Desativar usuário" description="O histórico e as ações do usuário são preservados — o cadastro não é apagado.">
        <div className="flex flex-col gap-4">
          <Input label="Motivo" value={motivoRemocao} onChange={(e) => setMotivoRemocao(e.target.value)} />
          <Select
            label="Transferir pendências para"
            value={substitutoId}
            onChange={(e) => setSubstitutoId(e.target.value)}
            options={[
              { value: '', label: 'Selecionar substituto (opcional)' },
              ...allUsers.filter((u) => u.id !== user.id && u.roleId === user.roleId && u.status === 'ativo').map((u) => ({ value: u.id, label: u.nome })),
            ]}
          />
        </div>
        <div className="flex items-center justify-end gap-2 pt-5">
          <Button variant="secondary" onClick={() => setDeactivateOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            leftIcon={<Ban className="h-3.5 w-3.5" strokeWidth={1.7} />}
            onClick={() => {
              setUserStatus(user.id, 'removido', motivoRemocao)
              setDeactivateOpen(false)
            }}
          >
            Desativar usuário
          </Button>
        </div>
      </Modal>
    </div>
  )
}
