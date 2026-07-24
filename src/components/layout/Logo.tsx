import { cn } from '@/utils/cn'

/**
 * Assinatura tipográfica do CORTEX HOST. "HOST" recebe o acento laranja.
 * Marca provisória — pode ser substituída após validação de identidade.
 */
export function Logo({ collapsed, className, showSignature }: { collapsed?: boolean; className?: string; showSignature?: boolean }) {
  if (collapsed) {
    return (
      <div className={cn('flex h-8 w-8 items-center justify-center rounded-md bg-navy', className)}>
        <span className="text-[13px] font-semibold leading-none text-white">
          C<span className="text-accent">H</span>
        </span>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-[15px] font-semibold tracking-tight text-ink-primary">
        CORTEX <span className="text-accent">HOST</span>
      </span>
      {showSignature && <span className="text-[11px] text-ink-tertiary">by ZAKA</span>}
    </div>
  )
}
