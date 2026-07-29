import { useMemo } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import { receipts as staticReceipts } from '@/data/receiving/receipts'
import { quarantineRecords as staticQuarantine } from '@/data/receiving/quarantine'
import type { QuarantineStatus, Receipt, ReceiptStatus } from '@/types'

export interface NovoRecebimentoInput {
  supplierId: string
  unitId: string
  nfNumero: string
  responsavel: string
}

/**
 * Combina a base estatica de recebimentos com recebimentos criados pelo
 * fluxo guiado e com alteracoes de status/quarentena — mesmo padrao de
 * useSuppliers/useKnowledge (uma unica instancia por pagina, tudo via
 * useLocalStorageState).
 */
export function useReceiving() {
  const [createdReceipts, setCreatedReceipts] = useLocalStorageState<Receipt[]>('cortex-host:receipts-created', [])
  const [statusOverrides, setStatusOverrides] = useLocalStorageState<Record<string, ReceiptStatus>>('cortex-host:receipt-status', {})
  const [quarantineOverrides, setQuarantineOverrides] = useLocalStorageState<Record<string, QuarantineStatus>>('cortex-host:quarantine-status', {})

  const allReceipts = useMemo<Receipt[]>(() => {
    const combined = [...staticReceipts, ...createdReceipts]
    return combined.map((r) => (statusOverrides[r.id] ? { ...r, status: statusOverrides[r.id] } : r))
  }, [createdReceipts, statusOverrides])

  const allQuarantine = useMemo(
    () => staticQuarantine.map((q) => (quarantineOverrides[q.id] ? { ...q, status: quarantineOverrides[q.id] } : q)),
    [quarantineOverrides],
  )

  function updateReceiptStatus(id: string, status: ReceiptStatus) {
    setStatusOverrides((prev) => ({ ...prev, [id]: status }))
  }

  function updateQuarantineStatus(id: string, status: QuarantineStatus) {
    setQuarantineOverrides((prev) => ({ ...prev, [id]: status }))
  }

  function createReceipt(input: NovoRecebimentoInput) {
    const novo: Receipt = {
      id: `rec-created-${Date.now()}`,
      nfNumero: input.nfNumero,
      supplierId: input.supplierId,
      unitId: input.unitId,
      dataAgendada: new Date().toISOString(),
      dataChegada: new Date().toISOString(),
      responsavel: input.responsavel,
      status: 'em_conferencia',
      leituraDocumento: {
        confianca: 'media',
        camposLidos: ['Fornecedor', 'Número da NF', 'Itens e quantidades', 'Valor total'],
        camposDivergentes: [],
        observacao: 'Leitura simulada — confirme os campos antes de concluir a conferência.',
      },
      itens: [],
      valorPedido: 0,
      valorDocumento: 0,
      valorFisico: 0,
      impactoFinanceiro: 0,
      decisao: 'pendente',
      timeline: [
        { tipo: 'agendado', data: new Date().toISOString(), responsavel: input.responsavel, descricao: 'Recebimento registrado manualmente.' },
        { tipo: 'chegada_registrada', data: new Date().toISOString(), responsavel: input.responsavel, descricao: 'Chegada registrada — conferência iniciada.' },
      ],
    }
    setCreatedReceipts((prev) => [...prev, novo])
    return novo
  }

  return { allReceipts, allQuarantine, updateReceiptStatus, updateQuarantineStatus, createReceipt }
}
