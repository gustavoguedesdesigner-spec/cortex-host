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
            className="flex items-center gap-2.5 rounded-md border border-border-subtle bg-surface-2 px-3.5 py-3 text-left text-support text-content-secondary transition-colors hover:border-cortex-700/40 hover:bg-surface-3 hover:text-content-primary"
          >
            <Sparkles className="h-3.5 w-3.5 text-cortex-500 shrink-0" />
            {qa.pergunta}
          </button>
        ))}
      </div>
    </section>
  )
}
