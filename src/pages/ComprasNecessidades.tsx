import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Sparkles } from 'lucide-react'
import { ComprasBreadcrumb } from '@/components/purchasing/ComprasBreadcrumb'
import { ComprasInternalNav } from '@/components/purchasing/ComprasInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Drawer } from '@/components/ui/Drawer'
import { DataList } from '@/components/ui/DataList'
import { UrgencyBadge } from '@/components/purchasing/UrgencyBadge'
import { usePurchasing } from '@/hooks/usePurchasing'
import { getUnitById } from '@/data/units'
import { purchaseCategories } from '@/data/purchasing/categories'
import { calcularNecessidadeSugerida } from '@/utils/purchasingCalculations'
import { useAppState } from '@/context/AppStateContext'
import { formatCurrencyBRL } from '@/utils/format'
import type { PurchaseNeed, PurchaseUrgency } from '@/types'

const quickFilters: { value: PurchaseUrgency | 'todas' | 'transferencia' | 'em_requisicao'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'critica', label: 'Crítica' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
  { value: 'transferencia', label: 'Transferência possível' },
  { value: 'em_requisicao', label: 'Já em requisição' },
]

export default function ComprasNecessidades() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { askCortex } = useAppState()
  const { allNeeds, ignoreNeed, createRequisitionFromNeed } = usePurchasing()
  const [filtro, setFiltro] = useState<(typeof quickFilters)[number]['value']>('todas')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [validado, setValidado] = useState(false)
  const categoriaParam = searchParams.get('categoria')

  const filtered = useMemo(
    () =>
      allNeeds.filter((n) => {
        if (n.status === 'ignorada' || n.status === 'resolvida') return false
        if (categoriaParam && categoriaParam !== 'todas') {
          const cat = purchaseCategories.find((c) => c.id === categoriaParam)
          if (cat && n.categoria !== cat.categoria) return false
        }
        if (filtro === 'transferencia') return !!n.transferenciaPossivelUnitId
        if (filtro === 'em_requisicao') return n.status === 'em_requisicao'
        if (filtro !== 'todas') return n.urgencia === filtro
        return true
      }),
    [allNeeds, filtro, categoriaParam],
  )

  const selected = selectedId ? allNeeds.find((n) => n.id === selectedId) : undefined

  const columns: TableColumn<PurchaseNeed>[] = [
    { key: 'item', header: 'Item', render: (n) => <span className="font-medium">{n.nome}</span> },
    { key: 'categoria', header: 'Categoria', render: (n) => n.categoria },
    { key: 'unidade', header: 'Unidade', render: (n) => getUnitById(n.unitId)?.nomeCurto ?? n.unitId },
    { key: 'saldo', header: 'Saldo disponível', align: 'right', render: (n) => `${n.saldoDisponivel.toLocaleString('pt-BR')} ${n.unidadeMedida}` },
    { key: 'minimo', header: 'Mínimo', align: 'right', render: (n) => `${n.estoqueMinimo.toLocaleString('pt-BR')} ${n.unidadeMedida}` },
    { key: 'consumo', header: 'Consumo médio/dia', align: 'right', render: (n) => n.consumoMedioDiario.toLocaleString('pt-BR') },
    { key: 'cobertura', header: 'Cobertura', align: 'right', render: (n) => (n.cobertura !== null ? `${n.cobertura.toFixed(1)} dias` : '—') },
    { key: 'prazo', header: 'Prazo de reposição', align: 'right', render: (n) => `${n.prazoMedioReposicaoDias} dias` },
    { key: 'transito', header: 'Em trânsito', align: 'right', render: (n) => n.estoqueEmTransito.toLocaleString('pt-BR') },
    { key: 'urgencia', header: 'Urgência', render: (n) => <UrgencyBadge urgencia={n.urgencia} /> },
    {
      key: 'status',
      header: '',
      align: 'right',
      render: (n) => (n.status === 'em_requisicao' ? <span className="text-caption text-ink-tertiary">Já em requisição</span> : null),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <ComprasBreadcrumb trail={[{ label: 'Necessidades' }]} />
      <PageHeader
        eyebrow="Suprimentos"
        title="Necessidades de compra"
        description="Itens que podem precisar de reposição, considerando estoque, consumo médio, prazo de reposição e pedidos já em andamento."
      />
      <ComprasInternalNav active="necessidades" />

      <SectionHeader title="Itens identificados" description="Uma sugestão, nunca um pedido criado automaticamente." actions={<SegmentedControl value={filtro} onChange={setFiltro} options={quickFilters} />} />

      {filtered.length === 0 ? (
        <EmptyState icon={<SlidersHorizontal className="h-5 w-5" />} title="Nenhuma necessidade encontrada" description="Ajuste os filtros para ver outros itens." />
      ) : (
        <Table columns={columns} data={filtered} getRowId={(n) => n.id} onRowClick={(n) => { setSelectedId(n.id); setValidado(false) }} />
      )}

      <Drawer isOpen={!!selected} onClose={() => setSelectedId(null)} title={selected?.nome ?? ''} subtitle={selected ? getUnitById(selected.unitId)?.nome : undefined}>
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <UrgencyBadge urgencia={selected.urgencia} />
              {selected.sazonalidade && <span className="text-caption text-ink-tertiary">{selected.sazonalidade}</span>}
            </div>

            <DataList
              items={[
                { label: 'Saldo disponível', value: `${selected.saldoDisponivel.toLocaleString('pt-BR')} ${selected.unidadeMedida}` },
                { label: 'Estoque mínimo', value: `${selected.estoqueMinimo.toLocaleString('pt-BR')} ${selected.unidadeMedida}` },
                { label: 'Ponto de reposição', value: `${selected.pontoReposicao.toLocaleString('pt-BR')} ${selected.unidadeMedida}` },
                { label: 'Consumo médio diário', value: `${selected.consumoMedioDiario.toLocaleString('pt-BR')} ${selected.unidadeMedida}` },
                { label: 'Cobertura atual', value: selected.cobertura !== null ? `${selected.cobertura.toFixed(1)} dias` : '—' },
                { label: 'Prazo médio de reposição', value: `${selected.prazoMedioReposicaoDias} dias` },
                { label: 'Pedidos em aberto', value: `${selected.pedidosEmAbertoQuantidade.toLocaleString('pt-BR')} ${selected.unidadeMedida}` },
                { label: 'Estoque em trânsito', value: `${selected.estoqueEmTransito.toLocaleString('pt-BR')} ${selected.unidadeMedida}` },
                selected.transferenciaPossivelUnitId
                  ? { label: 'Transferência possível', value: `${selected.transferenciaPossivelQuantidade} ${selected.unidadeMedida} de ${getUnitById(selected.transferenciaPossivelUnitId)?.nomeCurto}` }
                  : { label: 'Transferência possível', value: 'Nenhuma unidade com saldo suficiente' },
              ]}
            />

            <div className="rounded-md border border-border bg-surface-subtle p-3">
              <p className="mb-2 text-label text-ink-tertiary">Memória de cálculo — necessidade sugerida</p>
              <p className="text-caption leading-relaxed text-ink-secondary">
                Ponto de reposição ({selected.pontoReposicao.toLocaleString('pt-BR')}) + consumo previsto até a entrega ({selected.previsaoConsumoAteEntrega.toLocaleString('pt-BR')}) − saldo
                disponível ({selected.saldoDisponivel.toLocaleString('pt-BR')}) − estoque em trânsito ({selected.estoqueEmTransito.toLocaleString('pt-BR')}) − pedidos já confirmados (
                {selected.pedidosEmAbertoQuantidade.toLocaleString('pt-BR')})
              </p>
              <p className="mt-2 text-card-title text-ink-primary">
                = {calcularNecessidadeSugerida(selected.pontoReposicao, selected.previsaoConsumoAteEntrega, selected.saldoDisponivel, selected.estoqueEmTransito, selected.pedidosEmAbertoQuantidade).toLocaleString('pt-BR')}{' '}
                {selected.unidadeMedida}
              </p>
              <p className="mt-1 text-caption text-ink-tertiary">Ponto de partida para a decisão — não cria um pedido automaticamente.</p>
            </div>

            {validado && <p className="rounded-md bg-info-soft px-3 py-2 text-caption text-info">Validação solicitada ao responsável da unidade.</p>}

            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <Button
                variant="primary"
                onClick={() => {
                  const req = createRequisitionFromNeed(selected, calcularNecessidadeSugerida(selected.pontoReposicao, selected.previsaoConsumoAteEntrega, selected.saldoDisponivel, selected.estoqueEmTransito, selected.pedidosEmAbertoQuantidade) || selected.consumoMedioDiario, selected.urgencia, 'Requisição criada a partir da necessidade identificada.', 'Leo')
                  setSelectedId(null)
                  navigate(`/compras/requisicoes/${req.id}`)
                }}
              >
                Criar requisição
              </Button>
              <Button variant="secondary" onClick={() => navigate('/estoque/transferencias')}>
                Criar transferência
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  ignoreNeed(selected.id)
                  setSelectedId(null)
                }}
              >
                Ignorar temporariamente
              </Button>
              <Button variant="ghost" onClick={() => setValidado(true)}>
                Solicitar validação
              </Button>
              <Button
                variant="ghost"
                leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />}
                onClick={() => askCortex(`Preciso comprar ${selected.nome.toLowerCase()} agora?`, selected.nome)}
              >
                Perguntar ao CORTEX
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
