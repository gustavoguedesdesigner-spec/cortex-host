/**
 * Formulas do modulo de Compras. Nenhum componente visual deve calcular
 * necessidade sugerida, score de fornecedor, preenchimento de pedido ou
 * alcada diretamente — sempre via estas funcoes.
 */
import { approvalLimitRules } from '@/data/administration/approvalLimits'
import type { ApprovalLimitRule } from '@/types'
import type { PurchaseOrderItem, QuotationScoreWeights, QuotationSupplierResponse } from '@/types'

/**
 * Necessidade sugerida = Ponto de reposição + consumo previsto até a entrega
 * − saldo disponível − estoque em trânsito − pedidos já confirmados.
 * Nunca negativa (uma necessidade sugerida abaixo de zero significa que a
 * unidade já está coberta) e nunca cria um pedido sozinha — apenas orienta.
 */
export function calcularNecessidadeSugerida(
  pontoReposicao: number,
  previsaoConsumoAteEntrega: number,
  saldoDisponivel: number,
  estoqueEmTransito: number,
  pedidosConfirmadosQuantidade: number,
): number {
  const bruto = pontoReposicao + previsaoConsumoAteEntrega - saldoDisponivel - estoqueEmTransito - pedidosConfirmadosQuantidade
  return Math.max(0, bruto)
}

export function calcularPreenchimentoPedido(quantidadeRecebida: number, quantidadePedida: number): number {
  if (quantidadePedida <= 0) return 0
  return Math.min(1, quantidadeRecebida / quantidadePedida)
}

export function calcularSaldoPendenteItem(item: PurchaseOrderItem): number {
  return Math.max(0, item.quantidadePedida - item.quantidadeRecebida)
}

export function calcularValorTotalPedido(itens: PurchaseOrderItem[]): number {
  return itens.reduce((soma, item) => soma + item.quantidadePedida * item.custoUnitarioAcordado, 0)
}

function normalizar(valor: number, minimo: number, maximo: number, maiorMelhor: boolean): number {
  if (maximo === minimo) return 1
  const proporcao = (valor - minimo) / (maximo - minimo)
  return maiorMelhor ? proporcao : 1 - proporcao
}

/**
 * Score comparativo de fornecedor (0-100) — pesos configuráveis pelo usuário
 * na tela de cotação. "Qualidade" usa a pontualidade histórica como proxy
 * (o protótipo não coleta uma nota de qualidade separada); "conformidade"
 * usa a conformidade histórica declarada do fornecedor.
 */
export function calcularScoreFornecedor(resposta: QuotationSupplierResponse, respostas: QuotationSupplierResponse[], pesos: QuotationScoreWeights): number {
  const validas = respostas.filter((r) => r.respondeu)
  if (validas.length === 0) return 0

  const precos = validas.map((r) => r.valorTotal)
  const prazos = validas.map((r) => r.prazoEntregaDias)
  const divergencias = validas.map((r) => r.divergenciasHistoricas)
  const pagamentos = validas.map((r) => r.prazoPagamentoDias)

  const scorePreco = normalizar(resposta.valorTotal, Math.min(...precos), Math.max(...precos), false)
  const scorePrazo = normalizar(resposta.prazoEntregaDias, Math.min(...prazos), Math.max(...prazos), false)
  const scoreConformidade = resposta.conformidadeHistorica
  const scoreQualidade = resposta.pontualidadeHistorica
  const scoreDivergencias = normalizar(resposta.divergenciasHistoricas, Math.min(...divergencias), Math.max(...divergencias), false)
  const scorePagamento = normalizar(resposta.prazoPagamentoDias, Math.min(...pagamentos), Math.max(...pagamentos), true)

  const somaPesos = pesos.preco + pesos.prazo + pesos.conformidade + pesos.qualidade + pesos.divergencias + pesos.pagamento
  if (somaPesos <= 0) return 0

  const scorePonderado =
    scorePreco * pesos.preco +
    scorePrazo * pesos.prazo +
    scoreConformidade * pesos.conformidade +
    scoreQualidade * pesos.qualidade +
    scoreDivergencias * pesos.divergencias +
    scorePagamento * pesos.pagamento

  return (scorePonderado / somaPesos) * 100
}

/** Resolve a alçada de aprovação aplicável a um pedido de compra, a partir das mesmas regras usadas em Administração. */
export function resolverAlcadaCompra(valor: number, emergencial: boolean): ApprovalLimitRule | undefined {
  if (emergencial) return approvalLimitRules.find((r) => r.id === 'alcada-compras-emergencial')
  return approvalLimitRules.find(
    (r) => r.modulo === 'Compras' && r.evento === 'Pedido de compra' && valor >= (r.valorMin ?? 0) && (r.valorMax === undefined || valor <= r.valorMax),
  )
}
