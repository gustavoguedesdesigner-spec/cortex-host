import { Plus } from 'lucide-react'
import { PageHero, PageBanner, PageFilters } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { receivingSummary } from '@/data/receiving/receivingSituation'
import { units } from '@/data/units'
import { cn } from '@/utils/cn'
import type { ReceiptStatus } from '@/types'

export interface ReceivingFilters {
  busca: string
  unidade: string
  rapido: ReceivingQuickFilter
}

export type ReceivingQuickFilter = 'todos' | ReceiptStatus

const quickFilters: { value: ReceivingQuickFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'aguardando', label: 'Aguardando' },
  { value: 'em_conferencia', label: 'Em conferência' },
  { value: 'divergente', label: 'Divergentes' },
  { value: 'quarentena', label: 'Em quarentena' },
  { value: 'conforme', label: 'Conformes' },
]

export function ReceivingHero({ onNovoRecebimento }: { onNovoRecebimento: () => void }) {
  return (
    <PageHero
      breadcrumb={[{ label: 'Início', path: '/' }, { label: 'Recebimentos' }]}
      eyebrow="Suprimentos"
      title="Recebimentos"
      description="Leitura assistida de notas fiscais e conferência entre pedido, documento e recebimento físico — nenhuma entrega entra em estoque só porque chegou."
      meta={
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-support text-ink-tertiary">
          <span>
            <strong className="font-semibold text-ink-primary">{receivingSummary.agendadosHoje}</strong> agendados hoje
          </span>
          <span>
            <strong className="font-semibold text-danger">{receivingSummary.divergenciasAbertas}</strong> divergências abertas
          </span>
          <span>
            <strong className="font-semibold text-ink-primary">{receivingSummary.emQuarentena}</strong> em quarentena
          </span>
        </p>
      }
      actions={
        <Button leftIcon={<Plus className="h-4 w-4" strokeWidth={1.7} />} onClick={onNovoRecebimento}>
          Novo recebimento
        </Button>
      }
      banner={<PageBanner slot="banner-recebimentos" rotulo="Imagem do banner de Recebimentos" />}
    />
  )
}

export function ReceivingFilterBar({ filters, onChange }: { filters: ReceivingFilters; onChange: (next: ReceivingFilters) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <PageFilters>
        <SearchInput
          placeholder="Buscar por NF, fornecedor, unidade..."
          value={filters.busca}
          onChange={(e) => onChange({ ...filters, busca: e.target.value })}
          wrapperClassName="w-full sm:w-72"
        />
        <Select
          aria-label="Unidade"
          value={filters.unidade}
          onChange={(e) => onChange({ ...filters, unidade: e.target.value })}
          options={[{ value: 'todas', label: 'Todas as unidades' }, ...units.map((u) => ({ value: u.id, label: u.nome }))]}
          className="w-48"
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
