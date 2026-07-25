import { useNavigate } from 'react-router-dom'
import { CmvExecutiveSection } from './CmvExecutiveSection'
import { CmvIndicatorsStrip } from './CmvIndicatorsStrip'
import { CmvEvolutionSection } from './CmvEvolutionSection'
import { CmvBridgeSection } from './CmvBridgeSection'
import { CmvCategoryUnitImpactSection } from './CmvCategoryUnitImpactSection'
import { CmvMatrixSection } from './CmvMatrixSection'
import { CmvOpportunityPanel } from '@/components/cmv/CmvOpportunityPanel'
import { cmvNetworkPeriod, cmvDataQuality } from '@/data/cmv/cmvPeriod'
import { computeNetworkPeriod } from '@/utils/cmvCalculations'
import { useAppState } from '@/context/AppStateContext'

export function CmvOverviewTab() {
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const computed = computeNetworkPeriod(cmvNetworkPeriod)

  return (
    <div className="flex flex-col gap-8">
      <CmvExecutiveSection
        quality={cmvDataQuality}
        onInvestigarCausas={() => navigate('/cmv?tab=causas')}
        onVerEvidencias={() => navigate('/cmv?tab=causas')}
        onCriarPlano={() => navigate('/cmv?tab=causas')}
        onAskCortex={() => askCortex('Por que o CMV aumentou?', 'CMV consolidado')}
      />

      <CmvIndicatorsStrip computed={computed} meta={cmvNetworkPeriod.metaCmv} quality={cmvDataQuality} onOpenCalculation={() => navigate('/cmv')} />

      <CmvEvolutionSection
        onCompararPeriodos={() => navigate('/cmv/fechamentos?section=historico')}
        onVerUnidades={() => navigate('/cmv?tab=unidades')}
        onVerCategorias={() => navigate('/cmv?tab=categorias')}
      />

      <CmvBridgeSection custoTeorico={cmvNetworkPeriod.custoTeorico} custoReal={computed.custoRealConsumido} />

      <CmvCategoryUnitImpactSection
        onOpenCategory={(id) => navigate(`/cmv/categorias/${id}`)}
        onOpenUnit={(id) => navigate(`/cmv/unidades/${id}`)}
      />

      <CmvOpportunityPanel desvioVsTeorico={computed.impactoVsTeorico} impactoVsMeta={computed.impactoVsMeta} />

      <CmvMatrixSection />
    </div>
  )
}
