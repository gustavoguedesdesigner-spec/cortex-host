import { Drawer } from '@/components/ui/Drawer'
import { DataList } from '@/components/ui/DataList'
import { formatCurrencyBRL, formatDateFull, formatPercent } from '@/utils/format'
import { dataQualityLabel } from '@/utils/cmvConfidence'
import { computeNetworkPeriod } from '@/utils/cmvCalculations'
import type { CmvNetworkPeriod, DataQualityInfo } from '@/types'

/**
 * "Ver memória de cálculo" — transparência total: fórmula, valores
 * utilizados, origem, data, pendências e qualidade dos dados. O CMV
 * nunca deve ser uma caixa-preta.
 */
export function CmvCalculationDrawer({
  isOpen,
  onClose,
  period,
  quality,
}: {
  isOpen: boolean
  onClose: () => void
  period: CmvNetworkPeriod
  quality: DataQualityInfo
}) {
  const computed = computeNetworkPeriod(period)

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Memória de cálculo" subtitle={period.periodoLabel} widthClassName="w-full max-w-lg">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-label text-ink-tertiary mb-2">Fórmula — CMV real</p>
          <div className="rounded-md bg-surface-subtle p-3 text-support text-ink-secondary leading-relaxed">
            Custo real consumido = Estoque inicial + Compras líquidas + Transferências recebidas − Transferências enviadas − Estoque final ± Ajustes
            <br />
            CMV real = Custo real consumido ÷ Vendas líquidas × 100
          </div>
        </div>

        <DataList
          items={[
            { label: 'Vendas brutas', value: formatCurrencyBRL(period.vendasBrutas) },
            { label: 'Deduções (cancelamentos, descontos)', value: `− ${formatCurrencyBRL(period.deducoes)}` },
            { label: 'Vendas líquidas', value: formatCurrencyBRL(computed.vendasLiquidas) },
            { label: 'Estoque inicial', value: formatCurrencyBRL(period.estoqueInicial) },
            { label: 'Compras brutas', value: formatCurrencyBRL(period.comprasBrutas) },
            { label: 'Devoluções a fornecedores', value: `− ${formatCurrencyBRL(period.devolucoesFornecedores)}` },
            { label: 'Compras líquidas', value: formatCurrencyBRL(computed.comprasLiquidas) },
            { label: 'Transferências recebidas', value: formatCurrencyBRL(period.transferenciasRecebidas) },
            { label: 'Transferências enviadas', value: `− ${formatCurrencyBRL(period.transferenciasEnviadas)}` },
            { label: 'Estoque final', value: `− ${formatCurrencyBRL(period.estoqueFinal)}` },
            { label: 'Ajustes autorizados', value: formatCurrencyBRL(period.ajustesAutorizados) },
            { label: 'Custo real consumido', value: formatCurrencyBRL(computed.custoRealConsumido) },
            { label: 'CMV real', value: formatPercent(computed.cmvReal) },
          ]}
        />

        <div>
          <p className="text-label text-ink-tertiary mb-2">CMV teórico</p>
          <DataList
            items={[
              { label: 'Custo teórico (soma de qtd. vendida × custo padrão)', value: formatCurrencyBRL(period.custoTeorico) },
              { label: 'CMV teórico', value: formatPercent(computed.cmvTeorico) },
              { label: 'Meta de CMV', value: formatPercent(period.metaCmv) },
              { label: 'Custo correspondente à meta', value: `≈ ${formatCurrencyBRL(computed.custoCorrespondenteMeta)}` },
            ]}
          />
        </div>

        <div className="rounded-md bg-surface-subtle p-3">
          <p className="text-caption text-ink-tertiary mb-1">Qualidade dos dados</p>
          <p className="text-support text-ink-primary font-medium">
            {formatPercent(quality.percentual, 0)} — {dataQualityLabel[quality.classificacao]}
          </p>
          {quality.pendencias.length > 0 && (
            <ul className="mt-2 list-disc list-inside text-support text-ink-secondary">
              {quality.pendencias.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-caption text-ink-tertiary border-t border-border pt-3">
          Última atualização: {formatDateFull(period.ultimaAtualizacao)} · Valores arredondados para exibição — os cálculos internos usam
          precisão total.
        </p>
      </div>
    </Drawer>
  )
}
