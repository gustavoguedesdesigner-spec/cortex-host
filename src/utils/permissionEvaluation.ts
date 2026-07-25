import { permissionRows, type PermissionCell } from '@/data/administration/permissions'
import type { Role } from '@/types'

/** Retorna o estado de uma permissão para um perfil — nunca calculado dentro de componentes. */
export function evaluateRolePermission(roleId: string, permissionId: string): PermissionCell | null {
  const row = permissionRows.find((r) => r.permission.id === permissionId)
  return row?.allowed.find((a) => a.roleId === roleId) ?? null
}

export function countCriticalPermissionsForRole(roleId: string): number {
  return permissionRows.filter((r) => r.permission.critica && r.allowed.some((a) => a.roleId === roleId)).length
}

export function countPermissionsForRole(roleId: string): number {
  return permissionRows.filter((r) => r.allowed.some((a) => a.roleId === roleId)).length
}

/** Escopo mais amplo concedido a um perfil, usado para simulação e para destacar exceções. */
const scopeRank: Record<string, number> = {
  organizacao: 6,
  marca: 5,
  regiao: 4,
  unidades_selecionadas: 3,
  propria_unidade: 2,
  propria_area: 1,
  proprios_registros: 0,
  somente_leitura: 0,
  temporario: 0,
}

export function isScopeBroaderThanRole(role: Role, escopo: string): boolean {
  return (scopeRank[escopo] ?? 0) > (scopeRank[role.escopoPadrao] ?? 0)
}
