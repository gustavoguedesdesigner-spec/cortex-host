import { Plus, Scale } from 'lucide-react'
import { PageHero, PageBanner, PageFilters } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { supplierSummary, categoryLabels } from '@/data/suppliers/supplierSummary'
import { dependencyRisks } from '@/data/suppliers/supplierSummary'
import { cn } from '@/utils/cn'
import type { SupplierCategoryId } from '@/types'

export interface SuppliersFilters {
  busca: string
  categoria: SupplierCategoryId | 'todas'
  status: string
  unidade: string
  rapido: SuppliersQuickFilter
}

export type SuppliersQuickFilter = 'todos' | 'estrategicos' | 'em_atencao' | 'com_divergencias' | 'documentos_vencendo' | 'bloqueados' | 'em_homologacao' | 'sem_compra_recente'

const quickFilters: { value: SuppliersQuickFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'estrategicos', label: 'Estratégicos' },
  { value: 'em_atencao', label: 'Em atenção' },
  { value: 'com_divergencias', label: 'Com divergências' },
  { value: 'documentos_vencendo', label: 'Documentos vencendo' },
  { value: 'bloqueados', label: 'Bloqueados' },
  { value: 'em_homologacao', label: 'Em homologação' },
  { value: 'sem_compra_recente', label: 'Sem compra recente' },
]

export function SuppliersHero({ onNovoFornecedor, onComparar }: { onNovoFornecedor: () => void; onComparar: () => void }) {
  return (
    <PageHero
      breadcrumb={[{ label: 'Início', path: '/' }, { label: 'Fornecedores' }]}
      eyebrow="Base de parceiros"
      title="Fornecedores"
      description="Parceiros que abastecem as unidades, sustentam a operação e influenciam diretamente custo, qualidade e disponibilidade."
      meta={
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-support text-ink-tertiary">
          <span>
            <strong className="font-semibold text-ink-primary">{supplierSummary.ativos}</strong> fornecedores ativos
          </span>
          <span>
            <strong className="font-semibold text-warning">{supplierSummary.emAtencao}</strong> em atenção
          </span>
          <span>
            <strong className="font-semibold text-ink-primary">{dependencyRisks.length}</strong> categorias com dependência elevada
          </span>
        </p>
      }
      actions={
        <>
          <Button leftIcon={<Plus className="h-4 w-4" strokeWidth={1.7} />} onClick={onNovoFornecedor}>
            Novo fornecedor
          </Button>
          <Button variant="secondary" leftIcon={<Scale className="h-4 w-4" strokeWidth={1.7} />} onClick={onComparar}>
            Comparar fornecedores
          </Button>
        </>
      }
      banner={<PageBanner slot="banner-fornecedores" rotulo="Imagem do banner de Fornecedores" />}
    />
  )
}

export function SuppliersFilterBar({ filters, onChange }: { filters: SuppliersFilters; onChange: (next: SuppliersFilters) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <PageFilters>
        <SearchInput
          placeholder="Buscar fornecedor, categoria, contato..."
          value={filters.busca}
          onChange={(e) => onChange({ ...filters, busca: e.target.value })}
          wrapperClassName="w-full sm:w-72"
        />
        <Select
          aria-label="Categoria"
          value={filters.categoria}
          onChange={(e) => onChange({ ...filters, categoria: e.target.value as SuppliersFilters['categoria'] })}
          options={[{ value: 'todas', label: 'Todas as categorias' }, ...Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))]}
          className="w-48"
        />
        <Select
          aria-label="Status"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          options={[
            { value: 'todos', label: 'Todos os status' },
            { value: 'estrategico', label: 'Estratégico' },
            { value: 'ativo', label: 'Ativo' },
            { value: 'em_atencao', label: 'Em atenção' },
            { value: 'em_homologacao', label: 'Em homologação' },
            { value: 'bloqueado', label: 'Bloqueado' },
          ]}
          className="w-44"
        />
      </PageFilters>

      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickFilters.map((qf) => (
          <button
            key={qf.value}
            onClick={() => onChange({ ...filters, rapido: qf.value })}
            className={cn(
              'h-8 shrink-0 whitespace-nowrap rounded-full border px-3 text-caption font-medium transition-colors',
              filters.rapido === qf.value
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border text-ink-tertiary hover:border-border-strong hover:text-ink-secondary',
            )}
          >
            {qf.label}
          </button>
        ))}
      </div>
    </div>
  )
}
