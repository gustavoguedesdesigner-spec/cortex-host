import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminUserStatusBadge } from '@/components/administration/AdminUserStatusBadge'
import { AdminIntegrationStatusBadge } from '@/components/administration/AdminIntegrationStatusBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataList } from '@/components/ui/DataList'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Tabs } from '@/components/ui/Tabs'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { getUnitById } from '@/data/units'
import { getAdminUnitSummary, getOperationalAreasByUnit, getUnitModuleConfig } from '@/data/administration/organization'
import { getUsersByUnit } from '@/data/administration/users'
import { getRoleById, roles } from '@/data/administration/roles'
import { integrations } from '@/data/administration/integrations'
import { approvalLimitRules } from '@/data/administration/approvalLimits'
import { getAuditEventsByUnit } from '@/data/administration/auditEvents'
import { notificationRules } from '@/data/administration/notificationSettings'
import { adminModuleLabel } from '@/utils/adminModules'
import { auditCriticalityLabel, auditCriticalityStatus } from '@/utils/auditFormatters'
import { formatDateFull, formatPercent, formatRelativeShort } from '@/utils/format'
import type { User } from '@/types'
import NotFound from './NotFound'

export default function AdminUnitDetail() {
  const { unitId } = useParams<{ unitId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('geral')

  const unit = unitId ? getUnitById(unitId) : undefined
  if (!unit) return <NotFound />

  const summary = getAdminUnitSummary(unit.id)
  const areas = getOperationalAreasByUnit(unit.id)
  const moduleConfig = getUnitModuleConfig(unit.id)
  const unitUsers = getUsersByUnit(unit.id)
  const unitRoleIds = [...new Set(unitUsers.map((u) => u.roleId))]
  const unitIntegrations = integrations.filter((i) => i.unidades.includes(unit.id))
  const auditEvents = getAuditEventsByUnit(unit.nome.replace('Salvador ', ''))

  const userColumns: TableColumn<User>[] = [
    { key: 'nome', header: 'Nome', render: (u) => <span className="font-medium">{u.nome}</span> },
    { key: 'cargo', header: 'Cargo', render: (u) => u.cargo },
    { key: 'perfil', header: 'Perfil', render: (u) => getRoleById(u.roleId)?.nome ?? u.roleId },
    { key: 'status', header: 'Status', render: (u) => <AdminUserStatusBadge status={u.status} /> },
    {
      key: 'acao',
      header: '',
      align: 'right',
      render: (u) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/configuracoes/usuarios/${u.id}`)}>
          Abrir
        </Button>
      ),
    },
  ]

  const tabItems = [
    { id: 'geral', label: 'Geral' },
    { id: 'areas', label: 'Áreas e estoques' },
    { id: 'usuarios', label: 'Usuários e perfis' },
    { id: 'aprovacoes', label: 'Aprovações e integrações' },
    { id: 'parametros', label: 'Parâmetros e notificações' },
    { id: 'auditoria', label: 'Auditoria e histórico' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Unidades', path: '/configuracoes/unidades' }, { label: unit.nomeCurto }]} />

      <PageHeader
        eyebrow="Administração"
        title={unit.nome}
        description={`${unit.regiao} · Gerente: ${unit.gerente}`}
        actions={
          <Button size="sm" variant="secondary" onClick={() => navigate(`/unidades/${unit.id}`)}>
            Ver operação da unidade
          </Button>
        }
      />

      <Tabs items={tabItems} defaultTabId={activeTab} onChange={setActiveTab} />

      {activeTab === 'geral' && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section className="xl:col-span-6">
            <SectionHeader title="Informações gerais" />
            <DataList
              items={[
                { label: 'Nome', value: unit.nome },
                { label: 'Região', value: unit.regiao },
                { label: 'Status', value: <IndicatorBadge status="success">Ativa</IndicatorBadge> },
                { label: 'Data de abertura', value: formatDateFull(unit.dataAbertura) },
                { label: 'Área de estoque', value: `${unit.areaEstoqueM2} m²` },
              ]}
            />
          </section>
          <section className="xl:col-span-6">
            <SectionHeader title="Endereço e responsáveis" />
            <DataList
              items={[
                { label: 'Endereço', value: unit.endereco },
                { label: 'Telefone', value: unit.telefone },
                { label: 'Gerente responsável', value: unit.gerente },
                { label: 'Aprovadores', value: summary?.aprovadores.join(', ') ?? '—' },
                { label: 'Horário de funcionamento', value: unit.horarioFuncionamento },
              ]}
            />
          </section>
        </div>
      )}

      {activeTab === 'areas' && (
        <div className="flex flex-col gap-6">
          <section>
            <SectionHeader title="Áreas operacionais" description="Responsável, usuários, checklists e procedimentos por área (seção 21)" />
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {areas.map((a) => (
                <div key={a.id} className="rounded-lg border border-border bg-surface p-3">
                  <p className="text-support font-medium text-ink-primary">{a.nome}</p>
                  <p className="mt-0.5 text-caption text-ink-tertiary">
                    {a.usuariosCount} usuários · {a.checklistsCount} checklists · {a.procedimentosCount} procedimentos
                  </p>
                  <p className="mt-0.5 text-caption text-ink-tertiary">Responsável: {a.responsavel}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <SectionHeader
              title="Estoques"
              actions={
                <Button size="sm" variant="ghost" onClick={() => navigate(`/estoque/unidades/${unit.id}`)}>
                  Ver estoque completo
                </Button>
              }
            />
            <DataList items={[{ label: 'Valor em estoque', value: `R$ ${unit.valorEstoque.toLocaleString('pt-BR')}` }, { label: 'Última contagem', value: formatDateFull(unit.ultimaContagem) }]} />
          </section>
        </div>
      )}

      {activeTab === 'usuarios' && (
        <div className="flex flex-col gap-6">
          <section>
            <SectionHeader title="Usuários" description={`${unitUsers.length} usuários com acesso a esta unidade`} />
            <Table columns={userColumns} data={unitUsers} getRowId={(u) => u.id} onRowClick={(u) => navigate(`/configuracoes/usuarios/${u.id}`)} />
          </section>
          <section>
            <SectionHeader title="Perfis presentes na unidade" />
            <div className="flex flex-wrap gap-1.5">
              {unitRoleIds.map((roleId) => {
                const role = getRoleById(roleId)
                return (
                  <button
                    key={roleId}
                    onClick={() => navigate(`/configuracoes/perfis/${roleId}`)}
                    className="rounded-full border border-border bg-surface px-2.5 py-1 text-caption font-medium text-ink-secondary transition-colors hover:border-border-strong hover:text-ink-primary"
                  >
                    {role?.nome ?? roleId}
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'aprovacoes' && (
        <div className="flex flex-col gap-6">
          <section>
            <SectionHeader title="Alçadas aplicáveis" />
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
              {approvalLimitRules.slice(0, 6).map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="text-support text-ink-primary">
                    {r.modulo} — {r.evento}
                  </span>
                  <span className="text-caption text-ink-tertiary">{r.condicao} · {r.aprovadorPerfil}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Integrações da unidade" />
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
              {unitIntegrations.map((i) => (
                <button
                  key={i.id}
                  onClick={() => navigate(`/configuracoes/integracoes/${i.id}`)}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
                >
                  <div>
                    <p className="text-support font-medium text-ink-primary">{i.nome}</p>
                    <p className="text-caption text-ink-tertiary">{i.frequencia}</p>
                  </div>
                  <AdminIntegrationStatusBadge status={i.status} />
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'parametros' && (
        <div className="flex flex-col gap-6">
          <section>
            <SectionHeader title="Módulos ativos" description="Desativar um módulo restringe o acesso — os dados permanecem preservados" />
            <div className="flex flex-wrap gap-1.5">
              {moduleConfig?.modulosAtivos.map((m) => (
                <IndicatorBadge key={m} status="success">
                  {adminModuleLabel[m]}
                </IndicatorBadge>
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Notificações relevantes" />
            <DataList items={notificationRules.slice(0, 5).map((r) => ({ label: r.evento, value: r.canal }))} />
          </section>
        </div>
      )}

      {activeTab === 'auditoria' && (
        <section>
          <SectionHeader title="Eventos de auditoria da unidade" />
          {auditEvents.length === 0 ? (
            <p className="text-support text-ink-tertiary">Nenhum evento de auditoria registrado para esta unidade na amostra demonstrativa.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
              {auditEvents.map((e) => (
                <button
                  key={e.id}
                  onClick={() => navigate(`/configuracoes/auditoria?evento=${e.id}`)}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
                >
                  <div>
                    <p className="text-support font-medium text-ink-primary">{e.acao}</p>
                    <p className="text-caption text-ink-tertiary">
                      {e.usuario} · {formatRelativeShort(e.dataIso)}
                    </p>
                  </div>
                  <IndicatorBadge status={auditCriticalityStatus[e.criticidade]}>{auditCriticalityLabel[e.criticidade]}</IndicatorBadge>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {summary && (
        <p className="text-caption text-ink-tertiary">Qualidade dos dados administrativos desta unidade: {formatPercent(summary.qualidadeDados, 0)}.</p>
      )}
      <p className="text-caption text-ink-tertiary">{roles.length} perfis configurados na organização.</p>
    </div>
  )
}
