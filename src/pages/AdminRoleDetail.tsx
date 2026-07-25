import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Eye, LogOut } from 'lucide-react'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { AdminUserStatusBadge } from '@/components/administration/AdminUserStatusBadge'
import { getRoleById, roles } from '@/data/administration/roles'
import { getAccessConflictsByRole, getPermissionRowsByGroup, permissionGroupLabel, permissionRows } from '@/data/administration/permissions'
import { getUsersByRole } from '@/data/administration/users'
import { accessScopeLabel } from '@/utils/accessScope'
import type { PermissionGroupId, User } from '@/types'
import NotFound from './NotFound'

export default function AdminRoleDetail() {
  const { roleId } = useParams<{ roleId: string }>()
  const navigate = useNavigate()
  const [simulating, setSimulating] = useState(false)
  const [attemptedRestricted, setAttemptedRestricted] = useState(false)

  const role = roleId ? getRoleById(roleId) : undefined
  if (!role) return <NotFound />

  const conflicts = getAccessConflictsByRole(role.id)
  const roleUsers = getUsersByRole(role.id)
  const accessibleGroups = [...new Set(permissionRows.filter((r) => r.allowed.some((a) => a.roleId === role.id)).map((r) => r.permission.grupo))]
  const hasMarginAccess = getPermissionRowsByGroup('cmv' as PermissionGroupId).some((r) => r.permission.acao === 'visualizar_margens' && r.allowed.some((a) => a.roleId === role.id))

  const userColumns: TableColumn<User>[] = [
    { key: 'nome', header: 'Nome', render: (u) => <span className="font-medium">{u.nome}</span> },
    { key: 'cargo', header: 'Cargo', render: (u) => u.cargo },
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

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Perfis e permissões', path: '/configuracoes/perfis' }, { label: role.nome }]} />

      <PageHeader
        eyebrow="Administração"
        title={role.nome}
        description={role.descricao}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <IndicatorBadge status="neutral">{accessScopeLabel[role.escopoPadrao]}</IndicatorBadge>
            {role.critico && <IndicatorBadge status="critical">Perfil crítico</IndicatorBadge>}
          </div>
        }
        actions={
          <Button size="sm" variant="secondary" leftIcon={<Eye className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setSimulating(true)}>
            Visualizar como este perfil
          </Button>
        }
      />

      {simulating && (
        <div className="rounded-lg border border-navy/30 bg-navy/5 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-support font-medium text-navy">Simulando visão do perfil {role.nome}</p>
              <p className="mt-0.5 text-caption text-ink-tertiary">Esta simulação não altera a autenticação real — apenas demonstra o que este perfil enxergaria.</p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<LogOut className="h-3.5 w-3.5" strokeWidth={1.7} />}
              onClick={() => {
                setSimulating(false)
                setAttemptedRestricted(false)
              }}
            >
              Sair da simulação
            </Button>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-label text-ink-tertiary">Módulos visíveis</p>
            <div className="flex flex-wrap gap-1.5">
              {accessibleGroups.map((g) => (
                <IndicatorBadge key={g} status="success">
                  {permissionGroupLabel[g]}
                </IndicatorBadge>
              ))}
            </div>
            <p className="mt-2 text-label text-ink-tertiary">Escopo de unidade</p>
            <p className="text-support text-ink-secondary">
              {role.escopoPadrao === 'propria_unidade' ? 'Apenas Salvador Moinhos (unidade de exemplo)' : accessScopeLabel[role.escopoPadrao]}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setAttemptedRestricted(true)}>
                Tentar acessar margem consolidada da rede
              </Button>
            </div>
            {attemptedRestricted && (
              <p className={hasMarginAccess ? 'text-support text-success' : 'text-support text-danger'}>
                {hasMarginAccess ? 'Acesso permitido — este perfil pode visualizar margens consolidadas.' : 'Você não possui acesso a esta informação.'}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-6">
          <SectionHeader title="Pode" />
          <ul className="flex flex-col gap-1.5 text-support text-ink-secondary">
            {role.podeLista.map((p) => (
              <li key={p}>· {p}</li>
            ))}
          </ul>
        </section>
        <section className="xl:col-span-6">
          <SectionHeader title="Não pode" />
          <ul className="flex flex-col gap-1.5 text-support text-ink-secondary">
            {role.naoPodeLista.length === 0 ? <li>—</li> : role.naoPodeLista.map((p) => <li key={p}>· {p}</li>)}
          </ul>
        </section>
      </div>

      {conflicts.length > 0 && (
        <section>
          <SectionHeader title="Conflitos de acesso" />
          <div className="flex flex-col gap-2">
            {conflicts.map((c) => (
              <div key={c.id} className="rounded-lg border border-warning/30 bg-warning-soft/40 p-3">
                <p className="text-support font-medium text-warning">{c.titulo}</p>
                <p className="mt-1 text-caption text-ink-secondary">{c.descricao}</p>
                <p className="mt-1 text-caption text-ink-tertiary">Recomendação: {c.recomendacao}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader title="Usuários com este perfil" description={`${roleUsers.length} usuários`} />
        <Table columns={userColumns} data={roleUsers} getRowId={(u) => u.id} onRowClick={(u) => navigate(`/configuracoes/usuarios/${u.id}`)} />
      </section>

      <section>
        <SectionHeader title="Outros perfis" />
        <div className="flex flex-wrap gap-1.5">
          {roles
            .filter((r) => r.id !== role.id)
            .map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(`/configuracoes/perfis/${r.id}`)}
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-caption font-medium text-ink-secondary transition-colors hover:border-border-strong hover:text-ink-primary"
              >
                {r.nome}
              </button>
            ))}
        </div>
      </section>
    </div>
  )
}
