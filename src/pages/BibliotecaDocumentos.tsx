import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Star } from 'lucide-react'
import { BibliotecaBreadcrumb } from '@/components/knowledge/BibliotecaBreadcrumb'
import { BibliotecaInternalNav } from '@/components/knowledge/BibliotecaInternalNav'
import { PageHero, PageFilters } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { SearchInput } from '@/components/ui/Input'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { KnowledgeStatusBadge, ObligationBadge } from '@/components/knowledge/KnowledgeBadges'
import { useKnowledge } from '@/hooks/useKnowledge'
import { areaLabels } from '@/data/knowledge/knowledgeSummary'
import { isRevisionOverdue } from '@/data/knowledge/documents'
import { formatDateShort } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { KnowledgeDocument } from '@/types'

type QuickFilter =
  | 'todos'
  | 'obrigatorios'
  | 'mais_acessados'
  | 'recentes'
  | 'em_revisao'
  | 'revisao_vencida'
  | 'sem_responsavel'
  | 'sem_confirmacao'
  | 'ocorrencias'
  | 'restritos'
  | 'favoritos'

const quickFilters: { value: QuickFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'obrigatorios', label: 'Obrigatórios' },
  { value: 'mais_acessados', label: 'Mais acessados' },
  { value: 'recentes', label: 'Recentes' },
  { value: 'em_revisao', label: 'Em revisão' },
  { value: 'revisao_vencida', label: 'Revisão vencida' },
  { value: 'sem_responsavel', label: 'Sem responsável' },
  { value: 'sem_confirmacao', label: 'Sem confirmação' },
  { value: 'ocorrencias', label: 'Relacionados a ocorrências' },
  { value: 'restritos', label: 'Restritos' },
  { value: 'favoritos', label: 'Favoritos' },
]

/** Rota de detalhe: procedimentos têm leitura editorial própria. */
export function documentPath(doc: KnowledgeDocument): string {
  return doc.tipo === 'procedimento' ? `/biblioteca/procedimentos/${doc.id}` : `/biblioteca/documentos/${doc.id}`
}

export default function BibliotecaDocumentos() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { allDocuments, toggleFavorito, getLeitura } = useKnowledge()

  const buscaInicial = searchParams.get('busca') ?? ''
  const statusParam = searchParams.get('status')
  const [busca, setBusca] = useState(buscaInicial)
  const [filtro, setFiltro] = useState<QuickFilter>(statusParam === 'revisao_vencida' ? 'revisao_vencida' : 'todos')

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return allDocuments.filter((d) => {
      if (termo) {
        const alvo = [d.titulo, d.codigo, d.descricao, d.responsavel, ...d.palavrasChave].join(' ').toLowerCase()
        if (!alvo.includes(termo)) return false
      }
      switch (filtro) {
        case 'obrigatorios':
          return d.obrigatoriedade === 'obrigatorio'
        case 'mais_acessados':
          return d.visualizacoes >= 130
        case 'recentes':
          return new Date(d.ultimaRevisao).getTime() > new Date('2026-01-01').getTime()
        case 'em_revisao':
          return d.status === 'em_revisao'
        case 'revisao_vencida':
          return isRevisionOverdue(d)
        case 'sem_responsavel':
          return !d.responsavel
        case 'sem_confirmacao':
          return d.confirmacoesEsperadas > 0 && d.confirmacoesLeitura < d.confirmacoesEsperadas
        case 'ocorrencias':
          return d.ocorrenciasRelacionadas.length > 0
        case 'restritos':
          return d.obrigatoriedade === 'restrito'
        case 'favoritos':
          return !!d.favorito
        default:
          return true
      }
    })
  }, [allDocuments, busca, filtro])

  const columns: TableColumn<KnowledgeDocument>[] = [
    {
      key: 'titulo',
      header: 'Título',
      render: (d) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorito(d.id)
            }}
            aria-label={d.favorito ? `Remover ${d.titulo} dos favoritos` : `Adicionar ${d.titulo} aos favoritos`}
            className="shrink-0 text-ink-tertiary transition-colors hover:text-accent"
          >
            <Star className={cn('h-3.5 w-3.5', d.favorito && 'fill-accent text-accent')} strokeWidth={1.7} />
          </button>
          <span className="flex flex-col">
            <span className="font-medium text-ink-primary">{d.titulo}</span>
            <span className="text-caption text-ink-tertiary">{d.codigo}</span>
          </span>
        </div>
      ),
    },
    { key: 'area', header: 'Área', render: (d) => areaLabels[d.area] },
    { key: 'versao', header: 'Versão', align: 'right', render: (d) => d.versaoVigente },
    { key: 'status', header: 'Status', render: (d) => <KnowledgeStatusBadge status={d.status} /> },
    { key: 'obrigatoriedade', header: 'Obrigatoriedade', render: (d) => <ObligationBadge obrigatoriedade={d.obrigatoriedade} /> },
    { key: 'unidades', header: 'Unidades', align: 'right', render: (d) => d.unidadesAplicaveis.length },
    { key: 'responsavel', header: 'Responsável', render: (d) => d.responsavel },
    { key: 'revisao', header: 'Próxima revisão', align: 'right', render: (d) => <span className={isRevisionOverdue(d) ? 'text-danger' : undefined}>{formatDateShort(d.proximaRevisao)}</span> },
    { key: 'visualizacoes', header: 'Visualizações', align: 'right', render: (d) => d.visualizacoes },
    {
      key: 'leitura',
      header: 'Leitura',
      align: 'right',
      render: (d) => {
        if (d.confirmacoesEsperadas === 0) return <span className="text-ink-tertiary">—</span>
        const confirmadoLocal = getLeitura(d.id) ? 1 : 0
        return (
          <span className="tabular">
            {Math.min(d.confirmacoesLeitura + confirmadoLocal, d.confirmacoesEsperadas)}/{d.confirmacoesEsperadas}
          </span>
        )
      },
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Documentos' }]} />
      <PageHero
        eyebrow="Conhecimento"
        title="Documentos"
        description="Todos os conteúdos publicados da biblioteca, com versão vigente, responsável e status de revisão."
      />
      <BibliotecaInternalNav active="documentos" />

      <PageFilters>
        <SearchInput aria-label="Buscar documento" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por título, código ou palavra-chave..." wrapperClassName="w-full sm:w-96" />
      </PageFilters>

      <SectionHeader title={`${filtrados.length} conteúdos`} actions={<SegmentedControl value={filtro} onChange={setFiltro} options={quickFilters} />} />

      {filtrados.length === 0 ? (
        <EmptyState
          icon={<SlidersHorizontal className="h-5 w-5" />}
          title="Nenhum conteúdo encontrado"
          description="Ajuste a busca ou os filtros para ver outros conteúdos da biblioteca."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setBusca('')
                setFiltro('todos')
              }}
            >
              Limpar filtros
            </Button>
          }
        />
      ) : (
        <Table columns={columns} data={filtrados} getRowId={(d) => d.id} onRowClick={(d) => navigate(documentPath(d))} />
      )}
    </div>
  )
}
