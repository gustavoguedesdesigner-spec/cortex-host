import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, ClipboardPlus, Sparkles } from 'lucide-react'
import { CmvBreadcrumb } from '@/components/cmv/CmvBreadcrumb'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { CreateActionModal, type CreateActionDefaults } from '@/components/cortex/CreateActionModal'
import { TrendSection } from './unidade-detail/TrendSection'
import { CausesSection } from './unidade-detail/CausesSection'
import { ProductsSection } from './unidade-detail/ProductsSection'
import { NetworkComparisonSection } from './unidade-detail/NetworkComparisonSection'
import { BenchmarkSection } from './unidade-detail/BenchmarkSection'
import { ActionPlanSection } from './unidade-detail/ActionPlanSection'
import { IncompleteDataBanner } from './unidade-detail/IncompleteDataBanner'
import { CmvUnitCategoryBreakdown } from './cmv/CmvUnitCategoryBreakdown'
import NotFound from './NotFound'
import { getUnitById } from '@/data/units'
import { getUnitProfile } from '@/data/unit-profiles'
import { cmvMeta } from '@/data/cmv-weekly-series'
import { useAppState } from '@/context/AppStateContext'
import { useCreatedActions } from '@/hooks/useCreatedActions'
import { formatCurrencyCompactBRL, formatPercent, formatPercentPoints } from '@/utils/format'

export default function CmvUnitDetail() {
  const { unitId } = useParams<{ unitId: string }>()
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { createAction } = useCreatedActions()
  const [modalDefaults, setModalDefaults] = useState<CreateActionDefaults | null>(null)

  const unit = unitId ? getUnitById(unitId) : undefined
  const profile = unitId ? getUnitProfile(unitId) : undefined

  if (!unit || !profile) return <NotFound />

  const desvio = unit.cmvReal - unit.cmvTeorico
  const contextLabel = `CMV — ${unit.nome}`

  return (
    <div className="flex flex-col gap-6">
      <CmvBreadcrumb trail={[{ label: 'Unidades', path: '/cmv?tab=unidades' }, { label: unit.nomeCurto }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-page-title">CMV — {unit.nome}</h1>
            <StatusBadge level={unit.nivelAtencao} />
          </div>
          <p className="text-support text-ink-secondary">
            Gerente {unit.gerente} · {formatPercent(unit.cmvReal)} de CMV real, {formatPercentPoints(desvio)} versus o teórico
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/unidades/${unit.id}`)}>
            Ver detalhe completo da unidade
          </Button>
          <Button size="sm" variant="primary" leftIcon={<ClipboardPlus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setModalDefaults({ unidade: unit.nome, prioridade: 'alta' })}>
            Criar ação
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex(`Por que ${unit.nomeCurto} está crítica?`, contextLabel)}>
            Perguntar ao CORTEX
          </Button>
        </div>
      </div>

      {profile.dadosIncompletos && (
        <IncompleteDataBanner
          info={profile.dadosIncompletos}
          onCreateAction={() => setModalDefaults({ titulo: profile.dadosIncompletos!.acaoNecessaria, unidade: unit.nome, prioridade: 'alta' })}
        />
      )}

      <MetricStrip className="xl:grid-cols-4">
        <MetricCard titulo="CMV real" valor={formatPercent(unit.cmvReal)} status="critical" />
        <MetricCard titulo="CMV teórico" valor={formatPercent(unit.cmvTeorico)} status="neutral" />
        <MetricCard titulo="Diferença" valor={formatPercentPoints(desvio)} status={desvio > 0 ? 'critical' : 'success'} comparacao={`Meta: ${formatPercent(unit.metaCmv)}`} />
        <MetricCard titulo="Impacto financeiro" valor={formatCurrencyCompactBRL(unit.impactoFinanceiro)} status="critical" />
      </MetricStrip>

      <TrendSection data={profile.tendenciaSemanal} meta={cmvMeta} eventos={profile.eventosTendencia} />

      {profile.causas ? <CausesSection causas={profile.causas} /> : <CmvUnitCategoryBreakdown unitId={unit.id} />}

      <ProductsSection produtos={profile.produtosCriticos} unitName={unit.nomeCurto} />

      <NetworkComparisonSection unitName={unit.nomeCurto} rows={profile.comparacaoRede} insight={profile.comparacaoRedeInsight} />

      {profile.benchmarkInterno && (
        <BenchmarkSection
          unitLabel={unit.nomeCurto}
          comparadoComNome={profile.benchmarkInterno.comparadoComNome}
          comparadoComId={profile.benchmarkInterno.comparadoCom}
          linhas={profile.benchmarkInterno.linhas}
          insight={profile.benchmarkInterno.insight}
        />
      )}

      <ActionPlanSection acoes={profile.acoes} onCreateAction={() => setModalDefaults({ unidade: unit.nome, prioridade: 'alta' })} />

      <CreateActionModal isOpen={Boolean(modalDefaults)} onClose={() => setModalDefaults(null)} defaults={modalDefaults ?? undefined} onSave={(action) => createAction(action)} />
    </div>
  )
}
