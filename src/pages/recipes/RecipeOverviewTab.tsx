import { useNavigate } from 'react-router-dom'
import { RecipeExecutiveSection } from './RecipeExecutiveSection'
import { RecipeIndicatorsStrip } from './RecipeIndicatorsStrip'
import { RecipeCategoryCoverageSection } from './RecipeCategoryCoverageSection'
import { RecipePrioritiesSection } from './RecipePrioritiesSection'
import { RecipeInconsistenciesSection } from './RecipeInconsistenciesSection'
import { useAppState } from '@/context/AppStateContext'

export function RecipeOverviewTab() {
  const navigate = useNavigate()
  const { askCortex } = useAppState()

  return (
    <div className="flex flex-col gap-8">
      <RecipeExecutiveSection
        onVerInconsistencias={() => navigate('/fichas-tecnicas/inconsistencias')}
        onAbrirCriticos={() => navigate('/fichas-tecnicas?tab=fichas&filtro=custo_desatualizado')}
        onCriarRevisao={() => navigate('/fichas-tecnicas/revisoes')}
        onAskCortex={() => askCortex('Quais fichas precisam ser revisadas?', 'Fichas técnicas consolidadas')}
      />

      <RecipeIndicatorsStrip onSelect={(filtro) => navigate(`/fichas-tecnicas?tab=fichas&filtro=${filtro}`)} />

      <RecipeCategoryCoverageSection onSelectCategory={() => navigate('/fichas-tecnicas?tab=fichas')} />

      <RecipePrioritiesSection />

      <RecipeInconsistenciesSection />
    </div>
  )
}
