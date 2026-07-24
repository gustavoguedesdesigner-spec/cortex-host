import { useState } from 'react'
import { ArrowUp, Construction, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { CortexMark } from '@/components/cortex/CortexMark'

const quickPrompts = [
  'Explique o desvio de CMV da semana',
  'Quais unidades precisam de atenção hoje?',
  'Gere um resumo executivo do mês',
  'Onde estamos perdendo mais dinheiro?',
  'Compare o desempenho entre as unidades de Caxias',
]

export default function AssistenteCortex() {
  const [messages, setMessages] = useState<string[]>([])
  const [question, setQuestion] = useState('')

  function handleSend(q: string) {
    if (!q.trim()) return
    setMessages((prev) => [...prev, q.trim()])
    setQuestion('')
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Inteligência"
        title="Assistente CORTEX"
        description="Respostas em linguagem natural sobre vendas, CMV, estoque, compras e fornecedores de toda a rede."
      />

      <Card className="flex flex-col gap-4" padded>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cortex-900/60 text-cortex-400">
            <CortexMark className="h-[1.125rem] w-[1.125rem]" animated />
          </span>
          <div>
            <p className="text-card-title text-content-primary">CORTEX</p>
            <p className="text-caption text-content-tertiary">Assistente de inteligência operacional</p>
          </div>
        </div>

        <div className="min-h-[16rem] flex flex-col gap-3 rounded-md bg-surface-3/50 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
              <Sparkles className="h-5 w-5 text-cortex-500" />
              <p className="text-support text-content-tertiary max-w-sm">
                Pergunte algo sobre a operação ou escolha uma sugestão abaixo.
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="self-end max-w-[80%] rounded-lg rounded-tr-sm bg-cortex-500 text-[#181009] px-3.5 py-2.5 text-support font-medium">
                  {m}
                </div>
                <div className="max-w-[85%] rounded-lg rounded-tl-sm bg-surface-4 px-3.5 py-2.5 text-support text-content-secondary">
                  Resposta demonstrativa: a experiência conversacional completa do CORTEX, com acesso real aos dados da
                  operação, será construída em uma etapa dedicada do protótipo.
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="rounded-full border border-border-subtle bg-surface-2 px-3 py-1.5 text-support text-content-secondary transition-colors hover:border-border-strong hover:bg-surface-3 hover:text-content-primary"
            >
              {p}
            </button>
          ))}
        </div>

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
            className="h-11 flex-1 rounded-md bg-surface-2 border border-border px-3.5 text-body text-content-primary placeholder:text-content-tertiary outline-none focus:border-cortex-500 focus:ring-1 focus:ring-cortex-500/40"
          />
          <button
            type="submit"
            aria-label="Enviar pergunta"
            className="flex h-11 w-11 items-center justify-center rounded-md bg-cortex-500 text-[#181009] transition-colors hover:bg-cortex-400"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
      </Card>

      <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-surface-2/60 px-4 py-3.5 text-support text-content-tertiary">
        <Construction className="h-4 w-4 shrink-0 text-cortex-500" />
        A lógica conversacional completa, com leitura real dos dados operacionais, será desenvolvida em uma etapa
        futura do protótipo.
      </div>
    </div>
  )
}
