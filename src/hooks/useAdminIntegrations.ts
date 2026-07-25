import { useCallback } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import { useAdminAuditLog } from './useAdminAuditLog'
import { integrations as baseIntegrations, getIntegrationById as getBaseIntegrationById } from '@/data/administration/integrations'
import type { Integration, IntegrationStatus } from '@/types'

interface IntegrationOverride {
  status?: IntegrationStatus
  ultimaSincronizacaoIso?: string
  errosCount?: number
}

/** Overrides de integração persistidos localmente — ações simuladas (testar, sincronizar, pausar, reconectar). */
export function useAdminIntegrations() {
  const [overrides, setOverrides] = useLocalStorageState<Record<string, IntegrationOverride>>('cortex-host:admin-integration-overrides', {})
  const { auditLog, logEvent } = useAdminAuditLog()

  const getEffectiveIntegration = useCallback(
    (id: string): Integration | undefined => {
      const base = getBaseIntegrationById(id)
      if (!base) return undefined
      return { ...base, ...overrides[id] }
    },
    [overrides],
  )

  const setOverride = useCallback((id: string, patch: IntegrationOverride) => setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } })), [setOverrides])

  const testConnection = useCallback(
    (id: string) => {
      const integration = getEffectiveIntegration(id)
      if (!integration) return { success: false }
      const success = integration.status !== 'erro' && integration.status !== 'desconectada' && integration.status !== 'expirada'
      logEvent({
        usuario: 'Leo',
        acao: 'Teste de conexão',
        modulo: 'Integrações',
        recurso: integration.nome,
        criticidade: 'baixa',
        resultado: success ? 'sucesso' : 'falha',
        origem: 'Aplicação web',
        descricao: `Teste de conexão da integração ${integration.nome} — ${success ? 'conexão estabelecida com sucesso.' : 'falha ao conectar.'}`,
      })
      return { success }
    },
    [getEffectiveIntegration, logEvent],
  )

  const sync = useCallback(
    (id: string) => {
      const integration = getEffectiveIntegration(id)
      if (!integration) return
      setOverride(id, { status: 'ativa', ultimaSincronizacaoIso: new Date().toISOString(), errosCount: 0 })
      logEvent({
        usuario: 'Leo',
        acao: 'Sincronização manual',
        modulo: 'Integrações',
        recurso: integration.nome,
        criticidade: 'media',
        resultado: 'sucesso',
        origem: 'Aplicação web',
        antes: integration.status,
        depois: 'ativa',
        descricao: `Sincronização manual da integração ${integration.nome} concluída com sucesso.`,
      })
    },
    [getEffectiveIntegration, setOverride, logEvent],
  )

  const pause = useCallback(
    (id: string) => {
      const integration = getEffectiveIntegration(id)
      if (!integration) return
      setOverride(id, { status: 'pausada' })
      logEvent({
        usuario: 'Leo',
        acao: 'Pausa de integração',
        modulo: 'Integrações',
        recurso: integration.nome,
        criticidade: 'media',
        resultado: 'sucesso',
        origem: 'Aplicação web',
        descricao: `Integração ${integration.nome} pausada manualmente.`,
      })
    },
    [getEffectiveIntegration, setOverride, logEvent],
  )

  const reconnect = useCallback(
    (id: string) => {
      const integration = getEffectiveIntegration(id)
      if (!integration) return
      setOverride(id, { status: 'ativa', ultimaSincronizacaoIso: new Date().toISOString(), errosCount: 0 })
      logEvent({
        usuario: 'Leo',
        acao: 'Reconexão de integração',
        modulo: 'Integrações',
        recurso: integration.nome,
        criticidade: 'media',
        resultado: 'sucesso',
        origem: 'Aplicação web',
        descricao: `Integração ${integration.nome} reconectada manualmente.`,
      })
    },
    [getEffectiveIntegration, setOverride, logEvent],
  )

  const allIntegrations = baseIntegrations.map((i) => getEffectiveIntegration(i.id)).filter((i): i is Integration => Boolean(i))

  return { allIntegrations, auditLog, getEffectiveIntegration, testConnection, sync, pause, reconnect }
}
