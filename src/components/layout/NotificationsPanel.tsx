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
          <IconButton icon={<Bell className="h-[1.125rem] w-[1.125rem]" />} label="Notificações" onClick={onClick} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-status-critical ring-2 ring-surface-1" aria-hidden="true" />
          )}
        </div>
      )}
      className="w-[22rem] max-h-[26rem] overflow-y-auto"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle sticky top-0 bg-surface-3">
        <span className="text-card-title text-content-primary">Notificações</span>
        <button className="flex items-center gap-1.5 text-caption text-content-tertiary hover:text-content-primary transition-colors">
          <CheckCheck className="h-3.5 w-3.5" />
          Marcar como lidas
        </button>
      </div>
      {notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-5 w-5" />} title="Nenhuma notificação" description="Você está em dia por aqui." />
      ) : (
        <div>
          {notifications.map((n) => (
            <NotificationItem key={n.id} data={n} />
          ))}
        </div>
      )}
    </Dropdown>
  )
}
