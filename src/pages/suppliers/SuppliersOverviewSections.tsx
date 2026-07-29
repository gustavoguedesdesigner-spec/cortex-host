import { useNavigate } from 'react-router-dom'
import { ArrowRight, Scale, Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { SupplierRiskBadge, SupplierDivergenceBadge, SupplierDocumentBadge } from '@/components/suppliers/SupplierBadges'
import { supplierSummary, supplierExecutiveSummaryText, supplierExecutiveRecommendations, dependencyRisks, dependencyRiskNote } from '@/data/suppliers/supplierSummary'
import { networkPerformanceOverview } from '@/data/suppliers/supplierPerformance'
import { getOpenDivergences } from '@/data/suppliers/supplierDivergences'
import { getDocumentsNearExpiry } from '@/data/suppliers/supplierDocuments'
import { getSupplierById, suppliers } from '@/data/suppliers/suppliers'
import { getOpenNegotiations } from '@/data/suppliers/supplierNegotiations'
import { formatCurrencyBRL, formatCurrencyCompactBRL, formatPercent, formatPercentPoints } from '@/utils/format'
import { useAppState } from '@/context/AppStateContext'

export function SuppliersCortexSummarySection() {
  const navigate = useNavigate()
  const { askCortex } = useAppState()

  return (
    <section>
      <Card elevation="raised" className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-2 text-label uppercase tracking-[0.06em] text-accent">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />
            Entendimento do CORTEX
          </div>
          <p className="text-body leading-relaxed text-ink-secondary">{supplierExecutiveSummaryText}</p>
          <ol className="flex flex-col gap-1.5 text-support text-ink-secondary">
            {supplierExecutiveRecommendations.map((r, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="font-semibold tabular text-ink-tertiary">{String(i + 1).padStart(2, '0')}</span>
                {r}
              </li>
            ))}
          </ol>
          <div className="mt-1 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => navigate('/fornecedores?rapido=em_atencao')}>
              Ver fornecedores em atenção
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/fornecedores/riscos')}>
              Ver riscos
            </Button>
            <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Qual fornecedor devo escolher?', 'Fornecedores')}>
              Perguntar ao CORTEX
            </Button>
          </div>
        </div>
      </Card>
    </section>
  )
}

export function SuppliersIndicatorsStrip() {
  const navigate = useNavigate()
  const s = supplierSummary

  return (
    <MetricStrip>
      <MetricCard titulo="Ativos" valor={String(s.ativos)} status="success" comparacao="ver todos" onClick={() => navigate('/fornecedores')} />
      <MetricCard titulo="Estratégicos" valor={String(s.estrategicos)} status="neutral" comparacao="filtrar" onClick={() => navigate('/fornecedores?rapido=estrategicos')} />
      <MetricCard titulo="Em atenção" valor={String(s.emAtencao)} status="attention" comparacao="filtrar" onClick={() => navigate('/fornecedores?rapido=em_atencao')} />
      <MetricCard titulo="Bloqueados" valor={String(s.bloqueados)} status="critical" comparacao="filtrar" onClick={() => navigate('/fornecedores?rapido=bloqueados')} />
      <MetricCard titulo="Divergências abertas" valor={`${s.comDivergenciasAbertas} fornecedores`} status="critical" comparacao="ver divergências" onClick={() => navigate('/fornecedores/divergencias')} />
      <MetricCard titulo="Documentos vencendo" valor={String(s.documentosProximosVencimento)} status="attention" comparacao="ver documentos" onClick={() => navigate('/fornecedores/documentos')} />
      <MetricCard titulo="Negociações abertas" valor={String(s.negociacoesAbertas)} status="info" comparacao="ver negociações" onClick={() => navigate('/fornecedores/negociacoes')} />
      <MetricCard titulo="Compras no período" valor={formatCurrencyCompactBRL(s.valorCompradoPeriodo)} status="neutral" comparacao="ver Compras" onClick={() => navigate('/compras')} />
    </MetricStrip>
  )
}

const performanceLabels = {
  pontualidade: 'Pontualidade',
  conformidadeQuantidade: 'Conformidade de quantidade',
  conformidadePreco: 'Conformidade de preço',
  conformidadeQualidade: 'Conformidade de qualidade',
} as const

export function SuppliersPerformanceSection() {
  return (
    <section>
      <SectionHeader title="Desempenho geral" description="Média da rede no período, frente à meta e ao período anterior" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(performanceLabels) as (keyof typeof performanceLabels)[]).map((key) => {
          const m = networkPerformanceOverview[key]
          const diff = m.atual - m.periodoAnterior
          return (
            <Card key={key}>
              <p className="text-label text-ink-tertiary">{performanceLabels[key]}</p>
              <p className="mt-1.5 text-metric tabular text-ink-primary">{formatPercent(m.atual, 1)}</p>
              <p className="mt-1 text-caption text-ink-tertiary">Meta {formatPercent(m.meta, 0)}</p>
              <p className={`mt-2 text-caption font-medium tabular ${diff >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatPercentPoints(diff)} vs. período anterior
              </p>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export function SuppliersPurchaseDistributionSection() {
  const navigate = useNavigate()
  const top = [...suppliers].sort((a, b) => b.valorCompradoPeriodo - a.valorCompradoPeriodo).slice(0, 6)
  const max = top[0]?.valorCompradoPeriodo ?? 1

  return (
    <section>
      <SectionHeader title="Distribuição de compras" description="Principais fornecedores por valor comprado no período" />
      <div className="flex flex-col gap-3">
        {top.map((s) => (
          <button key={s.id} onClick={() => navigate(`/fornecedores/${s.id}`)} className="group flex flex-col gap-1.5 text-left">
            <div className="flex items-center justify-between text-support">
              <span className="font-medium text-ink-primary group-hover:text-accent">{s.nome}</span>
              <span className="tabular text-ink-tertiary">{formatCurrencyBRL(s.valorCompradoPeriodo)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(4, (s.valorCompradoPeriodo / max) * 100)}%` }} />
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

export function SuppliersDependencySection() {
  const navigate = useNavigate()
  return (
    <section>
      <SectionHeader title="Risco de dependência" description={dependencyRiskNote} actions={<Button size="sm" variant="ghost" onClick={() => navigate('/fornecedores/riscos')}>Ver todos os riscos</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {dependencyRisks.map((d) => (
          <Card key={`${d.categoria}-${d.supplierId}`} interactive onClick={() => navigate(`/fornecedores/${d.supplierId}`)}>
            <p className="text-label text-ink-tertiary">{d.categoriaLabel}</p>
            <p className="mt-1.5 text-metric tabular text-ink-primary">{formatPercent(d.participacao, 0)}</p>
            <p className="mt-1 text-support text-ink-secondary">{d.supplierNome}</p>
            <div className="mt-3">
              <SupplierRiskBadge nivel={d.risco} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function SuppliersDivergencesPreviewSection() {
  const navigate = useNavigate()
  const divergences = getOpenDivergences().slice(0, 4)

  return (
    <section>
      <SectionHeader title="Divergências recentes" description="Ocorrências abertas nos últimos 60 dias" actions={<Button size="sm" variant="ghost" onClick={() => navigate('/fornecedores/divergencias')}>Ver todas</Button>} />
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
        {divergences.map((d) => {
          const supplier = getSupplierById(d.supplierId)
          return (
            <button key={d.id} onClick={() => navigate(`/fornecedores/${d.supplierId}`)} className="flex items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
              <div className="min-w-0">
                <p className="text-support font-medium text-ink-primary">
                  {d.id.replace('div-', 'REC-').toUpperCase()} · {supplier?.nome}
                </p>
                <p className="truncate text-caption text-ink-tertiary">{d.descricao}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-support font-medium tabular text-danger">{formatCurrencyBRL(d.valorEnvolvido)}</span>
                <SupplierDivergenceBadge status={d.status} />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function SuppliersDocumentsNegotiationsSection() {
  const navigate = useNavigate()
  const documentos = getDocumentsNearExpiry().slice(0, 5)
  const negociacoes = getOpenNegotiations().slice(0, 4)

  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <SectionHeader title="Documentos vencendo" actions={<Button size="sm" variant="ghost" onClick={() => navigate('/fornecedores/documentos')}>Ver todos</Button>} />
        <ul className="flex flex-col divide-y divide-border border-t border-border">
          {documentos.map((doc) => {
            const supplier = getSupplierById(doc.supplierId)
            return (
              <li key={doc.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-support font-medium text-ink-primary">{doc.nome}</p>
                  <p className="text-caption text-ink-tertiary">{supplier?.nome}</p>
                </div>
                <SupplierDocumentBadge status={doc.status} />
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <SectionHeader title="Negociações abertas" actions={<Button size="sm" variant="ghost" leftIcon={<Scale className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/fornecedores/negociacoes')}>Ver todas</Button>} />
        <div className="flex flex-col gap-2">
          {negociacoes.map((n) => (
            <button key={n.id} onClick={() => navigate('/fornecedores/negociacoes')} className="rounded-md border border-border bg-surface-subtle px-3.5 py-2.5 text-left transition-colors hover:bg-surface-hover">
              <DataList items={[{ label: n.titulo, value: formatCurrencyCompactBRL(n.potencialEstimado) }]} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
