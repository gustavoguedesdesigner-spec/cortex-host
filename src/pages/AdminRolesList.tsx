import { useNavigate } from 'react-router-dom'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { roles } from '@/data/administration/roles'
import { accessScopeLabel } from '@/utils/accessScope'
import { countCriticalPermissionsForRole, countPermissionsForRole } from '@/utils/permissionEvaluation'

export default function AdminRolesList() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Perfis e permissões' }]} />

      <PageHeader
        eyebrow="Administração"
        title="Perfis e permissões"
        description="Nove perfis demonstrativos — cada um com escopo padrão, o que pode e o que não pode fazer."
        actions={
          <>
            <Button size="sm" variant="secondary" onClick={() => navigate('/configuracoes/permissoes')}>
              Ver matriz completa
            </Button>
            <Button size="sm" variant="ghost" onClick={() => navigate('/configuracoes/alcadas')}>
              Ver alçadas
            </Button>
          </>
        }
      />

      <AdminInternalNav active="perfis" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => navigate(`/configuracoes/perfis/${r.id}`)}
            className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 text-left transition-all hover:border-border-strong hover:shadow-card"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-support font-medium text-ink-primary">{r.nome}</p>
              {r.critico && <IndicatorBadge status="critical">Crítico</IndicatorBadge>}
            </div>
            <p className="text-caption text-ink-tertiary">{r.descricao}</p>
            <div className="mt-auto flex items-center justify-between border-t border-border pt-2 text-caption text-ink-tertiary">
              <span>{r.usuariosCount} usuários</span>
              <span>{accessScopeLabel[r.escopoPadrao]}</span>
            </div>
            <div className="flex items-center justify-between text-caption text-ink-tertiary">
              <span>{countPermissionsForRole(r.id)} permissões</span>
              {countCriticalPermissionsForRole(r.id) > 0 && <span className="font-medium text-danger">{countCriticalPermissionsForRole(r.id)} críticas</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
