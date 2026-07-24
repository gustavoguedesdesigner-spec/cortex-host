import { cn } from '@/utils/cn'

const sizeClasses = { sm: 'h-7 w-7 text-[11px]', md: 'h-8 w-8 text-caption', lg: 'h-11 w-11 text-support' }

export function Avatar({ iniciais, size = 'md', className }: { iniciais: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-navy font-medium text-white',
        sizeClasses[size],
        className,
      )}
    >
      {iniciais}
    </div>
  )
}
