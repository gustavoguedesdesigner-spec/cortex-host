import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
  interactive?: boolean
}

export function Card({ children, padded = true, interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-surface-2 border border-border-subtle shadow-card',
        padded && 'p-5',
        interactive && 'transition-colors duration-150 hover:border-border-strong hover:bg-surface-3 cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
