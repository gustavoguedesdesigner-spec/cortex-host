import { useEffect, useRef, useState, type RefObject } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getUnitById } from '@/data/units'
import { getUnitProfile } from '@/data/unit-profiles'
import { cmvMeta } from '@/data/cmv-weekly-series'
import { useAppState } from '@/context/AppStateContext'
import { useCreatedActions } from '@/hooks/useCreatedActions'
import { CreateActionModal, type CreateActionDefaults } from '@/components/cortex/CreateActionModal'
import { ContextBanner } from './unidade-detail/ContextBanner'
import { UnitHeader } from './unidade-detail/UnitHeader'
import { InternalTabs, UnitTabPlaceholder, type UnitTab } from './unidade-detail/InternalTabs'
import { ExecutiveSummarySection } from './unidade-detail/ExecutiveSummarySection'
import { UnitIndicatorsSection } from './unidade-detail/IndicatorsSection'
import { OperationalIndexCard } from './unidade-detail/OperationalIndexCard'
import { TrendSection } from './unidade-detail/TrendSection'
import { CausesSection } from './unidade-detail/CausesSection'
import { ProductsSection } from './unidade-detail/ProductsSection'
import { NetworkComparisonSection } from './unidade-detail/NetworkComparisonSection'
import { BenchmarkSection } from './unidade-detail/BenchmarkSection'
import { StockPurchasesSuppliersSection } from './unidade-detail/StockPurchasesSuppliersSection'
import { ActionPlanSection } from './unidade-detail/ActionPlanSection'
import { RecentActivitySection } from './unidade-detail/RecentActivitySection'
import { UnitQuickQuestionsSection } from './unidade-detail/UnitQuickQuestionsSection'
import { IncompleteDataBanner } from './unidade-detail/IncompleteDataBanner'
import NotFound from './NotFound'

interface LocationState {
  fromOccurrenceTitulo?: string
  outrasUnidades?: string[]
}

export default function UnitDetail() {
  const { unitId } = useParams<{ unitId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const { createAction } = useCreatedActions()

  const unit = unitId ? getUnitById(unitId) : undefined
  const profile = unitId ? getUnitProfile(unitId) : undefined

  const [activeTab, setActiveTab] = useState<UnitTab>('Visão geral')
  const [modalDefaults, setModalDefaults] = useState<CreateActionDefaults | null>(null)
  const trendRef = useRef<HTMLDivElement>(null)
  const causesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setActiveTab('Visão geral')
    window.scrollTo(0, 0)
  }, [unitId])

  if (!unit || !profile) {
    return <NotFound />
  }

  const state = (location.state as LocationState | null) ?? null

  function scrollTo(ref: RefObject<HTMLDivElement>) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex flex-col gap-6">
      {state?.fromOccurrenceTitulo && (
        <ContextBanner
          fromOccurrenceTitulo={state.fromOccurrenceTitulo}
          outrasUnidades={state.outrasUnidades ?? []}
          onCreateAction={() => setModalDefaults({ titulo: state.fromOccurrenceTitulo, unidade: unit.nome, prioridade: 'alta' })}
        />
      )}

      <UnitHeader
        unit={unit}
        onCreateAction={() => setModalDefaults({ unidade: unit.nome, prioridade: 'alta' })}
        onCompare={() => navigate('/unidades', { state: { preselecionar: unit.id } })}
        onAskCortex={() => askCortex(`Por que ${unit.nomeCurto} está crítica?`, unit.nome)}
      />

      <InternalTabs
        active={activeTab}
        onChange={(tab) => (tab === 'CMV' ? navigate(`/cmv/unidades/${unit.id}`) : setActiveTab(tab))}
      />

      {activeTab !== 'Visão geral' ? (
        <UnitTabPlaceholder unitName={unit.nomeCurto} tab={activeTab} />
      ) : (
        <div className="flex flex-col gap-8">
          {profile.dadosIncompletos && (
            <IncompleteDataBanner
              info={profile.dadosIncompletos}
              onCreateAction={() =>
                setModalDefaults({ titulo: profile.dadosIncompletos!.acaoNecessaria, unidade: unit.nome, prioridade: 'alta' })
              }
            />
          )}

          <ExecutiveSummarySection
            profile={profile}
            onCreatePlan={() => setModalDefaults({ unidade: unit.nome, prioridade: 'critica', titulo: `Reduzir o desvio de CMV em ${unit.nomeCurto}` })}
            onAnalyzeCmv={() => scrollTo(trendRef)}
            onViewEvidence={() => scrollTo(causesRef)}
            onAskCortex={() => askCortex(`Por que ${unit.nomeCurto} está crítica?`, unit.nome)}
          />

          <UnitIndicatorsSection unit={unit} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div ref={trendRef} className="xl:col-span-2">
              <TrendSection data={profile.tendenciaSemanal} meta={cmvMeta} eventos={profile.eventosTendencia} />
            </div>
            {profile.indiceOperacional && <OperationalIndexCard indice={profile.indiceOperacional} />}
          </div>

          {profile.causas && (
            <div ref={causesRef}>
              <CausesSection causas={profile.causas} />
            </div>
          )}

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

          <StockPurchasesSuppliersSection unit={unit} profile={profile} />

          <ActionPlanSection acoes={profile.acoes} onCreateAction={() => setModalDefaults({ unidade: unit.nome, prioridade: 'alta' })} />

          <RecentActivitySection eventos={profile.atividade} />

          <UnitQuickQuestionsSection
            perguntas={profile.perguntasRapidas}
            onAsk={(pergunta, resposta) => askCortex(pergunta, unit.nome, resposta)}
          />
        </div>
      )}

      <CreateActionModal
        isOpen={Boolean(modalDefaults)}
        onClose={() => setModalDefaults(null)}
        defaults={modalDefaults ?? undefined}
        onSave={(action) => createAction(action)}
      />
    </div>
  )
}
