import { useCallback } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import type { InventoryTransfer, TransferStatus } from '@/types'

type TransferOverride = { status: TransferStatus; quantidadeRecebida?: number | null; observacao?: string }

/**
 * Transferências criadas pelo usuário (persistidas localmente) e
 * atualizações de status sobre as transferências demonstrativas
 * (overrides por id, mesmo padrão do checklist de fechamento de CMV).
 */
export function useCreatedTransfers() {
  const [created, setCreated] = useLocalStorageState<InventoryTransfer[]>('cortex-host:inventory-created-transfers', [])
  const [overrides, setOverrides] = useLocalStorageState<Record<string, TransferOverride>>('cortex-host:inventory-transfer-overrides', {})

  const createTransfer = useCallback(
    (transfer: Omit<InventoryTransfer, 'id' | 'criadaEm' | 'status' | 'quantidadeRecebida'>) => {
      const newTransfer: InventoryTransfer = { ...transfer, id: `TR-${Math.floor(2000 + Math.random() * 100)}`, status: 'aprovada', quantidadeRecebida: null, criadaEm: new Date().toISOString() }
      setCreated((prev) => [newTransfer, ...prev])
      return newTransfer
    },
    [setCreated],
  )

  const updateTransferStatus = useCallback(
    (id: string, status: TransferStatus, quantidadeRecebida?: number, observacao?: string) => {
      if (created.some((t) => t.id === id)) {
        setCreated((prev) => prev.map((t) => (t.id === id ? { ...t, status, quantidadeRecebida: quantidadeRecebida ?? t.quantidadeRecebida, observacao: observacao ?? t.observacao } : t)))
      } else {
        setOverrides((prev) => ({ ...prev, [id]: { status, quantidadeRecebida, observacao } }))
      }
    },
    [created, setCreated, setOverrides],
  )

  const applyOverride = useCallback((transfer: InventoryTransfer): InventoryTransfer => {
    const o = overrides[transfer.id]
    if (!o) return transfer
    return { ...transfer, status: o.status, quantidadeRecebida: o.quantidadeRecebida ?? transfer.quantidadeRecebida, observacao: o.observacao ?? transfer.observacao }
  }, [overrides])

  return { created, updateTransferStatus, createTransfer, applyOverride }
}
