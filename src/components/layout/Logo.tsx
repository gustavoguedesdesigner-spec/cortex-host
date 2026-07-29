import { cn } from '@/utils/cn'
import { UploadableBrandImage } from '@/components/ui/ImageUpload'

/**
 * Marca exibida no trilho lateral, no topo mobile e no login.
 *
 * Por padrao usa a assinatura tipografica do CORTEX HOST, mas o cliente pode
 * enviar a propria marca — simbolo (quadrado) e assinatura (horizontal) sao
 * slots independentes, porque aparecem em contextos de tamanho bem diferente.
 */
export function Logo({ collapsed, className, showSignature }: { collapsed?: boolean; className?: string; showSignature?: boolean }) {
  if (collapsed) {
    return (
      <UploadableBrandImage
        slot="marca-simbolo"
        rotulo="Símbolo da marca"
        className={cn('h-8 w-8 shrink-0', className)}
        imgClassName="h-8 w-8 rounded-md object-contain"
        fallback={
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-navy">
            <span className="text-[13px] font-semibold leading-none text-white">
              C<span className="text-accent">H</span>
            </span>
          </div>
        }
      />
    )
  }

  return (
    <UploadableBrandImage
      slot="marca-assinatura"
      rotulo="Assinatura da marca"
      className={cn('min-w-0', className)}
      imgClassName="h-8 max-w-[168px] object-contain object-left"
      fallback={
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold tracking-tight text-ink-primary">
            CORTEX <span className="text-accent">HOST</span>
          </span>
          {showSignature && <span className="text-[11px] text-ink-tertiary">by ZAKA</span>}
        </div>
      }
    />
  )
}
