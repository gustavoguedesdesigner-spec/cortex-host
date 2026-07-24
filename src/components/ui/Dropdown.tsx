import { useRef, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useEscapeKey } from '@/hooks/useEscapeKey'

interface DropdownProps {
  trigger: (props: { onClick: () => void; isOpen: boolean }) => ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, children, align = 'right', className }: DropdownProps) {
  const { isOpen, toggle, close } = useDisclosure(false)
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, close, isOpen)
  useEscapeKey(close, isOpen)

  return (
    <div className="relative" ref={ref}>
      {trigger({ onClick: toggle, isOpen })}
      {isOpen && (
        <div
          className={cn(
            'absolute z-40 mt-2 min-w-[14rem] rounded-md border border-border bg-surface-3 shadow-overlay animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  icon,
}: {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-body text-content-primary hover:bg-surface-4 transition-colors first:rounded-t-md last:rounded-b-md"
    >
      {icon}
      {children}
    </button>
  )
}
