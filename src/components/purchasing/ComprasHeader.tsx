import { FilePlus2, ListChecks, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { SearchInput } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { periodOptions } from '@/data/periods'
import { useAppState, useUnitOptions } from '@/context/AppStateContext'
import { purchasingSituation } from '@/data/purchasing/situation'

export function ComprasHeader({
  search,
  onSearchChange,
  categoria,
  onCategoriaChange,
  categoriaOptions,
  status,
  onStatusChange,
  statusOptions,
  onNovaRequisicao,
  onCriarCotacao,
}: {
  search: string
  onSearchChange: (v: string) => void
  categoria: string
  onCategoriaChange: (v: string) => void
  categoriaOptions: { value: string; label: string }[]
  status: string
  onStatusChange: (v: string) => void
  statusOptions: { value: string; label: string }[]
  onNovaRequisicao: () => void
  onCriarCotacao: () => void
}) {
  const { periodo, setPeriodo, unidadeSelecionada, setUnidadeSelecionada, askCortex } = useAppState()
  const unitOptions = useUnitOptions()

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Suprimentos"
        title="Compras"
        description="O que precisa ser comprado, quando comprar, de quem comprar e por que essa decisão faz sentido."
        actions={
          <>
            <Button size="sm" variant="secondary" leftIcon={<FilePlus2 className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onNovaRequisicao}>
              Nova requisição
            </Button>
            <Button size="sm" variant="navy" leftIcon={<ListChecks className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onCriarCotacao}>
              Criar cotação
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />}
              onClick={() => askCortex('O que precisa ser comprado hoje?', 'Compras consolidadas')}
            >
              Pergunte ao CORTEX
            </Button>
          </>
        }
        meta={<p className="text-caption text-ink-tertiary">Atualizado {purchasingSituation.ultimaAtualizacaoLabel}</p>}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select aria-label="Período" value={periodo} onChange={(e) => setPeriodo(e.target.value as typeof periodo)} options={periodOptions.map((p) => ({ value: p.id, label: p.label }))} className="w-40" />
        <Select aria-label="Unidade" value={unidadeSelecionada} onChange={(e) => setUnidadeSelecionada(e.target.value)} options={unitOptions.map((u) => ({ value: u.id, label: u.nome }))} className="w-52" />
        <Select aria-label="Categoria" value={categoria} onChange={(e) => onCategoriaChange(e.target.value)} options={categoriaOptions} className="w-48" />
        <Select aria-label="Status" value={status} onChange={(e) => onStatusChange(e.target.value)} options={statusOptions} className="w-48" />
        <SearchInput aria-label="Buscar" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar item, requisição, pedido..." wrapperClassName="ml-auto w-64" />
      </div>
    </div>
  )
}
