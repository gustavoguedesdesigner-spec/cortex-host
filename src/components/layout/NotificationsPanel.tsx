import { Bell, CheckCheck } from 'lucide-react'
import { Dropdown } from '@/components/ui/Dropdown'
import { IconButton } from '@/components/ui/Button'
import { NotificationItem } from '@/components/ui/NotificationItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { notifications } from '@/data/notifications'

export function NotificationsPanel() {
  const unread = notifications.filter((n) => !n.lida).length

  return (
    <Dropdown
      align="right"
      trigger={({ onClick }) => (
        <div className="relative">
          <IconButton icon={<Bell className="h-[18px] w-[18px]" strokeWidth={1.7} />} label="Notificações" onClick={onClick} />
          {unread > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
        </div>
      )}
      className="max-h-[26rem] w-[22rem] overflow-y-auto"
    >
      <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <span className="text-card-title">Notificações</span>
        <button className="flex items-center gap-1.5 text-caption text-ink-tertiary transition-colors hover:text-ink-primary">
          <CheckCheck className="h-3.5 w-3.5" strokeWidth={1.7} />
          Marcar como lidas
        </button>
      </div>
      {notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-5 w-5" />} title="Nenhuma notificação" description="Você está em dia por aqui." />
      ) : (
        notifications.map((n) => <NotificationItem key={n.id} data={n} />)
      )}
    </Dropdown>
  )
}
