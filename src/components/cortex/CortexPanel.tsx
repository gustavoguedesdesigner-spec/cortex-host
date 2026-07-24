import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp, Maximize2 } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { demoUser } from '@/data/user'
import { quickQuestions } from '@/data/quick-questions'
import { useAppState } from '@/context/AppStateContext'
import { CortexMark } from './CortexMark'

const fallbackAnswer =
  'Esta é uma resposta demonstrativa. Nesta etapa do protótipo, o assistente ainda não processa perguntas livres — a experiência conversacional completa, com acesso real aos dados de CMV, estoque, compras e recebimento, será construída em uma etapa dedicada.'

interface Turn {
  question: string
  answer: string
}

function findAnswer(question: string): string {
  const match = quickQuestions.find((q) => q.pergunta.trim().toLowerCase() === question.trim().toLowerCase())
  return match?.resposta ?? fallbackAnswer
}

interface CortexPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CortexPanel({ isOpen, onClose }: CortexPanelProps) {
  const navigate = useNavigate()
  const { cortexPrefillQuestion, cortexContextLabel, cortexDirectAnswer } = useAppState()
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState<Turn[]>([])

  function handleAsk(q: string) {
    setHistory((prev) => [...prev, { question: q, answer: findAnswer(q) }])
    setQuestion('')
  }

  useEffect(() => {
    if (isOpen && cortexPrefillQuestion) {
      setHistory((prev) => {
        const alreadyLast = prev[prev.length - 1]?.question === cortexPrefillQuestion
        if (alreadyLast) return prev
        return [...prev, { question: cortexPrefillQuestion, answer: cortexDirectAnswer ?? findAnswer(cortexPrefillQuestion) }]
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, cortexPrefillQuestion, cortexDirectAnswer])

  function handleOpenFull() {
    onClose()
    navigate('/assistente')
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Pergunte ao CORTEX" widthClassName="w-full max-w-sm">
      <div className="flex h-full flex-col gap-5">
        {cortexContextLabel && (
          <span className="self-start rounded-full bg-cortex-900/50 border border-cortex-700/40 px-2.5 py-1 text-caption font-medium text-cortex-200">
            Contexto atual: {cortexContextLabel}
          </span>
        )}
        <div className="flex items-start gap-3 rounded-md bg-surface-3 p-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cortex-900/60 text-cortex-400">
            <CortexMark className="h-[1.125rem] w-[1.125rem]" animated />
          </span>
          <p className="text-support text-content-secondary">
            Olá, {demoUser.nome}. Posso explicar desvios de CMV, cruzar dados entre unidades e resumir a operação. O que você
            quer entender agora?
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex flex-col gap-4">
            {history.map((turn, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="self-end max-w-[85%] rounded-lg rounded-tr-sm bg-cortex-500 text-[#181009] px-3.5 py-2.5 text-support font-medium">
                  {turn.question}
                </div>
                <div className="max-w-[92%] rounded-lg rounded-tl-sm bg-surface-3 px-3.5 py-2.5 text-support text-content-secondary leading-relaxed">
                  {turn.answer}
                </div>
              </div>
            ))}
          </div>
        )}

        {history.length === 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-label text-content-tertiary">Sugestões</span>
            {quickQuestions.slice(0, 4).map((q) => (
              <button
                key={q.id}
                onClick={() => handleAsk(q.pergunta)}
                className="rounded-md border border-border-subtle bg-surface-2 px-3.5 py-2.5 text-left text-support text-content-secondary transition-colors hover:border-border-strong hover:bg-surface-3 hover:text-content-primary"
              >
                {q.pergunta}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-3">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (question.trim()) handleAsk(question.trim())
            }}
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Pergunte algo sobre a operação..."
              className="h-10 flex-1 rounded-md bg-surface-2 border border-border px-3 text-body text-content-primary placeholder:text-content-tertiary outline-none focus:border-cortex-500 focus:ring-1 focus:ring-cortex-500/40"
            />
            <Button type="submit" size="md" variant="primary" aria-label="Enviar pergunta" className="px-3">
              <ArrowUp className="h-4 w-4" />
            </Button>
          </form>
          <Button variant="secondary" size="sm" onClick={handleOpenFull} leftIcon={<Maximize2 className="h-3.5 w-3.5" />}>
            Abrir Assistente completo
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
