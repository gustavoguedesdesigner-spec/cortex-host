import { Tooltip } from '@/components/ui/Tooltip'
import { formatCurrencyCompactBRL, formatPercent, formatPercentPoints } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { Unit } from '@/types'

const dotByLevel = { saudavel: 'bg-success', atencao: 'bg-warning', critico: 'bg-danger' }

/**
 * Matriz de desempenho: eficiência operacional (x) × impacto financeiro (y).
 * Evidencia que vender muito não significa preservar margem.
 */
export function PerformanceMatrix({ units, onSelectUnit }: { units: Unit[]; onSelectUnit: (unit: Unit) => void }) {
  const maxImpacto = Math.max(...units.map((u) => u.impactoFinanceiro), 1)

  const eficiencia = (u: Unit) => Math.max(6, Math.min(94, 100 - (u.cmvReal - u.cmvTeorico) * 1000))
  const impacto = (u: Unit) => Math.max(6, Math.min(94, (u.impactoFinanceiro / maxImpacto) * 100))

  return (
    <div>
      <div className="relative aspect-[16/9] w-full rounded-xl border border-border bg-surface">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {['Monitorar', 'Prioridade', 'Saudável', 'Atenção'].map((label, i) => (
            <div
              key={label}
              className={cn(
                'flex p-3 text-caption text-ink-tertiary',
                i < 2 && 'border-b border-border',
                i % 2 === 0 && 'border-r border-border',
                i === 1 && 'justify-end',
                i === 2 && 'items-end',
                i === 3 && 'items-end justify-end',
              )}
            >
              {label}
            </div>
          ))}
        </div>

        <span className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-caption text-ink-tertiary">
          Impacto financeiro
        </span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-caption text-ink-tertiary">
          Eficiência operacional
        </span>

        {units.map((u) => (
          // A posição absoluta fica neste wrapper, não dentro do Tooltip: o span interno do Tooltip é `position: relative`
          // e, como o único filho seria retirado do fluxo, ele colapsaria para tamanho zero e viraria o bloco de
          // contenção do botão — todos os pontos cairiam exatamente na mesma coordenada.
          <div key={u.id} className="absolute -translate-x-1/2 translate-y-1/2" style={{ left: `${eficiencia(u)}%`, bottom: `${impacto(u)}%` }}>
            <Tooltip content={`${u.nome} · CMV ${formatPercent(u.cmvReal)} · ${formatPercentPoints(u.cmvReal - u.cmvTeorico)} · ${u.numeroAlertas} alertas · ${formatCurrencyCompactBRL(u.impactoFinanceiro)}`}>
              <button
                onClick={() => onSelectUnit(u)}
                className={cn('h-2.5 w-2.5 rounded-full ring-4 ring-surface transition-transform hover:scale-150', dotByLevel[u.nivelAtencao])}
                aria-label={`Ver ${u.nome}`}
              />
            </Tooltip>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {units.map((u) => (
          <button
            key={u.id}
            onClick={() => onSelectUnit(u)}
            className="flex items-center gap-1.5 text-caption text-ink-secondary transition-colors hover:text-ink-primary"
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', dotByLevel[u.nivelAtencao])} />
            {u.nomeCurto}
          </button>
        ))}
      </div>
    </div>
  )
}
