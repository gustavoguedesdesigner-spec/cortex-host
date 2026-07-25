import type { GovernancePolicy } from '@/types'

export const governancePolicyStatusLabel: Record<GovernancePolicy['status'], string> = {
  vigente: 'Vigente',
  em_revisao: 'Em revisão',
  vencida: 'Vencida',
}

export function isPolicyOverdue(policy: GovernancePolicy, referenceIso: string): boolean {
  return new Date(policy.revisaoIso).getTime() < new Date(referenceIso).getTime()
}

export function readConfirmationRate(policy: GovernancePolicy): number {
  return policy.pessoasImpactadas === 0 ? 0 : policy.confirmacoesLeitura / policy.pessoasImpactadas
}
