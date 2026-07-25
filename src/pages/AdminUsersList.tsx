import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { AdminUserStatusBadge } from '@/components/administration/AdminUserStatusBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchInput } from '@/components/ui/Input'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { getRoleById } from '@/data/administration/roles'
import { getUnitById } from '@/data/units'
import { formatDateFull } from '@/utils/format'
import { UsersRound } from 'lucide-react'
import type { User } from '@/types'

type QuickFilter =
  | 'todos'
  | 'ativo'
  | 'convidado'
  | 'inativo'
  | 'bloqueado'
  | 'acesso_temporario'
  | 'sem_acesso_recente'
  | 'permissao_critica'
  | 'aguardando_revisao'
  | 'administradores'
  | 'multiplas_unidades'

const quickFilters: { value: QuickFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'ativo', label: 'Ativos' },
  { value: 'convidado', label: 'Convidados' },
  { value: 'inativo', label: 'Inativos' },
  { value: 'bloqueado', label: 'Bloqueados' },
  { value: 'acesso_temporario', label: 'Acesso temporário' },
  { value: 'sem_acesso_recente', label: 'Sem acesso recente' },
  { value: 'permissao_critica', label: 'Com permissão crítica' },
  { value: 'aguardando_revisao', label: 'Aguardando revisão' },
  { value: 'administradores', label: 'Administradores' },
  { value: 'multiplas_unidades', label: 'Múltiplas unidades' },
]

function unitLabel(user: User): string {
  if (user.unidades.includes('*')) return 'Todas as unidades'
  if (user.unidades.length === 1) return getUnitById(user.unidades[0])?.nomeCurto ?? user.unidades[0]
  return `${user.unidades.length} unidades`
}

function matchesFilter(user: User, filtro: QuickFilter): boolean {
  switch (filtro) {
    case 'todos':
      return true
    case 'ativo':
      return user.status === 'ativo'
    case 'convidado':
      return user.status === 'convidado' || user.status === 'aguardando_ativacao'
    case 'inativo':
      return user.status === 'inativo'
    case 'bloqueado':
      return user.status === 'bloqueado' || user.status === 'suspenso'
    case 'acesso_temporario':
      return user.status === 'acesso_temporario' || Boolean(user.acessoTemporario)
    case 'sem_acesso_recente':
      return !user.ultimoAcessoIso || new Date(user.ultimoAcessoIso).getTime() < Date.now() - 60 * 24 * 60 * 60 * 1000
    case 'permissao_critica':
      return user.permissoesCriticasCount > 0
    case 'aguardando_revisao':
      return user.precisaRevisao
    case 'administradores':
      return user.roleId === 'administrador-corporativo'
    case 'multiplas_unidades':
      return user.unidades.includes('*') || user.unidades.length > 1
    default:
      return true
  }
}

export default function AdminUsersList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { allUsers } = useAdminUsers()
  const [search, setSearch] = useState('')

  const statusParam = searchParams.get('status') as QuickFilter | null
  const [filtro, setFiltro] = useState<QuickFilter>(statusParam ?? 'todos')

  const filtered = useMemo(
    () =>
      allUsers.filter((u) => {
        if (!matchesFilter(u, filtro)) return false
        if (search && !u.nome.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
        return true
      }),
    [allUsers, filtro, search],
  )

  const columns: TableColumn<User>[] = [
    { key: 'nome', header: 'Nome', render: (u) => <span className="font-medium">{u.nome}</span> },
    { key: 'email', header: 'E-mail', render: (u) => u.email },
    { key: 'cargo', header: 'Função', render: (u) => u.cargo },
    { key: 'perfil', header: 'Perfil', render: (u) => getRoleById(u.roleId)?.nome ?? u.roleId },
    { key: 'unidades', header: 'Unidades', render: (u) => unitLabel(u) },
    { key: 'status', header: 'Status', render: (u) => <AdminUserStatusBadge status={u.status} /> },
    { key: 'ultimoAcesso', header: 'Último acesso', align: 'right', render: (u) => (u.ultimoAcessoIso ? formatDateFull(u.ultimoAcessoIso) : '—') },
    { key: 'auth', header: '2FA', render: (u) => (u.autenticacaoDoisFatores ? 'Ativada' : '—') },
    { key: 'criticas', header: 'Permissões críticas', align: 'right', render: (u) => (u.permissoesCriticasCount > 0 ? <span className="font-medium text-danger">{u.permissoesCriticasCount}</span> : '—') },
    { key: 'temporario', header: 'Acesso temporário', render: (u) => (u.acessoTemporario ? `Até ${formatDateFull(u.acessoTemporario.fimIso)}` : '—') },
    { key: 'responsavel', header: 'Responsável', render: (u) => (u.responsavelId ? allUsers.find((r) => r.id === u.responsavelId)?.nome ?? '—' : '—') },
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
      <AdminBreadcrumb trail={[{ label: 'Usuários' }]} />

      <PageHeader
        eyebrow="Administração"
        title="Usuários"
        description="Acesso, perfil e status de cada usuário da organização."
        actions={
          <Button size="sm" variant="navy" leftIcon={<UserPlus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/configuracoes/usuarios/novo')}>
            Adicionar usuário
          </Button>
        }
      />

      <AdminInternalNav active="usuarios" />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput aria-label="Buscar usuário" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome ou e-mail..." wrapperClassName="w-64" />
        </div>
        <SegmentedControl value={filtro} onChange={setFiltro} options={quickFilters} className="flex-wrap" />

        {filtered.length === 0 ? (
          <EmptyState
            icon={<UsersRound className="h-5 w-5" strokeWidth={1.7} />}
            title="Nenhum usuário encontrado"
            description="Ajuste os filtros ou a busca para ver outros usuários."
            action={
              <Button variant="secondary" onClick={() => setFiltro('todos')}>
                Limpar filtros
              </Button>
            }
          />
        ) : (
          <Table columns={columns} data={filtered} getRowId={(u) => u.id} onRowClick={(u) => navigate(`/configuracoes/usuarios/${u.id}`)} stickyFirstColumn />
        )}
      </div>
    </div>
  )
}
