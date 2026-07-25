import { useCallback } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import type { InventoryMovement } from '@/types'

/** Movimentações registradas manualmente pelo usuário — persistidas localmente, nunca apagadas. */
export function useCreatedMovements() {
  const [movements, setMovements] = useLocalStorageState<InventoryMovement[]>('cortex-host:inventory-created-movements', [])

  const createMovement = useCallback(
    (movement: Omit<InventoryMovement, 'id'>) => {
      const newMovement: InventoryMovement = { ...movement, id: `mov-user-${Date.now()}` }
      setMovements((prev) => [newMovement, ...prev])
      return newMovement
    },
    [setMovements],
  )

  const estornarMovement = useCallback(
    (original: InventoryMovement, usuario: string, motivo: string) => {
      const reversal: InventoryMovement = {
        ...original,
        id: `mov-estorno-${Date.now()}`,
        tipo: 'estorno',
        data: new Date().toISOString(),
        usuario,
        origem: `Estorno de ${original.id}`,
        motivo,
        status: 'confirmado',
        reversaoDeId: original.id,
      }
      setMovements((prev) => [reversal, ...prev])
      return reversal
    },
    [setMovements],
  )

  return { movements, createMovement, estornarMovement }
}
