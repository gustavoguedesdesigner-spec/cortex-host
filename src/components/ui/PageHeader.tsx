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
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex max-w-2xl flex-col gap-1.5">
        {eyebrow && <span className="text-label uppercase tracking-wide text-accent">{eyebrow}</span>}
        <h1 className="text-page-title">{title}</h1>
        {description && <p className="text-body text-ink-secondary">{description}</p>}
        {meta}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
