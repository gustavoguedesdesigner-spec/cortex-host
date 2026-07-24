import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, CircleCheckBig, Circle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { formatCurrencyBRL } from '@/utils/format'
import type { Occurrence, OccurrenceStatus } from '@/types'

const priorityConfig = {
  critica: { label: 'Crítica', classes: 'bg-status-criticalBg text-status-critical border-status-critical/30' },
  alta: { label: 'Alta', classes: 'bg-status-attentionBg text-status-attention border-status-attention/30' },
  media: { label: 'Média', classes: 'bg-status-infoBg text-status-info border-status-info/30' },
}

const actionCreatingLabels = ['Criar ação', 'Criar requisição']

interface OccurrenceCardProps {
  occurrence: Occurrence
  status: OccurrenceStatus
  onToggleStatus: () => void
  onCreateAction: () => void
  onOpenUnit?: (unitName: string) => void
}

export function OccurrenceCard({ occurrence, status, onToggleStatus, onCreateAction, onOpenUnit }: OccurrenceCardProps) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const priority = priorityConfig[occurrence.prioridade]
  const analisada = status === 'analisada'

  function showFeedback(message: string) {
    setFeedback(message)
    window.setTimeout(() => setFeedback(null), 2600)
  }

  function handleSecondary() {
    if (actionCreatingLabels.includes(occurrence.botaoSecundario)) {
      onCreateAction()
      return
    }
    if (occurrence.botaoSecundario === 'Abrir unidade') {
      if (onOpenUnit && occurrence.unidades[0]) {
        onOpenUnit(occurrence.unidades[0])
      } else {
        navigate('/unidades')
      }
      return
    }
    showFeedback(`${occurrence.botaoSecundario}: concluído.`)
  }

  function handlePrimary() {
    onToggleStatus()
    showFeedback(`${occurrence.botaoPrimario}: registrado.`)
  }

  return (
    <div
      className={cn(
        'rounded-lg border p-4 flex flex-col gap-3 transition-colors',
        analisada ? 'border-border-subtle bg-surface-2/60' : 'border-border-subtle bg-surface-2',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-badge', priority.classes)}>
            {priority.label}
          </span>
          <span className="text-caption text-content-tertiary rounded-full bg-surface-3 border border-border-subtle px-2 py-0.5">
            {occurrence.categoria}
          </span>
        </div>
        <button
          onClick={onToggleStatus}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption font-medium shrink-0 transition-colors',
            analisada
              ? 'border-status-success/30 bg-status-successBg text-status-success'
              : 'border-border text-content-tertiary hover:text-content-secondary hover:border-border-strong',
          )}
        >
          {analisada ? <CircleCheckBig className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
          {analisada ? 'Analisada' : 'Marcar como analisada'}
        </button>
      </div>

      <div className={cn(analisada && 'opacity-70')}>
        <h3 className="text-card-title text-content-primary">{occurrence.titulo}</h3>
        <p className="text-support text-content-secondary mt-1">{occurrence.descricao}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {occurrence.unidades.map((u) =>
          onOpenUnit && u !== 'Todas as unidades' ? (
            <button
              key={u}
              onClick={() => onOpenUnit(u)}
              className="rounded-full bg-surface-3 border border-border-subtle px-2 py-0.5 text-caption text-content-secondary hover:border-cortex-700/40 hover:text-cortex-400 transition-colors"
            >
              {u} →
            </button>
          ) : (
            <span key={u} className="rounded-full bg-surface-3 border border-border-subtle px-2 py-0.5 text-caption text-content-tertiary">
              {u}
            </span>
          ),
        )}
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-caption text-content-tertiary hover:text-content-secondary self-start"
      >
        <ChevronDown className={cn('h-3 w-3 transition-transform', expanded && 'rotate-180')} />
        {expanded ? 'Ocultar detalhes' : 'Mais detalhes'}
      </button>

      {expanded && (
        <div className="grid grid-cols-2 gap-3 rounded-md bg-surface-3/60 p-3 sm:grid-cols-4">
          {occurrence.impactoFinanceiro !== undefined && (
            <div>
              <p className="text-caption text-content-tertiary">Impacto financeiro</p>
              <p className="text-support font-semibold text-status-critical mt-0.5">
                {occurrence.impactoDescricao ?? formatCurrencyBRL(occurrence.impactoFinanceiro)}
              </p>
            </div>
          )}
          {occurrence.prazo && (
            <div>
              <p className="text-caption text-content-tertiary">Prazo</p>
              <p className="text-support text-content-primary mt-0.5">{occurrence.prazo}</p>
            </div>
          )}
          {occurrence.responsavel && (
            <div>
              <p className="text-caption text-content-tertiary">Responsável / Fornecedor</p>
              <p className="text-support text-content-primary mt-0.5">{occurrence.responsavel}</p>
            </div>
          )}
          <div>
            <p className="text-caption text-content-tertiary">Ação recomendada</p>
            <p className="text-support text-content-primary mt-0.5">{occurrence.acaoRecomendada}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <Button size="sm" variant="primary" onClick={handlePrimary}>
          {occurrence.botaoPrimario}
        </Button>
        <Button size="sm" variant="secondary" onClick={handleSecondary}>
          {occurrence.botaoSecundario}
        </Button>
        {feedback && <span className="text-caption text-status-success animate-fade-in">{feedback}</span>}
      </div>
    </div>
  )
}
