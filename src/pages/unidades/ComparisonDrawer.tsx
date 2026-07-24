import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { CortexMark } from '@/components/cortex/CortexMark'
import { cn } from '@/utils/cn'
import { formatCurrencyCompactBRL, formatPercent, formatPercentPoints } from '@/utils/format'
import type { Unit } from '@/types'

interface ComparisonRow {
  label: string
  getValue: (u: Unit) => string
  getRaw: (u: Unit) => number
  higherIsBetter: boolean
}

const rows: ComparisonRow[] = [
  { label: 'Vendas', getValue: (u) => formatCurrencyCompactBRL(u.vendas), getRaw: (u) => u.vendas, higherIsBetter: true },
  { label: 'CMV teórico', getValue: (u) => formatPercent(u.cmvTeorico), getRaw: (u) => u.cmvTeorico, higherIsBetter: false },
  { label: 'CMV real', getValue: (u) => formatPercent(u.cmvReal), getRaw: (u) => u.cmvReal, higherIsBetter: false },
  { label: 'Diferença', getValue: (u) => formatPercentPoints(u.cmvReal - u.cmvTeorico), getRaw: (u) => u.cmvReal - u.cmvTeorico, higherIsBetter: false },
  { label: 'Impacto financeiro', getValue: (u) => formatCurrencyCompactBRL(u.impactoFinanceiro), getRaw: (u) => u.impactoFinanceiro, higherIsBetter: false },
  { label: 'Perdas', getValue: (u) => formatCurrencyCompactBRL(u.perdas), getRaw: (u) => u.perdas, higherIsBetter: false },
  { label: 'Compras', getValue: (u) => formatCurrencyCompactBRL(u.compras), getRaw: (u) => u.compras, higherIsBetter: true },
  { label: 'Valor em estoque', getValue: (u) => formatCurrencyCompactBRL(u.valorEstoque), getRaw: (u) => u.valorEstoque, higherIsBetter: true },
  { label: 'Divergências de recebimento', getValue: (u) => String(u.divergenciasRecebimento), getRaw: (u) => u.divergenciasRecebimento, higherIsBetter: false },
  { label: 'Alertas ativos', getValue: (u) => String(u.numeroAlertas), getRaw: (u) => u.numeroAlertas, higherIsBetter: false },
  { label: 'Fornecedores em atenção', getValue: (u) => String(u.fornecedoresAtencao), getRaw: (u) => u.fornecedoresAtencao, higherIsBetter: false },
]

export function ComparisonDrawer({ units, onClose }: { units: Unit[]; onClose: () => void }) {
  const navigate = useNavigate()
  const isOpen = units.length >= 2

  const first = units[0]
  const second = units[1]
  const vendaDiffPct = first && second ? Math.round(((first.vendas - second.vendas) / second.vendas) * 100) : 0
  const impactoRatio = first && second && second.impactoFinanceiro > 0 ? (first.impactoFinanceiro / second.impactoFinanceiro).toFixed(1) : '—'

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Comparar unidades" widthClassName="w-full max-w-3xl">
      {isOpen && (
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-2.5 rounded-md bg-surface-3/60 border border-border-subtle px-3.5 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cortex-900/60 text-cortex-400">
              <CortexMark className="h-3.5 w-3.5" />
            </span>
            <p className="text-support text-content-secondary leading-relaxed">
              {first && second
                ? `${first.nomeCurto} vende ${Math.abs(vendaDiffPct)}% ${vendaDiffPct >= 0 ? 'mais' : 'menos'} que ${second.nomeCurto}, mas apresenta impacto financeiro estimado ${impactoRatio}x ${Number(impactoRatio) >= 1 ? 'maior' : 'menor'}. A principal diferença está nas categorias de carnes e chope.`
                : 'Selecione entre 2 e 4 unidades para comparar.'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-support">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left py-2 pr-4 text-label text-content-tertiary">Indicador</th>
                  {units.map((u) => (
                    <th key={u.id} className="text-right py-2 pl-4 text-label text-content-primary">{u.nomeCurto}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const values = units.map((u) => row.getRaw(u))
                  const best = row.higherIsBetter ? Math.max(...values) : Math.min(...values)
                  const worst = row.higherIsBetter ? Math.min(...values) : Math.max(...values)
                  return (
                    <tr key={row.label} className="border-b border-border-subtle last:border-b-0">
                      <td className="py-2 pr-4 text-content-tertiary">{row.label}</td>
                      {units.map((u) => {
                        const raw = row.getRaw(u)
                        const isBest = raw === best && best !== worst
                        const isWorst = raw === worst && best !== worst
                        return (
                          <td
                            key={u.id}
                            className={cn(
                              'py-2 pl-4 text-right font-medium',
                              isBest && 'text-status-success',
                              isWorst && 'text-status-critical',
                              !isBest && !isWorst && 'text-content-primary',
                            )}
                          >
                            {row.getValue(u)}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2">
            {units.map((u) => (
              <Button key={u.id} size="sm" variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => navigate(`/unidades/${u.id}`)}>
                Abrir {u.nomeCurto}
              </Button>
            ))}
          </div>
        </div>
      )}
    </Drawer>
  )
}
