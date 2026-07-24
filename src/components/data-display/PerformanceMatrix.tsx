import { Tooltip } from '@/components/ui/Tooltip'
import { formatCurrencyCompactBRL, formatPercent, formatPercentPoints } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Unit } from '@/types'

const statusDotClasses = {
  saudavel: 'bg-status-success border-status-success',
  atencao: 'bg-status-attention border-status-attention',
  critico: 'bg-status-critical border-status-critical',
}

interface PerformanceMatrixProps {
  units: Unit[]
  onSelectUnit: (unit: Unit) => void
}

/**
 * Matriz de desempenho: eficiencia operacional (eixo horizontal) vs.
 * impacto financeiro dos desvios (eixo vertical). Ajuda a perceber que
 * uma unidade pode vender muito e ainda assim destruir margem.
 */
export function PerformanceMatrix({ units, onSelectUnit }: PerformanceMatrixProps) {
  const maxImpacto = Math.max(...units.map((u) => u.impactoFinanceiro))

  function eficiencia(u: Unit) {
    const desvioPontos = (u.cmvReal - u.cmvTeorico) * 1000
    return Math.max(0, Math.min(100, 100 - desvioPontos))
  }

  function impactoPct(u: Unit) {
    return (u.impactoFinanceiro / maxImpacto) * 100
  }

  return (
    <div>
      <div className="relative w-full aspect-[16/10] rounded-lg border border-border-subtle bg-surface-2 overflow-hidden">
        {/* Quadrantes */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="border-r border-b border-border-subtle bg-status-attentionBg/40 flex items-start p-2">
            <span className="text-caption text-content-tertiary">Monitorar</span>
          </div>
          <div className="border-b border-border-subtle bg-status-criticalBg/40 flex items-start justify-end p-2">
            <span className="text-caption text-content-tertiary">Prioridade</span>
          </div>
          <div className="border-r border-border-subtle bg-status-successBg/30 flex items-end p-2">
            <span className="text-caption text-content-tertiary">Saudável</span>
          </div>
          <div className="bg-status-infoBg/30 flex items-end justify-end p-2">
            <span className="text-caption text-content-tertiary">Atenção</span>
          </div>
        </div>

        {/* Eixos */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-caption text-content-tertiary -rotate-90 origin-left whitespace-nowrap">
          ↑ Impacto financeiro
        </div>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-caption text-content-tertiary whitespace-nowrap">
          Eficiência operacional →
        </div>

        {/* Pontos das unidades */}
        {units.map((u) => {
          const x = eficiencia(u)
          const y = impactoPct(u)
          return (
            <Tooltip
              key={u.id}
              content={`${u.nome} · CMV ${formatPercent(u.cmvReal)} · Diferença ${formatPercentPoints(u.cmvReal - u.cmvTeorico)} · ${u.numeroAlertas} alertas · Impacto ${formatCurrencyCompactBRL(u.impactoFinanceiro)}`}
            >
              <button
                onClick={() => onSelectUnit(u)}
                className={cn(
                  'absolute h-3.5 w-3.5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 shadow-card hover:scale-125 transition-transform',
                  statusDotClasses[u.nivelAtencao],
                )}
                style={{ left: `${x}%`, bottom: `${Math.max(4, y)}%` }}
                aria-label={`Ver ${u.nome}`}
              />
            </Tooltip>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
        {units.map((u) => (
          <button key={u.id} onClick={() => onSelectUnit(u)} className="flex items-center gap-1.5 text-caption text-content-tertiary hover:text-content-secondary">
            <span className={cn('h-2 w-2 rounded-full border', statusDotClasses[u.nivelAtencao])} />
            {u.nomeCurto}
          </button>
        ))}
      </div>
    </div>
  )
}
