import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, ClipboardPlus, Sparkles } from 'lucide-react'
import { InventoryBreadcrumb } from '@/components/inventory/InventoryBreadcrumb'
import { InventoryStatusBadge } from '@/components/inventory/InventoryStatusBadge'
import { InventoryConfidenceBadge } from '@/components/inventory/InventoryConfidenceBadge'
import { Button } from '@/components/ui/Button'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CreateActionModal, type CreateActionDefaults } from '@/components/cortex/CreateActionModal'
import { getUnitById } from '@/data/units'
import { getUnitProfile } from '@/data/unit-profiles'
import { getPositionsByUnit } from '@/data/inventory/inventoryPositions'
import { getInventoryLocationsByUnit } from '@/data/inventory/inventoryLocations'
import { getInventoryCountsByUnit } from '@/data/inventory/inventoryCounts'
import { getTransfersByUnit } from '@/data/inventory/inventoryTransfers'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { countStatusLabel, transferStatusLabel } from '@/data/inventory/inventoryMovementLabels'
import { units } from '@/data/units'
import { useAppState } from '@/context/AppStateContext'
import { useCreatedActions } from '@/hooks/useCreatedActions'
import { formatCurrencyBRL, formatCurrencyCompactBRL, formatDateFull, formatPercent } from '@/utils/format'
import NotFound from './NotFound'
import type { InventoryPosition } from '@/types'

const locationLabel: Record<string, string> = {
  estoque_seco: 'Estoque seco',
  estoque_refrigerado: 'Estoque refrigerado',
  estoque_congelado: 'Estoque congelado',
  camara_bebidas: 'Câmara de bebidas',
  bar: 'Bar',
  cozinha: 'Cozinha',
  deposito_limpeza: 'Depósito de limpeza',
  estoque_embalagens: 'Estoque de embalagens',
}

export default function InventoryUnitDetail() {
  const { unitId } = useParams<{ unitId: string }>()
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { createAction } = useCreatedActions()
  const [modalDefaults, setModalDefaults] = useState<CreateActionDefaults | null>(null)

  const unit = unitId ? getUnitById(unitId) : undefined
  const profile = unitId ? getUnitProfile(unitId) : undefined
  if (!unit || !profile) return <NotFound />

  const positions = getPositionsByUnit(unit.id)
  const locations = getInventoryLocationsByUnit(unit.id)
  const counts = getInventoryCountsByUnit(unit.id)
  const transfers = getTransfersByUnit(unit.id)
  const criticas = positions.filter((p) => p.status === 'risco_ruptura' || p.status === 'abaixo_minimo').length
  const divergentes = positions.filter((p) => p.status === 'divergente').length
  const contextLabel = `Estoque — ${unit.nome}`

  const positionColumns: TableColumn<InventoryPosition>[] = [
    { key: 'item', header: 'Item', render: (p) => <span className="font-medium">{getInventoryItemById(p.itemId)?.nome ?? p.itemId}</span> },
    { key: 'sistemico', header: 'Saldo sistêmico', align: 'right', render: (p) => p.saldoSistemico.toLocaleString('pt-BR') },
    { key: 'confianca', header: 'Confiança', render: (p) => <InventoryConfidenceBadge nivel={p.confianca} /> },
    { key: 'status', header: 'Status', render: (p) => <InventoryStatusBadge status={p.status} /> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <InventoryBreadcrumb trail={[{ label: unit.nomeCurto }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-page-title">Estoque — {unit.nome}</h1>
            <StatusBadge level={unit.nivelAtencao} />
          </div>
          <p className="text-support text-ink-secondary">Gerente {unit.gerente} · {criticas} itens críticos · {divergentes} divergências</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/unidades/${unit.id}`)}>
            Ver detalhe completo da unidade
          </Button>
          <Button size="sm" variant="primary" leftIcon={<ClipboardPlus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setModalDefaults({ unidade: unit.nome, prioridade: 'alta' })}>
            Criar ação
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Quais unidades possuem menor acuracidade?', contextLabel)}>
            Perguntar ao CORTEX
          </Button>
        </div>
      </div>

      <MetricStrip className="xl:grid-cols-5">
        <MetricCard titulo="Valor em estoque" valor={formatCurrencyCompactBRL(unit.valorEstoque)} status="neutral" />
        <MetricCard titulo="Acuracidade" valor={formatPercent(profile.estoque.acuraciadeEstimada, 1)} status={profile.estoque.acuraciadeEstimada < 0.85 ? 'critical' : 'attention'} />
        <MetricCard titulo="Itens críticos" valor={String(profile.estoque.itensCriticos)} status="critical" />
        <MetricCard titulo="Itens em excesso" valor={String(profile.estoque.itensExcesso)} status="info" />
        <MetricCard titulo="Perdas registradas" valor={formatCurrencyCompactBRL(unit.perdas)} status="critical" />
      </MetricStrip>

      <section>
        <SectionHeader title="Locais de estoque" description="Valor, itens e confiança por local — sem sensores reais, temperatura simulada" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {locations.map((loc) => (
            <div key={loc.id} className="flex flex-col gap-1.5 rounded-lg border border-border bg-surface p-4">
              <p className="text-support font-medium text-ink-primary">{locationLabel[loc.tipo]}</p>
              <p className="text-metric-sm tabular text-ink-primary">{formatCurrencyBRL(loc.valor)}</p>
              <p className="text-caption text-ink-tertiary">
                {loc.itens} itens · {loc.responsavel}
                {loc.temperaturaSimulada && ` · ${loc.temperaturaSimulada}`}
              </p>
              <InventoryConfidenceBadge nivel={loc.confianca} className="self-start" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Posições desta unidade" description="Amostra dos itens com posição registrada" />
        {positions.length === 0 ? (
          <p className="text-support text-ink-tertiary">Nenhuma posição cadastrada para esta unidade no catálogo demonstrativo.</p>
        ) : (
          <Table columns={positionColumns} data={positions} getRowId={(p) => p.itemId} onRowClick={(p) => navigate(`/estoque/itens/${p.itemId}?unit=${unit.id}`)} />
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-6">
          <SectionHeader title="Inventários" description="Contagens desta unidade" />
          {counts.length === 0 ? (
            <p className="text-support text-ink-tertiary">Nenhum inventário registrado.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
              {counts.map((c) => (
                <button key={c.id} onClick={() => navigate(`/estoque/inventarios/${c.id}`)} className="flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover">
                  <div className="min-w-0">
                    <p className="truncate text-support font-medium text-ink-primary">{c.titulo}</p>
                    <p className="text-caption text-ink-tertiary">{c.responsavel}</p>
                  </div>
                  <span className="shrink-0 text-caption text-ink-tertiary">{countStatusLabel[c.status]}</span>
                </button>
              ))}
            </div>
          )}
        </section>
        <section className="lg:col-span-6">
          <SectionHeader title="Transferências" description="Envios e recebimentos desta unidade" />
          {transfers.length === 0 ? (
            <p className="text-support text-ink-tertiary">Nenhuma transferência registrada.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
              {transfers.map((t) => (
                <button key={t.id} onClick={() => navigate('/estoque/transferencias')} className="flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover">
                  <div className="min-w-0">
                    <p className="truncate text-support font-medium text-ink-primary">
                      {t.id} — {getInventoryItemById(t.itemId)?.nome}
                    </p>
                    <p className="text-caption text-ink-tertiary">
                      {units.find((u) => u.id === t.origemUnitId)?.nomeCurto} → {units.find((u) => u.id === t.destinoUnitId)?.nomeCurto}
                    </p>
                  </div>
                  <span className="shrink-0 text-caption text-ink-tertiary">{transferStatusLabel[t.status]}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <section>
        <SectionHeader title="Conexão com o CMV" description="Divergências desta unidade com impacto identificado no CMV" />
        <p className="text-support text-ink-secondary">
          {unit.principalOcorrencia ?? 'Sem ocorrência principal registrada.'} — última sincronização {formatDateFull(unit.ultimaSincronizacao)}.
        </p>
        <Button size="sm" variant="ghost" className="mt-2" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/cmv/unidades/${unit.id}`)}>
          Abrir CMV — {unit.nomeCurto}
        </Button>
      </section>

      <CreateActionModal isOpen={Boolean(modalDefaults)} onClose={() => setModalDefaults(null)} defaults={modalDefaults ?? undefined} onSave={(action) => createAction(action)} />
    </div>
  )
}
