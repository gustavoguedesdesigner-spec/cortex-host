import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padded?: boolean
  interactive?: boolean
  /** 'flat' usa apenas borda; 'raised' adiciona sombra sutil para blocos principais */
  elevation?: 'flat' | 'raised'
}

export function Card({ children, padded = true, interactive, elevation = 'flat', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface',
        elevation === 'raised' && 'shadow-card',
        padded && 'p-6',
        interactive && 'cursor-pointer transition-all hover:border-border-strong hover:shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/** Seção sem superfície própria — usada quando o conteúdo não precisa de card. */
export function DataPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-col', className)}>{children}</div>
}
