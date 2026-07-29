import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AlertTriangle, ArrowRight, CheckCircle2, FileDiff, GitBranch, MessageSquare, Sparkles, Star } from 'lucide-react'
import { BibliotecaBreadcrumb } from '@/components/knowledge/BibliotecaBreadcrumb'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import NotFound from './NotFound'
import { KnowledgeStatusBadge, ObligationBadge } from '@/components/knowledge/KnowledgeBadges'
import { useKnowledge } from '@/hooks/useKnowledge'
import { getDocumentById, isRevisionOverdue, REFERENCE_TODAY } from '@/data/knowledge/documents'
import { getProcedureByDocumentId } from '@/data/knowledge/procedures'
import { trainings } from '@/data/knowledge/trainings'
import { checklists } from '@/data/knowledge/checklists'
import { occurrences } from '@/data/occurrences'
import { areaLabels } from '@/data/knowledge/knowledgeSummary'
import { getUnitById } from '@/data/units'
import { calcularConfirmacaoLeitura, calcularImpactoRevisao, diasParaRevisao, proximaVersao } from '@/utils/knowledgeCalculations'
import { useAppState } from '@/context/AppStateContext'
import { formatDateFull, formatPercent } from '@/utils/format'
import { cn } from '@/utils/cn'

export default function BibliotecaProcedimentoDetail() {
  const { procedureId } = useParams()
  return <ProcedimentoDetailBody key={procedureId} id={procedureId ?? ''} />
}

function ProcedimentoDetailBody({ id }: { id: string }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { askCortex } = useAppState()
  const { isFavorito, toggleFavorito, getLeitura, confirmarLeitura, criarRevisao, allRevisions } = useKnowledge()

  const [revisaoAberta, setRevisaoAberta] = useState(searchParams.get('acao') === 'revisar')
  const [motivoRevisao, setMotivoRevisao] = useState('')
  const [comentario, setComentario] = useState('')
  const [comparacaoAberta, setComparacaoAberta] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const doc = getDocumentById(id)
  const procedimento = doc ? getProcedureByDocumentId(doc.id) : undefined
  if (!doc || !procedimento) return <NotFound />

  const leitura = getLeitura(doc.id)
  const confirmacao = calcularConfirmacaoLeitura(doc)
  const impacto = calcularImpactoRevisao(doc)
  const diasRevisao = diasParaRevisao(doc.proximaRevisao, REFERENCE_TODAY)
  const vencida = isRevisionOverdue(doc)
  const revisoesDoDoc = allRevisions.filter((r) => r.documentId === doc.id)
  const versaoAnterior = doc.versoes[1]
  const versaoAtual = doc.versoes[0]

  const treinamentosRel = trainings.filter((t) => doc.treinamentosRelacionados.includes(t.id) || t.documentoRelacionado === doc.id)
  const checklistsRel = checklists.filter((c) => doc.checklistsRelacionados.includes(c.id) || c.documentoRelacionado === doc.id)
  const ocorrenciasRel = occurrences.filter((o) => doc.ocorrenciasRelacionadas.includes(o.id))

  function mostrarFeedback(msg: string) {
    setFeedback(msg)
    window.setTimeout(() => setFeedback(null), 3200)
  }

  function handleCriarRevisao() {
    if (!motivoRevisao.trim()) return
    const nova = criarRevisao(doc!.id, motivoRevisao.trim(), 'Leo')
    setRevisaoAberta(false)
    setMotivoRevisao('')
    mostrarFeedback(`Revisão ${nova.novaVersao} criada em elaboração. A versão ${doc!.versaoVigente} permanece vigente e imutável.`)
  }

  const secoes = [
    { id: 'objetivo', label: '1. Objetivo' },
    { id: 'escopo', label: '2. Escopo' },
    { id: 'responsaveis', label: '3. Responsáveis' },
    { id: 'materiais', label: '4. Materiais' },
    { id: 'seguranca', label: '5. Segurança' },
    { id: 'etapas', label: '6. Etapas' },
    { id: 'controles', label: '7. Limites e tolerâncias' },
    { id: 'evidencias', label: '8. Evidências' },
    { id: 'nc', label: '9. Não conformidades' },
    { id: 'acoes', label: '10. Ações corretivas' },
    { id: 'treinamento', label: '11. Treinamento' },
    { id: 'checklist', label: '12. Checklist' },
    { id: 'historico', label: '13. Histórico de versões' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Procedimentos', path: '/biblioteca/procedimentos' }, { label: doc.codigo }]} />

      <PageHero
        eyebrow={`${doc.codigo} · versão ${doc.versaoVigente}`}
        title={doc.titulo}
        description={doc.descricao}
        meta={
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <KnowledgeStatusBadge status={doc.status} />
            <ObligationBadge obrigatoriedade={doc.obrigatoriedade} />
            <span className="text-caption text-ink-tertiary">
              {areaLabels[doc.area]} · {doc.categoria} · leitura de {doc.tempoLeituraMin} min
            </span>
          </div>
        }
        actions={
          <>
            <Button size="sm" variant="secondary" leftIcon={<Star className={cn('h-3.5 w-3.5', isFavorito(doc.id) && 'fill-accent text-accent')} strokeWidth={1.7} />} onClick={() => toggleFavorito(doc.id)}>
              {isFavorito(doc.id) ? 'Nos favoritos' : 'Favoritar'}
            </Button>
            <Button size="sm" variant="navy" leftIcon={<GitBranch className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setRevisaoAberta(true)}>
              Criar revisão
            </Button>
            <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Qual é o procedimento correto para porcionar carne?', `Procedimento — ${doc.titulo}`)}>
              Perguntar ao CORTEX
            </Button>
          </>
        }
      />

      {vencida && (
        <p className="flex items-center gap-2 rounded-xl border border-warning-line bg-warning-soft px-4 py-3 text-support text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.7} />
          Revisão vencida há {Math.abs(diasRevisao)} dias. A versão {doc.versaoVigente} continua vigente até que uma nova versão seja publicada.
        </p>
      )}

      {feedback && <p className="rounded-xl border border-success-line bg-success-soft px-4 py-3 text-support text-success">{feedback}</p>}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Índice compacto */}
        <nav aria-label="Índice do procedimento" className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-24 flex flex-col gap-1">
            <p className="mb-1 text-label text-ink-tertiary">Neste procedimento</p>
            {secoes.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="rounded-md px-3 py-1.5 text-support text-ink-secondary transition-colors hover:bg-surface-hover hover:text-ink-primary">
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Conteúdo editorial */}
        <article className="flex flex-col gap-10 lg:col-span-6">
          <section id="objetivo">
            <h2 className="text-section-title">1. Objetivo</h2>
            <p className="mt-2 text-body leading-relaxed text-ink-secondary">{procedimento.objetivo}</p>
          </section>

          <section id="escopo">
            <h2 className="text-section-title">2. Escopo</h2>
            <p className="mt-2 text-body leading-relaxed text-ink-secondary">{procedimento.escopo}</p>
          </section>

          <section id="responsaveis">
            <h2 className="text-section-title">3. Responsáveis</h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-body text-ink-secondary">
              {procedimento.responsaveis.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-ink-tertiary">·</span>
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section id="materiais">
            <h2 className="text-section-title">4. Materiais necessários</h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-body text-ink-secondary">
              {procedimento.materiais.map((m, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-ink-tertiary">·</span>
                  {m}
                </li>
              ))}
            </ul>
          </section>

          <section id="seguranca">
            <h2 className="text-section-title">5. Condições de segurança</h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-body text-ink-secondary">
              {procedimento.seguranca.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-ink-tertiary">·</span>
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section id="etapas">
            <h2 className="text-section-title">6. Etapas</h2>
            <div className="mt-3 flex flex-col gap-6">
              {procedimento.etapas.map((etapa) => (
                <div key={etapa.numero} className="border-l-2 border-border pl-5">
                  <p className="text-card-title text-ink-primary">
                    Etapa {etapa.numero} — {etapa.titulo}
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5 text-body text-ink-secondary">
                    {etapa.itens.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-ink-tertiary">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="controles">
            <h2 className="text-section-title">7. Limites e tolerâncias</h2>
            <p className="mt-1 text-support text-ink-tertiary">Controles críticos do procedimento.</p>
            <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-surface">
              <table className="w-full border-collapse text-support">
                <thead>
                  <tr className="border-b border-border bg-surface-subtle/60">
                    {['Parâmetro', 'Padrão', 'Tolerância', 'Frequência', 'Responsável', 'Evidência'].map((h) => (
                      <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-label font-medium text-ink-tertiary">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {procedimento.controles.map((c, i) => (
                    <tr key={i} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3 font-medium text-ink-primary">{c.parametro}</td>
                      <td className="px-4 py-3 tabular">{c.padrao}</td>
                      <td className="px-4 py-3 tabular">{c.tolerancia}</td>
                      <td className="px-4 py-3">{c.frequencia}</td>
                      <td className="px-4 py-3">{c.responsavel}</td>
                      <td className="px-4 py-3 text-ink-secondary">{c.evidencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="evidencias">
            <h2 className="text-section-title">8. Evidências obrigatórias</h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-body text-ink-secondary">
              {procedimento.evidenciasObrigatorias.map((e, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-ink-tertiary">·</span>
                  {e}
                </li>
              ))}
            </ul>
          </section>

          <section id="nc">
            <h2 className="text-section-title">9. Não conformidades comuns</h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-body text-ink-secondary">
              {procedimento.naoConformidadesComuns.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-ink-tertiary">·</span>
                  {n}
                </li>
              ))}
            </ul>
          </section>

          <section id="acoes">
            <h2 className="text-section-title">10. Ações corretivas</h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-body text-ink-secondary">
              {procedimento.acoesCorretivas.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-ink-tertiary">·</span>
                  {a}
                </li>
              ))}
            </ul>
          </section>

          <section id="treinamento">
            <h2 className="text-section-title">11. Treinamento relacionado</h2>
            {treinamentosRel.length === 0 ? (
              <p className="mt-2 text-support text-ink-tertiary">Nenhum treinamento vinculado a este procedimento.</p>
            ) : (
              <div className="mt-3 flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
                {treinamentosRel.map((t) => (
                  <button key={t.id} onClick={() => navigate(`/biblioteca/treinamentos/${t.id}`)} className="flex items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-surface-hover">
                    <span>
                      <span className="block text-support font-medium text-ink-primary">{t.titulo}</span>
                      <span className="block text-caption text-ink-tertiary">
                        {t.codigo} · {t.pendentes} pendentes de {t.atribuidos}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink-tertiary" strokeWidth={1.7} />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section id="checklist">
            <h2 className="text-section-title">12. Checklist relacionado</h2>
            {checklistsRel.length === 0 ? (
              <p className="mt-2 text-support text-ink-tertiary">Nenhum checklist vinculado a este procedimento.</p>
            ) : (
              <div className="mt-3 flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
                {checklistsRel.map((c) => (
                  <button key={c.id} onClick={() => navigate(`/biblioteca/checklists/${c.id}`)} className="flex items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-surface-hover">
                    <span>
                      <span className="block text-support font-medium text-ink-primary">{c.titulo}</span>
                      <span className="block text-caption text-ink-tertiary">
                        {c.codigo} · conformidade {formatPercent(c.conformidadeRede)}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink-tertiary" strokeWidth={1.7} />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section id="historico">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-section-title">13. Histórico de versões</h2>
              {versaoAnterior && (
                <Button size="sm" variant="secondary" leftIcon={<FileDiff className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setComparacaoAberta(true)}>
                  Comparar versões
                </Button>
              )}
            </div>
            <div className="mt-3 flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
              {doc.versoes.map((v) => (
                <div key={v.versao} className="flex flex-col gap-1 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-support font-medium text-ink-primary">Versão {v.versao}</span>
                    <KnowledgeStatusBadge status={v.status} />
                  </div>
                  <p className="text-caption text-ink-tertiary">
                    {v.autor} · {v.publicadaEm ? formatDateFull(v.publicadaEm) : formatDateFull(v.criadaEm)}
                  </p>
                  <p className="text-support text-ink-secondary">{v.motivo}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-caption text-ink-tertiary">Versões publicadas são imutáveis — alterações geram sempre uma nova revisão.</p>
          </section>
        </article>

        {/* Metadados e ações */}
        <aside className="flex flex-col gap-6 lg:col-span-3">
          <Card>
            <p className="mb-3 text-label text-ink-tertiary">Governança</p>
            <DataList
              items={[
                { label: 'Versão vigente', value: doc.versaoVigente },
                { label: 'Responsável', value: doc.responsavel },
                { label: 'Autor', value: doc.autor },
                { label: 'Aprovadores', value: doc.aprovadores.join(', ') || '—' },
                { label: 'Última revisão', value: formatDateFull(doc.ultimaRevisao) },
                { label: 'Próxima revisão', value: <span className={vencida ? 'text-danger' : undefined}>{formatDateFull(doc.proximaRevisao)}</span> },
                { label: 'Unidades', value: `${doc.unidadesAplicaveis.length} unidades` },
                { label: 'Funções', value: doc.funcoesAplicaveis.join(', ') },
              ]}
            />
          </Card>

          {confirmacao !== null && (
            <Card>
              <p className="mb-2 text-label text-ink-tertiary">Confirmação de leitura</p>
              <ProgressBar value={confirmacao} status={confirmacao >= 0.9 ? 'success' : 'attention'} valueLabel={`${doc.confirmacoesLeitura}/${doc.confirmacoesEsperadas}`} />
              <p className="mt-3 text-caption leading-relaxed text-ink-tertiary">
                A confirmação de leitura registra ciência do conteúdo — não substitui o treinamento nem comprova capacitação.
              </p>
              {leitura ? (
                <p className="mt-3 flex items-center gap-1.5 text-support text-success">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.7} />
                  Leitura confirmada em {formatDateFull(leitura.confirmadoEm)}
                </p>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  <Button size="sm" variant="primary" onClick={() => confirmarLeitura(doc.id, true)}>
                    Confirmar leitura e entendimento
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => confirmarLeitura(doc.id, false, undefined, true)}>
                    O conteúdo não corresponde à prática
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/biblioteca/treinamentos/${treinamentosRel[0]?.id ?? 'trn-coz-007'}`)}>
                    Solicitar treinamento
                  </Button>
                </div>
              )}
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                <Input aria-label="Registrar dúvida ou comentário" placeholder="Registrar dúvida ou comentário" value={comentario} onChange={(e) => setComentario(e.target.value)} />
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<MessageSquare className="h-3.5 w-3.5" strokeWidth={1.7} />}
                  onClick={() => {
                    if (!comentario.trim()) return
                    confirmarLeitura(doc.id, leitura?.entendimento ?? false, comentario.trim())
                    setComentario('')
                    mostrarFeedback('Comentário registrado para o responsável pelo procedimento.')
                  }}
                >
                  Enviar
                </Button>
              </div>
            </Card>
          )}

          {ocorrenciasRel.length > 0 && (
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Ocorrências relacionadas</p>
              <div className="flex flex-col gap-2">
                {ocorrenciasRel.map((o) => (
                  <button key={o.id} onClick={() => navigate('/', { state: { scrollToOccurrence: true } })} className="rounded-md border border-border bg-surface-subtle px-3 py-2 text-left transition-colors hover:bg-surface-hover">
                    <span className="block text-support font-medium text-ink-primary">{o.titulo}</span>
                    <span className="block text-caption text-ink-tertiary">{o.unidades.join(' · ')}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {revisoesDoDoc.length > 0 && (
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Revisões deste documento</p>
              <div className="flex flex-col gap-2">
                {revisoesDoDoc.map((r) => (
                  <div key={r.id} className="rounded-md border border-border bg-surface-subtle px-3 py-2">
                    <span className="block text-support font-medium text-ink-primary">
                      {r.versaoOrigem} → {r.novaVersao}
                    </span>
                    <span className="block text-caption text-ink-tertiary">{r.motivo}</span>
                  </div>
                ))}
              </div>
              <Button size="sm" variant="ghost" className="mt-2" onClick={() => navigate('/biblioteca/revisoes')}>
                Ver todas as revisões
              </Button>
            </Card>
          )}
        </aside>
      </div>

      {/* Modal: criar revisão com impacto */}
      <Modal
        isOpen={revisaoAberta}
        onClose={() => setRevisaoAberta(false)}
        title={`Criar revisão ${proximaVersao(doc.versaoVigente)}`}
        description={`A versão ${doc.versaoVigente} permanece vigente e imutável até a publicação da nova versão.`}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRevisaoAberta(false)}>
              Cancelar
            </Button>
            <Button variant="primary" disabled={!motivoRevisao.trim()} onClick={handleCriarRevisao}>
              Criar revisão
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Motivo da revisão" placeholder="Ex.: desvio recorrente de porcionamento" value={motivoRevisao} onChange={(e) => setMotivoRevisao(e.target.value)} />

          <div className="rounded-xl border border-border bg-surface-subtle p-4">
            <p className="mb-2 text-label text-ink-tertiary">Impacto desta revisão</p>
            <DataList
              items={[
                { label: 'Unidades afetadas', value: impacto.unidadesAfetadas.map((u) => getUnitById(u)?.nomeCurto ?? u).join(', ') },
                { label: 'Funções afetadas', value: impacto.funcoesAfetadas.join(', ') },
                { label: 'Treinamentos a atualizar', value: impacto.treinamentosAfetados.length > 0 ? impacto.treinamentosAfetados.length : 'Nenhum' },
                { label: 'Checklists relacionados', value: impacto.checklistsAfetados.length > 0 ? impacto.checklistsAfetados.length : 'Nenhum' },
                { label: 'Fichas técnicas relacionadas', value: impacto.fichasAfetadas.length > 0 ? impacto.fichasAfetadas.join(', ') : 'Nenhuma' },
                { label: 'Ocorrências relacionadas', value: impacto.ocorrenciasRelacionadas.length > 0 ? impacto.ocorrenciasRelacionadas.length : 'Nenhuma' },
                { label: 'Pessoas que precisam confirmar leitura', value: impacto.pessoasParaConfirmar },
              ]}
            />
          </div>
        </div>
      </Modal>

      {/* Modal: comparação de versões */}
      {versaoAnterior && (
        <Modal isOpen={comparacaoAberta} onClose={() => setComparacaoAberta(false)} title={`Comparar ${versaoAnterior.versao} → ${versaoAtual.versao}`} description="Apenas as mudanças entre as duas versões." size="lg">
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-border bg-surface-subtle px-4 py-3">
              <p className="text-label text-ink-tertiary">Motivo da alteração</p>
              <p className="mt-1 text-support text-ink-secondary">{versaoAtual.motivo}</p>
            </div>
            {versaoAtual.alteracoes.length === 0 ? (
              <p className="text-support text-ink-tertiary">Nenhuma alteração registrada nesta versão.</p>
            ) : (
              <div className="flex flex-col divide-y divide-border rounded-xl border border-border">
                {versaoAtual.alteracoes.map((a, i) => (
                  <div key={i} className="flex flex-col gap-1 px-4 py-3">
                    <span className="text-support font-medium text-ink-primary">{a.descricao}</span>
                    {a.antes && a.depois && (
                      <span className="flex flex-wrap items-center gap-2 text-support">
                        <span className="rounded bg-danger-soft px-2 py-0.5 text-danger line-through">{a.antes}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-ink-tertiary" strokeWidth={1.7} />
                        <span className="rounded bg-success-soft px-2 py-0.5 text-success">{a.depois}</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
