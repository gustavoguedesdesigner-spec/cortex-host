import { useCallback } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import type { InventoryLoss } from '@/types'

export function useCreatedLosses() {
  const [losses, setLosses] = useLocalStorageState<InventoryLoss[]>('cortex-host:inventory-created-losses', [])

  const createLoss = useCallback(
    (loss: Omit<InventoryLoss, 'id' | 'status'>) => {
      const newLoss: InventoryLoss = { ...loss, id: `loss-user-${Date.now()}`, status: 'aguardando_validacao' }
      setLosses((prev) => [newLoss, ...prev])
      return newLoss
    },
    [setLosses],
  )

  return { losses, createLoss }
}
