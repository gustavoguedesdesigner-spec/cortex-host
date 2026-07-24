import { Sparkles } from 'lucide-react'
import type { QuickQuestion } from '@/types'

export function QuickQuestionsGrid({ questions, onAsk }: { questions: QuickQuestion[]; onAsk: (question: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {questions.map((q) => (
        <button
          key={q.id}
          onClick={() => onAsk(q.pergunta)}
          className="flex items-center gap-2.5 rounded-md border border-border-subtle bg-surface-2 px-3.5 py-3 text-left text-support text-content-secondary transition-colors hover:border-cortex-700/40 hover:bg-surface-3 hover:text-content-primary"
        >
          <Sparkles className="h-3.5 w-3.5 text-cortex-500 shrink-0" />
          {q.pergunta}
        </button>
      ))}
    </div>
  )
}
