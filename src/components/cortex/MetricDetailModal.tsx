import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Sparkline } from '@/components/ui/Sparkline'
import { cn } from '@/utils/cn'

export interface MetricCompositionRow {
  label: string
  value: string
  critical?: boolean
}

export interface MetricDetailConfig {
  id: string
  titulo: string
  explicacao: string
  tendencia?: number[]
  composicao: MetricCompositionRow[]
  composicaoTitulo?: string
  moduloPath: string
  moduloLabel: string
}

export function MetricDetailModal({ metric, onClose }: { metric: MetricDetailConfig | null; onClose: () => void }) {
  const navigate = useNavigate()
  if (!metric) return null

  return (
    <Modal isOpen={Boolean(metric)} onClose={onClose} title={metric.titulo} size="md">
      <div className="flex flex-col gap-4">
        <p className="text-support text-ink-secondary leading-relaxed">{metric.explicacao}</p>

        {metric.tendencia && (
          <div className="flex items-center justify-between rounded-md bg-surface-subtle px-3.5 py-3">
            <span className="text-caption text-ink-tertiary">Tendência — últimas 8 semanas</span>
            <Sparkline data={metric.tendencia} width={110} height={30} />
          </div>
        )}

        <div>
          <p className="text-label text-ink-tertiary mb-2">{metric.composicaoTitulo ?? 'Composição por unidade'}</p>
          <div className="flex flex-col divide-y divide-border rounded-md border border-border overflow-hidden">
            {metric.composicao.map((row) => (
              <div key={row.label} className="flex items-center justify-between px-3.5 py-2.5 bg-surface">
                <span className="text-support text-ink-secondary">{row.label}</span>
                <span className={cn('text-support font-medium', row.critical ? 'text-danger' : 'text-ink-primary')}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            onClose()
            navigate(metric.moduloPath)
          }}
          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
        >
          {metric.moduloLabel}
        </Button>
      </div>
    </Modal>
  )
}
