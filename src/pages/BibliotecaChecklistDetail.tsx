import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, Camera, CheckCircle2, ChevronLeft, ChevronRight, PauseCircle, PlayCircle, Sparkles } from 'lucide-react'
import { BibliotecaBreadcrumb } from '@/components/knowledge/BibliotecaBreadcrumb'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import NotFound from './NotFound'
import { KnowledgeStatusBadge, CriticalityBadge } from '@/components/knowledge/KnowledgeBadges'
import { useKnowledge } from '@/hooks/useKnowledge'
import { getChecklistById } from '@/data/knowledge/checklists'
import { getDocumentById } from '@/data/knowledge/documents'
import { getTrainingById } from '@/data/knowledge/trainings'
import { areaLabels } from '@/data/knowledge/knowledgeSummary'
import { units, getUnitById } from '@/data/units'
import { avaliarBloqueios, avaliarFaixa, calcularConformidade } from '@/utils/knowledgeCalculations'
import { useAppState } from '@/context/AppStateContext'
import { formatDateShort, formatPercent } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { ChecklistAnswer, ChecklistItem, NonConformityCriticality } from '@/types'

export default function BibliotecaChecklistDetail() {
  const { checklistId } = useParams()
  return <ChecklistDetailBody key={checklistId} id={checklistId ?? ''} />
}

function ChecklistDetailBody({ id }: { id: string }) {
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { getRascunho, salvarResposta, salvarAssinatura, pausarExecucao, concluirExecucao, criarNaoConformidade, allExecutions } = useKnowledge()

  const checklist = getChecklistById(id)
  const [unidade, setUnidade] = useState('moinhos')
  const [executando, setExecutando] = useState(false)
  const [indice, setIndice] = useState(0)
  const [ncModal, setNcModal] = useState<{ item: ChecklistItem; valor: string } | null>(null)
  const [ncResponsavel, setNcResponsavel] = useState('Rafael Martins')
  const [ncCriticidade, setNcCriticidade] = useState<NonConformityCriticality>('alta')
  const [ncAcao, setNcAcao] = useState('')
  const [ncsGeradas, setNcsGeradas] = useState<string[]>([])
  const [conclusaoAberta, setConclusaoAberta] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const rascunho = checklist ? getRascunho(checklist.id) : undefined
  const respostas = useMemo(() => rascunho?.respostas ?? [], [rascunho])
  const assinatura = rascunho?.assinatura ?? ''

  if (!checklist) return <NotFound />

  const item = checklist.itens[indice]
  const respostaAtual = respostas.find((r) => r.itemId === item?.id)
  const conformidadeParcial = calcularConformidade(respostas)
  const bloqueios = avaliarBloqueios(checklist, respostas, assinatura)
  const progresso = checklist.itens.length > 0 ? respostas.length / checklist.itens.length : 0
  const documento = checklist.documentoRelacionado ? getDocumentById(checklist.documentoRelacionado) : undefined
  const treinamento = checklist.treinamentoRelacionado ? getTrainingById(checklist.treinamentoRelacionado) : undefined
  const execucoesDoChecklist = allExecutions.filter((e) => e.checklistId === checklist.id)

  function mostrarFeedback(msg: string) {
    setFeedback(msg)
    window.setTimeout(() => setFeedback(null), 3600)
  }

  /** Grava a resposta e, quando numérica fora de faixa, oferece abrir não conformidade. */
  function responder(valor: string | number | boolean, conforme: boolean | null, observacao?: string, evidencia?: string) {
    const resposta: ChecklistAnswer = { itemId: item.id, valor, conforme, observacao, evidencia, respondidoEm: new Date().toISOString() }
    salvarResposta(checklist!.id, unidade, resposta)
    if (conforme === false && item.critico) setNcModal({ item, valor: String(valor) })
  }

  function avancar() {
    if (indice < checklist!.itens.length - 1) setIndice(indice + 1)
  }

  function handleCriarNc() {
    if (!ncModal) return
    const nc = criarNaoConformidade({
      origem: `Checklist ${checklist!.codigo}`,
      origemId: checklist!.id,
      unitId: unidade,
      area: checklist!.area,
      descricao: `${ncModal.item.titulo}: valor registrado ${ncModal.valor}${ncModal.item.unidade ? ` ${ncModal.item.unidade}` : ''} fora do padrão esperado.`,
      criticidade: ncCriticidade,
      responsavel: ncResponsavel,
      prazo: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      acaoImediata: ncAcao || 'Ação imediata a definir pelo responsável.',
      checklistRelacionado: checklist!.id,
      procedimentoRelacionado: checklist!.documentoRelacionado,
      evidenciaDescricao: `Registrado durante a execução do checklist em ${getUnitById(unidade)?.nomeCurto ?? unidade}.`,
    })
    setNcsGeradas((prev) => [...prev, nc.id])
    setNcModal(null)
    setNcAcao('')
    mostrarFeedback(`${nc.numero} registrada e atribuída a ${ncResponsavel}.`)
  }

  function handleConcluir() {
    const execucao = concluirExecucao(checklist!.id, unidade, 'Leo', ncsGeradas)
    setConclusaoAberta(false)
    setExecutando(false)
    setIndice(0)
    setNcsGeradas([])
    mostrarFeedback(
      `Execução ${execucao.id.toUpperCase()} concluída com conformidade de ${execucao.conformidade !== null ? formatPercent(execucao.conformidade) : '—'}. ${
        ncsGeradas.length > 0 ? `${ncsGeradas.length} não conformidade(s) aberta(s).` : ''
      }`,
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Checklists', path: '/biblioteca/checklists' }, { label: checklist.codigo }]} />

      <PageHero
        eyebrow={`${checklist.codigo} · v${checklist.versao}`}
        title={checklist.titulo}
        description={checklist.descricao}
        meta={
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <KnowledgeStatusBadge status={checklist.status} />
            <span className="text-caption text-ink-tertiary">
              {areaLabels[checklist.area]} · {checklist.responsavelPadrao} · {checklist.horarioRecomendado}
            </span>
          </div>
        }
        actions={
          <>
            {!executando ? (
              <Button size="sm" variant="primary" leftIcon={<PlayCircle className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setExecutando(true)}>
                {respostas.length > 0 ? 'Continuar execução' : 'Iniciar execução'}
              </Button>
            ) : (
              <Button size="sm" variant="secondary" leftIcon={<PauseCircle className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => { pausarExecucao(checklist.id); setExecutando(false); mostrarFeedback('Execução pausada — as respostas ficam salvas neste dispositivo.') }}>
                Pausar
              </Button>
            )}
            <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Como devo realizar este inventário?', `Checklist — ${checklist.titulo}`)}>
              Perguntar ao CORTEX
            </Button>
          </>
        }
      />

      {feedback && <p className="rounded-xl border border-success-line bg-success-soft px-4 py-3 text-support text-success">{feedback}</p>}

      {executando ? (
        /* ---------- Modo execução: um item por vez, ótimo no celular ---------- */
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-caption text-ink-tertiary">
                <span>
                  Item {indice + 1} de {checklist.itens.length} · {item.secao}
                </span>
                <span>{respostas.length} respondidos</span>
              </div>
              <ProgressBar value={progresso} status="info" />
            </div>

            <Card className="flex flex-col gap-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-section-title">{item.titulo}</h2>
                  {item.critico && <CriticalityBadge criticidade="alta" />}
                </div>
                <p className="mt-2 text-body leading-relaxed text-ink-secondary">{item.instrucao}</p>
                {(item.faixaMin !== undefined || item.faixaMax !== undefined) && (
                  <p className="mt-2 text-support text-ink-tertiary">
                    Faixa esperada: {item.faixaMin ?? '—'} a {item.faixaMax ?? '—'} {item.unidade}
                  </p>
                )}
              </div>

              <ItemAnswerField item={item} resposta={respostaAtual} onResponder={responder} />

              {respostaAtual?.conforme === false && (
                <p className="flex items-center gap-2 rounded-md border border-danger-line bg-danger-soft px-3 py-2.5 text-support text-danger">
                  <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                  Resposta fora do padrão esperado.
                  {item.critico && ' Item crítico — registre a não conformidade.'}
                </p>
              )}

              {item.exigeEvidencia && (
                <div className="rounded-md border border-border bg-surface-subtle p-3">
                  <p className="text-label text-ink-tertiary">Evidência obrigatória</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<Camera className="h-3.5 w-3.5" strokeWidth={1.7} />}
                      onClick={() => responder(respostaAtual?.valor ?? '', respostaAtual?.conforme ?? null, respostaAtual?.observacao, `Foto simulada registrada em ${new Date().toLocaleTimeString('pt-BR')}`)}
                    >
                      Anexar foto
                    </Button>
                    {respostaAtual?.evidencia && (
                      <span className="flex items-center gap-1.5 text-caption text-success">
                        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.7} />
                        {respostaAtual.evidencia}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-caption text-ink-tertiary">Captura de foto simulada — o protótipo não armazena arquivos.</p>
                </div>
              )}

              <Input
                aria-label="Observação"
                placeholder="Observação (opcional)"
                value={respostaAtual?.observacao ?? ''}
                onChange={(e) => responder(respostaAtual?.valor ?? '', respostaAtual?.conforme ?? null, e.target.value, respostaAtual?.evidencia)}
              />

              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <Button size="sm" variant="secondary" leftIcon={<ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.7} />} disabled={indice === 0} onClick={() => setIndice(indice - 1)}>
                  Anterior
                </Button>
                {indice < checklist.itens.length - 1 ? (
                  <Button size="sm" variant="primary" rightIcon={<ChevronRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={avancar}>
                    Salvar e continuar
                  </Button>
                ) : (
                  <Button size="sm" variant="primary" onClick={() => setConclusaoAberta(true)}>
                    Revisar e concluir
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <aside className="flex flex-col gap-4 lg:col-span-4">
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Execução</p>
              <Select label="Unidade" options={units.map((u) => ({ value: u.id, label: u.nome }))} value={unidade} onChange={(e) => setUnidade(e.target.value)} />
              <DataList
                className="mt-3"
                items={[
                  { label: 'Respondidos', value: `${respostas.length} de ${checklist.itens.length}` },
                  { label: 'Conformidade parcial', value: conformidadeParcial !== null ? formatPercent(conformidadeParcial) : '—' },
                  { label: 'Não conformidades', value: ncsGeradas.length },
                ]}
              />
            </Card>

            <Card>
              <p className="mb-2 text-label text-ink-tertiary">Itens do checklist</p>
              <div className="flex flex-col gap-1">
                {checklist.itens.map((it, i) => {
                  const r = respostas.find((x) => x.itemId === it.id)
                  return (
                    <button
                      key={it.id}
                      onClick={() => setIndice(i)}
                      className={cn('flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-caption transition-colors', i === indice ? 'bg-surface-subtle text-ink-primary' : 'text-ink-secondary hover:bg-surface-hover')}
                    >
                      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', r === undefined ? 'bg-ink-tertiary' : r.conforme === false ? 'bg-danger' : 'bg-success')} aria-hidden="true" />
                      <span className="truncate">
                        {it.ordem}. {it.titulo}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Card>
          </aside>
        </div>
      ) : (
        /* ---------- Modo consulta ---------- */
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <section>
              <SectionHeader title={`${checklist.itens.length} itens`} description="Estrutura do roteiro por seção." />
              <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
                {checklist.itens.map((it) => (
                  <div key={it.id} className="flex items-start justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-support font-medium text-ink-primary">
                        {it.ordem}. {it.titulo}
                      </p>
                      <p className="mt-0.5 text-caption text-ink-tertiary">
                        {it.secao} · {it.obrigatorio ? 'Obrigatório' : 'Opcional'}
                        {it.exigeEvidencia ? ' · exige evidência' : ''}
                        {it.faixaMin !== undefined || it.faixaMax !== undefined ? ` · faixa ${it.faixaMin ?? '—'} a ${it.faixaMax ?? '—'} ${it.unidade ?? ''}` : ''}
                      </p>
                    </div>
                    {it.critico && <CriticalityBadge criticidade="alta" />}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionHeader title="Execuções recentes" />
              <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
                {execucoesDoChecklist.slice(0, 6).map((e) => (
                  <div key={e.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-support font-medium text-ink-primary">{getUnitById(e.unitId)?.nomeCurto ?? e.unitId}</p>
                      <p className="text-caption text-ink-tertiary">
                        {e.responsavel} · {formatDateShort(e.iniciadaEm)}
                      </p>
                    </div>
                    <span className="shrink-0 tabular text-support text-ink-primary">{e.conformidade !== null ? formatPercent(e.conformidade) : 'Em andamento'}</span>
                  </div>
                ))}
                {execucoesDoChecklist.length === 0 && <p className="px-5 py-4 text-support text-ink-tertiary">Nenhuma execução registrada.</p>}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6 lg:col-span-4">
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Conformidade por unidade</p>
              <div className="flex flex-col gap-2.5">
                {Object.entries(checklist.conformidadePorUnidade)
                  .sort((a, b) => a[1] - b[1])
                  .map(([unitId, valor]) => (
                    <div key={unitId}>
                      <div className="flex items-baseline justify-between text-caption">
                        <span className="text-ink-secondary">{getUnitById(unitId)?.nomeCurto ?? unitId}</span>
                        <span className="tabular text-ink-primary">{formatPercent(valor)}</span>
                      </div>
                      <ProgressBar value={valor} status={valor >= 0.95 ? 'success' : valor >= 0.85 ? 'attention' : 'critical'} />
                    </div>
                  ))}
              </div>
            </Card>

            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Ficha do checklist</p>
              <DataList
                items={[
                  { label: 'Frequência', value: checklist.frequencia === 'diaria' ? 'Diária' : checklist.frequencia },
                  { label: 'Responsável', value: checklist.responsavelPadrao },
                  { label: 'Horário', value: checklist.horarioRecomendado },
                  { label: 'Versão', value: checklist.versao },
                  { label: 'Conformidade da rede', value: formatPercent(checklist.conformidadeRede) },
                  { label: 'Execuções no período', value: checklist.execucoesPeriodo },
                  { label: 'NCs abertas', value: checklist.naoConformidadesAbertas },
                ]}
              />
            </Card>

            {(documento || treinamento) && (
              <Card>
                <p className="mb-3 text-label text-ink-tertiary">Conteúdo relacionado</p>
                <div className="flex flex-col gap-2">
                  {documento && (
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/biblioteca/procedimentos/${documento.id}`)}>
                      {documento.codigo} — {documento.titulo}
                    </Button>
                  )}
                  {treinamento && (
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/biblioteca/treinamentos/${treinamento.id}`)}>
                      {treinamento.codigo} — {treinamento.titulo}
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </aside>
        </div>
      )}

      {/* Modal: registrar não conformidade */}
      <Modal
        isOpen={!!ncModal}
        onClose={() => setNcModal(null)}
        title="Registrar não conformidade"
        description={ncModal ? `${ncModal.item.titulo} — valor ${ncModal.valor}${ncModal.item.unidade ? ` ${ncModal.item.unidade}` : ''} fora do padrão.` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setNcModal(null)}>
              Agora não
            </Button>
            <Button variant="primary" onClick={handleCriarNc}>
              Registrar não conformidade
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Select
            label="Criticidade"
            options={[
              { value: 'alta', label: 'Alta' },
              { value: 'media', label: 'Média' },
              { value: 'baixa', label: 'Baixa' },
            ]}
            value={ncCriticidade}
            onChange={(e) => setNcCriticidade(e.target.value as NonConformityCriticality)}
          />
          <Input label="Responsável" value={ncResponsavel} onChange={(e) => setNcResponsavel(e.target.value)} />
          <Input label="Ação imediata" placeholder="Ex.: transferir produtos e acionar manutenção" value={ncAcao} onChange={(e) => setNcAcao(e.target.value)} />
          <p className="text-caption leading-relaxed text-ink-tertiary">
            A não conformidade fica aberta com responsável e prazo. Itens críticos sem decisão bloqueiam a conclusão do checklist.
          </p>
        </div>
      </Modal>

      {/* Modal: conclusão com validações */}
      <Modal
        isOpen={conclusaoAberta}
        onClose={() => setConclusaoAberta(false)}
        title="Concluir checklist"
        description="Revise as pendências antes de encerrar a execução."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConclusaoAberta(false)}>
              Voltar
            </Button>
            <Button variant="primary" disabled={!bloqueios.podeConcluir} onClick={handleConcluir}>
              Concluir execução
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <DataList
            items={[
              { label: 'Itens respondidos', value: `${respostas.length} de ${checklist.itens.length}` },
              { label: 'Conformidade', value: conformidadeParcial !== null ? formatPercent(conformidadeParcial) : '—' },
              { label: 'Não conformidades abertas', value: ncsGeradas.length },
              { label: 'Unidade', value: getUnitById(unidade)?.nome ?? unidade },
            ]}
          />

          <Input label="Assinatura do responsável" placeholder="Nome de quem executou" value={assinatura} onChange={(e) => salvarAssinatura(checklist.id, unidade, e.target.value)} />

          {!bloqueios.podeConcluir && (
            <div className="rounded-md border border-warning-line bg-warning-soft p-4">
              <p className="text-support font-medium text-warning">Pendências que bloqueiam a conclusão</p>
              <ul className="mt-2 flex flex-col gap-1 text-support text-warning">
                {bloqueios.obrigatoriosPendentes.map((i) => (
                  <li key={i.id}>· Item obrigatório sem resposta: {i.titulo}</li>
                ))}
                {bloqueios.semEvidencia.map((i) => (
                  <li key={i.id}>· Evidência obrigatória ausente: {i.titulo}</li>
                ))}
                {assinatura.trim().length === 0 && <li>· Assinatura do responsável não informada</li>}
              </ul>
            </div>
          )}

          <p className="text-caption leading-relaxed text-ink-tertiary">
            Execução demonstrativa — a conclusão registra conformidade e não conformidades localmente, sem movimentação real de estoque.
          </p>
        </div>
      </Modal>
    </div>
  )
}

/* ---------------- Campo de resposta por tipo ---------------- */

function ItemAnswerField({
  item,
  resposta,
  onResponder,
}: {
  item: ChecklistItem
  resposta?: ChecklistAnswer
  onResponder: (valor: string | number | boolean, conforme: boolean | null, observacao?: string, evidencia?: string) => void
}) {
  const [valorLocal, setValorLocal] = useState(resposta?.valor !== undefined && resposta?.valor !== null ? String(resposta.valor) : '')

  function registrarNumerico(v: string) {
    setValorLocal(v)
    const num = Number(v)
    if (v === '' || Number.isNaN(num)) return
    const dentro = avaliarFaixa(item, num)
    onResponder(num, dentro, resposta?.observacao, resposta?.evidencia)
  }

  switch (item.tipoResposta) {
    case 'temperatura':
    case 'quantidade':
      return (
        <div className="flex flex-col gap-2">
          <Input
            label={item.tipoResposta === 'temperatura' ? `Temperatura registrada (${item.unidade ?? '°C'})` : `Quantidade (${item.unidade ?? ''})`}
            type="number"
            inputMode="decimal"
            step="0.1"
            value={valorLocal}
            onChange={(e) => registrarNumerico(e.target.value)}
            className="text-metric-sm"
          />
          {resposta?.conforme === true && (
            <p className="flex items-center gap-1.5 text-support text-success">
              <CheckCircle2 className="h-4 w-4" strokeWidth={1.7} />
              Dentro da faixa esperada.
            </p>
          )}
        </div>
      )

    case 'conformidade':
      return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { label: 'Conforme', conforme: true as boolean | null },
            { label: 'Não conforme', conforme: false as boolean | null },
            { label: 'Não se aplica', conforme: null as boolean | null },
          ].map((op) => (
            <button
              key={op.label}
              onClick={() => onResponder(op.label, op.conforme, resposta?.observacao, resposta?.evidencia)}
              className={cn(
                'h-12 rounded-md border px-4 text-support font-medium transition-colors',
                resposta?.valor === op.label
                  ? op.conforme === true
                    ? 'border-success-line bg-success-soft text-success'
                    : op.conforme === false
                      ? 'border-danger-line bg-danger-soft text-danger'
                      : 'border-border bg-surface-subtle text-ink-secondary'
                  : 'border-border bg-surface text-ink-secondary hover:bg-surface-hover',
              )}
            >
              {op.label}
            </button>
          ))}
        </div>
      )

    case 'sim_nao':
      return (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Sim', conforme: true },
            { label: 'Não', conforme: false },
          ].map((op) => (
            <button
              key={op.label}
              onClick={() => onResponder(op.label, op.conforme, resposta?.observacao, resposta?.evidencia)}
              className={cn(
                'h-12 rounded-md border px-4 text-support font-medium transition-colors',
                resposta?.valor === op.label ? (op.conforme ? 'border-success-line bg-success-soft text-success' : 'border-danger-line bg-danger-soft text-danger') : 'border-border bg-surface text-ink-secondary hover:bg-surface-hover',
              )}
            >
              {op.label}
            </button>
          ))}
        </div>
      )

    case 'escolha':
      return (
        <div className="flex flex-col gap-2">
          {(item.opcoes ?? []).map((op, i) => (
            <button
              key={op}
              onClick={() => onResponder(op, i === 0 ? true : i === (item.opcoes?.length ?? 1) - 1 ? false : null, resposta?.observacao, resposta?.evidencia)}
              className={cn('h-12 rounded-md border px-4 text-left text-support font-medium transition-colors', resposta?.valor === op ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-surface text-ink-secondary hover:bg-surface-hover')}
            >
              {op}
            </button>
          ))}
        </div>
      )

    case 'assinatura':
      return (
        <Input
          label="Nome do responsável"
          value={valorLocal}
          onChange={(e) => {
            setValorLocal(e.target.value)
            onResponder(e.target.value, e.target.value.trim().length > 0 ? true : null, resposta?.observacao, resposta?.evidencia)
          }}
        />
      )

    case 'foto':
      return (
        <p className="text-support text-ink-tertiary">Registre a evidência fotográfica no campo abaixo.</p>
      )

    default:
      return (
        <Input
          label="Resposta"
          value={valorLocal}
          onChange={(e) => {
            setValorLocal(e.target.value)
            onResponder(e.target.value, e.target.value.trim().length > 0 ? true : null, resposta?.observacao, resposta?.evidencia)
          }}
        />
      )
  }
}
