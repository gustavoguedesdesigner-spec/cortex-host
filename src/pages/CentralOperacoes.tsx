import { useEffect, useRef, type RefObject } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ExecutiveSummaryCard } from '@/components/cortex/ExecutiveSummaryCard'
import { ContextualHeader } from './central-operacoes/ContextualHeader'
import { IndicatorsSection } from './central-operacoes/IndicatorsSection'
import { OccurrencesSection } from './central-operacoes/OccurrencesSection'
import { CmvSection } from './central-operacoes/CmvSection'
import { UnitsSection } from './central-operacoes/UnitsSection'
import { FinancialImpactSection } from './central-operacoes/FinancialImpactSection'
import { PurchasesSuppliersSection } from './central-operacoes/PurchasesSuppliersSection'
import { PendingSection } from './central-operacoes/PendingSection'
import { ActivitySection } from './central-operacoes/ActivitySection'
import { QuickQuestionsSection } from './central-operacoes/QuickQuestionsSection'
import { executiveSummaryText, executiveRecommendations } from '@/data/executive-summary'
import { useCreatedActions } from '@/hooks/useCreatedActions'
import { useAppState } from '@/context/AppStateContext'

/**
 * Central de Operacoes — tela principal do CORTEX HOST.
 * Funciona como uma narrativa operacional (situacao -> ocorrencias ->
 * impacto -> causas -> comparacao entre unidades -> tendencias ->
 * pendencias -> acoes), nao como um dashboard tradicional de cards soltos.
 */
export default function CentralOperacoes() {
  const navigate = useNavigate()
  const location = useLocation()
  const { askCortex } = useAppState()
  const { actions, createAction } = useCreatedActions()

  const occurrencesRef = useRef<HTMLElement>(null)
  const pendingRef = useRef<HTMLElement>(null)

  function scrollTo(ref: RefObject<HTMLElement>) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if ((location.state as { scrollToOccurrence?: boolean } | null)?.scrollToOccurrence) {
      scrollTo(occurrencesRef)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <ContextualHeader />

      <ExecutiveSummaryCard
        text={executiveSummaryText}
        recommendations={executiveRecommendations}
        onAnalyzeCauses={() => scrollTo(occurrencesRef)}
        onViewActionPlan={() => scrollTo(pendingRef)}
        onAskCortex={() => askCortex('Por que o CMV aumentou?')}
      />

      <IndicatorsSection />

      <OccurrencesSection onCreateAction={createAction} sectionRef={occurrencesRef} />

      <CmvSection onOpenFullAnalysis={() => navigate('/cmv')} />

      <UnitsSection />

      <FinancialImpactSection onViewDetails={() => navigate('/cmv')} />

      <PurchasesSuppliersSection />

      <PendingSection createdActions={actions} sectionRef={pendingRef} />

      <ActivitySection />

      <QuickQuestionsSection />
    </div>
  )
}
