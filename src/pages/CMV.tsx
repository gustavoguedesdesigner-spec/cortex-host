import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CmvHeader, type CmvComparisonMode } from '@/components/cmv/CmvHeader'
import { CmvInternalNav, type CmvTab } from '@/components/cmv/CmvInternalNav'
import { CmvCalculationDrawer } from '@/components/cmv/CmvCalculationDrawer'
import { CmvOverviewTab } from './cmv/CmvOverviewTab'
import { CmvUnitsTab } from './cmv/CmvUnitsTab'
import { CmvCategoriesTab } from './cmv/CmvCategoriesTab'
import { CmvProductsTab } from './cmv/CmvProductsTab'
import { CmvCausesTab } from './cmv/CmvCausesTab'
import { cmvNetworkPeriod, cmvDataQuality } from '@/data/cmv/cmvPeriod'
import { cmvCurrentPeriodStatus } from '@/data/cmv/cmvClosings'

const validTabs: CmvTab[] = ['visao-geral', 'unidades', 'categorias', 'produtos', 'causas']

export default function CMV() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [comparison, setComparison] = useState<CmvComparisonMode>('teorico')
  const [calculationOpen, setCalculationOpen] = useState(false)

  const tabParam = searchParams.get('tab') as CmvTab | null
  const activeTab: CmvTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'visao-geral'

  const closingCtaLabel = cmvCurrentPeriodStatus === 'aberto' ? 'Iniciar fechamento' : 'Revisar fechamento'

  return (
    <div className="flex flex-col gap-8">
      <CmvHeader
        quality={cmvDataQuality}
        ultimaAtualizacao={cmvNetworkPeriod.ultimaAtualizacao}
        ultimoFechamentoLabel={cmvNetworkPeriod.ultimoFechamentoLabel}
        comparison={comparison}
        onComparisonChange={setComparison}
        onOpenCalculation={() => setCalculationOpen(true)}
        onOpenClosing={() => navigate('/cmv/fechamentos')}
        closingCtaLabel={closingCtaLabel}
      />

      <CmvInternalNav active={activeTab} />

      {activeTab === 'visao-geral' && <CmvOverviewTab />}
      {activeTab === 'unidades' && <CmvUnitsTab />}
      {activeTab === 'categorias' && <CmvCategoriesTab />}
      {activeTab === 'produtos' && <CmvProductsTab />}
      {activeTab === 'causas' && <CmvCausesTab />}

      <CmvCalculationDrawer isOpen={calculationOpen} onClose={() => setCalculationOpen(false)} period={cmvNetworkPeriod} quality={cmvDataQuality} />
    </div>
  )
}
