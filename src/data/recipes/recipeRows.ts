import { recipes } from './recipes'
import { getRecipeVersionById } from './recipeVersions'
import { getIssuesByRecipe } from './recipeIssues'
import { computeRecipeFinancials, type RecipeFinancials } from '@/utils/recipeCalculations'
import type { Recipe, RecipeVersion } from '@/types'

export interface RecipeListRow {
  recipe: Recipe
  version: RecipeVersion | null
  financials: RecipeFinancials | null
  issuesCount: number
  impactoTotal: number
}

/** Junta Recipe + versão vigente + financeiro calculado — nunca hardcoded, sempre via computeRecipeFinancials. */
export function buildRecipeListRow(recipe: Recipe): RecipeListRow {
  const version = recipe.versaoVigenteId ? (getRecipeVersionById(recipe.versaoVigenteId) ?? null) : null
  const financials = version
    ? computeRecipeFinancials({
        ingredientes: version.ingredientes,
        porcoes: version.rendimento.porcoes,
        precoVenda: version.precoVenda,
        descontoMedioPercentual: version.descontoMedioPercentual,
        custoEmbalagem: version.custoEmbalagem,
      })
    : null
  const issues = getIssuesByRecipe(recipe.id)
  return {
    recipe,
    version,
    financials,
    issuesCount: issues.length,
    impactoTotal: issues.reduce((sum, i) => sum + (i.impacto ?? 0), 0),
  }
}

export const recipeListRows: RecipeListRow[] = recipes.map(buildRecipeListRow)

export function getRecipeListRow(recipeId: string): RecipeListRow | undefined {
  return recipeListRows.find((r) => r.recipe.id === recipeId)
}
