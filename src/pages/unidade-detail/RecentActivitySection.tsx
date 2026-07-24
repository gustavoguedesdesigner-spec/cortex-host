import { useState } from 'react'
import { Activity, ArrowLeftRight, ClipboardList, DollarSign, FileText, MessageSquare, PackageSearch, TriangleAlert } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Select } from '@/components/ui/Select'
import { formatRelativeShort } from '@/utils/format'
import type { UnitActivityEvent } from '@/types'

const iconByType: Record<string, typeof Activity> = {
  perda: TriangleAlert,
  recebimento: FileText,
  contagem: ClipboardList,
  ficha_tecnica: FileText,
  transferencia: ArrowLeftRight,
  comentario: MessageSquare,
  compra: DollarSign,
  estoque: PackageSearch,
  alerta: TriangleAlert,
}

export function RecentActivitySection({ eventos }: { eventos: UnitActivityEvent[] }) {
  const [filtro, setFiltro] = useState('todos')
  const tipos = Array.from(new Set(eventos.map((e) => e.tipo)))
  const filtrados = filtro === 'todos' ? eventos : eventos.filter((e) => e.tipo === filtro)

  return (
    <section>
      <SectionHeader
        title="Atividade recente"
        description="Últimos eventos relevantes desta unidade"
        actions={
          <Select
            aria-label="Filtrar por tipo"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            options={[{ value: 'todos', label: 'Todos os tipos' }, ...tipos.map((t) => ({ value: t, label: t.replace('_', ' ') }))]}
            className="w-44"
          />
        }
      />
      <Card padded={false}>
        <ul className="flex flex-col divide-y divide-border">
          {filtrados.map((e, i) => {
            const Icon = iconByType[e.tipo] ?? Activity
            return (
              <li key={i} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-ink-tertiary">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-support text-ink-secondary truncate">
                    <span className="font-medium text-ink-primary">{e.usuario}</span> {e.acao}
                  </p>
                </div>
                <span className="text-caption text-ink-tertiary shrink-0">{formatRelativeShort(e.horario)}</span>
              </li>
            )
          })}
        </ul>
      </Card>
    </section>
  )
}
