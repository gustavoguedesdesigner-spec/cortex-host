import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  eyebrow?: string
  meta?: ReactNode
}

export function PageHeader({ title, description, actions, eyebrow, meta }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex max-w-3xl flex-col gap-2">
        {eyebrow && <span className="text-label uppercase tracking-[0.08em] text-accent">{eyebrow}</span>}
        <h1 className="text-page-title-sm lg:text-page-title">{title}</h1>
        {description && <p className="text-body text-ink-secondary lg:text-lead">{description}</p>}
        {meta}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  )
}
