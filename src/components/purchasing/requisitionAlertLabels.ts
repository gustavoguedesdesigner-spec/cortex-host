import type { RequisitionAlertType } from '@/types'

/** Rótulos dos alertas de requisição (seção 22) — sempre texto, nunca só cor. */
export const requisitionAlertLabels: Record<RequisitionAlertType, string> = {
  risco_ruptura: 'Risco de ruptura',
  sem_cotacao: 'Sem cotação registrada',
  acima_alcada: 'Acima da alçada do solicitante',
  fornecedor_nao_homologado: 'Fornecedor não homologado',
  variacao_preco: 'Variação de preço acima do esperado',
  possivel_duplicidade: 'Possível duplicidade',
  transferencia_disponivel: 'Transferência disponível entre unidades',
  compra_emergencial: 'Compra emergencial',
  abaixo_minimo: 'Abaixo do estoque mínimo',
  sem_estoque_alternativo: 'Sem estoque alternativo em outras unidades',
}
