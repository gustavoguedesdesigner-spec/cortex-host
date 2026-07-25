import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function RecipeBreadcrumb({ trail }: { trail: { label: string; path?: string }[] }) {
  const navigate = useNavigate()
  return (
    <nav className="flex items-center gap-1.5 text-caption text-ink-tertiary" aria-label="Breadcrumb">
      <button onClick={() => navigate('/fichas-tecnicas')} className="hover:text-ink-secondary">
        Fichas Técnicas
      </button>
      {trail.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
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
