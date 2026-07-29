import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { IconButton } from './Button'

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  side = 'right',
  widthClassName = 'w-full max-w-md',
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  side?: 'left' | 'right'
  widthClassName?: string
}) {
  useEscapeKey(onClose, isOpen)
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className="absolute inset-0 animate-fade-in bg-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          'relative z-10 flex h-full animate-slide-in-right flex-col bg-surface-raised shadow-overlay',
          widthClassName,
          side === 'right' ? 'ml-auto border-l border-border' : 'mr-auto border-r border-border',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-5">
          <div className="min-w-0">
            <h2 id="drawer-title" className="truncate text-section-title">
              {title}
            </h2>
            {subtitle && <p className="truncate text-caption text-ink-tertiary">{subtitle}</p>}
          </div>
          <IconButton icon={<X className="h-4 w-4" strokeWidth={1.7} />} label="Fechar" onClick={onClose} size="sm" />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="shrink-0 border-t border-border px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
