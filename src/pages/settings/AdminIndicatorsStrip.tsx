import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { formatPercent } from '@/utils/format'
import { administrationSituation } from '@/data/administration/situation'

export function AdminIndicatorsStrip({ onSelect }: { onSelect: (filtro: string) => void }) {
  return (
    <MetricStrip className="xl:grid-cols-4">
      <MetricCard titulo="Usuários ativos" valor={String(administrationSituation.usuariosAtivos)} status="success" onClick={() => onSelect('ativo')} />
      <MetricCard titulo="Convites pendentes" valor={String(administrationSituation.convitesPendentes)} status="info" onClick={() => onSelect('convidado')} />
      <MetricCard titulo="Perfis" valor={String(administrationSituation.perfis)} status="neutral" onClick={() => onSelect('perfis')} />
      <MetricCard titulo="Acessos para revisar" valor={String(administrationSituation.acessosParaRevisar)} status="attention" onClick={() => onSelect('aguardando_revisao')} />
      <MetricCard titulo="Permissões críticas" valor={String(administrationSituation.permissoesCriticas)} status="critical" onClick={() => onSelect('criticas')} />
      <MetricCard titulo="Acessos temporários" valor={String(administrationSituation.acessosTemporarios)} status="attention" onClick={() => onSelect('acesso_temporario')} />
      <MetricCard titulo="Integrações com atenção" valor={String(administrationSituation.integracoesAtencao)} status="critical" onClick={() => onSelect('integracoes')} />
      <MetricCard titulo="Conformidade" valor={formatPercent(administrationSituation.conformidadeAcessos, 0)} status="attention" comparacao={`Meta: ${formatPercent(administrationSituation.metaConformidade, 0)}`} />
    </MetricStrip>
  )
}
