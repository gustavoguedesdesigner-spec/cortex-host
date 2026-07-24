import { cn } from '@/utils/cn'
import { CortexMark } from '@/components/cortex/CortexMark'

/**
 * Assinatura tipografica provisoria do CORTEX HOST.
 * "HOST" recebe destaque visual (peso e cor). Inclui, discretamente,
 * "Powered by ZAKA AI". Marca temporaria — podera ser substituida
 * por identidade visual definitiva apos validacao de marca.
 */
export function Logo({ collapsed, className }: { collapsed?: boolean; className?: string }) {
  if (collapsed) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <CortexMark className="h-6 w-6 text-cortex-500" />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        <CortexMark className="h-6 w-6 text-cortex-500" />
        <span className="font-display text-[1.05rem] font-semibold tracking-tight text-content-primary">
          CORTEX <span className="text-cortex-500 font-extrabold">HOST</span>
        </span>
      </div>
      <span className="text-caption text-content-tertiary pl-8">Powered by ZAKA AI</span>
    </div>
  )
}
