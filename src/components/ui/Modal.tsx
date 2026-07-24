import { useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { IconButton } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
}

export function Modal({ isOpen, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useEscapeKey(onClose, isOpen)

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div
        ref={containerRef}
        className={cn(
          'relative z-10 w-full rounded-lg bg-surface-3 border border-border-strong shadow-overlay animate-fade-in',
          sizeClasses[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-border-subtle">
          <div>
            <h2 id="modal-title" className="text-card-title text-content-primary">
              {title}
            </h2>
            {description && <p className="text-support text-content-tertiary mt-1">{description}</p>}
          </div>
          <IconButton icon={<X className="h-4 w-4" />} label="Fechar" onClick={onClose} size="sm" />
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border-subtle">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
