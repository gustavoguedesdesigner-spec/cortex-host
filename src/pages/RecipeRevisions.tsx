import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { History } from 'lucide-react'
import { RecipeBreadcrumb } from '@/components/recipes/RecipeBreadcrumb'
import { RecipeInternalNav } from '@/components/recipes/RecipeInternalNav'
import { RecipeStatusBadge } from '@/components/recipes/RecipeStatusBadge'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { recipes, getRecipeById } from '@/data/recipes/recipes'
import { recipeVersions } from '@/data/recipes/recipeVersions'
import { useCreatedRecipes } from '@/hooks/useCreatedRecipes'
import { formatDateFull } from '@/utils/format'
import type { RecipeVersion } from '@/types'

const pendingStatuses = new Set<RecipeVersion['status']>(['rascunho', 'em_revisao', 'aguardando_aprovacao'])

export default function RecipeRevisions() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { created } = useCreatedRecipes()
  const isHistorico = searchParams.get('section') === 'historico'
  const receitaFoco = searchParams.get('receita')

  const allVersions = useMemo(() => [...created.map((e) => e.version), ...recipeVersions], [created])

  const rows = useMemo(() => {
    const base = isHistorico ? allVersions : allVersions.filter((v) => pendingStatuses.has(v.status))
    return [...base].sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
  }, [allVersions, isHistorico])

  const activeTabId = isHistorico ? 'historico' : 'revisoes'

  return (
    <div className="flex flex-col gap-6">
      <RecipeBreadcrumb trail={[{ label: isHistorico ? 'Histórico' : 'Revisões' }]} />

      <PageHeader
        eyebrow="Conhecimento"
        title={isHistorico ? 'Histórico de versões' : 'Revisões'}
        description={
          isHistorico
            ? 'Todas as versões registradas em todas as fichas técnicas, da mais recente à mais antiga.'
            : 'Versões em rascunho, em revisão ou aguardando aprovação em qualquer ficha técnica da rede.'
        }
      />

      <RecipeInternalNav active={activeTabId} />

      {receitaFoco && (
        <div className="rounded-lg border border-info-soft bg-info-soft/40 p-4 text-support text-info">
          Revisão solicitada para {getRecipeById(receitaFoco)?.nome ?? receitaFoco} — encontre a ficha na lista abaixo para continuar.
        </div>
      )}

      <section>
        <SectionHeader title={isHistorico ? `${rows.length} versões` : `${rows.length} revisões pendentes`} />

        {rows.length === 0 ? (
          <EmptyState
            icon={<History className="h-5 w-5" strokeWidth={1.7} />}
            title="Nenhuma revisão pendente na amostra"
            description="O catálogo demonstrativo cobre uma amostra representativa das fichas técnicas — as revisões e aprovações pendentes da rede completa aparecem nos indicadores da visão geral."
          />
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
            {rows.map((v) => {
              const recipe = recipes.find((r) => r.id === v.recipeId) ?? created.find((e) => e.recipe.id === v.recipeId)?.recipe
              const aprovadas = v.aprovacoes.filter((a) => a.status === 'aprovado').length
              return (
                <button
                  key={v.id}
                  onClick={() => navigate(`/fichas-tecnicas/${v.recipeId}`)}
                  className="flex flex-col gap-1.5 px-4 py-3 text-left transition-colors hover:bg-surface-hover sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-support font-medium text-ink-primary">{recipe?.nome ?? v.recipeId}</p>
                      <span className="text-caption text-ink-tertiary">Versão {v.versao}</span>
                      <RecipeStatusBadge status={v.status} />
                    </div>
                    <p className="mt-0.5 text-caption text-ink-tertiary">
                      Criada por {v.criadoPor} em {formatDateFull(v.criadoEm)} · {aprovadas}/{v.aprovacoes.length} aprovações concluídas
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
