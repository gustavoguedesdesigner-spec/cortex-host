import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Sparkles, UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useAppState } from '@/context/AppStateContext'
import { organization } from '@/data/administration/organization'
import { formatRelativeShort } from '@/utils/format'
import { administrationLastUpdate } from '@/data/administration/situation'

export function AdminHeader({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: {
  search: string
  onSearchChange: (v: string) => void
  status: string
  onStatusChange: (v: string) => void
}) {
  const navigate = useNavigate()
  const { askCortex } = useAppState()

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Administração"
        title="Administração"
        description="Gerencie a estrutura da empresa, acessos, regras, integrações e políticas do CORTEX HOST."
        actions={
          <>
            <Button size="sm" variant="secondary" leftIcon={<ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/configuracoes/usuarios?status=aguardando_revisao')}>
              Revisar acessos
            </Button>
            <Button size="sm" variant="navy" leftIcon={<UserPlus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/configuracoes/usuarios/novo')}>
              Adicionar usuário
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />}
              onClick={() => askCortex('Quais acessos precisam ser revisados?', 'Administração consolidada')}
            >
              Pergunte ao CORTEX
            </Button>
          </>
        }
        meta={<p className="text-caption text-ink-tertiary">Atualizado {formatRelativeShort(administrationLastUpdate)}</p>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select aria-label="Organização" defaultValue={organization.id} options={[{ value: organization.id, label: organization.nomeFantasia }]} className="w-56" />
        <SearchInput aria-label="Busca administrativa" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar usuário, perfil, integração..." wrapperClassName="w-64" />
        <Select
          aria-label="Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { value: 'todos', label: 'Todos os status' },
            { value: 'ativo', label: 'Ativos' },
            { value: 'convidado', label: 'Convidados' },
            { value: 'aguardando_revisao', label: 'Aguardando revisão' },
            { value: 'inativo', label: 'Inativos' },
          ]}
          className="w-48"
        />
      </div>
    </div>
  )
}
