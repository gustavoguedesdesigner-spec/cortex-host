import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUp, Maximize2 } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { demoUser } from '@/data/user'
import { quickQuestions } from '@/data/quick-questions'
import { findCmvQuickAnswer } from '@/data/cmv/cmvQuickQuestions'
import { findInventoryQuickAnswer } from '@/data/inventory/inventoryQuickQuestions'
import { findRecipeQuickAnswer } from '@/data/recipes/recipeQuickQuestions'
import { findAdminQuickAnswer } from '@/data/administration/adminQuickQuestions'
import { findPurchasingQuickAnswer } from '@/data/purchasing/purchasingQuickQuestions'
import { useAppState } from '@/context/AppStateContext'

const fallbackAnswer =
  'Esta é uma resposta demonstrativa. Nesta etapa do protótipo, o assistente ainda não processa perguntas livres — a experiência conversacional completa será construída em uma etapa dedicada.'

interface Turn {
  question: string
  answer: string
}

function findAnswer(question: string): string {
  const network = quickQuestions.find((q) => q.pergunta.trim().toLowerCase() === question.trim().toLowerCase())
  if (network) return network.resposta
  const cmv = findCmvQuickAnswer(question)
  if (cmv) return cmv.resposta
  const inventory = findInventoryQuickAnswer(question)
  if (inventory) return inventory.resposta
  const recipe = findRecipeQuickAnswer(question)
  if (recipe) return recipe.resposta
  const admin = findAdminQuickAnswer(question)
  if (admin) return admin.resposta
  const purchasing = findPurchasingQuickAnswer(question)
  if (purchasing) return purchasing.resposta
  return fallbackAnswer
}

export function CortexPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
        if (prev[prev.length - 1]?.question === cortexPrefillQuestion) return prev
        return [...prev, { question: cortexPrefillQuestion, answer: cortexDirectAnswer ?? findAnswer(cortexPrefillQuestion) }]
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, cortexPrefillQuestion, cortexDirectAnswer])

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Pergunte ao CORTEX"
      subtitle={cortexContextLabel ? `Contexto atual: ${cortexContextLabel}` : undefined}
      widthClassName="w-full max-w-[430px]"
      footer={
        <div className="flex flex-col gap-2.5">
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
              aria-label="Pergunta para o CORTEX"
              className="h-10 flex-1 rounded-md border border-border bg-surface px-3 text-support text-ink-primary outline-none transition-colors placeholder:text-ink-tertiary focus:border-accent focus:ring-1 focus:ring-accent/30"
            />
            <Button type="submit" variant="primary" aria-label="Enviar pergunta" className="w-10 px-0">
              <ArrowUp className="h-4 w-4" strokeWidth={1.7} />
            </Button>
          </form>
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={() => {
              onClose()
              navigate('/assistente')
            }}
            leftIcon={<Maximize2 className="h-3.5 w-3.5" strokeWidth={1.7} />}
          >
            Abrir Assistente completo
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <p className="text-support leading-relaxed text-ink-secondary">
          Olá, {demoUser.nome}. Posso explicar desvios de CMV, cruzar dados entre unidades e resumir a operação.
        </p>

        {history.length > 0 && (
          <div className="flex flex-col gap-5">
            {history.map((turn, i) => (
              <div key={i} className="flex flex-col gap-2 border-t border-border pt-4 first:border-t-0 first:pt-0">
                <p className="text-card-title text-ink-primary">{turn.question}</p>
                <p className="text-support leading-relaxed text-ink-secondary">{turn.answer}</p>
              </div>
            ))}
          </div>
        )}

        {history.length === 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-label text-ink-tertiary">Sugestões</span>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.slice(0, 4).map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleAsk(q.pergunta)}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-support text-ink-secondary transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-ink-primary"
                >
                  {q.pergunta}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  )
}
