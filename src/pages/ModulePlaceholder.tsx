import type { ReactNode } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { FilterBar } from '@/components/ui/FilterBar'
import { Select } from '@/components/ui/Select'
import { SearchInput } from '@/components/ui/Input'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { periodOptions } from '@/data/periods'

/**
 * Estrutura das páginas de módulo ainda não aprofundadas. Mantém o
 * enquadramento do produto (contexto, filtros, aviso) sem simular dados
 * que ainda não existem.
 */
export function ModulePlaceholder({
  eyebrow,
  title,
  description,
  previewCards,
  extraFilters,
}: {
  eyebrow: string
  title: string
  description: string
  previewCards?: ReactNode
  extraFilters?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <FilterBar>
        <Select
          aria-label="Período"
          options={periodOptions.map((p) => ({ value: p.id, label: p.label }))}
          defaultValue="ultimos_7_dias"
          className="w-40"
        />
        {extraFilters}
        <SearchInput wrapperClassName="ml-auto w-56" placeholder="Buscar..." />
      </FilterBar>

      {previewCards}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      <p className="border-t border-border pt-4 text-support text-ink-tertiary">
        Módulo em construção. A lógica completa será desenvolvida em uma etapa dedicada do protótipo.
      </p>
    </div>
  )
}
