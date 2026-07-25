import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ClipboardPlus, Sparkles } from 'lucide-react'
import { InventoryBreadcrumb } from '@/components/inventory/InventoryBreadcrumb'
import { InventoryStatusBadge } from '@/components/inventory/InventoryStatusBadge'
import { InventoryConfidenceBadge } from '@/components/inventory/InventoryConfidenceBadge'
import { Button } from '@/components/ui/Button'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { DataList } from '@/components/ui/DataList'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { EmptyState } from '@/components/ui/EmptyState'
import { CreateActionModal, type CreateActionDefaults } from '@/components/cortex/CreateActionModal'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { getPositionsByItem } from '@/data/inventory/inventoryPositions'
import { getMovementsByItem } from '@/data/inventory/inventoryMovements'
import { getLossesByItem } from '@/data/inventory/inventoryLosses'
import { inventoryCmvImpactRows } from '@/data/inventory/inventoryCmvImpact'
import { units } from '@/data/units'
import { computeInventoryPosition } from '@/utils/inventoryCalculations'
import { useAppState } from '@/context/AppStateContext'
import { useCreatedActions } from '@/hooks/useCreatedActions'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'
import { movementTypeLabel } from '@/data/inventory/inventoryMovementLabels'
import NotFound from './NotFound'
import type { InventoryMovement, InventoryPosition } from '@/types'

export default function InventoryItemDetail() {
  const { itemId } = useParams<{ itemId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { createAction } = useCreatedActions()
  const [modalDefaults, setModalDefaults] = useState<CreateActionDefaults | null>(null)

  const item = itemId ? getInventoryItemById(itemId) : undefined
  if (!item) return <NotFound />

  const focusUnitId = searchParams.get('unit')
  const positions = getPositionsByItem(item.id)
  const movements = getMovementsByItem(item.id)
  const losses = getLossesByItem(item.id)
  const cmvImpact = inventoryCmvImpactRows.filter((r) => r.itemId === item.id)
  const contextLabel = `Item — ${item.nome}`

  const estoqueTotal = positions.reduce((sum, p) => sum + p.saldoSistemico, 0)
  const valorTotal = estoqueTotal * item.custoMedio
  const estoqueMinimoConsolidado = positions.reduce((sum, p) => sum + p.estoqueMinimo, 0)
  const coberturas = positions.map((p) => computeInventoryPosition(p, item.custoMedio).cobertura).filter((c): c is number => c !== null)
  const coberturaMedia = coberturas.length > 0 ? coberturas.reduce((a, b) => a + b, 0) / coberturas.length : null
  const unidadesComDesvio = positions.filter((p) => p.status === 'divergente' || p.status === 'dados_insuficientes').length
  const impactoTotalCmv = cmvImpact.reduce((sum, r) => sum + r.impacto, 0)

  const positionColumns: TableColumn<InventoryPosition>[] = [
    { key: 'unidade', header: 'Unidade', render: (p) => <span className="font-medium">{units.find((u) => u.id === p.unitId)?.nomeCurto ?? p.unitId}</span> },
    { key: 'sistemico', header: 'Saldo sistêmico', align: 'right', render: (p) => `${p.saldoSistemico.toLocaleString('pt-BR')} ${item.unidadeMedida}` },
    { key: 'contado', header: 'Saldo contado', align: 'right', render: (p) => (p.saldoContado !== null ? `${p.saldoContado.toLocaleString('pt-BR')} ${item.unidadeMedida}` : '—') },
    { key: 'disponivel', header: 'Saldo disponível', align: 'right', render: (p) => `${computeInventoryPosition(p, item.custoMedio).saldoDisponivel.toLocaleString('pt-BR')} ${item.unidadeMedida}` },
    { key: 'consumo', header: 'Consumo médio', align: 'right', render: (p) => `${p.consumoMedioDiario.toLocaleString('pt-BR')}/dia` },
    {
      key: 'cobertura',
      header: 'Cobertura',
      align: 'right',
      render: (p) => {
        const c = computeInventoryPosition(p, item.custoMedio).cobertura
        return c !== null ? `${c.toFixed(1)} dias` : '—'
      },
    },
    {
      key: 'diferenca',
      header: 'Diferença',
      align: 'right',
      render: (p) => {
        const d = computeInventoryPosition(p, item.custoMedio).divergencia
        return d !== null ? `${d > 0 ? '+' : ''}${d} ${item.unidadeMedida}` : '—'
      },
    },
    { key: 'contagem', header: 'Última contagem', align: 'right', render: (p) => (p.ultimaContagem ? formatDateFull(p.ultimaContagem) : 'Sem registro') },
    { key: 'confianca', header: 'Confiança', render: (p) => <InventoryConfidenceBadge nivel={p.confianca} motivos={p.motivosConfianca} /> },
    { key: 'status', header: 'Status', render: (p) => <InventoryStatusBadge status={p.status} /> },
  ]

  const movementColumns: TableColumn<InventoryMovement>[] = [
    { key: 'data', header: 'Data', render: (m) => formatDateFull(m.data) },
    { key: 'tipo', header: 'Tipo', render: (m) => movementTypeLabel[m.tipo] },
    { key: 'unidade', header: 'Unidade', render: (m) => units.find((u) => u.id === m.unitId)?.nomeCurto ?? m.unitId },
    { key: 'quantidade', header: 'Quantidade', align: 'right', render: (m) => `${m.quantidade.toLocaleString('pt-BR')} ${m.unidadeMedida}` },
    { key: 'valor', header: 'Valor', align: 'right', render: (m) => formatCurrencyBRL(m.valorTotal) },
    { key: 'origem', header: 'Origem', render: (m) => m.origem },
  ]

  return (
    <div className="flex flex-col gap-6">
      <InventoryBreadcrumb trail={[{ label: 'Posição de estoque', path: '/estoque?tab=posicao' }, { label: item.nome }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-page-title">{item.nome}</h1>
          <p className="text-support text-ink-secondary">
            {item.categoria} · Unidade padrão: {item.unidadeMedida} · Fornecedor principal: {item.fornecedorPrincipal}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button size="sm" variant="primary" leftIcon={<ClipboardPlus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setModalDefaults({ titulo: `Investigar divergência — ${item.nome}`, prioridade: 'alta' })}>
            Criar ação
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Quais divergências impactam o CMV?', contextLabel)}>
            Perguntar ao CORTEX
          </Button>
        </div>
      </div>

      <MetricStrip className="xl:grid-cols-4">
        <MetricCard titulo="Custo médio" valor={formatCurrencyBRL(item.custoMedio)} unidade={`/ ${item.unidadeMedida}`} status="neutral" />
        <MetricCard titulo="Estoque total" valor={`${estoqueTotal.toLocaleString('pt-BR')} ${item.unidadeMedida}`} status="neutral" comparacao={formatCurrencyBRL(valorTotal)} />
        <MetricCard titulo="Estoque mínimo consolidado" valor={`${estoqueMinimoConsolidado.toLocaleString('pt-BR')} ${item.unidadeMedida}`} status="info" />
        <MetricCard titulo="Cobertura média" valor={coberturaMedia !== null ? `${coberturaMedia.toFixed(1)} dias` : '—'} status="attention" comparacao={`${unidadesComDesvio} unidades com desvio`} />
      </MetricStrip>

      {item.produtosRelacionados.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-support text-ink-tertiary">Produtos que utilizam este insumo:</span>
          {item.produtosRelacionados.map((p) => (
            <span key={p} className="rounded-full border border-border bg-surface px-2.5 py-1 text-caption font-medium text-ink-secondary">
              {p}
            </span>
          ))}
        </div>
      )}

      <section>
        <SectionHeader title="Posição por unidade" description={`Saldo sistêmico, contado, disponível e cobertura em cada unidade${focusUnitId ? ' (destaque para a unidade selecionada)' : ''}`} />
        {positions.length === 0 ? (
          <EmptyState icon={<Sparkles className="h-5 w-5" />} title="Sem posição registrada" description="Este item ainda não possui posição de estoque cadastrada em nenhuma unidade." />
        ) : (
          <Table columns={positionColumns} data={positions} getRowId={(p) => p.unitId} />
        )}
      </section>

      {cmvImpact.length > 0 && (
        <section>
          <SectionHeader title="Relação com o CMV" description="Divergências deste item já identificadas na análise de CMV" />
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
            {cmvImpact.map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="text-support font-medium text-ink-primary">{units.find((u) => u.id === row.unitId)?.nomeCurto}</p>
                  <p className="text-caption text-ink-tertiary">{row.causaProvavel}</p>
                </div>
                <span className="tabular text-support font-medium text-danger">{formatCurrencyBRL(row.impacto)}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-support">
            <span className="text-ink-tertiary">Impacto estimado no CMV</span>
            <Button size="sm" variant="ghost" onClick={() => navigate('/cmv?tab=causas')}>
              Abrir módulo de CMV — {formatCurrencyBRL(impactoTotalCmv)}
            </Button>
          </div>
        </section>
      )}

      <section>
        <SectionHeader title="Movimentações recentes" description="Entradas, saídas, perdas e transferências — nunca apagadas" />
        {movements.length === 0 ? (
          <EmptyState icon={<Sparkles className="h-5 w-5" />} title="Sem movimentações registradas" />
        ) : (
          <Table columns={movementColumns} data={movements} getRowId={(m) => m.id} />
        )}
      </section>

      {losses.length > 0 && (
        <section>
          <SectionHeader title="Perdas" description="Registros de perda deste item" />
          <DataList
            items={losses.map((l) => ({
              label: `${formatDateFull(l.data)} — ${units.find((u) => u.id === l.unitId)?.nomeCurto}`,
              value: formatCurrencyBRL(l.valor),
            }))}
          />
        </section>
      )}

      <CreateActionModal isOpen={Boolean(modalDefaults)} onClose={() => setModalDefaults(null)} defaults={modalDefaults ?? undefined} onSave={(action) => createAction(action)} />
    </div>
  )
}
