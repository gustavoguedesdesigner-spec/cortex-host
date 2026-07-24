import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CortexMark } from '@/components/cortex/CortexMark'
import { units } from '@/data/units'
import { networkSummary } from '@/data/network-summary'
import { formatCurrencyCompactBRL, formatPercent } from '@/utils/format'

interface NetworkSummaryBarProps {
  onViewCritical: () => void
  onCompareTopBottom: () => void
  onAskCortex: () => void
}

export function NetworkSummaryBar({ onViewCritical, onCompareTopBottom, onAskCortex }: NetworkSummaryBarProps) {
  const criticas = units.filter((u) => u.nivelAtencao === 'critico').length
  const atencao = units.filter((u) => u.nivelAtencao === 'atencao').length
  const saudaveis = units.filter((u) => u.nivelAtencao === 'saudavel').length

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-support">
        <span><b className="text-content-primary font-semibold">{units.length}</b> <span className="text-content-tertiary">unidades</span></span>
        <span><b className="text-status-critical font-semibold">{criticas}</b> <span className="text-content-tertiary">críticas</span></span>
        <span><b className="text-status-attention font-semibold">{atencao}</b> <span className="text-content-tertiary">em atenção</span></span>
        <span><b className="text-status-success font-semibold">{saudaveis}</b> <span className="text-content-tertiary">saudável</span></span>
        <span><b className="text-status-critical font-semibold">{networkSummary.totalOcorrencias}</b> <span className="text-content-tertiary">alertas ativos</span></span>
        <span><b className="text-content-primary font-semibold">{formatCurrencyCompactBRL(networkSummary.diferencaFinanceira)}</b> <span className="text-content-tertiary">de impacto estimado</span></span>
        <span><b className="text-content-primary font-semibold">{formatPercent(networkSummary.cmvReal)}</b> <span className="text-content-tertiary">CMV real · meta {formatPercent(networkSummary.cmvMeta)}</span></span>
      </div>

      <div className="flex items-start gap-2.5 rounded-md bg-surface-3/60 border border-border-subtle px-3.5 py-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cortex-900/60 text-cortex-400">
          <CortexMark className="h-3.5 w-3.5" />
        </span>
        <p className="text-support text-content-secondary leading-relaxed">
          Duas unidades concentram 62% do impacto financeiro estimado. Moinhos apresenta a maior diferença entre CMV real e
          teórico, enquanto Serra opera mais próxima do padrão esperado.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="primary" onClick={onViewCritical}>Ver unidades críticas</Button>
        <Button size="sm" variant="secondary" onClick={onCompareTopBottom}>Comparar Moinhos e Serra</Button>
        <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={onAskCortex}>Perguntar ao CORTEX</Button>
      </div>
    </Card>
  )
}
