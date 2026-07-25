import type { CmvCategoryData } from '@/types'

/**
 * Categorias de insumo do CMV. As seis primeiras compõem o impacto
 * financeiro consolidado (soma = R$ 27.460, idêntico a
 * src/data/financial-impact.ts — mesma fonte, mesmos valores). As três
 * últimas (Secos, Bebidas, Embalagens) não têm desvio relevante no
 * período, mas permanecem navegáveis — nenhuma categoria fica vazia.
 *
 * custoTeorico de todas as categorias soma exatamente aos R$ 302.060 do
 * período consolidado (src/data/cmv/cmvPeriod.ts).
 */
export const cmvCategories: CmvCategoryData[] = [
  {
    id: 'carnes',
    categoria: 'Carnes',
    custoTeorico: 110000,
    custoReal: 120820,
    impacto: 10820,
    unidadesAfetadas: ['Moinhos', 'Caxias Centro'],
    tendencia: 'up',
    confianca: 'alta',
    resumo: 'Maior categoria de desvio da rede — consumo consistentemente acima da ficha técnica em duas unidades.',
    explicacoesProvaveis: [
      'Porcionamento acima da ficha técnica',
      'Perdas não integralmente registradas',
      'Inventários refrigerados irregulares',
      'Rendimento abaixo do previsto',
      'Divergências em recebimentos',
    ],
    destacada: true,
  },
  {
    id: 'chope',
    categoria: 'Chope',
    custoTeorico: 48000,
    custoReal: 53460,
    impacto: 5460,
    unidadesAfetadas: ['Moinhos', 'Caxias Centro'],
    tendencia: 'up',
    confianca: 'media',
    resumo: 'Transferência entre unidades ainda não conciliada explica boa parte da diferença entre saída e venda.',
    explicacoesProvaveis: [
      'Transferência entre unidades pendente de conciliação',
      'Diferença entre saída registrada e venda',
      'Risco de ruptura de chope IPA em Cidade Baixa e Zona Norte',
    ],
    destacada: true,
  },
  {
    id: 'oleos',
    categoria: 'Óleos e frituras',
    custoTeorico: 18000,
    custoReal: 22620,
    impacto: 4620,
    unidadesAfetadas: ['Zona Norte', 'Moinhos'],
    tendencia: 'up',
    confianca: 'alta',
    resumo: 'Aumento de preço do fornecedor é a causa mais evidenciada — dado direto de nota fiscal.',
    explicacoesProvaveis: [
      'Aumento de preço de 9,4% no período',
      'Frequência de troca acima do padrão',
      'Compra emergencial fora do fornecedor habitual',
    ],
    destacada: true,
  },
  {
    id: 'hortifruti',
    categoria: 'Hortifrúti',
    custoTeorico: 32000,
    custoReal: 34940,
    impacto: 2940,
    unidadesAfetadas: ['Caxias Norte', 'Cidade Baixa'],
    tendencia: 'flat',
    confianca: 'media',
    resumo: 'Perdas e sazonalidade explicam a maior parte da diferença — sem tendência clara de piora.',
    explicacoesProvaveis: ['Perdas e rendimento abaixo do previsto', 'Sazonalidade de preços', 'Variação de preços de fornecedores locais'],
    destacada: true,
  },
  {
    id: 'laticinios',
    categoria: 'Laticínios',
    custoTeorico: 24000,
    custoReal: 26160,
    impacto: 2160,
    unidadesAfetadas: ['Caxias Norte', 'Cidade Baixa'],
    tendencia: 'down',
    confianca: 'media',
    resumo: 'Validade e perdas concentram a maior parte do desvio — em melhora nas últimas semanas.',
    explicacoesProvaveis: ['Perdas por validade', 'Diferença de porcionamento', 'Armazenamento em temperatura inadequada'],
    destacada: true,
  },
  {
    id: 'outros',
    categoria: 'Outros',
    custoTeorico: 10060,
    custoReal: 11520,
    impacto: 1460,
    unidadesAfetadas: ['Moinhos', 'Caxias Centro'],
    tendencia: 'flat',
    confianca: 'baixa',
    resumo: 'Diferença residual ainda não decomposta por categoria específica — sobretudo em Moinhos.',
    explicacoesProvaveis: ['Diferença residual entre consumo teórico e real não atribuída às demais categorias'],
    destacada: true,
  },
  {
    id: 'secos',
    categoria: 'Secos',
    custoTeorico: 22000,
    custoReal: 22000,
    impacto: 0,
    unidadesAfetadas: [],
    tendencia: 'flat',
    confianca: 'alta',
    resumo: 'Sem desvio relevante no período — consumo dentro do previsto pelas fichas técnicas.',
    explicacoesProvaveis: [],
    destacada: false,
  },
  {
    id: 'bebidas',
    categoria: 'Bebidas',
    custoTeorico: 26000,
    custoReal: 26000,
    impacto: 0,
    unidadesAfetadas: [],
    tendencia: 'flat',
    confianca: 'alta',
    resumo: 'Sem desvio relevante no período — preços e consumo estáveis.',
    explicacoesProvaveis: [],
    destacada: false,
  },
  {
    id: 'embalagens',
    categoria: 'Embalagens',
    custoTeorico: 12000,
    custoReal: 12000,
    impacto: 0,
    unidadesAfetadas: [],
    tendencia: 'flat',
    confianca: 'alta',
    resumo: 'Sem desvio relevante no período.',
    explicacoesProvaveis: [],
    destacada: false,
  },
]

export function getCmvCategoryById(id: string): CmvCategoryData | undefined {
  return cmvCategories.find((c) => c.id === id)
}

export const cmvCategoriesDestacadas = cmvCategories.filter((c) => c.destacada)
