import { useNavigate } from 'react-router-dom'
import { ChevronRight, ClipboardPlus, GitCompareArrows, MoreHorizontal, Sparkles } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button, IconButton } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { units } from '@/data/units'
import { formatDateFull, formatRelativeShort } from '@/utils/format'
import type { Unit } from '@/types'

interface UnitHeaderProps {
  unit: Unit
  onCreateAction: () => void
  onCompare: () => void
  onAskCortex: () => void
}

export function UnitHeader({ unit, onCreateAction, onCompare, onAskCortex }: UnitHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex items-center gap-1.5 text-caption text-content-tertiary" aria-label="Breadcrumb">
        <button onClick={() => navigate('/')} className="hover:text-content-secondary">Central de Operações</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => navigate('/unidades')} className="hover:text-content-secondary">Unidades</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-content-secondary">{unit.nome}</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-page-title">{unit.nome}</h1>
            <StatusBadge level={unit.nivelAtencao} />
          </div>
          <p className="text-support text-content-secondary">
            {unit.cidade} · Gerente {unit.gerente} · Atualizado {formatRelativeShort(unit.ultimaSincronizacao)} · Última contagem{' '}
            {formatDateFull(unit.ultimaContagem)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Select
            aria-label="Trocar de unidade"
            value={unit.id}
            onChange={(e) => navigate(`/unidades/${e.target.value}`)}
            options={units.map((u) => ({ value: u.id, label: u.nomeCurto }))}
            className="w-40"
          />
          <Button size="sm" variant="primary" leftIcon={<ClipboardPlus className="h-3.5 w-3.5" />} onClick={onCreateAction}>
            Criar ação
          </Button>
          <IconButton icon={<GitCompareArrows className="h-4 w-4" />} label="Comparar unidade" onClick={onCompare} />
          <IconButton icon={<Sparkles className="h-4 w-4" />} label="Abrir Assistente" onClick={onAskCortex} />
          <IconButton icon={<MoreHorizontal className="h-4 w-4" />} label="Mais opções" />
        </div>
      </div>
    </div>
  )
}
