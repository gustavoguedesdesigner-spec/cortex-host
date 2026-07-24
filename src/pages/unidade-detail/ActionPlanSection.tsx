import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ClipboardCheck } from 'lucide-react'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/utils/cn'
import type { UnitActionItem } from '@/types'

const priorityClasses = {
  critica: 'bg-status-criticalBg text-status-critical border-status-critical/30',
  alta: 'bg-status-attentionBg text-status-attention border-status-attention/30',
  media: 'bg-status-infoBg text-status-info border-status-info/30',
}

const statusLabel = {
  nao_iniciado: 'Não iniciado',
  em_andamento: 'Em andamento',
  aguardando: 'Aguardando',
  concluido: 'Concluído',
}

export function ActionPlanSection({ acoes, onCreateAction }: { acoes: UnitActionItem[]; onCreateAction: () => void }) {
  return (
    <section>
      <SectionHeader
        title="Plano de ação da unidade"
        description="Ações abertas, atrasadas e pendências automáticas"
        actions={<Button size="sm" variant="primary" onClick={onCreateAction}>Criar plano de ação</Button>}
      />
      {acoes.length === 0 ? (
        <EmptyState icon={<ClipboardCheck className="h-5 w-5" />} title="Nenhuma ação aberta" description="Esta unidade não possui ações pendentes no momento." />
      ) : (
        <div className="flex flex-col gap-3">
          {acoes.map((a) => (
            <div key={a.id} className="rounded-lg border border-border-subtle bg-surface-2 p-4 flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('rounded-full border px-2 py-0.5 text-badge', priorityClasses[a.prioridade])}>
                    {a.prioridade === 'critica' ? 'Crítica' : a.prioridade === 'alta' ? 'Alta' : 'Média'}
                  </span>
                  <span className="text-caption text-content-tertiary rounded-full bg-surface-3 border border-border-subtle px-2 py-0.5">
                    {a.escopo === 'local' ? 'Ação local' : 'Ação global'}
                  </span>
                </div>
                <span className="text-caption text-content-tertiary shrink-0">{statusLabel[a.status]}</span>
              </div>
              <p className="text-support font-medium text-content-primary">{a.titulo}</p>
              <p className="text-caption text-content-tertiary">
                {a.responsavel} · Prazo: {a.prazoLabel} · Origem: {a.origem}
              </p>
              {a.progresso !== undefined && <ProgressBar value={a.progresso / 100} status="attention" label={`${a.progresso}% concluído`} />}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
