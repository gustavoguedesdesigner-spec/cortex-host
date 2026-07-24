import { cn } from '@/utils/cn'

interface AvatarProps {
  iniciais: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-7 w-7 text-caption',
  md: 'h-9 w-9 text-support',
  lg: 'h-12 w-12 text-body',
}

export function Avatar({ iniciais, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-cortex-900 text-cortex-200 font-semibold border border-cortex-700/50 shrink-0',
        sizeClasses[size],
        className,
      )}
    >
      {iniciais}
    </div>
  )
}
