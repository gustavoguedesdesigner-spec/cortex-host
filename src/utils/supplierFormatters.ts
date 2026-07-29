import type { SupplierOperationalStatus, SupplierRegistrationStatus } from '@/types'

export const supplierStatusLabels: Record<SupplierRegistrationStatus, string> = {
  ativo: 'Ativo',
  em_homologacao: 'Em homologação',
  restrito: 'Restrito',
  bloqueado: 'Bloqueado',
  inativo: 'Inativo',
  arquivado: 'Arquivado',
}

export const supplierOperationalStatusLabels: Record<SupplierOperationalStatus, string> = {
  estrategico: 'Estratégico',
  ativo: 'Ativo',
  em_atencao: 'Em atenção',
}

export function formatInitials(nome: string): string {
  const words = nome.split(' ').filter((w) => w.length > 2 || w === w.toUpperCase())
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
