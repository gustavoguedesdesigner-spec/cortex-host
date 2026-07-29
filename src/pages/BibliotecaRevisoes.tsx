import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, GitBranch, XCircle } from 'lucide-react'
import { BibliotecaBreadcrumb } from '@/components/knowledge/BibliotecaBreadcrumb'
import { BibliotecaInternalNav } from '@/components/knowledge/BibliotecaInternalNav'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useKnowledge } from '@/hooks/useKnowledge'
import { getDocumentById } from '@/data/knowledge/documents'
import { calcularImpactoRevisao } from '@/utils/knowledgeCalculations'
import { getUnitById } from '@/data/units'
import { formatDateShort } from '@/utils/format'

const statusLabels: Record<string, string> = {
  solicitada: 'Solicitada',
  em_elaboracao: 'Em elaboração',
  aguardando_aprovacao: 'Aguardando aprovação',
  aprovada: 'Aprovada',
  publicada: 'Publicada',
  rejeitada: 'Rejeitada',
}

export default function BibliotecaRevisoes() {
  const navigate = useNavigate()
  const { allRevisions, atualizarRevisao } = useKnowledge()
  const [feedback, setFeedback] = useState<string | null>(null)

  function mostrarFeedback(msg: string) {
    setFeedback(msg)
    window.setTimeout(() => setFeedback(null), 3600)
  }

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Revisões' }]} />
      <PageHero
        eyebrow="Conhecimento"
        title="Revisões"
        description="Solicitações de revisão em andamento. Versões publicadas permanecem imutáveis até a nova versão entrar em vigência."
      />
      <BibliotecaInternalNav active="revisoes" />

      {feedback && <p className="rounded-xl border border-success-line bg-success-soft px-4 py-3 text-support text-success">{feedback}</p>}

      <SectionHeader title={`${allRevisions.length} revisões`} />

      {allRevisions.length === 0 ? (
        <EmptyState icon={<GitBranch className="h-5 w-5" />} title="Nenhuma revisão em andamento" description="Crie uma revisão a partir de um procedimento ou documento." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {allRevisions.map((r) => {
            const doc = getDocumentById(r.documentId)
            const impacto = doc ? calcularImpactoRevisao(doc) : undefined
            return (
              <Card key={r.id} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-card-title text-ink-primary">{doc?.titulo ?? r.documentId}</p>
                    <p className="text-caption text-ink-tertiary">
                      {doc?.codigo} · {r.versaoOrigem} → {r.novaVersao}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-surface-subtle px-2 py-0.5 text-badge text-ink-secondary">{statusLabels[r.status] ?? r.status}</span>
                </div>

                <p className="text-support leading-relaxed text-ink-secondary">{r.motivo}</p>

                <DataList
                  items={[
                    { label: 'Solicitada por', value: r.solicitadaPor },
                    { label: 'Solicitada em', value: formatDateShort(r.solicitadaEm) },
                    { label: 'Vigência prevista', value: r.vigenciaPrevista ? formatDateShort(r.vigenciaPrevista) : 'A definir' },
                    { label: 'Aprovadores', value: r.aprovadores.map((a) => a.nome).join(', ') || '—' },
                  ]}
                />

                {impacto && (
                  <div className="rounded-md border border-border bg-surface-subtle p-3">
                    <p className="text-label text-ink-tertiary">Impacto</p>
                    <p className="mt-1 text-caption leading-relaxed text-ink-secondary">
                      {impacto.unidadesAfetadas.length} unidades ({impacto.unidadesAfetadas.map((u) => getUnitById(u)?.nomeCurto ?? u).slice(0, 3).join(', ')}
                      {impacto.unidadesAfetadas.length > 3 ? '…' : ''}) · {impacto.funcoesAfetadas.length} funções · {impacto.treinamentosAfetados.length} treinamentos ·{' '}
                      {impacto.checklistsAfetados.length} checklists · {impacto.pessoasParaConfirmar} pessoas precisam confirmar leitura
                    </p>
                  </div>
                )}

                {r.alteracoes.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-label text-ink-tertiary">Alterações previstas</p>
                    <ul className="flex flex-col gap-1 text-support text-ink-secondary">
                      {r.alteracoes.map((a, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-ink-tertiary">·</span>
                          <span>
                            {a.descricao}
                            {a.antes && a.depois ? ` (${a.antes} → ${a.depois})` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-1 flex flex-wrap gap-2 border-t border-border pt-3">
                  {doc && (
                    <Button size="sm" variant="secondary" onClick={() => navigate(doc.tipo === 'procedimento' ? `/biblioteca/procedimentos/${doc.id}` : `/biblioteca/documentos/${doc.id}`)}>
                      Abrir documento
                    </Button>
                  )}
                  {r.status !== 'publicada' && r.status !== 'aprovada' && (
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.7} />}
                      onClick={() => {
                        atualizarRevisao(r.id, { status: 'aprovada' })
                        mostrarFeedback(`Revisão ${r.novaVersao} aprovada. Defina a vigência para publicar e substituir a versão ${r.versaoOrigem}.`)
                      }}
                    >
                      Aprovar
                    </Button>
                  )}
                  {r.status === 'aprovada' && (
                    <Button
                      size="sm"
                      variant="navy"
                      onClick={() => {
                        atualizarRevisao(r.id, { status: 'publicada' })
                        mostrarFeedback(`Versão ${r.novaVersao} publicada. A versão ${r.versaoOrigem} passa a constar como substituída no histórico.`)
                      }}
                    >
                      Publicar
                    </Button>
                  )}
                  {r.status !== 'rejeitada' && r.status !== 'publicada' && (
                    <Button size="sm" variant="ghost" leftIcon={<XCircle className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => { atualizarRevisao(r.id, { status: 'rejeitada' }); mostrarFeedback('Revisão rejeitada e devolvida ao solicitante.') }}>
                      Rejeitar
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
