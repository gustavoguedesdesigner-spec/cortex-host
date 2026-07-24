import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { DataList } from '@/components/ui/DataList'
import { CmvWeeklyChart } from '@/components/data-display/CmvWeeklyChart'
import { getCmvWeeklySeriesForUnit, cmvMeta } from '@/data/cmv-weekly-series'
import { formatCurrencyBRL, formatDateFull, formatPercent, formatPercentPoints } from '@/utils/format'
import type { Unit } from '@/types'

export function UnitDetailDrawer({ unit, onClose }: { unit: Unit | null; onClose: () => void }) {
  const navigate = useNavigate()
  if (!unit) return null

  const desvio = unit.cmvReal - unit.cmvTeorico
  const series = getCmvWeeklySeriesForUnit(unit)

  return (
    <Drawer isOpen={Boolean(unit)} onClose={onClose} title={unit.nome} widthClassName="w-full max-w-lg">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <StatusBadge level={unit.nivelAtencao} />
          <span className="text-support text-content-tertiary">{unit.cidade} · {unit.regiao}</span>
        </div>

        <DataList
          items={[
            { label: 'Gerente responsável', value: unit.gerente },
            { label: 'CMV teórico', value: formatPercent(unit.cmvTeorico) },
            { label: 'CMV real', value: formatPercent(unit.cmvReal) },
            {
              label: 'Desvio',
              value: <span className={desvio > 0 ? 'text-status-critical' : 'text-status-success'}>{formatPercentPoints(desvio)}</span>,
            },
            { label: 'Vendas no período', value: formatCurrencyBRL(unit.vendas) },
            { label: 'Compras no período', value: formatCurrencyBRL(unit.compras) },
            { label: 'Valor em estoque', value: formatCurrencyBRL(unit.valorEstoque) },
            { label: 'Perdas registradas', value: formatCurrencyBRL(unit.perdas) },
            { label: 'Alertas ativos', value: String(unit.numeroAlertas) },
            { label: 'Última contagem', value: formatDateFull(unit.ultimaContagem) },
          ]}
        />

        <div>
          <p className="text-card-title text-content-primary mb-2">Tendência de CMV — 8 semanas</p>
          <CmvWeeklyChart data={series} meta={cmvMeta} height={180} />
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            onClose()
            navigate('/unidades')
          }}
          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
        >
          Ver módulo completo de Unidades
        </Button>
      </div>
    </Drawer>
  )
}
