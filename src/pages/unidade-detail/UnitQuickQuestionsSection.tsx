import { SectionHeader } from '@/components/ui/SectionHeader'
import { Sparkles } from 'lucide-react'
import type { UnitQuickQA } from '@/types'

export function UnitQuickQuestionsSection({ perguntas, onAsk }: { perguntas: UnitQuickQA[]; onAsk: (pergunta: string, resposta: string) => void }) {
  return (
    <section>
      <SectionHeader title="Perguntas ao CORTEX" description="Perguntas rápidas com o contexto desta unidade já aplicado" />
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {perguntas.map((qa) => (
          <button
            key={qa.pergunta}
            onClick={() => onAsk(qa.pergunta, qa.resposta)}
            className="flex items-center gap-2.5 rounded-md border border-border bg-surface px-3.5 py-3 text-left text-support text-ink-secondary transition-colors hover:border-accent/40 hover:bg-surface-hover hover:text-ink-primary"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" />
            {qa.pergunta}
          </button>
        ))}
      </div>
    </section>
  )
}
