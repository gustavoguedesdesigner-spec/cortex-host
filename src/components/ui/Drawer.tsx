import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { IconButton } from './Button'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  side?: 'left' | 'right'
  widthClassName?: string
}

export function Drawer({ isOpen, onClose, title, children, footer, side = 'right', widthClassName = 'w-full max-w-md' }: DrawerProps) {
  useEscapeKey(onClose, isOpen)

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className="absolute inset-0 bg-black/55 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          'relative z-10 h-full bg-surface-2 border-border-strong shadow-overlay flex flex-col animate-slide-in-right',
          widthClassName,
          side === 'right' ? 'ml-auto border-l' : 'mr-auto border-r',
        )}
      >
        <div className="flex items-center justify-between gap-4 px-5 h-14 border-b border-border-subtle shrink-0">
          <h2 id="drawer-title" className="text-card-title text-content-primary truncate">
            {title}
          </h2>
          <IconButton icon={<X className="h-4 w-4" />} label="Fechar" onClick={onClose} size="sm" />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-border-subtle px-5 py-4 shrink-0">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
