import { cn } from '@/utils/cn'
import type { UserStatus } from '@/types'

const config: Record<UserStatus, { label: string; classes: string; dot: string }> = {
  ativo: { label: 'Ativo', classes: 'bg-success-soft text-success', dot: 'bg-success' },
  convidado: { label: 'Convidado', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  aguardando_ativacao: { label: 'Aguardando ativação', classes: 'bg-info-soft text-info', dot: 'bg-info' },
  acesso_temporario: { label: 'Acesso temporário', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  bloqueado: { label: 'Bloqueado', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  suspenso: { label: 'Suspenso', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  inativo: { label: 'Inativo', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
  removido: { label: 'Removido', classes: 'bg-surface-subtle text-ink-tertiary', dot: 'bg-ink-tertiary' },
}

export function AdminUserStatusBadge({ status, className }: { status: UserStatus; className?: string }) {
  const c = config[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge whitespace-nowrap', c.classes, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden="true" />
      {c.label}
    </span>
  )
}
