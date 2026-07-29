import { useCallback, useMemo } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import { knowledgeDocuments } from '@/data/knowledge/documents'
import { trainings, trainingAssignments } from '@/data/knowledge/trainings'
import { checklists, checklistExecutions } from '@/data/knowledge/checklists'
import { nonConformities, revisionRequests } from '@/data/knowledge/compliance'
import { calcularConformidade, proximaVersao } from '@/utils/knowledgeCalculations'
import type {
  ChecklistAnswer,
  ChecklistExecution,
  ChecklistRunStatus,
  KnowledgeDocument,
  NonConformity,
  NonConformityCriticality,
  RevisionRequest,
  TrainingAssignment,
  TrainingProgressStatus,
} from '@/types'

interface ReadingConfirmation {
  confirmadoEm: string
  entendimento: boolean
  comentario?: string
  divergenciaPratica?: boolean
}

interface TrainingProgressState {
  modulosConcluidos: number
  status: TrainingProgressStatus
  ultimaAtividade: string
  tentativas: number
  resultado?: number
  concluidoEm?: string
}

interface DraftExecution {
  checklistId: string
  unitId: string
  respostas: ChecklistAnswer[]
  assinatura: string
  iniciadaEm: string
  status: ChecklistRunStatus
}

const now = () => new Date().toISOString()

/**
 * Camada de estado local da Biblioteca — confirmacoes de leitura, progresso de
 * treinamento, execucoes de checklist, nao conformidades e revisoes criadas.
 * Os dados-fonte em src/data nunca sao mutados: tudo aqui e sobreposicao.
 *
 * Chamar este hook UMA vez por pagina e distribuir o retorno via props — duas
 * instancias independentes lendo a mesma chave nao sincronizam entre si dentro
 * da mesma arvore montada.
 */
export function useKnowledge() {
  const [leituras, setLeituras] = useLocalStorageState<Record<string, ReadingConfirmation>>('cortex-host:knowledge-readings', {})
  const [favoritos, setFavoritos] = useLocalStorageState<string[]>('cortex-host:knowledge-favorites', [])
  const [progressos, setProgressos] = useLocalStorageState<Record<string, TrainingProgressState>>('cortex-host:knowledge-training-progress', {})
  const [rascunhos, setRascunhos] = useLocalStorageState<Record<string, DraftExecution>>('cortex-host:knowledge-checklist-drafts', {})
  const [execucoesCriadas, setExecucoesCriadas] = useLocalStorageState<ChecklistExecution[]>('cortex-host:knowledge-executions', [])
  const [ncCriadas, setNcCriadas] = useLocalStorageState<NonConformity[]>('cortex-host:knowledge-nonconformities', [])
  const [revisoesCriadas, setRevisoesCriadas] = useLocalStorageState<RevisionRequest[]>('cortex-host:knowledge-revisions', [])

  /* ---------------- Documentos ---------------- */

  const isFavorito = useCallback((documentId: string) => favoritos.includes(documentId), [favoritos])

  const toggleFavorito = useCallback(
    (documentId: string) => setFavoritos((prev) => (prev.includes(documentId) ? prev.filter((id) => id !== documentId) : [...prev, documentId])),
    [setFavoritos],
  )

  const getLeitura = useCallback((documentId: string) => leituras[documentId], [leituras])

  const confirmarLeitura = useCallback(
    (documentId: string, entendimento: boolean, comentario?: string, divergenciaPratica?: boolean) =>
      setLeituras((prev) => ({ ...prev, [documentId]: { confirmadoEm: now(), entendimento, comentario, divergenciaPratica } })),
    [setLeituras],
  )

  const allDocuments = useMemo<KnowledgeDocument[]>(
    () => knowledgeDocuments.map((d) => ({ ...d, favorito: favoritos.includes(d.id) })),
    [favoritos],
  )

  /* ---------------- Treinamentos ---------------- */

  const getProgresso = useCallback((trainingId: string) => progressos[trainingId], [progressos])

  /** Progresso efetivo: sobreposicao local sobre a atribuicao demonstrativa do usuario. */
  const getAssignmentForUser = useCallback(
    (trainingId: string, colaborador: string): TrainingAssignment | undefined => {
      const base = trainingAssignments.find((a) => a.trainingId === trainingId && a.colaborador === colaborador)
      if (!base) return undefined
      const override = progressos[trainingId]
      if (!override) return base
      const training = trainings.find((t) => t.id === trainingId)
      const total = training?.modulos.length ?? 1
      return {
        ...base,
        status: override.status,
        modulosConcluidos: override.modulosConcluidos,
        progressoPercentual: Math.round((override.modulosConcluidos / total) * 100),
        ultimaAtividade: override.ultimaAtividade,
        tentativas: override.tentativas,
        resultado: override.resultado ?? base.resultado,
      }
    },
    [progressos],
  )

  const concluirModulo = useCallback(
    (trainingId: string, numeroModulo: number) => {
      const training = trainings.find((t) => t.id === trainingId)
      const total = training?.modulos.length ?? 1
      setProgressos((prev) => {
        const atual = prev[trainingId]
        const concluidos = Math.max(atual?.modulosConcluidos ?? 0, numeroModulo)
        return {
          ...prev,
          [trainingId]: {
            modulosConcluidos: Math.min(concluidos, total),
            status: concluidos >= total ? (atual?.resultado !== undefined ? atual.status : 'em_andamento') : 'em_andamento',
            ultimaAtividade: now(),
            tentativas: atual?.tentativas ?? 0,
            resultado: atual?.resultado,
            concluidoEm: atual?.concluidoEm,
          },
        }
      })
    },
    [setProgressos],
  )

  const registrarAvaliacao = useCallback(
    (trainingId: string, aproveitamento: number, aprovado: boolean) => {
      const training = trainings.find((t) => t.id === trainingId)
      const total = training?.modulos.length ?? 1
      setProgressos((prev) => {
        const atual = prev[trainingId]
        return {
          ...prev,
          [trainingId]: {
            modulosConcluidos: aprovado ? total : (atual?.modulosConcluidos ?? 0),
            status: aprovado ? 'concluido' : 'reprovado',
            ultimaAtividade: now(),
            tentativas: (atual?.tentativas ?? 0) + 1,
            resultado: aproveitamento,
            concluidoEm: aprovado ? now() : undefined,
          },
        }
      })
    },
    [setProgressos],
  )

  /* ---------------- Checklists ---------------- */

  const getRascunho = useCallback((checklistId: string) => rascunhos[checklistId], [rascunhos])

  const salvarResposta = useCallback(
    (checklistId: string, unitId: string, resposta: ChecklistAnswer) =>
      setRascunhos((prev) => {
        const atual = prev[checklistId] ?? { checklistId, unitId, respostas: [], assinatura: '', iniciadaEm: now(), status: 'em_execucao' as ChecklistRunStatus }
        const respostas = [...atual.respostas.filter((r) => r.itemId !== resposta.itemId), resposta]
        return { ...prev, [checklistId]: { ...atual, unitId, respostas, status: 'em_execucao' } }
      }),
    [setRascunhos],
  )

  const salvarAssinatura = useCallback(
    (checklistId: string, unitId: string, assinatura: string) =>
      setRascunhos((prev) => {
        const atual = prev[checklistId] ?? { checklistId, unitId, respostas: [], assinatura: '', iniciadaEm: now(), status: 'em_execucao' as ChecklistRunStatus }
        return { ...prev, [checklistId]: { ...atual, assinatura } }
      }),
    [setRascunhos],
  )

  const pausarExecucao = useCallback(
    (checklistId: string) =>
      setRascunhos((prev) => (prev[checklistId] ? { ...prev, [checklistId]: { ...prev[checklistId], status: 'pausado' } } : prev)),
    [setRascunhos],
  )

  const descartarRascunho = useCallback(
    (checklistId: string) =>
      setRascunhos((prev) => {
        const copia = { ...prev }
        delete copia[checklistId]
        return copia
      }),
    [setRascunhos],
  )

  /** Conclui a execucao, calcula conformidade e devolve a execucao gerada. */
  const concluirExecucao = useCallback(
    (checklistId: string, unitId: string, responsavel: string, naoConformidadesIds: string[]) => {
      const rascunho = rascunhos[checklistId]
      const respostas = rascunho?.respostas ?? []
      const aplicaveis = respostas.filter((r) => r.conforme !== null)
      const conformidade = calcularConformidade(respostas)
      const execucao: ChecklistExecution = {
        id: `exe-${1000 + execucoesCriadas.length}`,
        checklistId,
        unitId,
        responsavel,
        iniciadaEm: rascunho?.iniciadaEm ?? now(),
        concluidaEm: now(),
        status: 'concluido',
        respostas,
        conformidade,
        itensConformes: aplicaveis.filter((r) => r.conforme === true).length,
        itensAplicaveis: aplicaveis.length,
        naoConformidades: naoConformidadesIds,
        assinatura: rascunho?.assinatura,
      }
      setExecucoesCriadas((prev) => [execucao, ...prev])
      descartarRascunho(checklistId)
      return execucao
    },
    [rascunhos, execucoesCriadas.length, setExecucoesCriadas, descartarRascunho],
  )

  const allExecutions = useMemo(() => [...execucoesCriadas, ...checklistExecutions], [execucoesCriadas])

  /* ---------------- Nao conformidades ---------------- */

  const criarNaoConformidade = useCallback(
    (input: {
      origem: string
      origemId?: string
      unitId: string
      area: NonConformity['area']
      descricao: string
      criticidade: NonConformityCriticality
      responsavel: string
      prazo: string
      acaoImediata: string
      checklistRelacionado?: string
      procedimentoRelacionado?: string
      evidenciaDescricao?: string
    }) => {
      const numero = `NC-${249 + ncCriadas.length}`
      const nova: NonConformity = {
        id: `nc-${249 + ncCriadas.length}`,
        numero,
        origem: input.origem,
        origemId: input.origemId,
        unitId: input.unitId,
        area: input.area,
        descricao: input.descricao,
        criticidade: input.criticidade,
        responsavel: input.responsavel,
        prazo: input.prazo,
        registradaEm: now(),
        evidencias: input.evidenciaDescricao
          ? [{ id: `ev-${Date.now()}`, tipo: 'observacao', descricao: input.evidenciaDescricao, registradoPor: input.responsavel, registradoEm: now(), origem: input.origem }]
          : [],
        acaoImediata: input.acaoImediata,
        status: 'aberta',
        recorrente: false,
        checklistRelacionado: input.checklistRelacionado,
        procedimentoRelacionado: input.procedimentoRelacionado,
      }
      setNcCriadas((prev) => [nova, ...prev])
      return nova
    },
    [ncCriadas.length, setNcCriadas],
  )

  const allNonConformities = useMemo(() => [...ncCriadas, ...nonConformities], [ncCriadas])

  /* ---------------- Revisoes ---------------- */

  const criarRevisao = useCallback(
    (documentId: string, motivo: string, solicitadaPor: string) => {
      const doc = knowledgeDocuments.find((d) => d.id === documentId)
      const nova: RevisionRequest = {
        id: `rev-${1000 + revisoesCriadas.length}`,
        documentId,
        versaoOrigem: doc?.versaoVigente ?? '1.0',
        novaVersao: proximaVersao(doc?.versaoVigente ?? '1.0'),
        motivo,
        solicitadaPor,
        solicitadaEm: now(),
        status: 'em_elaboracao',
        aprovadores: (doc?.aprovadores ?? []).map((nome) => ({ nome, papel: nome, status: 'pendente' as const })),
        alteracoes: [],
      }
      setRevisoesCriadas((prev) => [nova, ...prev])
      return nova
    },
    [revisoesCriadas.length, setRevisoesCriadas],
  )

  const atualizarRevisao = useCallback(
    (id: string, patch: Partial<RevisionRequest>) => setRevisoesCriadas((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    [setRevisoesCriadas],
  )

  const allRevisions = useMemo(() => [...revisoesCriadas, ...revisionRequests], [revisoesCriadas])

  return {
    // documentos
    allDocuments,
    isFavorito,
    toggleFavorito,
    getLeitura,
    confirmarLeitura,
    favoritos,
    // treinamentos
    getProgresso,
    getAssignmentForUser,
    concluirModulo,
    registrarAvaliacao,
    // checklists
    getRascunho,
    salvarResposta,
    salvarAssinatura,
    pausarExecucao,
    descartarRascunho,
    concluirExecucao,
    allExecutions,
    // conformidade
    allNonConformities,
    criarNaoConformidade,
    // revisoes
    allRevisions,
    criarRevisao,
    atualizarRevisao,
    // fontes estaticas reexportadas para conveniencia das paginas
    trainings,
    checklists,
  }
}
