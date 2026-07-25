import { SectionHeader } from '@/components/ui/SectionHeader'
import { CmvBridgeChart } from '@/components/cmv/CmvBridgeChart'
import { cmvBridgeSteps } from '@/data/cmv/cmvPeriod'
import { formatCurrencyBRL } from '@/utils/format'

export function CmvBridgeSection({ custoTeorico, custoReal }: { custoTeorico: number; custoReal: number }) {
  const totalDiferenca = cmvBridgeSteps.reduce((sum, s) => sum + s.valor, 0)

  return (
    <section>
      <SectionHeader
        title="Do CMV teórico ao CMV real"
        description={`Decomposição da diferença de ${formatCurrencyBRL(totalDiferenca)} entre o custo teórico e o custo real do período`}
      />
      <div className="rounded-lg border border-border bg-surface p-5">
        <CmvBridgeChart steps={cmvBridgeSteps} custoTeorico={custoTeorico} custoReal={custoReal} />
      </div>
    </section>
  )
}
