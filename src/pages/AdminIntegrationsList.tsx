import { useNavigate } from 'react-router-dom'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { AdminIntegrationStatusBadge } from '@/components/administration/AdminIntegrationStatusBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { useAdminIntegrations } from '@/hooks/useAdminIntegrations'
import { formatRelativeShort } from '@/utils/format'
import type { Integration } from '@/types'

export default function AdminIntegrationsList() {
  const navigate = useNavigate()
  const { allIntegrations } = useAdminIntegrations()

  const columns: TableColumn<Integration>[] = [
    { key: 'nome', header: 'Integração', render: (i) => <span className="font-medium">{i.nome}</span> },
    { key: 'tipo', header: 'Tipo', render: (i) => i.tipo },
    { key: 'unidades', header: 'Unidades', align: 'right', render: (i) => (i.unidades.length > 0 ? i.unidades.length : '—') },
    { key: 'status', header: 'Status', render: (i) => <AdminIntegrationStatusBadge status={i.status} /> },
    { key: 'sincronizacao', header: 'Última sincronização', align: 'right', render: (i) => (i.ultimaSincronizacaoIso ? formatRelativeShort(i.ultimaSincronizacaoIso) : '—') },
    { key: 'frequencia', header: 'Frequência', render: (i) => i.frequencia },
    { key: 'registros', header: 'Registros', align: 'right', render: (i) => i.registrosProcessados?.toLocaleString('pt-BR') ?? '—' },
    { key: 'erros', header: 'Erros', align: 'right', render: (i) => (i.errosCount > 0 ? <span className="font-medium text-danger">{i.errosCount}</span> : '—') },
    { key: 'responsavel', header: 'Responsável', render: (i) => i.responsavel },
  ]

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Integrações' }]} />

      <PageHeader eyebrow="Administração" title="Integrações" description="Status, sincronização e qualidade das integrações conectadas ao CORTEX HOST." />

      <AdminInternalNav active="integracoes" />

      <Table columns={columns} data={allIntegrations} getRowId={(i) => i.id} onRowClick={(i) => navigate(`/configuracoes/integracoes/${i.id}`)} />
    </div>
  )
}
