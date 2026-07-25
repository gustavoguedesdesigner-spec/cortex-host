import { useCallback } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import type { AuditEvent } from '@/types'

/** Eventos de auditoria gerados por ações do usuário no protótipo (ex.: revisão de acesso, criação de usuário). */
export function useAdminAuditLog() {
  const [auditLog, setAuditLog] = useLocalStorageState<AuditEvent[]>('cortex-host:admin-audit-log', [])

  const logEvent = useCallback(
    (entry: Omit<AuditEvent, 'id' | 'dataIso'>) => {
      const event: AuditEvent = { ...entry, id: `audit-local-${Date.now()}`, dataIso: new Date().toISOString() }
      setAuditLog((prev) => [event, ...prev])
      return event
    },
    [setAuditLog],
  )

  return { auditLog, logEvent }
}
