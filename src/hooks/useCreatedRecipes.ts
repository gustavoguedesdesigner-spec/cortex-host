import { useCallback } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import type { Recipe, RecipeIngredientLine, RecipeVersion } from '@/types'

export interface CreatedRecipeInput {
  nome: string
  categoriaId: string
  categoria: string
  codigoPdv: string
  responsavel: string
  unidades: string[]
  ingredientes: RecipeIngredientLine[]
  porcoes: number
  pesoPorcaoG: number
  precoVenda: number
  custoEmbalagem: number
}

export interface CreatedRecipeEntry {
  recipe: Recipe
  version: RecipeVersion
}

/** Fichas criadas pelo usuário no protótipo — persistidas localmente e mescladas às listas estáticas nas telas de leitura. */
export function useCreatedRecipes() {
  const [created, setCreated] = useLocalStorageState<CreatedRecipeEntry[]>('cortex-host:created-recipes', [])

  const createRecipe = useCallback(
    (input: CreatedRecipeInput) => {
      const id = `receita-user-${Date.now()}`
      const versionId = `${id}-v1.0`
      const nowIso = new Date().toISOString()

      const version: RecipeVersion = {
        id: versionId,
        recipeId: id,
        versao: '1.0',
        status: 'aguardando_aprovacao',
        criadoPor: input.responsavel,
        criadoEm: nowIso,
        vigenciaInicio: nowIso,
        unidadesAplicaveis: input.unidades,
        ingredientes: input.ingredientes,
        rendimento: {
          pesoBrutoG: input.pesoPorcaoG * input.porcoes,
          pesoLiquidoG: input.pesoPorcaoG * input.porcoes,
          porcoes: input.porcoes,
          pesoPorcaoG: input.pesoPorcaoG,
          unidadeRendimento: 'porcoes',
          perdaTecnicaPercentual: 0,
        },
        preparo: [],
        pontosCriticos: [],
        precoVenda: input.precoVenda,
        descontoMedioPercentual: 0,
        custoEmbalagem: input.custoEmbalagem,
        aprovacoes: [
          { ordem: 1, papel: 'Chef Executivo', status: 'pendente' },
          { ordem: 2, papel: 'Operações', status: 'pendente' },
        ],
      }

      const recipe: Recipe = {
        id,
        nome: input.nome,
        categoriaId: input.categoriaId,
        categoria: input.categoria,
        codigoPdv: input.codigoPdv,
        qualidade: 'bloqueada',
        versaoVigenteId: versionId,
        responsavel: input.responsavel,
        aprovadores: ['Chef Executivo', 'Operações'],
        unidades: input.unidades,
        vinculadoPdv: false,
        ultimaRevisaoIso: nowIso,
      }

      const entry: CreatedRecipeEntry = { recipe, version }
      setCreated((prev) => [entry, ...prev])
      return entry
    },
    [setCreated],
  )

  const getCreatedRecipeById = useCallback((id: string) => created.find((e) => e.recipe.id === id), [created])

  return { created, createRecipe, getCreatedRecipeById }
}
