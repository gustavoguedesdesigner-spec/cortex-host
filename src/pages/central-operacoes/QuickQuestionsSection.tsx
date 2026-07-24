import { SectionHeader } from '@/components/ui/SectionHeader'
import { QuickQuestionsGrid } from '@/components/cortex/QuickQuestionsGrid'
import { quickQuestions } from '@/data/quick-questions'
import { useAppState } from '@/context/AppStateContext'

export function QuickQuestionsSection() {
  const { askCortex } = useAppState()

  return (
    <section>
      <SectionHeader title="Pergunte sobre sua operação" description="Perguntas rápidas para o CORTEX, com resposta imediata" />
      <QuickQuestionsGrid questions={quickQuestions} onAsk={askCortex} />
    </section>
  )
}
