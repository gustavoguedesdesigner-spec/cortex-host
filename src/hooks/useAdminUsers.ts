import { useCallback, useMemo } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import { useAdminAuditLog } from './useAdminAuditLog'
import { users as baseUsers, getUserById as getBaseUserById } from '@/data/administration/users'
import { getRoleById } from '@/data/administration/roles'
import type { TemporaryAccess, User, UserStatus } from '@/types'

interface UserOverride {
  status?: UserStatus
  precisaRevisao?: boolean
  motivoRevisao?: string
  permissoesDiretasCount?: number
  removidoEmIso?: string
  motivoRemocao?: string
  substitutoId?: string
  acessoTemporario?: TemporaryAccess | null
}

/**
 * Camada de overrides sobre a amostra estática de usuários — persistida localmente,
 * espelhando o padrão de useRecipeApprovals: os dados-fonte em src/data nunca são
 * mutados diretamente, apenas sobrepostos.
 */
export function useAdminUsers() {
  const [overrides, setOverrides] = useLocalStorageState<Record<string, UserOverride>>('cortex-host:admin-user-overrides', {})
  const [createdUsers, setCreatedUsers] = useLocalStorageState<User[]>('cortex-host:admin-created-users', [])
  // Reaproveita a mesma instância do hook para leitura e escrita do log — duas chamadas
  // independentes de useAdminAuditLog no mesmo componente não sincronizam entre si
  // (cada uma mantém seu próprio estado React, mesmo lendo/escrevendo a mesma chave).
  const { auditLog, logEvent } = useAdminAuditLog()

  const allUsers = useMemo(() => [...createdUsers, ...baseUsers], [createdUsers])

  const getEffectiveUser = useCallback(
    (id: string): User | undefined => {
      const base = createdUsers.find((u) => u.id === id) ?? getBaseUserById(id)
      if (!base) return undefined
      const override = overrides[id]
      if (!override) return base
      return {
        ...base,
        ...override,
        acessoTemporario: override.acessoTemporario === null ? undefined : (override.acessoTemporario ?? base.acessoTemporario),
      }
    },
    [createdUsers, overrides],
  )

  const setOverride = useCallback(
    (id: string, patch: UserOverride) => setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } })),
    [setOverrides],
  )

  /** Jornada 2 — revisar acesso financeiro inadequado (Mariana Costa e casos semelhantes). */
  const reviewAccess = useCallback(
    (userId: string, justificativa: string) => {
      const user = getEffectiveUser(userId)
      if (!user) return
      setOverride(userId, { precisaRevisao: false, permissoesDiretasCount: 0 })
      logEvent({
        usuario: 'Leo',
        acao: 'Revisão de acesso',
        modulo: 'Usuários',
        recurso: `${user.nome} — exceção de permissão removida`,
        criticidade: 'alta',
        resultado: 'sucesso',
        origem: 'Aplicação web',
        antes: user.motivoRevisao ?? 'Exceção individual ativa',
        depois: 'Restrito ao escopo padrão do perfil',
        justificativa,
        descricao: `Acesso de ${user.nome} revisado e restrito ao escopo padrão do perfil ${getRoleById(user.roleId)?.nome ?? user.roleId}.`,
      })
    },
    [getEffectiveUser, setOverride, logEvent],
  )

  const setUserStatus = useCallback(
    (userId: string, status: UserStatus, motivo?: string) => {
      const user = getEffectiveUser(userId)
      if (!user) return
      const patch: UserOverride = { status }
      if (status === 'removido') {
        patch.removidoEmIso = new Date().toISOString()
        patch.motivoRemocao = motivo
      }
      setOverride(userId, patch)
      logEvent({
        usuario: 'Leo',
        acao: status === 'removido' ? 'Remoção de usuário' : status === 'suspenso' ? 'Suspensão de usuário' : 'Alteração de status de usuário',
        modulo: 'Usuários',
        recurso: user.nome,
        criticidade: status === 'removido' ? 'media' : 'baixa',
        resultado: 'sucesso',
        origem: 'Aplicação web',
        antes: user.status,
        depois: status,
        justificativa: motivo,
        descricao: `Status de ${user.nome} alterado para ${status}.${motivo ? ` Motivo: ${motivo}.` : ''}`,
      })
    },
    [getEffectiveUser, setOverride, logEvent],
  )

  const extendTemporaryAccess = useCallback(
    (userId: string, novoFimIso: string) => {
      const user = getEffectiveUser(userId)
      if (!user?.acessoTemporario) return
      setOverride(userId, { acessoTemporario: { ...user.acessoTemporario, fimIso: novoFimIso } })
      logEvent({
        usuario: 'Leo',
        acao: 'Prorrogação de acesso temporário',
        modulo: 'Usuários',
        recurso: user.nome,
        criticidade: 'media',
        resultado: 'sucesso',
        origem: 'Aplicação web',
        antes: user.acessoTemporario.fimIso,
        depois: novoFimIso,
        descricao: `Acesso temporário de ${user.nome} prorrogado.`,
      })
    },
    [getEffectiveUser, setOverride, logEvent],
  )

  const endTemporaryAccess = useCallback(
    (userId: string) => {
      const user = getEffectiveUser(userId)
      if (!user) return
      setOverride(userId, { status: 'removido', acessoTemporario: null, removidoEmIso: new Date().toISOString(), motivoRemocao: 'Acesso temporário encerrado' })
      logEvent({
        usuario: 'Leo',
        acao: 'Encerramento de acesso temporário',
        modulo: 'Usuários',
        recurso: user.nome,
        criticidade: 'media',
        resultado: 'sucesso',
        origem: 'Aplicação web',
        descricao: `Acesso temporário de ${user.nome} encerrado antes do vencimento.`,
      })
    },
    [getEffectiveUser, setOverride, logEvent],
  )

  const createUser = useCallback(
    (input: { nome: string; email: string; cargo: string; area?: string; roleId: string; unidades: string[]; autenticacaoDoisFatores: boolean; acessoTemporario?: TemporaryAccess }) => {
      const id = `usuario-${Date.now()}`
      const newUser: User = {
        id,
        nome: input.nome,
        email: input.email,
        cargo: input.cargo,
        area: input.area,
        status: input.acessoTemporario ? 'acesso_temporario' : 'convidado',
        roleId: input.roleId,
        unidades: input.unidades,
        autenticacaoDoisFatores: input.autenticacaoDoisFatores,
        acessoTemporario: input.acessoTemporario,
        responsavelId: 'leo',
        criadoEmIso: new Date().toISOString(),
        permissoesDiretasCount: 0,
        permissoesCriticasCount: 0,
        precisaRevisao: false,
      }
      setCreatedUsers((prev) => [newUser, ...prev])
      logEvent({
        usuario: 'Leo',
        acao: 'Criação de usuário',
        modulo: 'Usuários',
        recurso: newUser.nome,
        criticidade: 'media',
        resultado: 'sucesso',
        origem: 'Aplicação web',
        descricao: `Usuário ${newUser.nome} criado com perfil ${getRoleById(newUser.roleId)?.nome ?? newUser.roleId} e convite enviado.`,
      })
      return newUser
    },
    [setCreatedUsers, logEvent],
  )

  return { allUsers, getEffectiveUser, auditLog, reviewAccess, setUserStatus, extendTemporaryAccess, endTemporaryAccess, createUser }
}
