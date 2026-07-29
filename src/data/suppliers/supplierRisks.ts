import type { SupplierRiskItem } from '@/types'

/** Riscos por fornecedor (secao 53-55) — taxonomia completa, aprofundado para Serra Alimentos. */
export const supplierRisks: SupplierRiskItem[] = [
  { id: 'risk-sa-1', supplierId: 'serra-alimentos', tipo: 'dependencia', titulo: 'Dependência em carnes', descricao: 'Serra Alimentos concentra 68% das compras da categoria — pouca margem de negociação e reposição em caso de ruptura.', probabilidade: 'alto', impacto: 'alto' },
  { id: 'risk-sa-2', supplierId: 'serra-alimentos', tipo: 'quantidade', titulo: 'Divergências recorrentes', descricao: 'Quatro divergências de quantidade e preço em 60 dias, concentradas em itens de carnes.', probabilidade: 'alto', impacto: 'medio' },
  { id: 'risk-sa-3', supplierId: 'serra-alimentos', tipo: 'documentacao', titulo: 'Documento próximo do vencimento', descricao: 'Licença Sanitária demonstrativa vence em 18 dias — pendência de renovação.', probabilidade: 'medio', impacto: 'baixo' },
  { id: 'risk-sa-4', supplierId: 'serra-alimentos', tipo: 'prazo', titulo: 'Atrasos', descricao: 'Atraso médio de 1,8 dia nas entregas, acima do padrão da rede.', probabilidade: 'medio', impacto: 'medio' },

  { id: 'risk-bs-1', supplierId: 'bebidas-sul', tipo: 'dependencia', titulo: 'Dependência em chope IPA', descricao: 'Bebidas Sul representa 76% do volume de chope IPA da rede.', probabilidade: 'alto', impacto: 'alto' },
  { id: 'risk-hb-1', supplierId: 'hortifruti-bahia', tipo: 'dependencia', titulo: 'Dependência em hortifrúti', descricao: 'Hortifruti Bahia representa 54% das compras da categoria.', probabilidade: 'medio', impacto: 'medio' },
  { id: 'risk-dg-1', supplierId: 'distribuidora-gaucha', tipo: 'preco', titulo: 'Reajustes não confirmados', descricao: 'Reajustes de preço aplicados sem confirmação prévia em pelo menos uma entrega recente.', probabilidade: 'medio', impacto: 'medio' },
  { id: 'risk-eb-1', supplierId: 'embalagens-bahia', tipo: 'documentacao', titulo: 'Homologação incompleta', descricao: 'Dois documentos obrigatórios pendentes impedem a conclusão da homologação.', probabilidade: 'alto', impacto: 'medio' },
  { id: 'risk-ts-1', supplierId: 'techsolutions-ba', tipo: 'continuidade', titulo: 'Fornecedor em homologação', descricao: 'Ainda sem histórico operacional suficiente para avaliação de continuidade.', probabilidade: 'medio', impacto: 'baixo' },
]

export function getRisksBySupplier(supplierId: string): SupplierRiskItem[] {
  return supplierRisks.filter((r) => r.supplierId === supplierId)
}
