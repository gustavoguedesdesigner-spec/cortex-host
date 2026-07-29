import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { IconButton } from './Button'

const sizeClasses = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-3xl' }

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  useEscapeKey(onClose, isOpen)
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 animate-fade-in bg-backdrop" onClick={onClose} aria-hidden="true" />
      <div className={cn('relative z-10 w-full animate-fade-in rounded-xl border border-border bg-surface-raised shadow-overlay', sizeClasses[size])}>
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 pb-4 pt-5">
          <div>
            <h2 id="modal-title" className="text-section-title">
              {title}
            </h2>
            {description && <p className="mt-1 text-support text-ink-tertiary">{description}</p>}
          </div>
          <IconButton icon={<X className="h-4 w-4" strokeWidth={1.7} />} label="Fechar" onClick={onClose} size="sm" />
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
