import { computeRecipeFinancials } from './recipeCalculations'
import type { RecipeVersion } from '@/types'

export interface VersionDiffLine {
  campo: string
  anterior: string
  novo: string
}

/**
 * Compara duas versões de ficha — destaca apenas o que mudou
 * (ingredientes adicionados/removidos/alterados, custo, rendimento, CMV,
 * margem), conforme a seção "Comparação de versões".
 */
export function compararVersoes(anterior: RecipeVersion, nova: RecipeVersion): VersionDiffLine[] {
  const diffs: VersionDiffLine[] = []

  const anteriorFin = computeRecipeFinancials({
    ingredientes: anterior.ingredientes,
    porcoes: anterior.rendimento.porcoes,
    precoVenda: anterior.precoVenda,
    descontoMedioPercentual: anterior.descontoMedioPercentual,
    custoEmbalagem: anterior.custoEmbalagem,
  })
  const novaFin = computeRecipeFinancials({
    ingredientes: nova.ingredientes,
    porcoes: nova.rendimento.porcoes,
    precoVenda: nova.precoVenda,
    descontoMedioPercentual: nova.descontoMedioPercentual,
    custoEmbalagem: nova.custoEmbalagem,
  })

  const anterioresPorId = new Map(anterior.ingredientes.map((i) => [i.id, i]))
  const novosPorId = new Map(nova.ingredientes.map((i) => [i.id, i]))

  for (const ing of nova.ingredientes) {
    const antigo = anterioresPorId.get(ing.id)
    if (!antigo) {
      diffs.push({ campo: `Ingrediente adicionado — ${ing.nome}`, anterior: '—', novo: `${ing.quantidadeLiquida} ${ing.unidade}` })
    } else if (antigo.quantidadeLiquida !== ing.quantidadeLiquida || antigo.unidade !== ing.unidade) {
      diffs.push({ campo: `Quantidade — ${ing.nome}`, anterior: `${antigo.quantidadeLiquida} ${antigo.unidade}`, novo: `${ing.quantidadeLiquida} ${ing.unidade}` })
    }
  }
  for (const ing of anterior.ingredientes) {
    if (!novosPorId.has(ing.id)) {
      diffs.push({ campo: `Ingrediente removido — ${ing.nome}`, anterior: `${ing.quantidadeLiquida} ${ing.unidade}`, novo: '—' })
    }
  }

  if (anterior.precoVenda !== nova.precoVenda) {
    diffs.push({ campo: 'Preço de venda', anterior: `R$ ${anterior.precoVenda.toFixed(2)}`, novo: `R$ ${nova.precoVenda.toFixed(2)}` })
  }
  if (anteriorFin.custoPorcao.toFixed(2) !== novaFin.custoPorcao.toFixed(2)) {
    diffs.push({ campo: 'Custo por porção', anterior: `R$ ${anteriorFin.custoPorcao.toFixed(2)}`, novo: `R$ ${novaFin.custoPorcao.toFixed(2)}` })
  }
  if (anteriorFin.cmvTeorico.toFixed(3) !== novaFin.cmvTeorico.toFixed(3)) {
    diffs.push({ campo: 'CMV teórico', anterior: `${(anteriorFin.cmvTeorico * 100).toFixed(1)}%`, novo: `${(novaFin.cmvTeorico * 100).toFixed(1)}%` })
  }
  if (anterior.rendimento.porcoes !== nova.rendimento.porcoes) {
    diffs.push({ campo: 'Rendimento', anterior: `${anterior.rendimento.porcoes} porções`, novo: `${nova.rendimento.porcoes} porções` })
  }

  return diffs
}
