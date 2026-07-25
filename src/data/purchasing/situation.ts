import { networkSummary } from '@/data/network-summary'

/**
 * Situação consolidada de Compras (seção 5) — mesmo padrão de constantes de
 * referência usado em administrationSituation/recipeSituation. comprasLiquidas
 * e comprasVariacaoAnterior reaproveitam networkSummary (já a fonte oficial
 * de "Compras do período" na Central de Operações) em vez de duplicar o
 * número — o somatório de `compras` por unidade em units.ts é um dado mais
 * antigo e não foi alterado nesta etapa, por instrução explícita.
 */
export const purchasingSituation = {
  comprasLiquidas: networkSummary.compras,
  comprasPeriodoAnterior: 401400,
  comprasVariacaoAnterior: networkSummary.comprasVariacaoAnterior,
  pedidosEmAberto: 14,
  pedidosAguardandoEntrega: 7,
  pedidosParcialmenteRecebidos: 5,
  pedidosComDivergencia: 2,
  requisicoesAguardandoAprovacao: 4,
  comprasEmergenciais: 3,
  cotacoesEmAndamento: 3,
  cotacoesProntasParaDecisao: 2,
  economiaEstimadaCotacoes: 12860,
  valorPedidosComDivergencia: 18400,
  prazoMedioAprovacaoLabel: '9h20',
  prazoMedioCompraDias: 3.8,
  prazoMedioEntregaDias: 2.6,
  variacaoMediaPrecos: 0.047,
  necessidadesIdentificadas: 12,
  requisicoesAbertas: 8,
  emCotacao: 3,
  pedidosEmitidos: 14,
  ultimaAtualizacaoLabel: 'há 12 minutos',
}

export const purchasingExecutiveSummaryText =
  'A rede comprou R$ 428.700 no período, 6,8% acima do período anterior. Quatro requisições aguardam aprovação e três compras emergenciais foram abertas nos últimos dias — sinal de que parte das decisões de reposição está chegando tarde. Duas cotações estão prontas para decisão, com economia estimada de R$ 12.860, e dois pedidos apresentam divergência de recebimento, somando R$ 18.400. O caso mais urgente é o chope IPA da Zona Norte, com cobertura de estoque abaixo do prazo de entrega do fornecedor.'

export const purchasingExecutiveRecommendations: string[] = [
  'Decidir a requisição crítica de chope IPA da Zona Norte antes do fim do dia',
  'Decidir a cotação de óleos e frituras — economia de R$ 2.860 disponível',
  'Cobrar o fornecedor Bebidas Sul pelo saldo pendente do pedido PO-4532',
  'Revisar o pedido divergente PO-4518, da Serra Alimentos',
]

export interface PurchasingAlert {
  id: string
  titulo: string
  descricao: string
  severidade: 'critical' | 'attention' | 'info'
  path: string
}

export const purchasingAlerts: PurchasingAlert[] = [
  {
    id: 'alerta-ruptura-chope',
    titulo: 'Risco de ruptura',
    descricao: 'Chope IPA da Zona Norte cobre 1,7 dia de consumo — abaixo do prazo de reposição do fornecedor (3 dias).',
    severidade: 'critical',
    path: '/compras/requisicoes/req-1842',
  },
  {
    id: 'alerta-divergencia-po4518',
    titulo: 'Pedido divergente',
    descricao: 'PO-4518 (Serra Alimentos) chegou com diferença de quantidade e preço — R$ 3.780 envolvidos.',
    severidade: 'critical',
    path: '/compras/pedidos/po-4518',
  },
  {
    id: 'alerta-duplicidade-cheddar',
    titulo: 'Possível duplicidade',
    descricao: 'Cidade Baixa e Serra abriram requisições de cheddar fatiado na mesma janela — provável consolidação.',
    severidade: 'attention',
    path: '/compras/requisicoes',
  },
  {
    id: 'alerta-cotacao-pronta',
    titulo: 'Cotação pronta para decisão',
    descricao: 'COT-0573 (óleos e frituras) reúne quatro respostas e economia potencial de R$ 2.860.',
    severidade: 'info',
    path: '/compras/cotacoes/cot-0573',
  },
  {
    id: 'alerta-entrega-parcial',
    titulo: 'Entrega parcial hoje',
    descricao: 'PO-4532 (Bebidas Sul) prevê a entrega do saldo de 80L às 14h.',
    severidade: 'attention',
    path: '/compras/pedidos/po-4532',
  },
]

export const purchasingRecommendationText =
  'Recomendo decidir nesta ordem: aprovar a requisição crítica do chope IPA, decidir a cotação de óleos e frituras já pronta, e cobrar o fornecedor do pedido com entrega parcial marcada para hoje.'

export interface PurchaseFlowStep {
  id: string
  label: string
  valor: number
  path: string
}

export const purchaseFlowSteps: PurchaseFlowStep[] = [
  { id: 'necessidades', label: 'Necessidades identificadas', valor: purchasingSituation.necessidadesIdentificadas, path: '/compras/necessidades' },
  { id: 'requisicoes', label: 'Requisições abertas', valor: purchasingSituation.requisicoesAbertas, path: '/compras/requisicoes' },
  { id: 'aguardando-aprovacao', label: 'Aguardando aprovação', valor: purchasingSituation.requisicoesAguardandoAprovacao, path: '/compras/aprovacoes' },
  { id: 'em-cotacao', label: 'Em cotação', valor: purchasingSituation.emCotacao, path: '/compras/cotacoes' },
  { id: 'pedidos-emitidos', label: 'Pedidos emitidos', valor: purchasingSituation.pedidosEmitidos, path: '/compras/pedidos' },
  { id: 'aguardando-entrega', label: 'Aguardando entrega', valor: purchasingSituation.pedidosAguardandoEntrega, path: '/compras/pedidos?status=aguardando_entrega' },
  { id: 'parcialmente-recebidos', label: 'Parcialmente recebidos', valor: purchasingSituation.pedidosParcialmenteRecebidos, path: '/compras/pedidos?status=parcialmente_recebido' },
  { id: 'divergentes', label: 'Divergentes', valor: purchasingSituation.pedidosComDivergencia, path: '/compras/pedidos?status=divergente' },
]
