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
import { KnowledgeStatusBadge, ObligationBadge } from '@/components/knowledge/KnowledgeBadges'
import { useKnowledge } from '@/hooks/useKnowledge'
import { areaLabels } from '@/data/knowledge/knowledgeSummary'
import { isRevisionOverdue } from '@/data/knowledge/documents'
import { formatDateShort } from '@/utils/format'
import type { KnowledgeDocument } from '@/types'

type Filtro = 'todos' | 'obrigatorios' | 'revisao_vencida' | 'com_treinamento' | 'com_checklist'

const filtros: { value: Filtro; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'obrigatorios', label: 'Obrigatórios' },
  { value: 'revisao_vencida', label: 'Revisão vencida' },
  { value: 'com_treinamento', label: 'Com treinamento' },
  { value: 'com_checklist', label: 'Com checklist' },
]

/** Lista apenas os conteúdos do tipo procedimento — leitura editorial própria. */
export default function BibliotecaProcedimentos() {
  const navigate = useNavigate()
  const { allDocuments } = useKnowledge()
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const procedimentos = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return allDocuments
      .filter((d) => d.tipo === 'procedimento' || d.tipo === 'instrucao_trabalho' || d.tipo === 'politica')
      .filter((d) => {
        if (termo && ![d.titulo, d.codigo, ...d.palavrasChave].join(' ').toLowerCase().includes(termo)) return false
        switch (filtro) {
          case 'obrigatorios':
            return d.obrigatoriedade === 'obrigatorio'
          case 'revisao_vencida':
            return isRevisionOverdue(d)
          case 'com_treinamento':
            return d.treinamentosRelacionados.length > 0
          case 'com_checklist':
            return d.checklistsRelacionados.length > 0
          default:
            return true
        }
      })
  }, [allDocuments, busca, filtro])

  const columns: TableColumn<KnowledgeDocument>[] = [
    {
      key: 'titulo',
      header: 'Procedimento',
      render: (d) => (
        <span className="flex flex-col">
          <span className="font-medium text-ink-primary">{d.titulo}</span>
          <span className="text-caption text-ink-tertiary">{d.codigo}</span>
        </span>
      ),
    },
    { key: 'area', header: 'Área', render: (d) => areaLabels[d.area] },
    { key: 'versao', header: 'Versão', align: 'right', render: (d) => d.versaoVigente },
    { key: 'status', header: 'Status', render: (d) => <KnowledgeStatusBadge status={d.status} /> },
    { key: 'obrigatoriedade', header: 'Obrigatoriedade', render: (d) => <ObligationBadge obrigatoriedade={d.obrigatoriedade} /> },
    { key: 'responsavel', header: 'Responsável', render: (d) => d.responsavel },
    { key: 'relacionados', header: 'Vinculados', align: 'right', render: (d) => `${d.treinamentosRelacionados.length} trein. · ${d.checklistsRelacionados.length} check.` },
    { key: 'revisao', header: 'Próxima revisão', align: 'right', render: (d) => <span className={isRevisionOverdue(d) ? 'text-danger' : undefined}>{formatDateShort(d.proximaRevisao)}</span> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Procedimentos' }]} />
      <PageHero eyebrow="Conhecimento" title="Procedimentos" description="Procedimentos operacionais, instruções de trabalho e políticas com versão vigente, treinamento e checklist vinculados." />
      <BibliotecaInternalNav active="procedimentos" />

      <PageFilters>
        <SearchInput aria-label="Buscar procedimento" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar procedimento..." wrapperClassName="w-full sm:w-96" />
      </PageFilters>

      <SectionHeader title={`${procedimentos.length} procedimentos`} actions={<SegmentedControl value={filtro} onChange={setFiltro} options={filtros} />} />

      {procedimentos.length === 0 ? (
        <EmptyState
          icon={<SlidersHorizontal className="h-5 w-5" />}
          title="Nenhum procedimento encontrado"
          description="Ajuste a busca ou os filtros."
          action={
            <Button variant="secondary" onClick={() => { setBusca(''); setFiltro('todos') }}>
              Limpar filtros
            </Button>
          }
        />
      ) : (
        <Table columns={columns} data={procedimentos} getRowId={(d) => d.id} onRowClick={(d) => navigate(`/biblioteca/procedimentos/${d.id}`)} />
      )}
    </div>
  )
}
