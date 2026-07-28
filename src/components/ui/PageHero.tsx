import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

/**
 * Padrão global de cabeçalho de página: breadcrumb → label contextual →
 * título grande → descrição → ações, com banner opcional à direita e
 * separação inferior clara antes do conteúdo. Peças exportadas
 * individualmente para composição em páginas com necessidades próprias.
 */

export function PageBreadcrumb({ trail, className }: { trail: { label: string; path?: string }[]; className?: string }) {
  const navigate = useNavigate()
  return (
    <nav className={cn('flex items-center gap-1.5 text-caption text-ink-tertiary', className)} aria-label="Breadcrumb">
      {trail.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden="true" />}
          {item.path ? (
            <button onClick={() => navigate(item.path!)} className="hover:text-ink-secondary">
              {item.label}
            </button>
          ) : (
            <span className="text-ink-secondary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function PageEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('text-label uppercase tracking-[0.08em] text-accent', className)}>{children}</span>
}

export function PageTitle({ children, size = 'default', className }: { children: ReactNode; size?: 'default' | 'display'; className?: string }) {
  return (
    <h1 className={cn(size === 'display' ? 'text-page-title-sm lg:text-display' : 'text-page-title-sm lg:text-page-title', className)}>
      {children}
    </h1>
  )
}

export function PageDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('max-w-2xl text-body text-ink-secondary lg:text-lead', className)}>{children}</p>
}

export function PageActions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap items-center gap-2.5 pt-1', className)}>{children}</div>
}

/**
 * Banner abstrato local — cor estrutural, formas geométricas e textura
 * discreta em SVG. Sem imagem externa, sem conteúdo funcional.
 */
export function PageBanner({ className }: { className?: string }) {
  return (
    <div className={cn('relative hidden min-h-[180px] overflow-hidden rounded-[24px] bg-navy lg:block', className)} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 240" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="hero-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" className="fill-white/[0.06]" />
          </pattern>
        </defs>
        <rect width="560" height="240" fill="url(#hero-dots)" />
        <circle cx="470" cy="130" r="150" className="fill-accent/90" />
        <circle cx="470" cy="130" r="196" className="fill-none stroke-white/10" strokeWidth="1.5" />
        <circle cx="470" cy="130" r="240" className="fill-none stroke-white/[0.06]" strokeWidth="1.5" />
        <circle cx="118" cy="196" r="46" className="fill-white/[0.05]" />
        <circle cx="92" cy="48" r="5" className="fill-accent" />
      </svg>
    </div>
  )
}

/** Organiza a linha de filtros da página com espaçamento consistente. */
export function PageFilters({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap items-center gap-2.5', className)}>{children}</div>
}

interface PageHeroProps {
  breadcrumb?: { label: string; path?: string }[]
  eyebrow?: string
  title: ReactNode
  titleSize?: 'default' | 'display'
  description?: ReactNode
  actions?: ReactNode
  meta?: ReactNode
  banner?: ReactNode
  /** Separação inferior clara antes do conteúdo (padrão: ativa). */
  divider?: boolean
  className?: string
}

export function PageHero({ breadcrumb, eyebrow, title, titleSize, description, actions, meta, banner, divider = true, className }: PageHeroProps) {
  return (
    <div className={cn('flex flex-col gap-4', divider && 'border-b border-border pb-8 lg:pb-10', className)}>
      {breadcrumb && <PageBreadcrumb trail={breadcrumb} />}
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-10">
        <div className={cn('flex flex-col gap-2.5', banner ? 'lg:col-span-7' : 'lg:col-span-12')}>
          {eyebrow && <PageEyebrow>{eyebrow}</PageEyebrow>}
          <PageTitle size={titleSize}>{title}</PageTitle>
          {description && <PageDescription>{description}</PageDescription>}
          {meta}
          {actions && <PageActions>{actions}</PageActions>}
        </div>
        {banner && <div className="lg:col-span-5">{banner}</div>}
      </div>
    </div>
  )
}
