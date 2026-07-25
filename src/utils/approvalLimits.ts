import { approvalLimitRules } from '@/data/administration/approvalLimits'
import type { ApprovalLimitRule } from '@/types'

/** Resolve a regra de alçada aplicável a um valor dentro de um módulo — nunca calculado inline em componentes. */
export function resolveApprovalLimit(modulo: string, evento: string, valor: number): ApprovalLimitRule | undefined {
  return approvalLimitRules.find((r) => {
    if (r.modulo !== modulo || r.evento !== evento) return false
    if (r.valorMin !== undefined && valor < r.valorMin) return false
    if (r.valorMax !== undefined && valor > r.valorMax) return false
    return true
  })
}

export const approvalChainLabel: Record<ApprovalLimitRule['cadeia'], string> = {
  sequencial: 'Sequencial',
  paralela: 'Paralela',
  qualquer_um: 'Qualquer um aprova',
  todos: 'Todos aprovam',
}
