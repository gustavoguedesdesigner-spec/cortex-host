import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  BookOpen,
  CheckSquare,
  ClipboardCheck,
  FileWarning,
  GraduationCap,
  ListTodo,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { ExecutiveSummaryCard } from '@/components/cortex/ExecutiveSummaryCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { KnowledgeStatusBadge, CriticalityBadge } from '@/components/knowledge/KnowledgeBadges'
import { cn } from '@/utils/cn'
import { useAppState } from '@/context/AppStateContext'
import { getUnitById } from '@/data/units'
import {
  areaComplianceRanking,
  continueItems,
  knowledgeExecutiveRecommendations,
  knowledgeExecutiveSummaryText,
  knowledgeSummary,
  quickActivities,
} from '@/data/knowledge/knowledgeSummary'
import { complianceByUnit } from '@/data/knowledge/compliance'
import { formatPercent } from '@/utils/format'
import type { IndicatorStatus, NonConformity, RevisionRequest } from '@/types'

/* ---------------- Resumo executivo ---------------- */

export function KnowledgeExecutiveSection({
  onVerCriticos,
  onVerTreinamentos,
  onAbrirConformidade,
}: {
  onVerCriticos: () => void
  onVerTreinamentos: () => void
  onAbrirConformidade: () => void
}) {
  const { askCortex } = useAppState()

  return (
    <ExecutiveSummaryCard
      text={knowledgeExecutiveSummaryText}
      recommendations={knowledgeExecutiveRecommendations}
      onAnalyzeCauses={onVerCriticos}
      onViewActionPlan={onVerTreinamentos}
      onAskCortex={() => askCortex('Quais procedimentos estão vencidos?', 'Biblioteca consolidada')}
      primaryLabel="Ver conteúdos críticos"
      primaryIcon={<FileWarning className="h-3.5 w-3.5" strokeWidth={1.7} />}
      secondaryLabel="Ver treinamentos pendentes"
      secondaryIcon={<GraduationCap className="h-3.5 w-3.5" strokeWidth={1.7} />}
      extraActions={
        <Button size="sm" variant="ghost" leftIcon={<ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onAbrirConformidade}>
          Abrir conformidade
        </Button>
      }
      aside={
        <div className="flex h-full flex-col gap-4">
          <div>
            <p className="text-caption text-ink-tertiary">Conformidade dos checklists</p>
            <p className="mt-1 text-metric-sm tabular text-ink-primary">{formatPercent(knowledgeSummary.conformidadeGeral)}</p>
            <p className="mt-0.5 text-caption text-ink-tertiary">Meta: {formatPercent(knowledgeSummary.metaConformidade, 0)}</p>
          </div>
          <div>
            <p className="mb-1 text-label text-ink-tertiary">Pendências</p>
            <ul className="flex flex-col gap-1 text-support text-ink-secondary">
              <li>{knowledgeSummary.revisoesVencidas} documentos com revisão vencida</li>
              <li>{knowledgeSummary.procedimentosCriticosDesatualizados} procedimentos críticos desatualizados</li>
              <li>{knowledgeSummary.treinamentosPendentes} treinamentos pendentes</li>
              <li>{knowledgeSummary.naoConformidadesAbertas} não conformidades abertas</li>
            </ul>
          </div>
          <div className="mt-auto border-t border-border pt-3">
            <p className="text-caption text-ink-tertiary">Qualidade geral da biblioteca</p>
            <p className="mt-1 text-metric-sm tabular text-ink-primary">{formatPercent(knowledgeSummary.qualidadeBiblioteca, 0)}</p>
          </div>
        </div>
      }
    />
  )
}

/* ---------------- Faixa de indicadores ---------------- */

const statusIconClasses: Record<IndicatorStatus, string> = {
  success: 'bg-success-soft text-success',
  attention: 'bg-warning-soft text-warning',
  critical: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-surface-subtle text-ink-secondary',
}

interface KnowledgeIndicator {
  id: string
  titulo: string
  valor: string
  icon: LucideIcon
  status: IndicatorStatus
  comparacao: string
  path: string
}

const indicators: KnowledgeIndicator[] = [
  { id: 'publicados', titulo: 'Conteúdos publicados', valor: String(knowledgeSummary.conteudosPublicados), icon: BookOpen, status: 'neutral', comparacao: 'ver documentos', path: '/biblioteca/documentos' },
  { id: 'procedimentos', titulo: 'Procedimentos', valor: String(knowledgeSummary.procedimentos), icon: ClipboardCheck, status: 'neutral', comparacao: 'ver procedimentos', path: '/biblioteca/procedimentos' },
  { id: 'treinamentos', titulo: 'Treinamentos', valor: String(knowledgeSummary.treinamentos), icon: GraduationCap, status: 'neutral', comparacao: 'ver treinamentos', path: '/biblioteca/treinamentos' },
  { id: 'checklists', titulo: 'Checklists ativos', valor: String(knowledgeSummary.checklistsAtivos), icon: CheckSquare, status: 'neutral', comparacao: 'ver checklists', path: '/biblioteca/checklists' },
  { id: 'revisoes', titulo: 'Revisões vencidas', valor: String(knowledgeSummary.revisoesVencidas), icon: FileWarning, status: 'critical', comparacao: 'filtrar documentos', path: '/biblioteca/documentos?status=revisao_vencida' },
  { id: 'pendentes', titulo: 'Treinamentos pendentes', valor: String(knowledgeSummary.treinamentosPendentes), icon: ListTodo, status: 'attention', comparacao: 'ver pendentes', path: '/biblioteca/treinamentos?status=pendente' },
  { id: 'conformidade', titulo: 'Conformidade', valor: formatPercent(knowledgeSummary.conformidadeGeral), icon: ShieldCheck, status: 'attention', comparacao: `meta ${formatPercent(knowledgeSummary.metaConformidade, 0)}`, path: '/biblioteca/conformidade' },
  { id: 'nc', titulo: 'Não conformidades abertas', valor: String(knowledgeSummary.naoConformidadesAbertas), icon: AlertTriangle, status: 'critical', comparacao: 'abrir conformidade', path: '/biblioteca/conformidade?status=aberta' },
]

export function KnowledgeIndicatorsStrip() {
  const navigate = useNavigate()

  return (
    <section>
      <SectionHeader title="Indicadores da biblioteca" description="Consolidado da rede no período selecionado" />
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {indicators.map((ind) => {
          const Icon = ind.icon
          return (
            <button key={ind.id} onClick={() => navigate(ind.path)} className="flex items-start gap-3 bg-surface px-5 py-5 text-left transition-colors hover:bg-surface-hover">
              <span className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full', statusIconClasses[ind.status])}>
                <Icon className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-caption text-ink-secondary">{ind.titulo}</span>
                <span className="text-metric-sm tabular text-ink-primary">{ind.valor}</span>
                <span className="text-caption text-ink-tertiary">{ind.comparacao}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- Conteúdos prioritários ---------------- */

interface PriorityContent {
  id: string
  titulo: string
  tipo: string
  destaqueLabel: string
  destaqueValor: string
  motivo: string
  path: string
  acoes: { label: string; path: string }[]
  pergunta: string
}

const priorityContents: PriorityContent[] = [
  {
    id: 'pop-coz-004',
    titulo: 'Porcionamento de carnes',
    tipo: 'Procedimento operacional',
    destaqueLabel: 'Status',
    destaqueValor: 'Revisão recomendada',
    motivo: 'Desvio de consumo em Moinhos e Caxias Centro · última revisão há 11 meses',
    path: '/biblioteca/procedimentos/pop-coz-004',
    acoes: [
      { label: 'Abrir', path: '/biblioteca/procedimentos/pop-coz-004' },
      { label: 'Criar revisão', path: '/biblioteca/procedimentos/pop-coz-004?acao=revisar' },
      { label: 'Ver ocorrências relacionadas', path: '/?scroll=ocorrencias' },
    ],
    pergunta: 'Qual é o procedimento correto para porcionar carne?',
  },
  {
    id: 'trn-rec-003',
    titulo: 'Recebimento de produtos refrigerados',
    tipo: 'Treinamento obrigatório',
    destaqueLabel: 'Pendentes',
    destaqueValor: '8 colaboradores',
    motivo: 'Moinhos e Caxias Centro concentram as pendências',
    path: '/biblioteca/treinamentos/trn-rec-003',
    acoes: [
      { label: 'Ver pendentes', path: '/biblioteca/treinamentos/trn-rec-003?aba=atribuicoes' },
      { label: 'Abrir treinamento', path: '/biblioteca/treinamentos/trn-rec-003' },
    ],
    pergunta: 'Quais treinamentos estão pendentes?',
  },
  {
    id: 'chk-est-007',
    titulo: 'Inventário do estoque refrigerado',
    tipo: 'Checklist',
    destaqueLabel: 'Conformidade',
    destaqueValor: '72%',
    motivo: 'Moinhos é a unidade crítica · Serra opera a 97%',
    path: '/biblioteca/checklists/chk-est-007',
    acoes: [
      { label: 'Ver execuções', path: '/biblioteca/execucoes?checklist=chk-est-007' },
      { label: 'Comparar com Serra', path: '/biblioteca/conformidade' },
    ],
    pergunta: 'Qual unidade possui menor conformidade?',
  },
  {
    id: 'pol-com-001',
    titulo: 'Política de compras emergenciais',
    tipo: 'Política',
    destaqueLabel: 'Status',
    destaqueValor: 'Revisão vencida',
    motivo: 'Três compras emergenciais no período',
    path: '/biblioteca/documentos/pol-com-001',
    acoes: [
      { label: 'Abrir', path: '/biblioteca/documentos/pol-com-001' },
      { label: 'Ver revisões', path: '/biblioteca/revisoes' },
    ],
    pergunta: 'Quais procedimentos estão vencidos?',
  },
]

export function PriorityContentSection() {
  const navigate = useNavigate()
  const { askCortex } = useAppState()

  return (
    <section id="conteudos-criticos">
      <SectionHeader title="Exigem atenção" description="Conteúdos que impactam a operação agora" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {priorityContents.map((c) => (
          <Card key={c.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-card-title text-ink-primary">{c.titulo}</p>
                <p className="text-caption text-ink-tertiary">{c.tipo}</p>
              </div>
              <span className="shrink-0 text-right">
                <span className="block text-caption text-ink-tertiary">{c.destaqueLabel}</span>
                <span className="block text-support font-medium text-ink-primary">{c.destaqueValor}</span>
              </span>
            </div>
            <p className="text-support leading-relaxed text-ink-secondary">{c.motivo}</p>
            <div className="mt-1 flex flex-wrap gap-2 border-t border-border pt-3">
              {c.acoes.map((a, i) => (
                <Button key={a.label} size="sm" variant={i === 0 ? 'secondary' : 'ghost'} onClick={() => navigate(a.path)}>
                  {a.label}
                </Button>
              ))}
              <Button size="sm" variant="ghost" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex(c.pergunta, c.titulo)}>
                Perguntar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Acesso rápido por atividade ---------------- */

export function QuickAccessSection() {
  const navigate = useNavigate()

  function destino(a: (typeof quickActivities)[number]) {
    if (a.procedimentoId) return `/biblioteca/procedimentos/${a.procedimentoId}`
    if (a.checklistId) return `/biblioteca/checklists/${a.checklistId}`
    if (a.treinamentoId) return `/biblioteca/treinamentos/${a.treinamentoId}`
    return '/biblioteca'
  }

  return (
    <section>
      <SectionHeader title="Acesso rápido" description="O que você vai fazer agora — abre procedimento, checklist e treinamento relacionados" />
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
        {quickActivities.map((a) => (
          <button key={a.id} onClick={() => navigate(destino(a))} className="flex items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
            <div className="min-w-0">
              <p className="text-support font-medium text-ink-primary">{a.label}</p>
              <p className="text-caption text-ink-tertiary">
                {a.responsavel} · {a.versaoLabel}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              {a.procedimentoId && <span className="rounded-full bg-surface-subtle px-2 py-0.5 text-badge text-ink-secondary">Procedimento</span>}
              {a.checklistId && <span className="rounded-full bg-surface-subtle px-2 py-0.5 text-badge text-ink-secondary">Checklist</span>}
              {a.treinamentoId && <span className="rounded-full bg-surface-subtle px-2 py-0.5 text-badge text-ink-secondary">Treinamento</span>}
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Continuar de onde parei ---------------- */

export function ContinueSection() {
  const navigate = useNavigate()

  return (
    <section>
      <SectionHeader title="Continuar de onde parei" description="Itens em andamento do seu perfil" />
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
        {continueItems.map((item) => (
          <button key={item.id} onClick={() => navigate(item.path)} className="flex items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
            <div className="min-w-0">
              <p className="text-caption text-ink-tertiary">{item.tipo}</p>
              <p className="truncate text-support font-medium text-ink-primary">{item.titulo}</p>
              <p className="text-caption text-ink-tertiary">{item.detalhe}</p>
            </div>
            <span className="shrink-0 text-caption font-medium text-accent">Continuar</span>
          </button>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Conformidade resumida ---------------- */

export function ComplianceSummarySection() {
  const navigate = useNavigate()
  const ordenadas = [...complianceByUnit].sort((a, b) => a.conformidadeGeral - b.conformidadeGeral)

  return (
    <section>
      <SectionHeader
        title="Conformidade por unidade"
        description="Da menor para a maior conformidade"
        actions={
          <Button size="sm" variant="secondary" onClick={() => navigate('/biblioteca/conformidade')}>
            Abrir conformidade
          </Button>
        }
      />
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
        {ordenadas.map((c) => {
          const unit = getUnitById(c.unitId)
          const status: IndicatorStatus = c.conformidadeGeral < 0.85 ? 'critical' : c.conformidadeGeral < 0.95 ? 'attention' : 'success'
          return (
            <button key={c.unitId} onClick={() => navigate(`/biblioteca/conformidade?unidade=${c.unitId}`)} className="flex flex-col gap-2 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-support font-medium text-ink-primary">{unit?.nomeCurto ?? c.unitId}</span>
                <span className="tabular text-support text-ink-primary">{formatPercent(c.conformidadeGeral)}</span>
              </div>
              <ProgressBar value={c.conformidadeGeral} status={status} />
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink-tertiary">
                <span>{c.checklistsExecutados} execuções</span>
                <span>{c.naoConformidades} não conformidades</span>
                <span>{c.treinamentosPendentes} treinamentos pendentes</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- Áreas de menor conformidade ---------------- */

export function AreaComplianceSection() {
  return (
    <section>
      <SectionHeader title="Áreas de menor conformidade" description="Processos com maior desvio na rede" />
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
        {areaComplianceRanking.map((a) => (
          <div key={a.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="min-w-0">
              <p className="text-support font-medium text-ink-primary">{a.label}</p>
              <p className="text-caption text-ink-tertiary">
                {a.naoConformidades > 0 ? `${a.naoConformidades} não conformidade${a.naoConformidades > 1 ? 's' : ''}` : 'Sem não conformidades'} · unidade crítica: {a.unidadeCritica}
              </p>
            </div>
            <span className="shrink-0 tabular text-support font-medium text-ink-primary">{formatPercent(a.conformidade)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Não conformidades e revisões (resumo) ---------------- */

export function OpenItemsSection({ naoConformidades, revisoes }: { naoConformidades: NonConformity[]; revisoes: RevisionRequest[] }) {
  const navigate = useNavigate()
  const abertas = naoConformidades.filter((n) => n.status !== 'resolvida').slice(0, 5)
  const pendentes = revisoes.filter((r) => r.status !== 'publicada').slice(0, 4)

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <SectionHeader
          title="Não conformidades abertas"
          actions={
            <Button size="sm" variant="secondary" onClick={() => navigate('/biblioteca/conformidade')}>
              Ver todas
            </Button>
          }
        />
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {abertas.map((nc) => (
            <button key={nc.id} onClick={() => navigate(`/biblioteca/conformidade?nc=${nc.id}`)} className="flex items-start justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
              <div className="min-w-0">
                <p className="text-support font-medium text-ink-primary">
                  {nc.numero} · {getUnitById(nc.unitId)?.nomeCurto ?? nc.unitId}
                </p>
                <p className="mt-0.5 text-caption leading-relaxed text-ink-secondary">{nc.descricao}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <CriticalityBadge criticidade={nc.criticidade} />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="lg:col-span-5">
        <SectionHeader
          title="Revisões em andamento"
          actions={
            <Button size="sm" variant="ghost" onClick={() => navigate('/biblioteca/revisoes')}>
              Ver revisões
            </Button>
          }
        />
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {pendentes.map((r) => (
            <button key={r.id} onClick={() => navigate('/biblioteca/revisoes')} className="flex items-start justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover">
              <div className="min-w-0">
                <p className="text-support font-medium text-ink-primary">
                  {r.versaoOrigem} → {r.novaVersao}
                </p>
                <p className="mt-0.5 text-caption leading-relaxed text-ink-tertiary">{r.motivo}</p>
              </div>
              <Tooltip content={`Solicitada por ${r.solicitadaPor}`}>
                <span className="shrink-0 cursor-help">
                  <KnowledgeStatusBadge status={r.status === 'aguardando_aprovacao' ? 'aguardando_aprovacao' : r.status === 'publicada' ? 'publicado' : 'em_revisao'} />
                </span>
              </Tooltip>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
