import { Tooltip } from '@/components/ui/Tooltip'
import { menuClassificationLabel } from '@/utils/menuEngineering'
import { formatCurrencyCompactBRL, formatPercent } from '@/utils/format'
import { cn } from '@/utils/cn'
import type { MenuEngineeringProduct } from '@/types'

const dotByClassification = {
  estrela: 'bg-success',
  cavalo_batalha: 'bg-info',
  quebra_cabeca: 'bg-warning',
  cao: 'bg-danger',
}

/** Matriz de engenharia de cardápio: popularidade (x) × margem observada (y) — mesmo padrão visual da PerformanceMatrix de Unidades. */
export function MenuQuadrantMatrix({ products, onSelectProduct }: { products: MenuEngineeringProduct[]; onSelectProduct: (product: MenuEngineeringProduct) => void }) {
  const x = (p: MenuEngineeringProduct) => Math.max(6, Math.min(94, p.popularidadeIndice * 100))
  const y = (p: MenuEngineeringProduct) => Math.max(6, Math.min(94, p.margemObservada * 100))

  return (
    <div>
      <div className="relative aspect-[16/9] w-full rounded-lg border border-border bg-surface">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {(['Quebra-cabeça', 'Estrela', 'Cão', 'Cavalo de batalha'] as const).map((label, i) => (
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

        <span className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-caption text-ink-tertiary">Margem observada</span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-caption text-ink-tertiary">Popularidade</span>

        {products.map((p) => (
          // Posição absoluta no wrapper, não dentro do Tooltip — ver comentário equivalente em PerformanceMatrix.
          <div key={p.id} className="absolute -translate-x-1/2 translate-y-1/2" style={{ left: `${x(p)}%`, bottom: `${y(p)}%` }}>
            <Tooltip
              content={`${p.nome} · ${menuClassificationLabel[p.classificacaoComercial].classico} · popularidade ${formatPercent(p.popularidadeIndice, 0)} · margem ${formatPercent(p.margemObservada, 0)} · ${formatCurrencyCompactBRL(p.receita)}`}
            >
              <button
                onClick={() => onSelectProduct(p)}
                className={cn('h-2.5 w-2.5 rounded-full ring-4 ring-surface transition-transform hover:scale-150', dotByClassification[p.classificacaoComercial])}
                aria-label={`Ver ${p.nome}`}
              />
            </Tooltip>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {products.map((p) => (
          <button key={p.id} onClick={() => onSelectProduct(p)} className="flex items-center gap-1.5 text-caption text-ink-secondary transition-colors hover:text-ink-primary">
            <span className={cn('h-1.5 w-1.5 rounded-full', dotByClassification[p.classificacaoComercial])} />
            {p.nome}
          </button>
        ))}
      </div>
    </div>
  )
}
