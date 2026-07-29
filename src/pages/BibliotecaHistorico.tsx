import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { History } from 'lucide-react'
import { BibliotecaBreadcrumb } from '@/components/knowledge/BibliotecaBreadcrumb'
import { BibliotecaInternalNav } from '@/components/knowledge/BibliotecaInternalNav'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { useKnowledge } from '@/hooks/useKnowledge'
import { getUnitById } from '@/data/units'
import { formatDateFull } from '@/utils/format'

interface HistoryEvent {
  id: string
  data: string
  titulo: string
  descricao: string
  path: string
}

/**
 * Trilha de auditoria consolidada — combina eventos de todas as camadas do
 * módulo (revisões, execuções, não conformidades) em ordem cronológica.
 * Não é uma fonte de dados própria: deriva das mesmas fontes já usadas
 * em cada aba, para nunca divergir dos números exibidos ali.
 */
export default function BibliotecaHistorico() {
  const navigate = useNavigate()
  const { allRevisions, allExecutions, allNonConformities, checklists } = useKnowledge()

  const eventos = useMemo<HistoryEvent[]>(() => {
    const revisao = allRevisions.map((r) => ({
      id: `rev-${r.id}`,
      data: r.solicitadaEm,
      titulo: `Revisão ${r.novaVersao} solicitada`,
      descricao: `${r.motivo} · por ${r.solicitadaPor}`,
      path: '/biblioteca/revisoes',
    }))
    const execucao = allExecutions
      .filter((e) => e.concluidaEm)
      .map((e) => ({
        id: `exe-${e.id}`,
        data: e.concluidaEm as string,
        titulo: `${checklists.find((c) => c.id === e.checklistId)?.titulo ?? e.checklistId} concluído`,
        descricao: `${getUnitById(e.unitId)?.nomeCurto ?? e.unitId} · ${e.responsavel}`,
        path: `/biblioteca/checklists/${e.checklistId}`,
      }))
    const nc = allNonConformities.map((n) => ({
      id: `nc-${n.id}`,
      data: n.registradaEm,
      titulo: `${n.numero} registrada`,
      descricao: `${getUnitById(n.unitId)?.nomeCurto ?? n.unitId} · ${n.descricao.slice(0, 70)}`,
      path: '/biblioteca/conformidade',
    }))
    return [...revisao, ...execucao, ...nc].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  }, [allRevisions, allExecutions, allNonConformities, checklists])

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Histórico' }]} />
      <PageHero eyebrow="Conhecimento" title="Histórico" description="Trilha de eventos da biblioteca — revisões, execuções de checklist e não conformidades registradas." />
      <BibliotecaInternalNav active="historico" />

      <SectionHeader title={`${eventos.length} eventos`} />

      {eventos.length === 0 ? (
        <EmptyState icon={<History className="h-5 w-5" />} title="Nenhum evento registrado" description="Eventos aparecem aqui conforme você usa a biblioteca." />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {eventos.map((e) => (
            <button key={e.id} onClick={() => navigate(e.path)} className="flex items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
              <div className="min-w-0">
                <p className="text-support font-medium text-ink-primary">{e.titulo}</p>
                <p className="text-caption text-ink-tertiary">{e.descricao}</p>
              </div>
              <span className="shrink-0 text-caption text-ink-tertiary">{formatDateFull(e.data)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
