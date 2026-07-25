import { useNavigate } from 'react-router-dom'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { purchasingSituation } from '@/data/purchasing/situation'
import { formatCurrencyCompactBRL, formatPercent } from '@/utils/format'

/** Faixa de 8 indicadores — cada um filtra a lista correspondente ao ser clicado. */
export function ComprasIndicatorsStrip() {
  const navigate = useNavigate()
  const s = purchasingSituation

  return (
    <MetricStrip>
      <MetricCard
        titulo="Compras líquidas"
        valor={formatCurrencyCompactBRL(s.comprasLiquidas)}
        status="attention"
        variacao={`+${formatPercent(s.comprasVariacaoAnterior)}`}
        direcaoVariacao="up"
        comparacao="vs. período anterior"
      />
      <MetricCard titulo="Pedidos em aberto" valor={String(s.pedidosEmAberto)} status="neutral" comparacao="ver todos" onClick={() => navigate('/compras/pedidos')} />
      <MetricCard
        titulo="Aguardando entrega"
        valor={String(s.pedidosAguardandoEntrega)}
        status="info"
        comparacao="filtrar pedidos"
        onClick={() => navigate('/compras/pedidos?status=aguardando_entrega')}
      />
      <MetricCard
        titulo="Parcialmente recebidos"
        valor={String(s.pedidosParcialmenteRecebidos)}
        status="attention"
        comparacao="filtrar pedidos"
        onClick={() => navigate('/compras/pedidos?status=parcialmente_recebido')}
      />
      <MetricCard
        titulo="Pedidos divergentes"
        valor={String(s.pedidosComDivergencia)}
        status="critical"
        comparacao="filtrar pedidos"
        onClick={() => navigate('/compras/pedidos?status=divergente')}
      />
      <MetricCard
        titulo="Aguardando aprovação"
        valor={String(s.requisicoesAguardandoAprovacao)}
        status="critical"
        comparacao="abrir aprovações"
        onClick={() => navigate('/compras/aprovacoes')}
      />
      <MetricCard
        titulo="Cotações prontas"
        valor={String(s.cotacoesProntasParaDecisao)}
        status="attention"
        comparacao="decidir agora"
        onClick={() => navigate('/compras/cotacoes')}
      />
      <MetricCard
        titulo="Economia em cotações"
        valor={formatCurrencyCompactBRL(s.economiaEstimadaCotacoes)}
        status="success"
        comparacao="ver oportunidades"
        onClick={() => navigate('/compras/cotacoes')}
      />
    </MetricStrip>
  )
}
