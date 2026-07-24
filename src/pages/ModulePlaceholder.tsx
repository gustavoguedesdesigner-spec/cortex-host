import type { ReactNode } from 'react'
import { Construction } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Select } from '@/components/ui/Select'
import { SearchInput } from '@/components/ui/Input'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { periodOptions } from '@/data/periods'

interface ModulePlaceholderProps {
  eyebrow: string
  title: string
  description: string
  previewCards?: ReactNode
  extraFilters?: ReactNode
}

/**
 * Estrutura reutilizada pelas paginas de modulo que ainda serao
 * desenvolvidas em profundidade em etapas futuras. Mantem a pagina
 * com aparencia de sistema real (filtros, skeleton, cards demonstrativos)
 * em vez de uma tela vazia.
 */
export function ModulePlaceholder({ eyebrow, title, description, previewCards, extraFilters }: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <FilterBar>
        <Select
          aria-label="Período"
          options={periodOptions.map((p) => ({ value: p.id, label: p.label }))}
          defaultValue="ultimos_7_dias"
          className="w-40"
        />
        {extraFilters}
        <SearchInput wrapperClassName="max-w-xs ml-auto" placeholder="Buscar..." />
      </FilterBar>

      {previewCards}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-surface-2/60 px-4 py-3.5 text-support text-content-tertiary">
        <Construction className="h-4 w-4 shrink-0 text-cortex-500" />
        Este módulo está em construção. A lógica completa será desenvolvida em uma etapa futura do protótipo.
      </div>
    </div>
  )
}
