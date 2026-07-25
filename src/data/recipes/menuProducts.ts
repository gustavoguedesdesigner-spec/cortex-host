import type { MenuEngineeringProduct } from '@/types'
import { classificarQuadrante } from '@/utils/menuEngineering'

/**
 * Produtos representativos da Engenharia de Cardápio (seção 46). A
 * classificação comercial é derivada por função (classificarQuadrante),
 * usando popularidade e margem observada — reproduz exatamente as
 * classificações citadas no briefing (Burger Costela: Estrela; Burger
 * Clássico: Volume relevante/Cavalo de batalha; Tomahawk: Potencial com
 * revisão/Quebra-cabeça; Sobremesa Especial e Item Promocional idem).
 */
function buildProduct(p: Omit<MenuEngineeringProduct, 'classificacaoComercial'>): MenuEngineeringProduct {
  return { ...p, classificacaoComercial: classificarQuadrante(p.popularidadeIndice, p.margemObservada) }
}

export const menuEngineeringProducts: MenuEngineeringProduct[] = [
  buildProduct({
    id: 'menu-burger-costela', recipeId: 'burger-costela', nome: 'Burger Costela', categoria: 'Hambúrgueres',
    unidadesVendidas: 8400, receita: 410760, custoTeorico: 131880, custoRealEstimado: 145560,
    margemTeorica: 0.679, margemObservada: 0.646, popularidadeIndice: 0.85,
    complexidade: 'alta', desvioOperacional: 'alto', classificacaoOperacional: 'atencao', tendencia: 'up',
  }),
  buildProduct({
    id: 'menu-burger-classico', recipeId: 'burger-classico', nome: 'Burger Clássico', categoria: 'Hambúrgueres',
    unidadesVendidas: 7200, receita: 236880, custoTeorico: 73440, custoRealEstimado: 74880,
    margemTeorica: 0.69, margemObservada: 0.45, popularidadeIndice: 0.75,
    complexidade: 'baixa', desvioOperacional: 'baixo', classificacaoOperacional: 'ok', tendencia: 'flat',
  }),
  buildProduct({
    id: 'menu-tomahawk', recipeId: 'tomahawk-burger', nome: 'Tomahawk Burger', categoria: 'Hambúrgueres',
    unidadesVendidas: 2200, receita: 151580, custoTeorico: 50160, custoRealEstimado: 55440,
    margemTeorica: 0.669, margemObservada: 0.62, popularidadeIndice: 0.35,
    complexidade: 'alta', desvioOperacional: 'alto', classificacaoOperacional: 'atencao', tendencia: 'up',
  }),
  buildProduct({
    id: 'menu-entrecot', recipeId: 'porcao-entrecot', nome: 'Porção de Entrecot', categoria: 'Porções',
    unidadesVendidas: 2600, receita: 199940, custoTeorico: 63960, custoRealEstimado: 71760,
    margemTeorica: 0.68, margemObservada: 0.48, popularidadeIndice: 0.4,
    complexidade: 'media', desvioOperacional: 'medio', classificacaoOperacional: 'atencao', tendencia: 'flat',
  }),
  buildProduct({
    id: 'menu-chope-ipa', recipeId: 'chope-ipa-500', nome: 'Chope IPA 500 ml', categoria: 'Chopes',
    unidadesVendidas: 9600, receita: 219840, custoTeorico: 66240, custoRealEstimado: 72960,
    margemTeorica: 0.699, margemObservada: 0.62, popularidadeIndice: 0.8,
    complexidade: 'baixa', desvioOperacional: 'medio', classificacaoOperacional: 'atencao', tendencia: 'up',
  }),
  buildProduct({
    id: 'menu-sobremesa-especial', recipeId: 'sobremesa-especial', nome: 'Sobremesa Especial', categoria: 'Sobremesas',
    unidadesVendidas: 950, receita: 25555, custoTeorico: 7410, custoRealEstimado: 7520,
    margemTeorica: 0.71, margemObservada: 0.72, popularidadeIndice: 0.15,
    complexidade: 'media', desvioOperacional: 'baixo', classificacaoOperacional: 'ok', tendencia: 'flat',
  }),
  buildProduct({
    id: 'menu-item-promocional', recipeId: 'combo-costela-chope', nome: 'Item Promocional', categoria: 'Combos',
    unidadesVendidas: 6800, receita: 122400, custoTeorico: 98600, custoRealEstimado: 101200,
    margemTeorica: 0.19, margemObservada: 0.18, popularidadeIndice: 0.9,
    complexidade: 'baixa', desvioOperacional: 'baixo', classificacaoOperacional: 'ok', tendencia: 'flat',
  }),
  buildProduct({
    id: 'menu-batata-cheddar', recipeId: 'batata-cheddar', nome: 'Batata com Cheddar', categoria: 'Porções',
    unidadesVendidas: 5400, receita: 188460, custoTeorico: 60480, custoRealEstimado: 67320,
    margemTeorica: 0.679, margemObservada: 0.53, popularidadeIndice: 0.6,
    complexidade: 'baixa', desvioOperacional: 'medio', classificacaoOperacional: 'atencao', tendencia: 'up',
  }),
  buildProduct({
    id: 'menu-costelinha', recipeId: 'costelinha-suina', nome: 'Costelinha Suína', categoria: 'Pratos',
    unidadesVendidas: 1400, receita: 88060, custoTeorico: 27300, custoRealEstimado: 28100,
    margemTeorica: 0.69, margemObservada: 0.68, popularidadeIndice: 0.22,
    complexidade: 'alta', desvioOperacional: 'baixo', classificacaoOperacional: 'ok', tendencia: 'flat',
  }),
]

export function getMenuEngineeringProductById(id: string): MenuEngineeringProduct | undefined {
  return menuEngineeringProducts.find((p) => p.id === id)
}
