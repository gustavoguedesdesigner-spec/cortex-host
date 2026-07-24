import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function SectionHeader({ title, description, actions }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2.5 mb-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-card-title text-content-primary">{title}</h2>
        {description && <p className="text-support text-content-tertiary mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
