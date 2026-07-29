import type { QuarantineRecord } from '@/types'

/** Itens em quarentena — nunca liberados automaticamente, sempre com decisao explicita registrada. */
export const quarantineRecords: QuarantineRecord[] = [
  {
    id: 'qtn-001',
    receiptId: 'rec-9910',
    itemId: 'sp-alface-americana',
    itemNome: 'Alface americana',
    motivo: 'Temperatura de recebimento em 11°C, acima da tolerância máxima de 6°C para hortifrúti resfriado.',
    dataInicio: '2026-07-23T09:25:00-03:00',
    responsavel: 'Patricia Lins',
    status: 'em_analise',
  },
  {
    id: 'qtn-000',
    receiptId: 'rec-9914',
    itemId: 'sp-alface-americana',
    itemNome: 'Alface americana',
    motivo: 'Sinais de deterioração identificados na conferência visual de qualidade.',
    dataInicio: '2026-07-05T09:35:00-03:00',
    responsavel: 'Diego Andrade',
    status: 'descartado',
    decisaoFinal: 'Descartado — produto sem condições de consumo.',
    dataDecisao: '2026-07-05T10:30:00-03:00',
  },
]

export function getQuarantineByReceipt(receiptId: string): QuarantineRecord[] {
  return quarantineRecords.filter((q) => q.receiptId === receiptId)
}

export function getOpenQuarantine(): QuarantineRecord[] {
  return quarantineRecords.filter((q) => q.status === 'em_analise')
}
