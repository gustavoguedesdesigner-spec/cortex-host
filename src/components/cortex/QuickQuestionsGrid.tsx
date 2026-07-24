import type { QuickQuestion } from '@/types'

/** Chips neutros — sem aparência de chatbot genérico. */
export function QuickQuestionsGrid({ questions, onAsk }: { questions: QuickQuestion[]; onAsk: (question: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q) => (
        <button
          key={q.id}
          onClick={() => onAsk(q.pergunta)}
          className="rounded-full border border-border bg-surface px-3.5 py-2 text-support text-ink-secondary transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-ink-primary"
        >
          {q.pergunta}
        </button>
      ))}
    </div>
  )
}
