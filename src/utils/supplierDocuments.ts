import type { SupplierDocument } from '@/types'

const DAY_MS = 24 * 60 * 60 * 1000

/** Data de referencia do prototipo — mesma usada no restante da aplicacao (23/07/2026). */
const REFERENCE_TODAY = new Date('2026-07-23T00:00:00-03:00')

export function diasParaVencimento(validade: string): number {
  return Math.round((new Date(validade).getTime() - REFERENCE_TODAY.getTime()) / DAY_MS)
}

export function calcularCompletudeDocumental(obrigatorios: number, validos: number): number {
  if (obrigatorios === 0) return 1
  return validos / obrigatorios
}

export function contarDocumentosPorStatus(documentos: SupplierDocument[]) {
  return documentos.reduce(
    (acc, doc) => {
      acc[doc.status] += 1
      return acc
    },
    { valido: 0, proximo_vencimento: 0, vencido: 0, pendente: 0 },
  )
}
