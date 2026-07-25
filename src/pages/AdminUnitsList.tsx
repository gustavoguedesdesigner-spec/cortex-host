import { useNavigate } from 'react-router-dom'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { units } from '@/data/units'
import { adminUnitSummaries, getAdminUnitSummary, getUnitModuleConfig } from '@/data/administration/organization'
import { formatPercent, formatRelativeShort } from '@/utils/format'
import type { Unit } from '@/types'

interface UnitRow {
  unit: Unit
  summary: ReturnType<typeof getAdminUnitSummary>
  modulosAtivos: number
}

export default function AdminUnitsList() {
  const navigate = useNavigate()

  const rows: UnitRow[] = units.map((unit) => ({
    unit,
    summary: getAdminUnitSummary(unit.id),
    modulosAtivos: getUnitModuleConfig(unit.id)?.modulosAtivos.length ?? 0,
  }))

  const columns: TableColumn<UnitRow>[] = [
    { key: 'unidade', header: 'Unidade', render: (r) => <span className="font-medium">{r.unit.nomeCurto}</span> },
    { key: 'cidade', header: 'Cidade', render: (r) => r.unit.cidade },
    { key: 'regiao', header: 'Região', render: (r) => r.unit.regiao },
    { key: 'gerente', header: 'Gerente', render: (r) => r.unit.gerente },
    { key: 'status', header: 'Status', render: (r) => <IndicatorBadge status="success">{r.unit.status === 'ativa' ? 'Ativa' : r.unit.status}</IndicatorBadge> },
    { key: 'usuarios', header: 'Usuários', align: 'right', render: (r) => r.summary?.usuariosCount ?? '—' },
    {
      key: 'integracoes',
      header: 'Integrações',
      align: 'right',
      render: (r) =>
        r.summary && r.summary.integracoesAtencao > 0 ? (
          <span className="font-medium text-warning">
            {r.summary.integracoesAtivas} ativas · {r.summary.integracoesAtencao} atenção
          </span>
        ) : (
          `${r.summary?.integracoesAtivas ?? 0} ativas`
        ),
    },
    { key: 'modulos', header: 'Módulos ativos', align: 'right', render: (r) => r.modulosAtivos },
    { key: 'sincronizacao', header: 'Última sincronização', align: 'right', render: (r) => formatRelativeShort(r.unit.ultimaSincronizacao) },
    {
      key: 'qualidade',
      header: 'Qualidade dos dados',
      align: 'right',
      render: (r) => (r.summary ? <span className={r.summary.qualidadeDados < 0.85 ? 'font-medium text-warning' : undefined}>{formatPercent(r.summary.qualidadeDados, 0)}</span> : '—'),
    },
    { key: 'operacao', header: 'Operação', render: (r) => r.unit.horarioFuncionamento },
    {
      key: 'acao',
      header: '',
      align: 'right',
      render: (r) => (
        <Button size="sm" variant="ghost" onClick={() => navigate(`/configuracoes/unidades/${r.unit.id}`)}>
          Abrir
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Unidades' }]} />

      <PageHeader eyebrow="Administração" title="Unidades" description="Estrutura administrativa, usuários, integrações e módulos ativos por unidade." />

      <AdminInternalNav active="unidades" />

      <Table columns={columns} data={rows} getRowId={(r) => r.unit.id} onRowClick={(r) => navigate(`/configuracoes/unidades/${r.unit.id}`)} stickyFirstColumn />

      <p className="text-caption text-ink-tertiary">{adminUnitSummaries.length} de {units.length} unidades da rede Salvador.</p>
    </div>
  )
}
