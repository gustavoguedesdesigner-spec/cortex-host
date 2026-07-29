import { useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Download, GitBranch, Sparkles, Star } from 'lucide-react'
import { BibliotecaBreadcrumb } from '@/components/knowledge/BibliotecaBreadcrumb'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import NotFound from './NotFound'
import { KnowledgeStatusBadge, ObligationBadge } from '@/components/knowledge/KnowledgeBadges'
import { useKnowledge } from '@/hooks/useKnowledge'
import { getDocumentById, isRevisionOverdue, REFERENCE_TODAY } from '@/data/knowledge/documents'
import { areaLabels } from '@/data/knowledge/knowledgeSummary'
import { calcularConfirmacaoLeitura, diasParaRevisao } from '@/utils/knowledgeCalculations'
import { useAppState } from '@/context/AppStateContext'
import { formatDateFull } from '@/utils/format'
import { cn } from '@/utils/cn'

/**
 * Detalhe de conteúdos que não são procedimentos (políticas, guias,
 * comunicados). Procedimentos usam a leitura editorial própria em
 * BibliotecaProcedimentoDetail.
 */
export default function BibliotecaDocumentoDetail() {
  const { documentId } = useParams()
  return <DocumentoDetailBody key={documentId} id={documentId ?? ''} />
}

function DocumentoDetailBody({ id }: { id: string }) {
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { isFavorito, toggleFavorito, getLeitura, confirmarLeitura, criarRevisao } = useKnowledge()

  const doc = getDocumentById(id)
  if (!doc) return <NotFound />

  /* Procedimentos têm página própria — redireciona por link, sem duplicar conteúdo. */
  const leitura = getLeitura(doc.id)
  const confirmacao = calcularConfirmacaoLeitura(doc)
  const vencida = isRevisionOverdue(doc)
  const diasRevisao = diasParaRevisao(doc.proximaRevisao, REFERENCE_TODAY)

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Documentos', path: '/biblioteca/documentos' }, { label: doc.codigo }]} />

      <PageHero
        eyebrow={`${doc.codigo} · versão ${doc.versaoVigente}`}
        title={doc.titulo}
        description={doc.descricao}
        meta={
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <KnowledgeStatusBadge status={doc.status} />
            <ObligationBadge obrigatoriedade={doc.obrigatoriedade} />
            <span className="text-caption text-ink-tertiary">
              {areaLabels[doc.area]} · {doc.categoria}
              {doc.tempoLeituraMin ? ` · leitura de ${doc.tempoLeituraMin} min` : ''}
            </span>
          </div>
        }
        actions={
          <>
            <Button size="sm" variant="secondary" leftIcon={<Star className={cn('h-3.5 w-3.5', isFavorito(doc.id) && 'fill-accent text-accent')} strokeWidth={1.7} />} onClick={() => toggleFavorito(doc.id)}>
              {isFavorito(doc.id) ? 'Nos favoritos' : 'Favoritar'}
            </Button>
            <Button size="sm" variant="navy" leftIcon={<GitBranch className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => { criarRevisao(doc.id, 'Revisão solicitada a partir do documento.', 'Leo'); navigate('/biblioteca/revisoes') }}>
              Criar revisão
            </Button>
            <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Qual versão está vigente?', `Documento — ${doc.titulo}`)}>
              Perguntar ao CORTEX
            </Button>
          </>
        }
      />

      {vencida && (
        <p className="flex items-center gap-2 rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-support text-danger">
          <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.7} />
          Revisão vencida há {Math.abs(diasRevisao)} dias. O conteúdo continua acessível, mas exige atualização.
        </p>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <section>
            <SectionHeader title="Sobre este conteúdo" />
            <p className="text-body leading-relaxed text-ink-secondary">{doc.descricao}</p>
            <p className="mt-3 text-support leading-relaxed text-ink-tertiary">
              Este é um conteúdo do tipo {doc.tipo.replace(/_/g, ' ')} aplicável a {doc.unidadesAplicaveis.length} unidades e às funções: {doc.funcoesAplicaveis.join(', ')}.
            </p>
          </section>

          <section>
            <SectionHeader title="Palavras-chave" />
            <div className="flex flex-wrap gap-2">
              {doc.palavrasChave.map((p) => (
                <span key={p} className="rounded-full border border-border bg-surface-subtle px-3 py-1 text-caption text-ink-secondary">
                  {p}
                </span>
              ))}
            </div>
          </section>

          {doc.anexos.length > 0 && (
            <section>
              <SectionHeader title="Anexos" />
              <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
                {doc.anexos.map((a) => (
                  <div key={a.nome} className="flex items-center justify-between gap-4 px-4 py-3">
                    <span>
                      <span className="block text-support font-medium text-ink-primary">{a.nome}</span>
                      <span className="block text-caption text-ink-tertiary">
                        {a.tipo} · {a.tamanhoKb} KB
                      </span>
                    </span>
                    <Button size="sm" variant="ghost" leftIcon={<Download className="h-3.5 w-3.5" strokeWidth={1.7} />}>
                      Baixar
                    </Button>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-caption text-ink-tertiary">Download demonstrativo — sem arquivo real anexado nesta etapa do protótipo.</p>
            </section>
          )}

          <section>
            <SectionHeader title="Histórico de versões" />
            <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
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
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-4">
          <Card>
            <p className="mb-3 text-label text-ink-tertiary">Governança</p>
            <DataList
              items={[
                { label: 'Versão vigente', value: doc.versaoVigente },
                { label: 'Responsável', value: doc.responsavel },
                { label: 'Autor', value: doc.autor },
                { label: 'Aprovadores', value: doc.aprovadores.join(', ') || '—' },
                { label: 'Publicado em', value: doc.publicadoEm ? formatDateFull(doc.publicadoEm) : '—' },
                { label: 'Última revisão', value: formatDateFull(doc.ultimaRevisao) },
                { label: 'Próxima revisão', value: <span className={vencida ? 'text-danger' : undefined}>{formatDateFull(doc.proximaRevisao)}</span> },
                { label: 'Visualizações', value: doc.visualizacoes },
              ]}
            />
          </Card>

          {confirmacao !== null && (
            <Card>
              <p className="mb-2 text-label text-ink-tertiary">Confirmação de leitura</p>
              <ProgressBar value={confirmacao} status={confirmacao >= 0.9 ? 'success' : 'attention'} valueLabel={`${doc.confirmacoesLeitura}/${doc.confirmacoesEsperadas}`} />
              <p className="mt-3 text-caption leading-relaxed text-ink-tertiary">
                A confirmação registra ciência do conteúdo — não substitui treinamento nem comprova capacitação.
              </p>
              {leitura ? (
                <p className="mt-3 flex items-center gap-1.5 text-support text-success">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={1.7} />
                  Leitura confirmada em {formatDateFull(leitura.confirmadoEm)}
                </p>
              ) : (
                <Button size="sm" variant="primary" className="mt-3 w-full" onClick={() => confirmarLeitura(doc.id, true)}>
                  Confirmar leitura
                </Button>
              )}
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}
