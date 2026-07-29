import { useRef, type ChangeEvent, type ReactNode } from 'react'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useImageSlot, type ImageSlotId } from '@/hooks/useImageSlot'
import { ACCEPTED_IMAGE_TYPES } from '@/utils/imageUpload'

/**
 * Upload de imagens de ambientacao (banners, painel do login e marca).
 *
 * O controle fica invisivel ate o cursor se aproximar ou o foco de teclado
 * entrar — a imagem e o conteudo, o controle e apenas o meio de troca-la.
 * Dois layouts: `overlay` centraliza os botoes sobre superficies grandes
 * (banners); `flutuante` abre uma barra logo abaixo do elemento, para alvos
 * pequenos como o simbolo de 32 px, onde botoes internos nao caberiam.
 */
function UploadControls({
  temImagem,
  isBusy,
  onUpload,
  onRemover,
  rotulo,
  layout,
}: {
  temImagem: boolean
  isBusy: boolean
  onUpload: (file: File) => void
  onRemover: () => void
  rotulo: string
  layout: 'overlay' | 'flutuante' | 'canto'
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    /* Zera para permitir reenviar o mesmo arquivo apos remover. */
    e.target.value = ''
  }

  const flutuante = layout === 'flutuante'

  const posicao =
    layout === 'flutuante'
      ? 'absolute left-0 top-full z-40 mt-1.5 rounded-full border border-border bg-surface-raised p-1 shadow-card'
      : layout === 'canto'
        ? 'absolute right-5 top-5 z-20'
        : cn('absolute inset-0 justify-center', temImagem && 'bg-backdrop')

  const pilula = 'inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-caption font-medium transition-colors disabled:opacity-60 h-8'
  const icone = 'inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:opacity-60'

  return (
    <div
      className={cn('flex items-center gap-1.5 transition-opacity duration-150', 'opacity-0 focus-within:opacity-100 group-hover:opacity-100', posicao)}
    >
      <input ref={inputRef} type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={handleChange} className="sr-only" aria-label={rotulo} />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isBusy}
        title={temImagem ? `Trocar — ${rotulo}` : `Enviar — ${rotulo}`}
        className={cn(flutuante ? cn(icone, 'text-ink-secondary hover:bg-surface-hover hover:text-ink-primary') : cn(pilula, 'text-ink-primary hover:bg-surface-hover'))}
      >
        {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.7} /> : <ImagePlus className="h-3.5 w-3.5" strokeWidth={1.7} />}
        {!flutuante && (temImagem ? 'Trocar' : 'Enviar imagem')}
      </button>

      {temImagem && (
        <button
          type="button"
          onClick={onRemover}
          disabled={isBusy}
          title={`Remover — ${rotulo}`}
          className={cn(
            flutuante ? cn(icone, 'text-ink-secondary hover:bg-surface-hover hover:text-danger') : cn(pilula, 'text-ink-secondary hover:bg-surface-hover hover:text-danger'),
          )}
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.7} />
          {!flutuante && 'Remover'}
        </button>
      )}
    </div>
  )
}

/**
 * Composicao abstrata usada enquanto nao ha imagem enviada — cor estrutural,
 * formas geometricas e textura discreta. Sem imagem externa, sem foto generica.
 */
export function AbstractBannerPattern({ id }: { id: string }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id={`hero-dots-${id}`} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" className="fill-white/[0.06]" />
        </pattern>
      </defs>
      <rect width="560" height="240" fill={`url(#hero-dots-${id})`} />
      <circle cx="470" cy="130" r="150" className="fill-accent/90" />
      <circle cx="470" cy="130" r="196" className="fill-none stroke-white/10" strokeWidth="1.5" />
      <circle cx="470" cy="130" r="240" className="fill-none stroke-white/[0.06]" strokeWidth="1.5" />
      <circle cx="118" cy="196" r="46" className="fill-white/[0.05]" />
      <circle cx="92" cy="48" r="5" className="fill-accent" />
    </svg>
  )
}

/** Banner de pagina com imagem enviavel; sem imagem, mantem a composicao abstrata. */
export function UploadableBanner({ slot, className, rotulo }: { slot: ImageSlotId; className?: string; rotulo: string }) {
  const { src, upload, remover, isBusy, erro } = useImageSlot(slot)

  return (
    <div className={cn('group relative hidden min-h-[180px] overflow-hidden rounded-[24px] bg-navy lg:block', className)}>
      {src ? <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <AbstractBannerPattern id={slot} />}

      <UploadControls temImagem={Boolean(src)} isBusy={isBusy} onUpload={upload} onRemover={remover} rotulo={rotulo} layout="overlay" />

      {erro && (
        <p role="alert" className="absolute inset-x-3 bottom-3 rounded-md bg-danger-soft px-2.5 py-1.5 text-caption text-danger">
          {erro}
        </p>
      )}
    </div>
  )
}

/**
 * Superficie editorial grande com texto claro por cima (painel do login).
 *
 * Quando ha imagem, aplica um veu na cor estrutural: sem ele, uma foto clara
 * — justamente as de prato e cerveja — apagaria o texto branco. O veu e
 * funcional, nao decoracao.
 */
export function UploadableEditorialPanel({
  slot,
  rotulo,
  className,
  decoracao,
  children,
}: {
  slot: ImageSlotId
  rotulo: string
  className?: string
  /** Composicao abstrata exibida enquanto nao ha imagem enviada. */
  decoracao?: ReactNode
  children: ReactNode
}) {
  const { src, upload, remover, isBusy, erro } = useImageSlot(slot)

  return (
    <div className={cn('group relative overflow-hidden bg-navy', className)}>
      {src ? (
        <>
          <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
          {/* 85% garante AA mesmo sobre uma foto branca: texto branco 10,3:1 e o secundario (white/60) 4,9:1. */}
          <div className="absolute inset-0 bg-navy/[0.85]" aria-hidden="true" />
        </>
      ) : (
        decoracao
      )}

      <UploadControls temImagem={Boolean(src)} isBusy={isBusy} onUpload={upload} onRemover={remover} rotulo={rotulo} layout="canto" />

      {erro && (
        <p role="alert" className="absolute inset-x-5 bottom-5 z-20 rounded-md bg-danger-soft px-3 py-2 text-caption text-danger">
          {erro}
        </p>
      )}

      {children}
    </div>
  )
}

/**
 * Imagem da marca do cliente. Sem imagem enviada, cai no `fallback` — a
 * assinatura tipografica padrao do produto.
 */
export function UploadableBrandImage({
  slot,
  className,
  imgClassName,
  rotulo,
  fallback,
}: {
  slot: ImageSlotId
  className?: string
  imgClassName?: string
  rotulo: string
  fallback: ReactNode
}) {
  const { src, upload, remover, isBusy, erro } = useImageSlot(slot)

  return (
    <div className={cn('group relative', className)} title={erro ?? undefined}>
      {src ? <img src={src} alt={rotulo} className={imgClassName} /> : fallback}
      <UploadControls temImagem={Boolean(src)} isBusy={isBusy} onUpload={upload} onRemover={remover} rotulo={rotulo} layout="flutuante" />
    </div>
  )
}
