import type { SupplierCategoryId, SupplierDependencyRisk, SupplierNetworkSummary } from '@/types'

/**
 * Situacao consolidada da base de Fornecedores (secao 8) — mesmo padrao de
 * constantes de referencia usado em purchasingSituation/knowledgeSummary:
 * numeros de rede fixos, independentes da amostra de fornecedores modelados
 * em detalhe neste arquivo (a base completa tem 32 cadastros; apenas os
 * mais relevantes para as jornadas de demonstracao estao em suppliers.ts).
 * Valor comprado no periodo (R$ 428.700) e o mesmo total ja usado em Compras
 * e na Central de Operacoes — mesma fonte de verdade em toda a aplicacao.
 */
export const supplierSummary: SupplierNetworkSummary = {
  cadastrados: 32,
  ativos: 28,
  emAtencao: 7,
  bloqueados: 2,
  emHomologacao: 2,
  inativos: 2,
  categoriasAtendidas: 10,
  estrategicos: 6,
  comDivergenciasAbertas: 5,
  documentosProximosVencimento: 8,
  negociacoesAbertas: 6,
  valorCompradoPeriodo: 428700,
  valorComprado12Meses: 4986400,
  pontualidadeMedia: 0.886,
  conformidadeQuantidadeMedia: 0.942,
  conformidadePrecoMedia: 0.928,
  conformidadeQualidadeMedia: 0.961,
}

export const categoryLabels: Record<SupplierCategoryId, string> = {
  carnes: 'Carnes',
  chope_cervejas: 'Chope e cervejas',
  bebidas: 'Bebidas',
  hortifruti: 'Hortifrúti',
  laticinios: 'Laticínios',
  secos: 'Secos',
  oleos_frituras: 'Óleos e frituras',
  embalagens: 'Embalagens',
  limpeza: 'Limpeza',
  servicos: 'Serviços',
  manutencao: 'Manutenção',
  tecnologia: 'Tecnologia',
}

export const knowledgeExecutiveSummaryText =
  'A base possui 28 fornecedores ativos. Sete exigem atenção e dois estão bloqueados. Serra Alimentos concentra quatro divergências abertas e pontualidade de 82%. Sul Foodservice apresenta o melhor equilíbrio entre preço, conformidade e prazo. Três categorias possuem dependência elevada de apenas um fornecedor.'

export const supplierExecutiveSummaryText = knowledgeExecutiveSummaryText

export const supplierExecutiveRecommendations: string[] = [
  'Revisar o plano corretivo da Serra Alimentos',
  'Renovar oito documentos próximos do vencimento',
  'Homologar alternativa para chope IPA',
  'Reduzir dependência em carnes',
  'Concluir seis negociações abertas',
]

/** Risco de dependencia por categoria (secao 25). */
export const dependencyRisks: SupplierDependencyRisk[] = [
  { categoria: 'carnes', categoriaLabel: 'Carnes', supplierId: 'serra-alimentos', supplierNome: 'Serra Alimentos', participacao: 0.68, risco: 'alto' },
  { categoria: 'chope_cervejas', categoriaLabel: 'Chope IPA', supplierId: 'bebidas-sul', supplierNome: 'Bebidas Sul', participacao: 0.76, risco: 'alto' },
  { categoria: 'hortifruti', categoriaLabel: 'Hortifrúti', supplierId: 'hortifruti-bahia', supplierNome: 'Hortifruti Bahia', participacao: 0.54, risco: 'medio' },
]

export const dependencyRiskNote =
  'Dependência elevada não significa necessariamente problema, mas reduz a flexibilidade de negociação e reposição.'
