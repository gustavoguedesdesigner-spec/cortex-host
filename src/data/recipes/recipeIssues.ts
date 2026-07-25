import type { RecipeIssue } from '@/types'

/** Inconsistências demonstrativas (seção 18) — amostra representativa dos 4 tipos de conversão e das fichas incompletas/sem aprovação. */
export const recipeIssues: RecipeIssue[] = [
  { id: 'issue-01', recipeId: 'chope-ipa-500', tipo: 'sem_conversao', titulo: 'Conversão entre litros, barril e copos ausente', descricao: 'Chope IPA 500 ml não possui conversão configurada entre barril, litro e copo — impacta o cálculo de rendimento por barril.', impacto: 1980, severidade: 'alta' },
  { id: 'issue-02', recipeId: 'burger-veggie', tipo: 'sem_ficha', titulo: 'Produto vendido sem ficha completa', descricao: 'Burger Veggie está ativo no PDV, mas não possui ficha técnica publicada.', severidade: 'alta' },
  { id: 'issue-03', recipeId: 'salada-caesar', tipo: 'sem_ficha', titulo: 'Produto vendido sem ficha completa', descricao: 'Salada Caesar está ativa no PDV sem estrutura de ingredientes cadastrada.', severidade: 'alta' },
  { id: 'issue-04', recipeId: 'brownie-sorvete', tipo: 'sem_rendimento', titulo: 'Ficha sem rendimento definido', descricao: 'Brownie com Sorvete não possui rendimento nem porções configuradas.', severidade: 'media' },
  { id: 'issue-05', recipeId: 'burger-costela', tipo: 'custo_desatualizado', titulo: 'Custo atualizado há 42 dias', descricao: 'O custo do blend de carne bovina não é revisado há 42 dias — acima do limite de 30 dias.', impacto: 3420, severidade: 'alta' },
  { id: 'issue-06', recipeId: 'tomahawk-burger', tipo: 'subreceita_desatualizada', titulo: 'Rendimento da sub-receita não validado', descricao: 'O Blend de Carne utilizado no Tomahawk Burger não teve o rendimento revalidado na última atualização.', impacto: 2760, severidade: 'alta' },
  { id: 'issue-07', recipeId: 'batata-cheddar', tipo: 'custo_desatualizado', titulo: 'Custo do óleo desatualizado', descricao: 'O custo do óleo de soja utilizado na fritura está defasado em relação à última compra.', impacto: 1420, severidade: 'media' },
  { id: 'issue-08', recipeId: 'batata-cheddar', tipo: 'unidade_diferente_estoque', titulo: 'Porção de cheddar divergente entre unidades', descricao: 'A quantidade de cheddar aplicada diverge entre Moinhos e as demais unidades.', impacto: 1420, severidade: 'media' },
  { id: 'issue-09', recipeId: 'combo-costela-chope', tipo: 'sem_preco_venda', titulo: 'Preço de venda ausente para uma unidade', descricao: 'Combo Costela + Chope está sem preço configurado para Caxias Norte.', severidade: 'media' },
  { id: 'issue-10', recipeId: 'burger-veggie', tipo: 'sem_aprovacao', titulo: 'Ficha sem aprovação', descricao: 'Rascunho do Burger Veggie aguarda aprovação do Chef Executivo antes de prosseguir.', severidade: 'baixa' },
  { id: 'issue-11', recipeId: 'porcao-onion-rings', tipo: 'versao_expirada', titulo: 'Versão com vigência expirada', descricao: 'A versão 1.0 tem vigência encerrada e aguarda republicação.', severidade: 'baixa' },
]

export function getIssuesByRecipe(recipeId: string): RecipeIssue[] {
  return recipeIssues.filter((i) => i.recipeId === recipeId)
}
