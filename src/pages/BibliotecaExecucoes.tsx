import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { BibliotecaBreadcrumb } from '@/components/knowledge/BibliotecaBreadcrumb'
import { BibliotecaInternalNav } from '@/components/knowledge/BibliotecaInternalNav'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Table, type TableColumn } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { ChecklistRunBadge } from '@/components/knowledge/KnowledgeBadges'
import { useKnowledge } from '@/hooks/useKnowledge'
import { getUnitById } from '@/data/units'
import { formatDateShort, formatPercent } from '@/utils/format'
import type { ChecklistExecution } from '@/types'

type Filtro = 'todas' | 'concluidas' | 'em_andamento' | 'baixa_conformidade'

const filtros: { value: Filtro; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'concluidas', label: 'Concluídas' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'baixa_conformidade', label: 'Baixa conformidade' },
]

export default function BibliotecaExecucoes() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { allExecutions, checklists } = useKnowledge()
  const [filtro, setFiltro] = useState<Filtro>('todas')

  const checklistFiltro = searchParams.get('checklist')

  const filtradas = useMemo(
    () =>
      allExecutions.filter((e) => {
        if (checklistFiltro && e.checklistId !== checklistFiltro) return false
        switch (filtro) {
          case 'concluidas':
            return e.status === 'concluido'
          case 'em_andamento':
            return e.status !== 'concluido'
          case 'baixa_conformidade':
            return e.conformidade !== null && e.conformidade < 0.85
          default:
            return true
        }
      }),
    [allExecutions, filtro, checklistFiltro],
  )

  const columns: TableColumn<ChecklistExecution>[] = [
    { key: 'id', header: 'Execução', render: (e) => <span className="font-medium uppercase text-ink-primary">{e.id}</span> },
    { key: 'checklist', header: 'Checklist', render: (e) => checklists.find((c) => c.id === e.checklistId)?.titulo ?? e.checklistId },
    { key: 'unidade', header: 'Unidade', render: (e) => getUnitById(e.unitId)?.nomeCurto ?? e.unitId },
    { key: 'responsavel', header: 'Responsável', render: (e) => e.responsavel },
    { key: 'inicio', header: 'Início', align: 'right', render: (e) => formatDateShort(e.iniciadaEm) },
    { key: 'itens', header: 'Itens conformes', align: 'right', render: (e) => (e.itensAplicaveis > 0 ? `${e.itensConformes}/${e.itensAplicaveis}` : '—') },
    { key: 'conformidade', header: 'Conformidade', align: 'right', render: (e) => (e.conformidade !== null ? <span className={e.conformidade < 0.85 ? 'text-danger' : undefined}>{formatPercent(e.conformidade)}</span> : '—') },
    { key: 'nc', header: 'NCs', align: 'right', render: (e) => e.naoConformidades.length },
    { key: 'status', header: 'Status', render: (e) => <ChecklistRunBadge status={e.status} /> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Execuções' }]} />
      <PageHero eyebrow="Conhecimento" title="Execuções" description="Registro das execuções de checklist com conformidade apurada, responsável e não conformidades geradas." />
      <BibliotecaInternalNav active="execucoes" />

      <SectionHeader title={`${filtradas.length} execuções`} actions={<SegmentedControl value={filtro} onChange={setFiltro} options={filtros} />} />

      {filtradas.length === 0 ? (
        <EmptyState icon={<ClipboardList className="h-5 w-5" />} title="Nenhuma execução encontrada" description="Execute um checklist para gerar o primeiro registro." />
      ) : (
        <Table columns={columns} data={filtradas} getRowId={(e) => e.id} onRowClick={(e) => navigate(`/biblioteca/checklists/${e.checklistId}`)} />
      )}
    </div>
  )
}
