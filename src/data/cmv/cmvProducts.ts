import type { CmvProductData, CmvProductDetail } from '@/types'

/**
 * Produtos demonstrativos no nível de rede (agregado entre unidades).
 * Distintos dos "produtos críticos" por unidade já publicados em
 * unit-profiles.ts (aqueles são o recorte local; estes são o recorte
 * consolidado do módulo de CMV). Os seis primeiros somam os impactos
 * de maior destaque; os dois últimos completam a tabela sem inflar o
 * total consolidado (nunca representam a diferença completa).
 */
export const cmvProducts: CmvProductData[] = [
  {
    id: 'burger-costela',
    nome: 'Burger Costela',
    categoriaId: 'carnes',
    categoria: 'Carnes',
    unidadesVendidas: 760,
    vendas: 118000,
    custoTeorico: 38500,
    custoRealEstimado: 41920,
    impacto: 3420,
    tendencia: 'up',
    confianca: 'alta',
    fichaTecnicaVersao: 'v3 — revisada em 12/06/2026',
  },
  {
    id: 'tomahawk-burger',
    nome: 'Tomahawk Burger',
    categoriaId: 'carnes',
    categoria: 'Carnes',
    unidadesVendidas: 390,
    vendas: 79600,
    custoTeorico: 27600,
    custoRealEstimado: 30360,
    impacto: 2760,
    tendencia: 'up',
    confianca: 'alta',
    fichaTecnicaVersao: 'v2 — revisada em 03/05/2026',
  },
  {
    id: 'porcao-entrecot',
    nome: 'Porção de Entrecot',
    categoriaId: 'carnes',
    categoria: 'Carnes',
    unidadesVendidas: 252,
    vendas: 58200,
    custoTeorico: 19200,
    custoRealEstimado: 21310,
    impacto: 2110,
    tendencia: 'up',
    confianca: 'media',
    fichaTecnicaVersao: 'v2 — revisada em 03/05/2026',
  },
  {
    id: 'chope-ipa-500',
    nome: 'Chope IPA 500 ml',
    categoriaId: 'chope',
    categoria: 'Chope',
    unidadesVendidas: 3120,
    vendas: 64200,
    custoTeorico: 19800,
    custoRealEstimado: 21780,
    impacto: 1980,
    tendencia: 'up',
    confianca: 'media',
    fichaTecnicaVersao: 'v1 — vigente desde 10/02/2026',
  },
  {
    id: 'batata-cheddar',
    nome: 'Batata com Cheddar',
    categoriaId: 'oleos',
    categoria: 'Óleos e frituras',
    unidadesVendidas: 2380,
    vendas: 44100,
    custoTeorico: 12600,
    custoRealEstimado: 14020,
    impacto: 1420,
    tendencia: 'flat',
    confianca: 'baixa',
    fichaTecnicaVersao: 'v1 — vigente desde 22/01/2026',
  },
  {
    id: 'burger-bacon',
    nome: 'Burger Bacon',
    categoriaId: 'carnes',
    categoria: 'Carnes',
    unidadesVendidas: 470,
    vendas: 61200,
    custoTeorico: 17800,
    custoRealEstimado: 19080,
    impacto: 1280,
    tendencia: 'flat',
    confianca: 'baixa',
    fichaTecnicaVersao: 'v2 — revisada em 03/05/2026',
  },
  {
    id: 'burger-classico',
    nome: 'Burger Clássico',
    categoriaId: 'carnes',
    categoria: 'Carnes',
    unidadesVendidas: 610,
    vendas: 52400,
    custoTeorico: 15600,
    custoRealEstimado: 15940,
    impacto: 340,
    tendencia: 'flat',
    confianca: 'baixa',
    fichaTecnicaVersao: 'v3 — revisada em 12/06/2026',
  },
  {
    id: 'chope-pilsen-500',
    nome: 'Chope Pilsen 500 ml',
    categoriaId: 'chope',
    categoria: 'Chope',
    unidadesVendidas: 1980,
    vendas: 38900,
    custoTeorico: 11200,
    custoRealEstimado: 11380,
    impacto: 180,
    tendencia: 'flat',
    confianca: 'baixa',
    fichaTecnicaVersao: 'v1 — vigente desde 10/02/2026',
  },
]

/** Produtos de maior impacto — lista parcial, não cobre todo o desvio consolidado. */
export const cmvTopImpactProducts = [...cmvProducts].sort((a, b) => b.impacto - a.impacto).slice(0, 6)

export function getCmvProductById(id: string): CmvProductData | undefined {
  return cmvProducts.find((p) => p.id === id)
}

/** Detalhe aprofundado — apenas Burger Costela recebe profundidade total, conforme o produto de demonstração. */
export const cmvProductDetails: Record<string, CmvProductDetail> = {
  'burger-costela': {
    ...cmvProducts[0],
    custoPadrao: 18.4,
    precoVenda: 42.9,
    consumoTeoricoLabel: '1.180 kg previstos pela ficha técnica',
    consumoRealLabel: '1.297 kg consumidos no período',
    perdas: 'R$ 640 registrados — não explicam a diferença total',
    unidadesMaisAfetadas: ['Moinhos', 'Caxias Centro'],
    historico: [
      { semana: 'Sem. 1', consumoTeorico: 138, consumoReal: 142 },
      { semana: 'Sem. 2', consumoTeorico: 140, consumoReal: 148 },
      { semana: 'Sem. 3', consumoTeorico: 142, consumoReal: 158 },
      { semana: 'Sem. 4', consumoTeorico: 145, consumoReal: 162 },
      { semana: 'Sem. 5', consumoTeorico: 147, consumoReal: 168 },
      { semana: 'Sem. 6', consumoTeorico: 148, consumoReal: 172 },
      { semana: 'Sem. 7', consumoTeorico: 149, consumoReal: 174 },
      { semana: 'Sem. 8', consumoTeorico: 171, consumoReal: 173 },
    ],
    insumoId: 'carne-bovina-blend',
    explicacao:
      'O consumo de carne bovina para o Burger Costela está 9,9% acima do previsto pela ficha técnica, concentrado em Moinhos e Caxias Centro. As perdas registradas (R$ 640) não explicam a diferença total — os dados indicam porcionamento acima da ficha ou perda não integralmente registrada, mas a confirmação depende da contagem do estoque refrigerado pendente em Moinhos.',
  },
}

export function getCmvProductDetail(id: string): CmvProductDetail | undefined {
  return cmvProductDetails[id]
}
