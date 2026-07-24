import { useCallback } from 'react'
import type { OccurrenceStatus } from '@/types'
import { useLocalStorageState } from './useLocalStorageState'

/** Mapa id-da-ocorrencia -> status, persistido localmente. */
export function useOccurrenceStatus() {
  const [statusMap, setStatusMap] = useLocalStorageState<Record<string, OccurrenceStatus>>(
    'cortex-host:occurrence-status',
    {},
  )

  const getStatus = useCallback((id: string): OccurrenceStatus => statusMap[id] ?? 'pendente', [statusMap])

  const markAsAnalyzed = useCallback(
    (id: string) => setStatusMap((prev) => ({ ...prev, [id]: 'analisada' })),
    [setStatusMap],
  )

  const toggleStatus = useCallback(
    (id: string) =>
      setStatusMap((prev) => ({ ...prev, [id]: (prev[id] ?? 'pendente') === 'analisada' ? 'pendente' : 'analisada' })),
    [setStatusMap],
  )

  return { getStatus, markAsAnalyzed, toggleStatus }
}
