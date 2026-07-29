import type { Receipt, ReceiptFieldStatus, ReceiptItem } from '@/types'

/**
 * Regras de conferencia — mesmos limites do procedimento POP-REC-002:
 * temperatura padrao 0-4 C (tolerancia maxima 6 C), validade minima na
 * entrada com folga de pelo menos 3 dias antes do vencimento.
 */
export function avaliarTemperatura(temperaturaC: number | undefined): ReceiptFieldStatus {
  if (temperaturaC === undefined) return 'nao_aplicavel'
  return temperaturaC <= 6 ? 'conforme' : 'divergente'
}

export function diasParaVencimento(validade: string | undefined, referencia = '2026-07-23T00:00:00-03:00'): number | null {
  if (!validade) return null
  const DAY_MS = 24 * 60 * 60 * 1000
  return Math.round((new Date(validade).getTime() - new Date(referencia).getTime()) / DAY_MS)
}

export function calcularImpactoItem(item: ReceiptItem): number {
  const impactoQuantidade = (item.quantidadePedida - item.quantidadeFisica) * item.precoAcordado
  const impactoPreco = (item.precoDocumento - item.precoAcordado) * item.quantidadeFisica
  return Math.round((impactoQuantidade + impactoPreco) * 100) / 100
}

/** Status agregado do recebimento a partir dos itens — nunca digitado a mao. */
export function calcularStatusConferencia(itens: ReceiptItem[]): 'conforme' | 'divergente' {
  const temDivergencia = itens.some(
    (i) => i.quantidadeStatus === 'divergente' || i.precoStatus === 'divergente' || i.qualidadeStatus === 'divergente' || i.loteValidadeStatus === 'divergente',
  )
  return temDivergencia ? 'divergente' : 'conforme'
}

export function calcularTaxaConformidade(receipts: Receipt[]): number {
  const concluidos = receipts.filter((r) => r.status === 'conforme' || r.status === 'divergente' || r.status === 'concluido')
  if (concluidos.length === 0) return 0
  const conformes = concluidos.filter((r) => r.status === 'conforme' || r.status === 'concluido').length
  return conformes / concluidos.length
}

export function getReceiptsByStatus(receipts: Receipt[], status: Receipt['status']): Receipt[] {
  return receipts.filter((r) => r.status === status)
}
