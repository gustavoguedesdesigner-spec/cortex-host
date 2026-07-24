import { useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { CortexLabel } from '@/components/cortex/CortexButton'
import { quickQuestions } from '@/data/quick-questions'

const fallback =
  'Resposta demonstrativa. A experiência conversacional completa do CORTEX, com acesso real aos dados da operação, será construída em uma etapa dedicada.'

export default function AssistenteCortex() {
  const [messages, setMessages] = useState<{ q: string; a: string }[]>([])
  const [question, setQuestion] = useState('')

  function handleSend(q: string) {
    if (!q.trim()) return
    const match = quickQuestions.find((item) => item.pergunta.toLowerCase() === q.trim().toLowerCase())
    setMessages((prev) => [...prev, { q: q.trim(), a: match?.resposta ?? fallback }])
    setQuestion('')
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Inteligência"
        title="Assistente CORTEX"
        description="Respostas em linguagem natural sobre vendas, CMV, estoque, compras e fornecedores de toda a rede."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          {messages.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border-strong px-6 py-14 text-center">
              <CortexLabel />
              <p className="mx-auto mt-3 max-w-sm text-support text-ink-tertiary">
                Pergunte algo sobre a operação ou escolha uma das sugestões ao lado.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border border-t border-border">
              {messages.map((m, i) => (
                <div key={i} className="flex flex-col gap-2 py-5">
                  <p className="text-card-title">{m.q}</p>
                  <p className="max-w-3xl text-support leading-relaxed text-ink-secondary">{m.a}</p>
                </div>
              ))}
            </div>
          )}

          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(question)
            }}
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Pergunte algo sobre a operação..."
              aria-label="Pergunta para o CORTEX"
              className="h-11 flex-1 rounded-md border border-border bg-surface px-3.5 text-body text-ink-primary outline-none transition-colors placeholder:text-ink-tertiary focus:border-accent focus:ring-1 focus:ring-accent/30"
            />
            <Button type="submit" size="lg" variant="primary" aria-label="Enviar pergunta" className="w-11 px-0">
              <ArrowUp className="h-4 w-4" strokeWidth={1.7} />
            </Button>
          </form>
        </div>

        <aside className="lg:col-span-4">
          <p className="mb-3 text-card-title text-ink-secondary">Sugestões</p>
          <ul className="flex flex-col divide-y divide-border border-t border-border">
            {quickQuestions.map((q) => (
              <li key={q.id}>
                <button
                  onClick={() => handleSend(q.pergunta)}
                  className="w-full py-3 text-left text-support text-ink-secondary transition-colors hover:text-accent"
                >
                  {q.pergunta}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-border pt-4 text-caption leading-relaxed text-ink-tertiary">
            A lógica conversacional completa, com leitura real dos dados operacionais, será desenvolvida em uma etapa futura
            do protótipo.
          </p>
        </aside>
      </div>
    </div>
  )
}
