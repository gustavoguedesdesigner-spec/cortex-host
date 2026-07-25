import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Select } from '@/components/ui/Select'
import { Tooltip } from '@/components/ui/Tooltip'
import { roles } from '@/data/administration/roles'
import { accessConflicts, getPermissionRowsByGroup, permissionGroupLabel } from '@/data/administration/permissions'
import { accessScopeLabel, permissionStateLabel } from '@/utils/accessScope'
import { cn } from '@/utils/cn'
import type { PermissionGroupId, PermissionState } from '@/types'

const stateDot: Record<PermissionState, string> = {
  permitido: 'bg-success',
  negado: 'bg-transparent',
  condicionado: 'bg-warning',
  somente_leitura: 'bg-info',
  exige_aprovacao: 'bg-accent',
}

const groupIds = Object.keys(permissionGroupLabel) as PermissionGroupId[]

export default function AdminPermissionsMatrix() {
  const navigate = useNavigate()
  const [grupo, setGrupo] = useState<PermissionGroupId>('cmv')

  const rows = getPermissionRowsByGroup(grupo)

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Perfis e permissões', path: '/configuracoes/perfis' }, { label: 'Matriz de permissões' }]} />

      <PageHeader eyebrow="Administração" title="Matriz de permissões" description="Recursos por grupo × perfis — células em branco significam negado por padrão." />

      <AdminInternalNav active="perfis" />

      <section>
        <SectionHeader
          title="Matriz"
          actions={<Select aria-label="Grupo de permissões" value={grupo} onChange={(e) => setGrupo(e.target.value as PermissionGroupId)} options={groupIds.map((g) => ({ value: g, label: permissionGroupLabel[g] }))} className="w-56" />}
        />
        {rows.length === 0 ? (
          <p className="text-support text-ink-tertiary">Nenhuma permissão cadastrada nesta amostra para o grupo selecionado.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full border-collapse text-support">
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 bg-surface px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Recurso</th>
                  {roles.map((r) => (
                    <th key={r.id} className="whitespace-nowrap px-3 py-2.5 text-center text-label font-medium text-ink-tertiary">
                      <button onClick={() => navigate(`/configuracoes/perfis/${r.id}`)} className="hover:text-ink-primary">
                        {r.nome}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.permission.id} className="border-b border-border last:border-b-0">
                    <td className="sticky left-0 h-12 bg-surface px-4 text-ink-primary">
                      {row.permission.recurso}
                      {row.permission.critica && <span className="ml-1.5 text-caption text-danger">crítica</span>}
                    </td>
                    {roles.map((r) => {
                      const cell = row.allowed.find((a) => a.roleId === r.id)
                      return (
                        <td key={r.id} className="h-12 px-3 text-center">
                          {cell ? (
                            <Tooltip content={`${permissionStateLabel[cell.estado]} · ${accessScopeLabel[cell.escopo]}`}>
                              <span className={cn('inline-block h-2.5 w-2.5 rounded-full', stateDot[cell.estado])} aria-label={permissionStateLabel[cell.estado]} />
                            </Tooltip>
                          ) : (
                            <span className="text-caption text-ink-tertiary">—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-caption text-ink-tertiary">
          {(['permitido', 'condicionado', 'somente_leitura', 'exige_aprovacao'] as PermissionState[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className={cn('h-2 w-2 rounded-full', stateDot[s])} />
              {permissionStateLabel[s]}
            </span>
          ))}
          <span className="flex items-center gap-1.5">— Negado</span>
        </div>
      </section>

      <section>
        <SectionHeader title="Conflitos de acesso detectados" description="Seção 37 — corrigir, manter com justificativa ou exigir segundo aprovador" />
        <div className="flex flex-col gap-2">
          {accessConflicts.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/configuracoes/perfis/${c.roleId}`)}
              className="flex flex-col gap-1 rounded-lg border border-warning/30 bg-warning-soft/40 p-3 text-left transition-colors hover:border-warning/50"
            >
              <p className="text-support font-medium text-warning">{c.titulo}</p>
              <p className="text-caption text-ink-secondary">{c.descricao}</p>
              <p className="text-caption text-ink-tertiary">Recomendação: {c.recomendacao}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
