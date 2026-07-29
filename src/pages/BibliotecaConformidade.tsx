import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, ClipboardList, ShieldCheck, Sparkles } from 'lucide-react'
import { BibliotecaBreadcrumb } from '@/components/knowledge/BibliotecaBreadcrumb'
import { BibliotecaInternalNav } from '@/components/knowledge/BibliotecaInternalNav'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Drawer } from '@/components/ui/Drawer'
import { Table, type TableColumn } from '@/components/ui/Table'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { CriticalityBadge, NonConformityStatusBadge } from '@/components/knowledge/KnowledgeBadges'
import { useKnowledge } from '@/hooks/useKnowledge'
import { useCreatedActions } from '@/hooks/useCreatedActions'
import { complianceByUnit } from '@/data/knowledge/compliance'
import { areaComplianceRanking, areaLabels, knowledgeSummary } from '@/data/knowledge/knowledgeSummary'
import { getUnitById } from '@/data/units'
import { useAppState } from '@/context/AppStateContext'
import { formatDateShort, formatPercent } from '@/utils/format'
import type { NonConformity } from '@/types'

type Filtro = 'todas' | 'criticas' | 'abertas' | 'em_correcao' | 'resolvidas'

const filtros: { value: Filtro; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'criticas', label: 'Críticas' },
  { value: 'abertas', label: 'Abertas' },
  { value: 'em_correcao', label: 'Em correção' },
  { value: 'resolvidas', label: 'Resolvidas' },
]

export default function BibliotecaConformidade() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { askCortex } = useAppState()
  const { allNonConformities } = useKnowledge()
  const { createAction } = useCreatedActions()

  const [filtro, setFiltro] = useState<Filtro>(searchParams.get('status') === 'aberta' ? 'abertas' : 'todas')
  const [selecionada, setSelecionada] = useState<string | null>(searchParams.get('nc'))
  const [planoResponsavel, setPlanoResponsavel] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const unidadeFiltro = searchParams.get('unidade')

  const ordenadas = useMemo(() => [...complianceByUnit].sort((a, b) => a.conformidadeGeral - b.conformidadeGeral), [])
  const pior = ordenadas[0]
  const melhor = ordenadas[ordenadas.length - 1]

  const filtradas = useMemo(
    () =>
      allNonConformities.filter((n) => {
        if (unidadeFiltro && n.unitId !== unidadeFiltro) return false
        switch (filtro) {
          case 'criticas':
            return n.criticidade === 'alta' && n.status !== 'resolvida'
          case 'abertas':
            return n.status === 'aberta' || n.status === 'em_analise'
          case 'em_correcao':
            return n.status === 'em_correcao' || n.status === 'acao_definida'
          case 'resolvidas':
            return n.status === 'resolvida'
          default:
            return true
        }
      }),
    [allNonConformities, filtro, unidadeFiltro],
  )

  const nc = selecionada ? allNonConformities.find((n) => n.id === selecionada) : undefined

  function mostrarFeedback(msg: string) {
    setFeedback(msg)
    window.setTimeout(() => setFeedback(null), 3600)
  }

  function criarPlano(item: NonConformity) {
    createAction({
      titulo: `${item.numero} — ${item.descricao.slice(0, 60)}`,
      descricao: item.acaoCorretiva?.descricao ?? item.acaoImediata,
      unidade: getUnitById(item.unitId)?.nome ?? item.unitId,
      responsavel: planoResponsavel || item.responsavel,
      prazo: formatDateShort(item.prazo),
      prioridade: item.criticidade === 'alta' ? 'critica' : item.criticidade === 'media' ? 'alta' : 'media',
    })
    setPlanoResponsavel('')
    mostrarFeedback(`Plano de ação criado para ${item.numero} e enviado às pendências operacionais da Central.`)
  }

  const columns: TableColumn<NonConformity>[] = [
    { key: 'numero', header: 'Número', render: (n) => <span className="font-medium text-ink-primary">{n.numero}</span> },
    { key: 'origem', header: 'Origem', render: (n) => n.origem },
    { key: 'unidade', header: 'Unidade', render: (n) => getUnitById(n.unitId)?.nomeCurto ?? n.unitId },
    { key: 'area', header: 'Área', render: (n) => areaLabels[n.area] },
    { key: 'descricao', header: 'Descrição', render: (n) => <span className="block max-w-[26rem] truncate">{n.descricao}</span> },
    { key: 'criticidade', header: 'Criticidade', render: (n) => <CriticalityBadge criticidade={n.criticidade} /> },
    { key: 'responsavel', header: 'Responsável', render: (n) => n.responsavel },
    { key: 'prazo', header: 'Prazo', align: 'right', render: (n) => formatDateShort(n.prazo) },
    { key: 'recorrencia', header: 'Recorrente', render: (n) => (n.recorrente ? <span className="text-warning">Sim</span> : '—') },
    { key: 'status', header: 'Status', render: (n) => <NonConformityStatusBadge status={n.status} /> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Conformidade' }]} />
      <PageHero
        eyebrow="Conhecimento"
        title="Conformidade"
        description="Resultado real da execução dos checklists, não conformidades abertas e ações corretivas em andamento."
        actions={
          <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Qual unidade possui menor conformidade?', 'Conformidade consolidada')}>
            Perguntar ao CORTEX
          </Button>
        }
      />
      <BibliotecaInternalNav active="conformidade" />

      {feedback && <p className="rounded-xl border border-success-line bg-success-soft px-4 py-3 text-support text-success">{feedback}</p>}

      <section>
        <SectionHeader title="Visão geral" />
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Conformidade geral', valor: formatPercent(knowledgeSummary.conformidadeGeral), detalhe: `meta ${formatPercent(knowledgeSummary.metaConformidade, 0)}` },
            { label: 'Não conformidades abertas', valor: String(knowledgeSummary.naoConformidadesAbertas), detalhe: `${knowledgeSummary.naoConformidadesCriticas} críticas` },
            { label: 'Ações corretivas atrasadas', valor: String(knowledgeSummary.acoesCorretivasAtrasadas), detalhe: 'exigem atenção' },
            { label: 'Menor · maior conformidade', valor: `${getUnitById(pior.unitId)?.nomeCurto} · ${getUnitById(melhor.unitId)?.nomeCurto}`, detalhe: `${formatPercent(pior.conformidadeGeral)} · ${formatPercent(melhor.conformidadeGeral)}` },
          ].map((i) => (
            <div key={i.label} className="bg-surface px-5 py-5">
              <p className="text-caption text-ink-secondary">{i.label}</p>
              <p className="mt-1 text-metric-sm tabular text-ink-primary">{i.valor}</p>
              <p className="mt-0.5 text-caption text-ink-tertiary">{i.detalhe}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <SectionHeader title="Comparação entre unidades" description="Da menor para a maior conformidade" />
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full border-collapse text-support">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/60">
                  {['Unidade', 'Conformidade', 'Execuções', 'Atrasados', 'NCs', 'Críticas', 'Ações', 'Treinamentos', 'Tendência'].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-label font-medium text-ink-tertiary">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordenadas.map((c) => (
                  <tr key={c.unitId} className="border-b border-border last:border-b-0 transition-colors hover:bg-surface-hover">
                    <td className="h-14 px-4 font-medium text-ink-primary">{getUnitById(c.unitId)?.nomeCurto ?? c.unitId}</td>
                    <td className="h-14 px-4">
                      <ProgressBar value={c.conformidadeGeral} status={c.conformidadeGeral >= 0.95 ? 'success' : c.conformidadeGeral >= 0.85 ? 'attention' : 'critical'} valueLabel={formatPercent(c.conformidadeGeral)} className="w-28" />
                    </td>
                    <td className="h-14 px-4 tabular">{c.checklistsExecutados}</td>
                    <td className="h-14 px-4 tabular">{c.checklistsAtrasados}</td>
                    <td className="h-14 px-4 tabular">{c.naoConformidades}</td>
                    <td className="h-14 px-4 tabular">{c.naoConformidadesCriticas}</td>
                    <td className="h-14 px-4 tabular">{c.acoesAbertas}</td>
                    <td className="h-14 px-4 tabular">{c.treinamentosPendentes}</td>
                    <td className="h-14 px-4">
                      <span className={c.tendencia === 'piorando' ? 'text-danger' : c.tendencia === 'melhorando' ? 'text-success' : 'text-ink-tertiary'}>
                        {c.tendencia === 'piorando' ? 'Piorando' : c.tendencia === 'melhorando' ? 'Melhorando' : 'Estável'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-caption leading-relaxed text-ink-tertiary">
            Serra opera a {formatPercent(melhor.conformidadeGeral)} com contagem cega e conferência dupla — a mesma rotina pode ser replicada em {getUnitById(pior.unitId)?.nomeCurto}.
          </p>
        </section>

        <section className="lg:col-span-5">
          <SectionHeader title="Áreas de menor conformidade" />
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
            {areaComplianceRanking.map((a) => (
              <div key={a.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="text-support font-medium text-ink-primary">{a.label}</p>
                  <p className="text-caption text-ink-tertiary">Unidade crítica: {a.unidadeCritica}</p>
                </div>
                <span className="shrink-0 tabular text-support text-ink-primary">{formatPercent(a.conformidade)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section>
        <SectionHeader title={`${filtradas.length} não conformidades`} actions={<SegmentedControl value={filtro} onChange={setFiltro} options={filtros} />} />
        {filtradas.length === 0 ? (
          <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="Nenhuma não conformidade neste filtro" description="Ajuste os filtros para ver outros registros." />
        ) : (
          <Table columns={columns} data={filtradas} getRowId={(n) => n.id} onRowClick={(n) => setSelecionada(n.id)} />
        )}
      </section>

      {/* Drawer de detalhe da não conformidade */}
      <Drawer isOpen={!!nc} onClose={() => setSelecionada(null)} title={nc?.numero ?? ''} subtitle={nc ? `${nc.origem} · ${getUnitById(nc.unitId)?.nome}` : undefined} widthClassName="w-full max-w-lg">
        {nc && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <CriticalityBadge criticidade={nc.criticidade} />
              <NonConformityStatusBadge status={nc.status} />
              {nc.recorrente && <span className="rounded-full bg-warning-soft px-2 py-0.5 text-badge text-warning">Recorrente</span>}
            </div>

            <p className="text-body leading-relaxed text-ink-secondary">{nc.descricao}</p>

            <DataList
              items={[
                { label: 'Responsável', value: nc.responsavel },
                { label: 'Prazo', value: formatDateShort(nc.prazo) },
                { label: 'Registrada em', value: formatDateShort(nc.registradaEm) },
                { label: 'Área', value: areaLabels[nc.area] },
              ]}
            />

            <div className="rounded-md border border-border bg-surface-subtle p-3">
              <p className="text-label text-ink-tertiary">Ação imediata</p>
              <p className="mt-1 text-support text-ink-primary">{nc.acaoImediata}</p>
            </div>

            {nc.acaoCorretiva && (
              <div>
                <p className="mb-2 text-label text-ink-tertiary">Ação corretiva</p>
                <DataList
                  items={[
                    { label: 'Descrição', value: nc.acaoCorretiva.descricao },
                    { label: 'Causa provável', value: nc.acaoCorretiva.causaProvavel },
                    { label: 'Contenção imediata', value: nc.acaoCorretiva.contencaoImediata },
                    { label: 'Responsável', value: nc.acaoCorretiva.responsavel },
                    { label: 'Prazo', value: formatDateShort(nc.acaoCorretiva.prazo) },
                    { label: 'Status', value: nc.acaoCorretiva.status === 'atrasada' ? <span className="text-danger">Atrasada</span> : nc.acaoCorretiva.status },
                  ]}
                />
              </div>
            )}

            {nc.evidencias.length > 0 && (
              <div>
                <p className="mb-2 text-label text-ink-tertiary">Evidências</p>
                <div className="flex flex-col gap-2">
                  {nc.evidencias.map((e) => (
                    <div key={e.id} className="rounded-md border border-border bg-surface-subtle px-3 py-2">
                      <p className="text-support text-ink-primary">{e.descricao}</p>
                      <p className="text-caption text-ink-tertiary">
                        {e.registradoPor} · {formatDateShort(e.registradoEm)} · {e.origem}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nc.evidencias.length === 0 && nc.status !== 'resolvida' && (
              <p className="rounded-md border border-warning-line bg-warning-soft px-3 py-2 text-caption text-warning">
                Sem evidência registrada. Não conformidades não devem ser encerradas sem evidência.
              </p>
            )}

            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <Input aria-label="Responsável pelo plano" placeholder={`Responsável (padrão: ${nc.responsavel})`} value={planoResponsavel} onChange={(e) => setPlanoResponsavel(e.target.value)} />
              <Button variant="primary" leftIcon={<ClipboardList className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => criarPlano(nc)}>
                Criar plano de ação
              </Button>
              {nc.procedimentoRelacionado && (
                <Button variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/biblioteca/procedimentos/${nc.procedimentoRelacionado}`)}>
                  Abrir procedimento relacionado
                </Button>
              )}
              {nc.treinamentoRelacionado && (
                <Button variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/biblioteca/treinamentos/${nc.treinamentoRelacionado}`)}>
                  Abrir treinamento relacionado
                </Button>
              )}
              {nc.checklistRelacionado && (
                <Button variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/biblioteca/checklists/${nc.checklistRelacionado}`)}>
                  Abrir checklist de origem
                </Button>
              )}
              <Button variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Como resolver esta não conformidade?', `Não conformidade — ${nc.numero}`)}>
                Perguntar ao CORTEX
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}

