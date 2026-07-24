import { cn } from '@/utils/cn'

/** Contador compacto de alertas — usado em cards de unidade e navegacao. */
export function AlertBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full',
        'bg-status-criticalBg text-status-critical border border-status-critical/30 text-caption font-semibold',
        className,
      )}
    >
      {count}
    </span>
  )
}
