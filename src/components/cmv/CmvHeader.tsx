import { Calculator, ClipboardCheck, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Tooltip } from '@/components/ui/Tooltip'
import { periodOptions } from '@/data/periods'
import { useAppState, useUnitOptions } from '@/context/AppStateContext'
import { formatDateFull, formatPercent, formatRelativeShort } from '@/utils/format'
import { dataQualityLabel } from '@/utils/cmvConfidence'
import type { DataQualityInfo } from '@/types'

export type CmvComparisonMode = 'periodo_anterior' | 'mesmo_periodo_mes_anterior' | 'meta' | 'teorico' | 'media_rede'

export const cmvComparisonOptions: { value: CmvComparisonMode; label: string }[] = [
  { value: 'teorico', label: 'Vs. CMV teórico' },
  { value: 'meta', label: 'Vs. meta' },
  { value: 'periodo_anterior', label: 'Vs. período anterior' },
  { value: 'mesmo_periodo_mes_anterior', label: 'Vs. mesmo período do mês anterior' },
  { value: 'media_rede', label: 'Vs. média da rede' },
]

const qualityStatus = (classificacao: DataQualityInfo['classificacao']) =>
  classificacao === 'excelente' || classificacao === 'boa' ? ('success' as const) : classificacao === 'parcial' ? ('attention' as const) : ('critical' as const)

export function CmvHeader({
  quality,
  ultimaAtualizacao,
  ultimoFechamentoLabel,
  comparison,
  onComparisonChange,
  onOpenCalculation,
  onOpenClosing,
  closingCtaLabel,
}: {
  quality: DataQualityInfo
  ultimaAtualizacao: string
  ultimoFechamentoLabel: string
  comparison: CmvComparisonMode
  onComparisonChange: (v: CmvComparisonMode) => void
  onOpenCalculation: () => void
  onOpenClosing: () => void
  closingCtaLabel: string
}) {
  const { periodo, setPeriodo, unidadeSelecionada, setUnidadeSelecionada, askCortex } = useAppState()
  const unitOptions = useUnitOptions()

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        eyebrow="Operação"
        title="CMV"
        description="Entenda a diferença entre o consumo esperado e o consumo real, identifique as causas e priorize ações."
        actions={
          <>
            <Button size="sm" variant="secondary" leftIcon={<Calculator className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onOpenCalculation}>
              Ver memória de cálculo
            </Button>
            <Button size="sm" variant="navy" leftIcon={<ClipboardCheck className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onOpenClosing}>
              {closingCtaLabel}
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />}
              onClick={() => askCortex('Por que o CMV aumentou?', 'CMV consolidado')}
            >
              Pergunte ao CORTEX
            </Button>
          </>
        }
        meta={
          <p className="text-caption text-ink-tertiary">
            Último fechamento: {ultimoFechamentoLabel} · Atualizado {formatRelativeShort(ultimaAtualizacao)}
          </p>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select
          aria-label="Período"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value as typeof periodo)}
          options={periodOptions.map((p) => ({ value: p.id, label: p.label }))}
          className="w-44"
        />
        <Select
          aria-label="Unidade"
          value={unidadeSelecionada}
          onChange={(e) => setUnidadeSelecionada(e.target.value)}
          options={unitOptions.map((u) => ({ value: u.id, label: u.nome }))}
          className="w-52"
        />
        <Select
          aria-label="Comparar com"
          value={comparison}
          onChange={(e) => onComparisonChange(e.target.value as CmvComparisonMode)}
          options={cmvComparisonOptions}
          className="w-60"
        />
        <Tooltip content="A qualidade dos dados influencia a precisão e o nível de confiança das análises.">
          <span className="cursor-help">
            <IndicatorBadge status={qualityStatus(quality.classificacao)}>
              Qualidade dos dados: {formatPercent(quality.percentual, 0)} — {dataQualityLabel[quality.classificacao]}
            </IndicatorBadge>
          </span>
        </Tooltip>
      </div>
    </div>
  )
}

export function formatUltimaAtualizacaoTooltip(iso: string): string {
  return formatDateFull(iso)
}
