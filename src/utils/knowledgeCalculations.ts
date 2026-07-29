/**
 * Formulas do modulo de Biblioteca Operacional. Nenhum componente visual deve
 * calcular conformidade, progresso de treinamento ou impacto de revisao
 * diretamente — sempre via estas funcoes.
 */
import type {
  Checklist,
  ChecklistAnswer,
  ChecklistItem,
  KnowledgeDocument,
  RevisionImpact,
  Training,
  TrainingQuestion,
} from '@/types'

/**
 * Conformidade = itens conformes ÷ itens aplicaveis × 100.
 * Itens "nao se aplica" (conforme === null) ficam fora do denominador.
 * Retorna null quando nao ha item aplicavel — evita divisao por zero.
 */
export function calcularConformidade(respostas: ChecklistAnswer[]): number | null {
  const aplicaveis = respostas.filter((r) => r.conforme !== null)
  if (aplicaveis.length === 0) return null
  const conformes = aplicaveis.filter((r) => r.conforme === true).length
  return conformes / aplicaveis.length
}

/** Conformidade considerando apenas itens marcados como criticos. */
export function calcularConformidadeCritica(respostas: ChecklistAnswer[], itens: ChecklistItem[]): number | null {
  const criticos = new Set(itens.filter((i) => i.critico).map((i) => i.id))
  return calcularConformidade(respostas.filter((r) => criticos.has(r.itemId)))
}

/**
 * Avalia se uma resposta numerica esta dentro da faixa esperada do item.
 * Retorna null quando o item nao define faixa (nao ha julgamento automatico).
 */
export function avaliarFaixa(item: ChecklistItem, valor: number): boolean | null {
  if (item.faixaMin === undefined && item.faixaMax === undefined) return null
  if (item.faixaMin !== undefined && valor < item.faixaMin) return false
  if (item.faixaMax !== undefined && valor > item.faixaMax) return false
  return true
}

/** Itens obrigatorios ainda sem resposta — bloqueiam a conclusao do checklist. */
export function itensObrigatoriosPendentes(checklist: Checklist, respostas: ChecklistAnswer[]): ChecklistItem[] {
  const respondidos = new Set(respostas.filter((r) => r.valor !== null && r.valor !== '').map((r) => r.itemId))
  return checklist.itens.filter((i) => i.obrigatorio && !respondidos.has(i.id))
}

/** Itens que exigem evidencia e ainda nao a possuem. */
export function itensSemEvidencia(checklist: Checklist, respostas: ChecklistAnswer[]): ChecklistItem[] {
  return checklist.itens.filter((item) => {
    if (!item.exigeEvidencia) return false
    const resposta = respostas.find((r) => r.itemId === item.id)
    return !resposta?.evidencia
  })
}

export interface ChecklistBlockers {
  obrigatoriosPendentes: ChecklistItem[]
  semEvidencia: ChecklistItem[]
  podeConcluir: boolean
}

/** Regras de bloqueio da conclusao (secao 45). */
export function avaliarBloqueios(checklist: Checklist, respostas: ChecklistAnswer[], assinatura: string): ChecklistBlockers {
  const obrigatoriosPendentes = itensObrigatoriosPendentes(checklist, respostas)
  const semEvidencia = itensSemEvidencia(checklist, respostas)
  return {
    obrigatoriosPendentes,
    semEvidencia,
    podeConcluir: obrigatoriosPendentes.length === 0 && semEvidencia.length === 0 && assinatura.trim().length > 0,
  }
}

/** Progresso do treinamento em percentual de modulos concluidos. */
export function calcularProgressoTreinamento(modulosConcluidos: number, totalModulos: number): number {
  if (totalModulos <= 0) return 0
  return Math.min(1, modulosConcluidos / totalModulos)
}

/** Aproveitamento da avaliacao e resultado de aprovacao. */
export function avaliarProva(
  questoes: TrainingQuestion[],
  respostas: Record<string, number>,
  aproveitamentoMinimo: number,
): { acertos: number; total: number; aproveitamento: number; aprovado: boolean } {
  const total = questoes.length
  if (total === 0) return { acertos: 0, total: 0, aproveitamento: 0, aprovado: false }
  const acertos = questoes.filter((q) => respostas[q.id] === q.indiceCorreto).length
  const aproveitamento = acertos / total
  return { acertos, total, aproveitamento, aprovado: aproveitamento >= aproveitamentoMinimo }
}

/** Taxa de conclusao de um treinamento a partir dos totais atribuidos. */
export function calcularTaxaConclusao(concluidos: number, atribuidos: number): number | null {
  if (atribuidos <= 0) return null
  return concluidos / atribuidos
}

/**
 * Escopo impactado por uma revisao (secao 28) — derivado do documento de
 * origem, nunca digitado a mao, para nao divergir do conteudo.
 */
export function calcularImpactoRevisao(doc: KnowledgeDocument): RevisionImpact {
  return {
    unidadesAfetadas: doc.unidadesAplicaveis,
    funcoesAfetadas: doc.funcoesAplicaveis,
    treinamentosAfetados: doc.treinamentosRelacionados,
    checklistsAfetados: doc.checklistsRelacionados,
    fichasAfetadas: doc.fichasRelacionadas ?? [],
    ocorrenciasRelacionadas: doc.ocorrenciasRelacionadas,
    pessoasParaConfirmar: doc.confirmacoesEsperadas,
  }
}

/** Percentual de confirmacao de leitura; null quando o conteudo nao exige confirmacao. */
export function calcularConfirmacaoLeitura(doc: KnowledgeDocument): number | null {
  if (doc.confirmacoesEsperadas <= 0) return null
  return doc.confirmacoesLeitura / doc.confirmacoesEsperadas
}

/** Proxima versao sugerida (incremento menor) a partir da vigente. */
export function proximaVersao(versaoAtual: string): string {
  const partes = versaoAtual.split('.')
  const maior = Number(partes[0] ?? 1)
  const menor = Number(partes[1] ?? 0)
  if (Number.isNaN(maior) || Number.isNaN(menor)) return `${versaoAtual}.1`
  return `${maior}.${menor + 1}`
}

/** Dias entre a data de referencia e a proxima revisao (negativo = vencida). */
export function diasParaRevisao(proximaRevisaoIso: string, referenciaIso: string): number {
  const diff = new Date(proximaRevisaoIso).getTime() - new Date(referenciaIso).getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

/** Treinamentos de um documento que precisam ser atualizados apos nova versao. */
export function treinamentosParaAtualizar(doc: KnowledgeDocument, trainings: Training[]): Training[] {
  return trainings.filter((t) => doc.treinamentosRelacionados.includes(t.id) || t.documentoRelacionado === doc.id)
}
