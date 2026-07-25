import { ShieldAlert, UsersRound } from 'lucide-react'
import { ExecutiveSummaryCard } from '@/components/cortex/ExecutiveSummaryCard'
import { Button } from '@/components/ui/Button'
import { formatPercent } from '@/utils/format'
import { administrationExecutiveRecommendations, administrationExecutiveSummaryText, administrationSituation } from '@/data/administration/situation'

export function AdminExecutiveSection({
  onRevisarAcessos,
  onVerIntegracoes,
  onAbrirAuditoria,
  onAskCortex,
}: {
  onRevisarAcessos: () => void
  onVerIntegracoes: () => void
  onAbrirAuditoria: () => void
  onAskCortex: () => void
}) {
  return (
    <ExecutiveSummaryCard
      text={administrationExecutiveSummaryText}
      recommendations={administrationExecutiveRecommendations}
      onAnalyzeCauses={onRevisarAcessos}
      onViewActionPlan={onAbrirAuditoria}
      onAskCortex={onAskCortex}
      aside={
        <div className="flex h-full flex-col gap-4">
          <div>
            <p className="text-caption text-ink-tertiary">Conformidade de acessos</p>
            <p className="mt-1 text-metric-sm tabular text-ink-primary">{formatPercent(administrationSituation.conformidadeAcessos, 0)}</p>
            <p className="mt-0.5 text-caption text-ink-tertiary">Meta: {formatPercent(administrationSituation.metaConformidade, 0)}</p>
          </div>
          <div>
            <p className="mb-1 text-label text-ink-tertiary">Pendências</p>
            <ul className="flex flex-col gap-1 text-support text-ink-secondary">
              <li>{administrationSituation.acessosParaRevisar} acessos aguardando revisão</li>
              <li>{administrationSituation.acessosTemporarios} acessos temporários ativos</li>
              <li>{administrationSituation.integracoesAtencao} integrações com atenção</li>
            </ul>
          </div>
          <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-3">
            <Button size="sm" variant="secondary" leftIcon={<UsersRound className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onRevisarAcessos}>
              Revisar acessos
            </Button>
            <Button size="sm" variant="ghost" leftIcon={<ShieldAlert className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onVerIntegracoes}>
              Ver integrações
            </Button>
          </div>
        </div>
      }
    />
  )
}
