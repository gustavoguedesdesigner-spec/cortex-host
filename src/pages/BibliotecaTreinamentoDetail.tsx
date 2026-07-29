import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, RotateCcw, Sparkles } from 'lucide-react'
import { BibliotecaBreadcrumb } from '@/components/knowledge/BibliotecaBreadcrumb'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import NotFound from './NotFound'
import { KnowledgeStatusBadge, ObligationBadge, TrainingStatusBadge } from '@/components/knowledge/KnowledgeBadges'
import { useKnowledge } from '@/hooks/useKnowledge'
import { getTrainingById, getAssignmentsByTraining } from '@/data/knowledge/trainings'
import { getDocumentById } from '@/data/knowledge/documents'
import { getChecklistById } from '@/data/knowledge/checklists'
import { areaLabels } from '@/data/knowledge/knowledgeSummary'
import { getUnitById } from '@/data/units'
import { avaliarProva, calcularProgressoTreinamento, calcularTaxaConclusao } from '@/utils/knowledgeCalculations'
import { useAppState } from '@/context/AppStateContext'
import { formatDateShort, formatPercent } from '@/utils/format'
import { cn } from '@/utils/cn'

const USUARIO_DEMO = 'Marina Costa'

export default function BibliotecaTreinamentoDetail() {
  const { trainingId } = useParams()
  return <TreinamentoDetailBody key={trainingId} id={trainingId ?? ''} />
}

type Aba = 'conteudo' | 'avaliacao' | 'atribuicoes'

function TreinamentoDetailBody({ id }: { id: string }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { askCortex } = useAppState()
  const { getProgresso, concluirModulo, registrarAvaliacao } = useKnowledge()

  const [aba, setAba] = useState<Aba>(searchParams.get('aba') === 'atribuicoes' ? 'atribuicoes' : 'conteudo')
  const [moduloAtivo, setModuloAtivo] = useState(1)
  const [respostas, setRespostas] = useState<Record<string, number>>({})
  const [resultado, setResultado] = useState<{ acertos: number; total: number; aproveitamento: number; aprovado: boolean } | null>(null)

  const training = getTrainingById(id)
  if (!training) return <NotFound />

  const progresso = getProgresso(training.id)
  const modulosConcluidos = progresso?.modulosConcluidos ?? 0
  const percentual = calcularProgressoTreinamento(modulosConcluidos, training.modulos.length)
  const taxaRede = calcularTaxaConclusao(training.concluidos, training.atribuidos)
  const atribuicoes = getAssignmentsByTraining(training.id)
  const documento = training.documentoRelacionado ? getDocumentById(training.documentoRelacionado) : undefined
  const checklist = training.checklistRelacionado ? getChecklistById(training.checklistRelacionado) : undefined
  const modulo = training.modulos.find((m) => m.numero === moduloAtivo) ?? training.modulos[0]
  const statusUsuario = progresso?.status ?? 'nao_iniciado'

  function handleFinalizarAvaliacao() {
    const r = avaliarProva(training!.avaliacao, respostas, training!.aproveitamentoMinimo)
    setResultado(r)
    registrarAvaliacao(training!.id, r.aproveitamento, r.aprovado)
  }

  function refazerAvaliacao() {
    setRespostas({})
    setResultado(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Treinamentos', path: '/biblioteca/treinamentos' }, { label: training.codigo }]} />

      <PageHero
        eyebrow={`${training.codigo} · ${areaLabels[training.area]}`}
        title={training.titulo}
        description={training.descricao}
        meta={
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <KnowledgeStatusBadge status={training.status} />
            <ObligationBadge obrigatoriedade={training.obrigatoriedade} />
            <TrainingStatusBadge status={statusUsuario} />
            <span className="text-caption text-ink-tertiary">
              {training.duracaoMin} min · {training.modulos.length} módulos · validade de {training.validadeMeses} meses
            </span>
          </div>
        }
        actions={
          <>
            <Button size="sm" variant="primary" leftIcon={<GraduationCap className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => { setAba('conteudo'); setModuloAtivo(Math.min(modulosConcluidos + 1, training.modulos.length)) }}>
              {modulosConcluidos === 0 ? 'Iniciar treinamento' : 'Continuar'}
            </Button>
            {documento && (
              <Button size="sm" variant="secondary" leftIcon={<BookOpen className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/biblioteca/procedimentos/${documento.id}`)}>
                Abrir procedimento
              </Button>
            )}
            <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Existe um treinamento relacionado?', `Treinamento — ${training.titulo}`)}>
              Perguntar ao CORTEX
            </Button>
          </>
        }
      />

      <SegmentedControl
        value={aba}
        onChange={setAba}
        options={[
          { value: 'conteudo', label: 'Conteúdo' },
          { value: 'avaliacao', label: 'Avaliação' },
          { value: 'atribuicoes', label: `Atribuições (${training.pendentes} pendentes)` },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          {aba === 'conteudo' && (
            <>
              <section>
                <SectionHeader title="Módulos" description="Conclua cada módulo para liberar a avaliação final." />
                <div className="flex flex-wrap gap-2">
                  {training.modulos.map((m) => {
                    const concluido = m.numero <= modulosConcluidos
                    const ativo = m.numero === moduloAtivo
                    return (
                      <button
                        key={m.numero}
                        onClick={() => setModuloAtivo(m.numero)}
                        className={cn(
                          'flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-support font-medium transition-colors',
                          ativo ? 'border-accent bg-accent-soft text-accent' : concluido ? 'border-success-line bg-success-soft text-success' : 'border-border bg-surface text-ink-secondary hover:bg-surface-hover',
                        )}
                      >
                        {concluido && <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.7} />}
                        {m.numero}. {m.titulo}
                      </button>
                    )
                  })}
                </div>
              </section>

              <section>
                <div className="rounded-xl border border-border bg-surface p-6">
                  <p className="text-label text-ink-tertiary">
                    Módulo {modulo.numero} de {training.modulos.length} · {modulo.duracaoMin} min
                  </p>
                  <h2 className="mt-1 text-section-title">{modulo.titulo}</h2>
                  <p className="mt-3 text-body leading-relaxed text-ink-secondary">{modulo.conteudo}</p>

                  <div className="mt-5 rounded-md border border-border bg-surface-subtle p-4">
                    <p className="text-label text-ink-tertiary">Pergunta de verificação</p>
                    <p className="mt-1 text-support text-ink-primary">{modulo.perguntaVerificacao}</p>
                    <p className="mt-2 text-support text-ink-secondary">
                      <span className="text-ink-tertiary">Resposta esperada: </span>
                      {modulo.respostaEsperada}
                    </p>
                  </div>

                  {training.formato === 'video' && (
                    <p className="mt-4 text-caption text-ink-tertiary">
                      Conteúdo em vídeo demonstrativo — nesta etapa do protótipo o material é apresentado em texto, sem reprodução de mídia.
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        concluirModulo(training.id, modulo.numero)
                        if (modulo.numero < training.modulos.length) setModuloAtivo(modulo.numero + 1)
                        else setAba('avaliacao')
                      }}
                    >
                      {modulo.numero < training.modulos.length ? 'Concluir e avançar' : 'Concluir e ir para a avaliação'}
                    </Button>
                    {modulo.numero > 1 && (
                      <Button size="sm" variant="secondary" onClick={() => setModuloAtivo(modulo.numero - 1)}>
                        Rever módulo anterior
                      </Button>
                    )}
                    {modulo.materialRelacionado && (
                      <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/biblioteca/procedimentos/${modulo.materialRelacionado}`)}>
                        Abrir material relacionado
                      </Button>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}

          {aba === 'avaliacao' && (
            <section>
              <SectionHeader title="Avaliação final" description={`Aproveitamento mínimo de ${formatPercent(training.aproveitamentoMinimo, 0)} para aprovação.`} />

              {resultado ? (
                <div className={cn('rounded-xl border p-6', resultado.aprovado ? 'border-success-line bg-success-soft' : 'border-danger-line bg-danger-soft')}>
                  <p className={cn('text-section-title', resultado.aprovado ? 'text-success' : 'text-danger')}>{resultado.aprovado ? 'Aprovado' : 'Não aprovado'}</p>
                  <p className={cn('mt-1 text-support', resultado.aprovado ? 'text-success' : 'text-danger')}>
                    {resultado.acertos} de {resultado.total} corretas · aproveitamento de {formatPercent(resultado.aproveitamento, 0)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" leftIcon={<RotateCcw className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={refazerAvaliacao}>
                      Refazer avaliação
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setAba('conteudo')}>
                      Rever conteúdo
                    </Button>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4">
                    {training.avaliacao.map((q) => {
                      const marcada = respostas[q.id]
                      const correta = marcada === q.indiceCorreto
                      return (
                        <div key={q.id}>
                          <p className="text-support font-medium text-ink-primary">{q.enunciado}</p>
                          <p className={cn('mt-0.5 text-caption', correta ? 'text-success' : 'text-danger')}>
                            {correta ? 'Correta' : `Sua resposta: ${q.alternativas[marcada] ?? '—'} · Correta: ${q.alternativas[q.indiceCorreto]}`}
                          </p>
                          <p className="mt-0.5 text-caption leading-relaxed text-ink-secondary">{q.explicacao}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {training.avaliacao.map((q, i) => (
                    <fieldset key={q.id} className="rounded-xl border border-border bg-surface p-5">
                      <legend className="px-1 text-label text-ink-tertiary">Questão {i + 1}</legend>
                      <p className="text-support font-medium text-ink-primary">{q.enunciado}</p>
                      <div className="mt-3 flex flex-col gap-2">
                        {q.alternativas.map((alt, idx) => (
                          <label key={idx} className={cn('flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2.5 text-support transition-colors', respostas[q.id] === idx ? 'border-accent bg-accent-soft text-ink-primary' : 'border-border bg-surface text-ink-secondary hover:bg-surface-hover')}>
                            <input type="radio" name={q.id} checked={respostas[q.id] === idx} onChange={() => setRespostas((prev) => ({ ...prev, [q.id]: idx }))} className="accent-accent" />
                            {alt}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                  <Button variant="primary" className="self-start" disabled={Object.keys(respostas).length < training.avaliacao.length} onClick={handleFinalizarAvaliacao}>
                    Finalizar avaliação
                  </Button>
                  {Object.keys(respostas).length < training.avaliacao.length && (
                    <p className="text-caption text-ink-tertiary">Responda todas as questões para finalizar.</p>
                  )}
                </div>
              )}
            </section>
          )}

          {aba === 'atribuicoes' && (
            <section>
              <SectionHeader title="Atribuições" description="Colaboradores com este treinamento atribuído." />
              <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
                {atribuicoes.map((a) => (
                  <div key={a.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-support font-medium text-ink-primary">{a.colaborador}</p>
                      <p className="text-caption text-ink-tertiary">
                        {a.funcao} · {getUnitById(a.unitId)?.nomeCurto ?? a.unitId} · {a.motivo}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                      <ProgressBar value={a.progressoPercentual / 100} status={a.atrasado ? 'critical' : 'info'} valueLabel={`${a.progressoPercentual}%`} className="w-24" />
                      <span className={cn('text-caption', a.atrasado ? 'text-danger' : 'text-ink-tertiary')}>Prazo {formatDateShort(a.prazo)}</span>
                      <TrainingStatusBadge status={a.status} />
                    </div>
                  </div>
                ))}
              </div>
              {atribuicoes.length === 0 && <p className="text-support text-ink-tertiary">Nenhuma atribuição nominal na amostra demonstrativa deste treinamento.</p>}
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-4">
          <Card>
            <p className="mb-2 text-label text-ink-tertiary">Seu progresso</p>
            <ProgressBar value={percentual} status={percentual >= 1 ? 'success' : 'info'} valueLabel={formatPercent(percentual, 0)} />
            <DataList
              className="mt-3"
              items={[
                { label: 'Módulos concluídos', value: `${modulosConcluidos} de ${training.modulos.length}` },
                { label: 'Status', value: <TrainingStatusBadge status={statusUsuario} /> },
                { label: 'Tentativas', value: progresso?.tentativas ?? 0 },
                { label: 'Resultado', value: progresso?.resultado !== undefined ? formatPercent(progresso.resultado, 0) : '—' },
                { label: 'Colaborador', value: USUARIO_DEMO },
              ]}
            />
          </Card>

          {progresso?.status === 'concluido' && (
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Certificação interna</p>
              <DataList
                items={[
                  { label: 'Conclusão', value: progresso.concluidoEm ? formatDateShort(progresso.concluidoEm) : '—' },
                  { label: 'Resultado', value: progresso.resultado !== undefined ? formatPercent(progresso.resultado, 0) : '—' },
                  { label: 'Validade', value: `${training.validadeMeses} meses` },
                  { label: 'Versão do treinamento', value: training.codigo },
                ]}
              />
              <p className="mt-3 text-caption leading-relaxed text-ink-tertiary">
                Registro interno de capacitação. Não representa certificação profissional externa.
              </p>
            </Card>
          )}

          <Card>
            <p className="mb-3 text-label text-ink-tertiary">Alcance na rede</p>
            <DataList
              items={[
                { label: 'Atribuídos', value: training.atribuidos },
                { label: 'Concluídos', value: training.concluidos },
                { label: 'Pendentes', value: training.pendentes },
                { label: 'Taxa de conclusão', value: taxaRede !== null ? formatPercent(taxaRede) : '—' },
                { label: 'Público', value: training.publico.join(', ') },
                { label: 'Unidades críticas', value: training.unidadesCriticas.length > 0 ? training.unidadesCriticas.map((u) => getUnitById(u)?.nomeCurto ?? u).join(', ') : 'Nenhuma' },
              ]}
            />
          </Card>

          {(documento || checklist) && (
            <Card>
              <p className="mb-3 text-label text-ink-tertiary">Conteúdo relacionado</p>
              <div className="flex flex-col gap-2">
                {documento && (
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/biblioteca/procedimentos/${documento.id}`)}>
                    {documento.codigo} — {documento.titulo}
                  </Button>
                )}
                {checklist && (
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/biblioteca/checklists/${checklist.id}`)}>
                    {checklist.codigo} — {checklist.titulo}
                  </Button>
                )}
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}
