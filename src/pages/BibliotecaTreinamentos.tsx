import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
import { KnowledgeStatusBadge, ObligationBadge, TrainingStatusBadge } from '@/components/knowledge/KnowledgeBadges'
import { useKnowledge } from '@/hooks/useKnowledge'
import { getPendingAssignments } from '@/data/knowledge/trainings'
import { areaLabels, knowledgeSummary } from '@/data/knowledge/knowledgeSummary'
import { getUnitById } from '@/data/units'
import { calcularTaxaConclusao } from '@/utils/knowledgeCalculations'
import { formatDateShort, formatPercent } from '@/utils/format'
import type { Training } from '@/types'

const formatoLabels: Record<Training['formato'], string> = {
  leitura_orientada: 'Leitura orientada',
  video: 'Vídeo demonstrativo',
  apresentacao: 'Apresentação',
  aula_registrada: 'Aula registrada',
  pratica_supervisionada: 'Prática supervisionada',
  avaliacao: 'Avaliação',
  combinado: 'Módulos combinados',
}

type Aba = 'catalogo' | 'pendentes'

export default function BibliotecaTreinamentos() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { trainings } = useKnowledge()
  const [busca, setBusca] = useState('')
  const [aba, setAba] = useState<Aba>(searchParams.get('status') === 'pendente' ? 'pendentes' : 'catalogo')

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return trainings
    return trainings.filter((t) => [t.titulo, t.codigo, t.descricao].join(' ').toLowerCase().includes(termo))
  }, [trainings, busca])

  const pendentes = useMemo(() => getPendingAssignments(), [])

  const columns: TableColumn<Training>[] = [
    {
      key: 'titulo',
      header: 'Treinamento',
      render: (t) => (
        <span className="flex flex-col">
          <span className="font-medium text-ink-primary">{t.titulo}</span>
          <span className="text-caption text-ink-tertiary">{t.codigo}</span>
        </span>
      ),
    },
    { key: 'area', header: 'Área', render: (t) => areaLabels[t.area] },
    { key: 'formato', header: 'Formato', render: (t) => formatoLabels[t.formato] },
    { key: 'duracao', header: 'Duração', align: 'right', render: (t) => `${t.duracaoMin} min` },
    { key: 'obrigatoriedade', header: 'Obrigatoriedade', render: (t) => <ObligationBadge obrigatoriedade={t.obrigatoriedade} /> },
    { key: 'atribuidos', header: 'Atribuídos', align: 'right', render: (t) => t.atribuidos },
    { key: 'concluidos', header: 'Concluídos', align: 'right', render: (t) => t.concluidos },
    { key: 'pendentes', header: 'Pendentes', align: 'right', render: (t) => <span className={t.pendentes > 0 ? 'text-warning' : undefined}>{t.pendentes}</span> },
    {
      key: 'taxa',
      header: 'Conclusão',
      render: (t) => {
        const taxa = calcularTaxaConclusao(t.concluidos, t.atribuidos)
        return taxa === null ? <span className="text-ink-tertiary">—</span> : <ProgressBar value={taxa} status={taxa >= 0.9 ? 'success' : taxa >= 0.75 ? 'attention' : 'critical'} valueLabel={formatPercent(taxa)} className="w-28" />
      },
    },
    { key: 'validade', header: 'Validade', align: 'right', render: (t) => `${t.validadeMeses} meses` },
    { key: 'status', header: 'Status', render: (t) => <KnowledgeStatusBadge status={t.status} /> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Treinamentos' }]} />
      <PageHero
        eyebrow="Conhecimento"
        title="Treinamentos"
        description="Capacitação atribuída por função e unidade, com progresso, avaliação e validade."
        meta={
          <p className="text-caption text-ink-tertiary">
            {knowledgeSummary.atribuicoesTreinamento} atribuições · {knowledgeSummary.treinamentosConcluidos} concluídas · {knowledgeSummary.treinamentosPendentes} pendentes · taxa de {formatPercent(knowledgeSummary.taxaConclusao)}
          </p>
        }
      />
      <BibliotecaInternalNav active="treinamentos" />

      <SectionHeader
        title={aba === 'catalogo' ? `${filtrados.length} treinamentos` : `${pendentes.length} atribuições pendentes`}
        actions={
          <SegmentedControl
            value={aba}
            onChange={setAba}
            options={[
              { value: 'catalogo', label: 'Catálogo' },
              { value: 'pendentes', label: 'Pendentes' },
            ]}
          />
        }
      />

      {aba === 'catalogo' ? (
        <>
          <PageFilters>
            <SearchInput aria-label="Buscar treinamento" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar treinamento..." wrapperClassName="w-full sm:w-96" />
          </PageFilters>
          {filtrados.length === 0 ? (
            <EmptyState icon={<SlidersHorizontal className="h-5 w-5" />} title="Nenhum treinamento encontrado" description="Ajuste a busca." action={<Button variant="secondary" onClick={() => setBusca('')}>Limpar busca</Button>} />
          ) : (
            <Table columns={columns} data={filtrados} getRowId={(t) => t.id} onRowClick={(t) => navigate(`/biblioteca/treinamentos/${t.id}`)} />
          )}
        </>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {pendentes.map((a) => {
            const training = trainings.find((t) => t.id === a.trainingId)
            return (
              <button key={a.id} onClick={() => navigate(`/biblioteca/treinamentos/${a.trainingId}`)} className="flex flex-col gap-2 px-5 py-4 text-left transition-colors hover:bg-surface-hover sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-support font-medium text-ink-primary">{a.colaborador}</p>
                  <p className="text-caption text-ink-tertiary">
                    {a.funcao} · {getUnitById(a.unitId)?.nomeCurto ?? a.unitId} · {training?.titulo}
                  </p>
                  <p className="mt-0.5 text-caption text-ink-tertiary">Motivo: {a.motivo}</p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <ProgressBar value={a.progressoPercentual / 100} status={a.atrasado ? 'critical' : 'info'} valueLabel={`${a.progressoPercentual}%`} className="w-28" />
                  <span className={`text-caption ${a.atrasado ? 'text-danger' : 'text-ink-tertiary'}`}>Prazo {formatDateShort(a.prazo)}</span>
                  <TrainingStatusBadge status={a.status} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
