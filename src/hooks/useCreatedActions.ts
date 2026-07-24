import { useCallback } from 'react'
import type { CreatedAction } from '@/types'
import { useLocalStorageState } from './useLocalStorageState'

/** Lista de acoes criadas a partir de ocorrencias, persistida localmente. */
export function useCreatedActions() {
  const [actions, setActions] = useLocalStorageState<CreatedAction[]>('cortex-host:created-actions', [])

  const createAction = useCallback(
    (action: Omit<CreatedAction, 'id' | 'criadoEm'>) => {
      const newAction: CreatedAction = {
        ...action,
        id: `acao-${Date.now()}`,
        criadoEm: new Date().toISOString(),
      }
      setActions((prev) => [newAction, ...prev])
      return newAction
    },
    [setActions],
  )

  return { actions, createAction }
}
