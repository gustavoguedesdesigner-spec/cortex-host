import { cn } from '@/utils/cn'

export function AlertBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null
  return (
    <span
      className={cn(
        'inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-danger-soft px-1.5 text-caption font-medium text-danger tabular',
        className,
      )}
    >
      {count}
    </span>
  )
}
