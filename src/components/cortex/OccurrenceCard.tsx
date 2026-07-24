import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'
import { formatCurrencyBRL } from '@/utils/format'
import type { Occurrence, OccurrenceStatus } from '@/types'

const priorityConfig = {
  critica: { label: 'Crítica', classes: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  alta: { label: 'Alta', classes: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  media: { label: 'Média', classes: 'bg-info-soft text-info', dot: 'bg-info' },
}

const actionCreatingLabels = ['Criar ação', 'Criar requisição']

export function OccurrenceCard({
  occurrence,
  status,
  onToggleStatus,
  onCreateAction,
  onOpenUnit,
}: {
  occurrence: Occurrence
  status: OccurrenceStatus
  onToggleStatus: () => void
  onCreateAction: () => void
  onOpenUnit?: (unitName: string) => void
}) {
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
    if (actionCreatingLabels.includes(occurrence.botaoSecundario)) return onCreateAction()
    if (occurrence.botaoSecundario === 'Abrir unidade') {
      if (onOpenUnit && occurrence.unidades[0]) return onOpenUnit(occurrence.unidades[0])
      return navigate('/unidades')
    }
    showFeedback(`${occurrence.botaoSecundario}: concluído.`)
  }

  return (
    <div className={cn('flex flex-col gap-3 py-5 transition-opacity', analisada && 'opacity-55')}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-badge', priority.classes)}>
              <span className={cn('h-1.5 w-1.5 rounded-full', priority.dot)} aria-hidden="true" />
              {priority.label}
            </span>
            <span className="text-caption text-ink-tertiary">{occurrence.categoria}</span>
            {occurrence.impactoFinanceiro !== undefined && (
              <span className="text-caption tabular text-ink-secondary">
                · {occurrence.impactoDescricao ?? formatCurrencyBRL(occurrence.impactoFinanceiro)}
              </span>
            )}
          </div>

          <h3 className="text-card-title">{occurrence.titulo}</h3>
          <p className="max-w-3xl text-support leading-relaxed text-ink-secondary">{occurrence.descricao}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {occurrence.unidades.map((u) =>
              onOpenUnit && u !== 'Todas as unidades' ? (
                <button
                  key={u}
                  onClick={() => onOpenUnit(u)}
                  className="text-caption font-medium text-ink-secondary underline decoration-border underline-offset-4 transition-colors hover:text-accent"
                >
                  {u}
                </button>
              ) : (
                <span key={u} className="text-caption text-ink-tertiary">
                  {u}
                </span>
              ),
            )}
          </div>
        </div>

        <button
          onClick={onToggleStatus}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption font-medium transition-colors',
            analisada
              ? 'border-success/30 bg-success-soft text-success'
              : 'border-border text-ink-tertiary hover:border-border-strong hover:text-ink-secondary',
          )}
        >
          {analisada && <Check className="h-3 w-3" strokeWidth={2} />}
          {analisada ? 'Analisada' : 'Marcar como analisada'}
        </button>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 self-start text-caption text-ink-tertiary transition-colors hover:text-ink-secondary"
      >
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-180')} strokeWidth={1.7} />
        {expanded ? 'Ocultar detalhes' : 'Mais detalhes'}
      </button>

      {expanded && (
        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 rounded-md bg-surface-subtle p-4 sm:grid-cols-3">
          {occurrence.prazo && (
            <div>
              <dt className="text-caption text-ink-tertiary">Prazo</dt>
              <dd className="mt-0.5 text-support text-ink-primary">{occurrence.prazo}</dd>
            </div>
          )}
          {occurrence.responsavel && (
            <div>
              <dt className="text-caption text-ink-tertiary">Responsável</dt>
              <dd className="mt-0.5 text-support text-ink-primary">{occurrence.responsavel}</dd>
            </div>
          )}
          <div className="sm:col-span-1">
            <dt className="text-caption text-ink-tertiary">Ação recomendada</dt>
            <dd className="mt-0.5 text-support text-ink-primary">{occurrence.acaoRecomendada}</dd>
          </div>
        </dl>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            onToggleStatus()
            showFeedback(`${occurrence.botaoPrimario}: registrado.`)
          }}
        >
          {occurrence.botaoPrimario}
        </Button>
        <Button size="sm" variant="ghost" onClick={handleSecondary}>
          {occurrence.botaoSecundario}
        </Button>
        {feedback && <span className="animate-fade-in text-caption text-success">{feedback}</span>}
      </div>
    </div>
  )
}
