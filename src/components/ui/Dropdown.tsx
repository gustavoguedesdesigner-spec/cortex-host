import { useRef, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useEscapeKey } from '@/hooks/useEscapeKey'

export function Dropdown({
  trigger,
  children,
  align = 'right',
  className,
}: {
  trigger: (props: { onClick: () => void; isOpen: boolean }) => ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}) {
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
            'absolute z-40 mt-2 min-w-[14rem] animate-fade-in overflow-hidden rounded-lg border border-border bg-surface shadow-overlay',
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

export function DropdownItem({ children, onClick, icon }: { children: ReactNode; onClick?: () => void; icon?: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-support text-ink-primary transition-colors hover:bg-surface-hover"
    >
      {icon}
      {children}
    </button>
  )
}
