import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { BibliotecaBreadcrumb } from '@/components/knowledge/BibliotecaBreadcrumb'
import { BibliotecaInternalNav } from '@/components/knowledge/BibliotecaInternalNav'
import { PageHero, PageFilters } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SearchInput } from '@/components/ui/Input'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Table, type TableColumn } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { KnowledgeStatusBadge } from '@/components/knowledge/KnowledgeBadges'
import { useKnowledge } from '@/hooks/useKnowledge'
import { todayChecklists } from '@/data/knowledge/checklists'
import { areaLabels } from '@/data/knowledge/knowledgeSummary'
import { getUnitById } from '@/data/units'
import { formatDateShort, formatPercent } from '@/utils/format'
import type { Checklist, ChecklistFrequency } from '@/types'

const frequenciaLabels: Record<ChecklistFrequency, string> = {
  diaria: 'Diária',
  semanal: 'Semanal',
  mensal: 'Mensal',
  por_evento: 'Por evento',
  sob_demanda: 'Sob demanda',
}

type Filtro = 'todos' | 'hoje' | 'baixa_conformidade' | 'com_nc'

const filtros: { value: Filtro; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'hoje', label: 'Do dia' },
  { value: 'baixa_conformidade', label: 'Baixa conformidade' },
  { value: 'com_nc', label: 'Com não conformidade' },
]

export default function BibliotecaChecklists() {
  const navigate = useNavigate()
  const { checklists } = useKnowledge()
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const idsHoje = useMemo(() => new Set(todayChecklists.map((t) => t.checklistId)), [])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return checklists.filter((c) => {
      if (termo && ![c.titulo, c.codigo, c.tipo].join(' ').toLowerCase().includes(termo)) return false
      switch (filtro) {
        case 'hoje':
          return idsHoje.has(c.id)
        case 'baixa_conformidade':
          return c.conformidadeRede < 0.9
        case 'com_nc':
          return c.naoConformidadesAbertas > 0
        default:
          return true
      }
    })
  }, [checklists, busca, filtro, idsHoje])

  const columns: TableColumn<Checklist>[] = [
    {
      key: 'titulo',
      header: 'Checklist',
      render: (c) => (
        <span className="flex flex-col">
          <span className="font-medium text-ink-primary">{c.titulo}</span>
          <span className="text-caption text-ink-tertiary">
            {c.codigo} · v{c.versao}
          </span>
        </span>
      ),
    },
    { key: 'area', header: 'Área', render: (c) => areaLabels[c.area] },
    { key: 'frequencia', header: 'Frequência', render: (c) => frequenciaLabels[c.frequencia] },
    { key: 'unidades', header: 'Unidades', align: 'right', render: (c) => c.unidades.length },
    { key: 'responsavel', header: 'Responsável', render: (c) => c.responsavelPadrao },
    { key: 'proxima', header: 'Próxima execução', align: 'right', render: (c) => formatDateShort(c.proximaExecucao) },
    { key: 'execucoes', header: 'Execuções', align: 'right', render: (c) => c.execucoesPeriodo },
    {
      key: 'conformidade',
      header: 'Conformidade',
      render: (c) => <ProgressBar value={c.conformidadeRede} status={c.conformidadeRede >= 0.95 ? 'success' : c.conformidadeRede >= 0.85 ? 'attention' : 'critical'} valueLabel={formatPercent(c.conformidadeRede)} className="w-28" />,
    },
    { key: 'nc', header: 'NCs abertas', align: 'right', render: (c) => <span className={c.naoConformidadesAbertas > 0 ? 'text-danger' : undefined}>{c.naoConformidadesAbertas}</span> },
    { key: 'status', header: 'Status', render: (c) => <KnowledgeStatusBadge status={c.status} /> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Checklists' }]} />
      <PageHero eyebrow="Conhecimento" title="Checklists" description="Roteiros de execução com evidência obrigatória, conformidade medida e não conformidades registradas." />
      <BibliotecaInternalNav active="checklists" />

      <section>
        <SectionHeader title="Seus checklists de hoje" description="Perfil demonstrativo — unidade Moinhos" />
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {todayChecklists.map((t) => {
            const checklist = checklists.find((c) => c.id === t.checklistId)
            if (!checklist) return null
            return (
              <button key={t.checklistId} onClick={() => navigate(`/biblioteca/checklists/${t.checklistId}`)} className="flex items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
                <div className="min-w-0">
                  <p className="text-support font-medium text-ink-primary">{t.label}</p>
                  <p className="text-caption text-ink-tertiary">
                    {checklist.codigo} · {getUnitById(t.unitId)?.nomeCurto ?? t.unitId}
                  </p>
                </div>
                <span className={`shrink-0 text-caption font-medium ${t.atrasado ? 'text-danger' : 'text-accent'}`}>{t.atrasado ? 'Atrasado · executar' : 'Executar'}</span>
              </button>
            )
          })}
        </div>
      </section>

      <PageFilters>
        <SearchInput aria-label="Buscar checklist" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar checklist..." wrapperClassName="w-full sm:w-96" />
      </PageFilters>

      <SectionHeader title={`${filtrados.length} checklists`} actions={<SegmentedControl value={filtro} onChange={setFiltro} options={filtros} />} />

      {filtrados.length === 0 ? (
        <EmptyState icon={<SlidersHorizontal className="h-5 w-5" />} title="Nenhum checklist encontrado" description="Ajuste a busca ou os filtros." action={<Button variant="secondary" onClick={() => { setBusca(''); setFiltro('todos') }}>Limpar filtros</Button>} />
      ) : (
        <Table columns={columns} data={filtrados} getRowId={(c) => c.id} onRowClick={(c) => navigate(`/biblioteca/checklists/${c.id}`)} />
      )}
    </div>
  )
}
