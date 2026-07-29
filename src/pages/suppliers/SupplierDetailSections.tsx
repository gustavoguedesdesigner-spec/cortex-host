import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  SupplierRiskBadge,
  SupplierDivergenceBadge,
  SupplierDocumentBadge,
  SupplierNegotiationBadge,
} from '@/components/suppliers/SupplierBadges'
import { categoryLabels } from '@/data/suppliers/supplierSummary'
import { getContactsBySupplier } from '@/data/suppliers/supplierContacts'
import { getCategoryBreakdownBySupplier } from '@/data/suppliers/supplierCategories'
import { getProductsBySupplier } from '@/data/suppliers/supplierProducts'
import { getOrdersBySupplier } from '@/data/suppliers/supplierOrders'
import { getReceiptsBySupplier } from '@/data/suppliers/supplierReceipts'
import { getDivergencesBySupplier } from '@/data/suppliers/supplierDivergences'
import { getPricesBySupplier } from '@/data/suppliers/supplierPrices'
import { getDocumentsBySupplier } from '@/data/suppliers/supplierDocuments'
import { getNegotiationsBySupplier } from '@/data/suppliers/supplierNegotiations'
import { getRisksBySupplier } from '@/data/suppliers/supplierRisks'
import { getHistoryBySupplier } from '@/data/suppliers/supplierHistory'
import { getPurchaseSummaryBySupplier } from '@/data/suppliers/supplierPurchases'
import { getUnitById } from '@/data/units'
import { riskLevelLabels } from '@/utils/supplierRisk'
import { diasParaVencimento } from '@/utils/supplierDocuments'
import { formatCurrencyBRL, formatCurrencyPreciseBRL, formatDateFull, formatDateShort, formatPercent } from '@/utils/format'
import { useAppState } from '@/context/AppStateContext'
import type { Supplier, PurchaseOrder } from '@/types'

export function SupplierCortexSection({ supplier }: { supplier: Supplier }) {
  const { askCortex } = useAppState()
  const divergencias = getDivergencesBySupplier(supplier.id)
  const totalDivergencias = divergencias.reduce((s, d) => s + d.valorEnvolvido, 0)

  const texto =
    supplier.id === 'serra-alimentos'
      ? `A ${supplier.nome} é estratégica para ${categoryLabels[supplier.categoriaPrincipalId].toLowerCase()}, mas apresenta queda de desempenho. A pontualidade está em ${formatPercent(supplier.pontualidade, 0)}, existem ${supplier.divergenciasAbertas} divergências abertas e a categoria de carnes possui dependência de ${formatPercent(supplier.participacaoCategoriaPrincipal, 0)}. O principal risco está na combinação entre concentração de compras e recorrência de diferenças de quantidade e preço.`
      : `${supplier.nome} está ${supplier.statusOperacional === 'em_atencao' ? 'em atenção' : supplier.statusOperacional === 'estrategico' ? 'entre os fornecedores estratégicos' : 'com desempenho estável'}, com score de ${supplier.scoreGeral}/100${supplier.divergenciasAbertas > 0 ? ` e ${supplier.divergenciasAbertas} divergência(s) aberta(s)` : ' e nenhuma divergência aberta no período'}.`

  const recomendacoes =
    supplier.id === 'serra-alimentos'
      ? ['Solicitar plano corretivo', 'Concluir a divergência da NF 9821', 'Homologar fornecedor alternativo', 'Revisar acordo de preço', 'Monitorar as próximas três entregas']
      : supplier.divergenciasAbertas > 0
        ? ['Acompanhar as divergências abertas', 'Confirmar preços antes do próximo pedido']
        : ['Manter o acompanhamento padrão de desempenho']

  return (
    <Card elevation="raised" className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-label uppercase tracking-[0.06em] text-accent">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />
        Resumo do CORTEX
      </div>
      <p className="text-body leading-relaxed text-ink-secondary">{texto}</p>
      {totalDivergencias > 0 && (
        <p className="text-caption text-ink-tertiary">Valor acumulado em divergências nos últimos 60 dias: {formatCurrencyBRL(totalDivergencias)}</p>
      )}
      <ol className="flex flex-col gap-1.5 text-support text-ink-secondary">
        {recomendacoes.map((r, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="font-semibold tabular text-ink-tertiary">{String(i + 1).padStart(2, '0')}</span>
            {r}
          </li>
        ))}
      </ol>
      <div className="mt-1">
        <Button size="sm" variant="ghost" onClick={() => askCortex(`Existe alternativa para este fornecedor?`, supplier.nome)}>
          Perguntar ao CORTEX
        </Button>
      </div>
    </Card>
  )
}

export function SupplierScoreSection({ supplier }: { supplier: Supplier }) {
  const b = supplier.scoreBreakdown
  const items = [
    { label: 'Preço competitivo', value: b.precoCompetitivo },
    { label: 'Pontualidade', value: b.pontualidade },
    { label: 'Quantidade', value: b.quantidade },
    { label: 'Preço conforme pedido', value: b.precoConformePedido },
    { label: 'Qualidade', value: b.qualidade },
    { label: 'Capacidade de resposta', value: b.capacidadeResposta },
    { label: 'Documentação', value: b.documentacao },
  ]

  return (
    <section>
      <SectionHeader title="Score do fornecedor" description="Composição ponderada, nunca digitada — sempre derivada do breakdown abaixo." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="flex flex-col gap-2.5">
            {items.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-44 shrink-0 text-support text-ink-secondary">{item.label}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-subtle">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${item.value}%` }} />
                </div>
                <span className="w-8 shrink-0 text-right text-support font-medium tabular text-ink-primary">{item.value}</span>
              </div>
            ))}
          </div>
          {supplier.penalidades.length > 0 && (
            <div className="mt-4 rounded-md border border-border bg-surface-subtle p-3.5">
              <p className="text-label text-ink-tertiary">Deduções aplicadas</p>
              <ul className="mt-1.5 flex flex-col gap-1 text-support text-ink-secondary">
                {supplier.penalidades.map((p, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <span>{p.motivo}</span>
                    <span className="tabular text-danger">-{p.pontos}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="lg:col-span-5">
          <Card className="flex h-full flex-col justify-center gap-2 text-center">
            <p className="text-label text-ink-tertiary">Score geral</p>
            <p className="text-display tabular text-ink-primary">{supplier.scoreGeral}</p>
            <p className="text-caption text-ink-tertiary">de 100</p>
            <p className="mt-2 text-caption leading-relaxed text-ink-tertiary">
              Pesos: preço 20% · prazo 20% · quantidade 15% · preço conforme 15% · qualidade 15% · resposta 10% · documentação 5%
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}

export function SupplierStatusRiskSection({ supplier }: { supplier: Supplier }) {
  const items = [
    { label: 'Desempenho', value: supplier.statusOperacional === 'em_atencao' ? 'Em atenção' : supplier.statusOperacional === 'estrategico' ? 'Estratégico' : 'Ativo' },
  ]
  return (
    <section>
      <SectionHeader title="Status e risco" description="Cada dimensão é lida separadamente — nunca reduzida a um único número." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-label text-ink-tertiary">Desempenho</p>
          <p className="mt-2 text-support font-medium text-ink-primary">{items[0].value}</p>
        </Card>
        <Card>
          <p className="text-label text-ink-tertiary">Risco de dependência</p>
          <div className="mt-2">
            <SupplierRiskBadge nivel={supplier.riscoDependencia} />
          </div>
        </Card>
        <Card>
          <p className="text-label text-ink-tertiary">Risco documental</p>
          <div className="mt-2">
            <SupplierRiskBadge nivel={supplier.riscoDocumental} />
          </div>
        </Card>
        <Card>
          <p className="text-label text-ink-tertiary">Risco operacional</p>
          <div className="mt-2">
            <SupplierRiskBadge nivel={supplier.riscoOperacional} />
          </div>
        </Card>
      </div>
    </section>
  )
}

export function SupplierContactsSection({ supplier }: { supplier: Supplier }) {
  const contatos = getContactsBySupplier(supplier.id)
  if (contatos.length === 0) return null
  return (
    <section>
      <SectionHeader title="Contatos" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contatos.map((c) => (
          <Card key={c.id}>
            <div className="flex items-center justify-between">
              <p className="text-card-title text-ink-primary">{c.nome}</p>
              {c.principal && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-badge text-accent">Principal</span>}
            </div>
            <p className="text-caption text-ink-tertiary">{c.funcao}</p>
            <DataList
              className="mt-3"
              items={[
                { label: 'E-mail', value: c.email },
                { label: 'Telefone', value: c.telefone },
                ...(c.horario ? [{ label: 'Horário', value: c.horario }] : []),
              ]}
            />
          </Card>
        ))}
      </div>
    </section>
  )
}

export function SupplierCategoriesSection({ supplier }: { supplier: Supplier }) {
  const breakdown = getCategoryBreakdownBySupplier(supplier.id)
  const produtos = getProductsBySupplier(supplier.id)
  if (breakdown.length === 0 && produtos.length === 0) return null

  const columns: TableColumn<(typeof produtos)[number]>[] = [
    { key: 'nome', header: 'Item', render: (p) => <span className="font-medium text-ink-primary">{p.nome}</span> },
    { key: 'codigo', header: 'Código', render: (p) => p.codigo },
    { key: 'preco', header: 'Preço atual', align: 'right', render: (p) => formatCurrencyPreciseBRL(p.precoAtual) },
    { key: 'anterior', header: 'Preço anterior', align: 'right', render: (p) => formatCurrencyPreciseBRL(p.precoAnterior) },
    { key: 'prazo', header: 'Prazo', align: 'right', render: (p) => `${p.prazoEntregaDias}d` },
    { key: 'minimo', header: 'Mínimo', align: 'right', render: (p) => p.pedidoMinimo },
    { key: 'unidades', header: 'Unidades', align: 'right', render: (p) => p.unidadesAtendidas.length },
    { key: 'divergencias', header: 'Divergências', align: 'right', render: (p) => p.divergencias },
  ]

  return (
    <section className="flex flex-col gap-6">
      <div>
        <SectionHeader title="Categorias fornecidas" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {breakdown.map((c) => (
            <Card key={c.categoria}>
              <p className="text-label text-ink-tertiary">{categoryLabels[c.categoria]}</p>
              <p className="mt-1.5 text-metric tabular text-ink-primary">{formatCurrencyBRL(c.valor)}</p>
              <p className="mt-1 text-caption text-ink-tertiary">
                {c.itens} itens · {c.unidades} unidades · {formatPercent(c.participacao, 0)} da categoria
              </p>
            </Card>
          ))}
        </div>
      </div>
      {produtos.length > 0 && (
        <div>
          <SectionHeader title="Itens fornecidos" />
          <Table columns={columns} data={produtos} getRowId={(p) => p.id} />
        </div>
      )}
    </section>
  )
}

export function SupplierUnitsSection({ supplier }: { supplier: Supplier }) {
  const navigate = useNavigate()
  if (supplier.unidadesAtendidas.length === 0) return null
  return (
    <section>
      <SectionHeader title="Unidades atendidas" />
      <div className="flex flex-wrap gap-2">
        {supplier.unidadesAtendidas.map((id) => {
          const unit = getUnitById(id)
          if (!unit) return null
          return (
            <button key={id} onClick={() => navigate(`/unidades/${id}`)} className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-support text-ink-primary hover:bg-surface-hover">
              {unit.nomeCurto}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function SupplierPurchasesOrdersSection({ supplier }: { supplier: Supplier }) {
  const navigate = useNavigate()
  const resumo = getPurchaseSummaryBySupplier(supplier.id)
  const pedidos = getOrdersBySupplier(supplier.id)

  const columns: TableColumn<PurchaseOrder>[] = [
    { key: 'id', header: 'Pedido', render: (o) => <span className="font-medium uppercase text-ink-primary">{o.id}</span> },
    { key: 'unidade', header: 'Unidade', render: (o) => getUnitById(o.unitId)?.nomeCurto ?? o.unitId },
    { key: 'emissao', header: 'Emissão', align: 'right', render: (o) => formatDateShort(o.dataEmissao) },
    { key: 'entrega', header: 'Entrega prevista', align: 'right', render: (o) => formatDateShort(o.previsaoEntrega) },
    { key: 'valor', header: 'Valor', align: 'right', render: (o) => formatCurrencyBRL(o.valorTotal) },
    { key: 'status', header: 'Status', render: (o) => (o.status === 'divergente' ? <span className="text-danger">Divergente</span> : o.status.replace(/_/g, ' ')) },
  ]

  return (
    <section className="flex flex-col gap-6">
      <div>
        <SectionHeader title="Compras" description={resumo ? `Ticket médio ${formatCurrencyBRL(resumo.ticketMedio)} · ${resumo.frequenciaPedidosMes} pedidos/mês` : undefined} />
        <DataList
          items={[
            { label: 'Valor comprado no período', value: formatCurrencyBRL(supplier.valorCompradoPeriodo) },
            { label: 'Valor comprado em 12 meses', value: formatCurrencyBRL(supplier.valorComprado12Meses) },
            { label: `Participação em ${categoryLabels[supplier.categoriaPrincipalId].toLowerCase()}`, value: formatPercent(supplier.participacaoCategoriaPrincipal, 0) },
            { label: 'Pedidos em aberto', value: supplier.pedidosEmAberto },
          ]}
        />
      </div>
      {pedidos.length > 0 && (
        <div>
          <SectionHeader title="Pedidos" />
          <Table columns={columns} data={pedidos} getRowId={(o) => o.id} onRowClick={(o) => navigate(`/compras/pedidos/${o.id}`)} />
        </div>
      )}
    </section>
  )
}

export function SupplierReceiptsDivergencesSection({ supplier }: { supplier: Supplier }) {
  const divergencias = getDivergencesBySupplier(supplier.id)
  const total = divergencias.reduce((s, d) => s + d.valorEnvolvido, 0)

  return (
    <section>
      <SectionHeader
        title="Recebimentos e divergências"
        description={`${supplier.recebimentosNoPeriodo} recebimentos no período · atraso médio de ${supplier.atrasoMedioDias} dia(s)`}
      />
      {divergencias.length === 0 ? (
        <EmptyState icon={<Sparkles className="h-5 w-5" />} title="Nenhuma divergência no período" />
      ) : (
        <>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
            {divergencias.map((d) => (
              <div key={d.id} className="flex flex-col gap-1.5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-support font-medium uppercase text-ink-primary">
                    {d.receiptId.toUpperCase()} · {getUnitById(d.unitId)?.nomeCurto}
                  </p>
                  <p className="mt-0.5 text-caption text-ink-tertiary">{d.descricao}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-support font-medium tabular text-danger">{formatCurrencyBRL(d.valorEnvolvido)}</span>
                  <SupplierDivergenceBadge status={d.status} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-support leading-relaxed text-ink-secondary">
            As divergências da {supplier.nome} se repetem em quantidade e preço.{' '}
            {divergencias.filter((d) => d.tipo.includes('quantidade')).length >= divergencias.length / 2 ? 'A maioria envolve itens de carnes.' : ''} Valor acumulado: {formatCurrencyBRL(total)}.
          </p>
        </>
      )}
    </section>
  )
}

export function SupplierPricesSection({ supplier }: { supplier: Supplier }) {
  const precos = getPricesBySupplier(supplier.id)
  if (precos.length === 0) return null

  return (
    <section>
      <SectionHeader title="Histórico de preços" description="Preço atual frente ao histórico do item" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {precos.map((p) => (
          <Card key={p.id}>
            <div className="flex items-center justify-between">
              <p className="text-card-title text-ink-primary">{p.itemNome}</p>
              <span className={`text-support font-medium tabular ${p.variacao > 0.05 ? 'text-danger' : 'text-ink-secondary'}`}>
                {p.variacao > 0 ? '+' : ''}
                {formatPercent(p.variacao, 1)}
              </span>
            </div>
            <div className="mt-3 flex h-12 items-end gap-1">
              {p.historico.map((h, i) => {
                const max = Math.max(...p.historico.map((x) => x.preco))
                const min = Math.min(...p.historico.map((x) => x.preco))
                const range = max - min || 1
                const heightPct = 20 + ((h.preco - min) / range) * 80
                return <div key={i} className="flex-1 rounded-t bg-accent/70" style={{ height: `${heightPct}%` }} title={`${formatDateShort(h.data)}: ${formatCurrencyBRL(h.preco)}`} />
              })}
            </div>
            <DataList
              className="mt-3"
              items={[
                { label: 'Atual', value: formatCurrencyPreciseBRL(p.precoAtual) },
                { label: 'Médio', value: formatCurrencyPreciseBRL(p.precoMedio) },
                { label: 'Menor / maior', value: `${formatCurrencyPreciseBRL(p.menor)} / ${formatCurrencyPreciseBRL(p.maior)}` },
              ]}
            />
          </Card>
        ))}
      </div>
    </section>
  )
}

export function SupplierDocumentsSection({ supplier }: { supplier: Supplier }) {
  const documentos = getDocumentsBySupplier(supplier.id)
  const completude = supplier.documentosObrigatorios > 0 ? supplier.documentosValidos / supplier.documentosObrigatorios : 1

  return (
    <section>
      <SectionHeader title="Documentos" description={`${supplier.documentosValidos} de ${supplier.documentosObrigatorios} obrigatórios válidos · completude ${formatPercent(completude, 1)}`} />
      {documentos.length === 0 ? (
        <EmptyState icon={<Sparkles className="h-5 w-5" />} title="Nenhum documento detalhado nesta amostra" />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {documentos.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-support font-medium text-ink-primary">{doc.nome}</p>
                {doc.validade && (
                  <p className="text-caption text-ink-tertiary">
                    Vencimento {formatDateFull(doc.validade)} {diasParaVencimento(doc.validade) >= 0 ? `· em ${diasParaVencimento(doc.validade)} dias` : '· vencido'}
                  </p>
                )}
              </div>
              <SupplierDocumentBadge status={doc.status} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export function SupplierNegotiationsSection({ supplier }: { supplier: Supplier }) {
  const negociacoes = getNegotiationsBySupplier(supplier.id)
  if (negociacoes.length === 0) return null

  return (
    <section>
      <SectionHeader title="Negociações" />
      <div className="flex flex-col gap-4">
        {negociacoes.map((n) => (
          <Card key={n.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-card-title text-ink-primary">{n.titulo}</p>
                <p className="text-caption text-ink-tertiary">
                  Responsável {n.responsavel} · potencial estimado {formatCurrencyBRL(n.potencialEstimado)}
                </p>
              </div>
              <SupplierNegotiationBadge status={n.status} />
            </div>
            <p className="mt-2 text-caption text-ink-tertiary">Estimativa demonstrativa. Não representa economia garantida.</p>
            {n.objetivos.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {n.objetivos.map((o) => (
                  <li key={o} className="rounded-full bg-surface-subtle px-2.5 py-1 text-caption text-ink-secondary">
                    {o}
                  </li>
                ))}
              </ul>
            )}
            {n.historico.length > 0 && (
              <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
                {n.historico.map((h, i) => (
                  <p key={i} className="text-caption text-ink-tertiary">
                    <span className="font-medium text-ink-secondary">{formatDateShort(h.data)}</span> — {h.descricao}
                  </p>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}

export function SupplierRisksSection({ supplier }: { supplier: Supplier }) {
  const riscos = getRisksBySupplier(supplier.id)
  if (riscos.length === 0) return null

  return (
    <section>
      <SectionHeader title="Riscos" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {riscos.map((r) => (
          <Card key={r.id}>
            <p className="text-card-title text-ink-primary">{r.titulo}</p>
            <p className="mt-1 text-support leading-relaxed text-ink-secondary">{r.descricao}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ink-tertiary">
              <span>Probabilidade: {riskLevelLabels[r.probabilidade]}</span>
              <span>Impacto: {riskLevelLabels[r.impacto]}</span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function SupplierHistorySection({ supplier }: { supplier: Supplier }) {
  const eventos = getHistoryBySupplier(supplier.id)
  const navigate = useNavigate()
  if (eventos.length === 0) return null

  return (
    <section>
      <SectionHeader title="Histórico" />
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
        {eventos.map((e) => (
          <button
            key={e.id}
            onClick={() => e.link && navigate(e.link.path)}
            className="flex items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-surface-hover"
          >
            <div className="min-w-0">
              <p className="text-support font-medium text-ink-primary">{e.titulo}</p>
              <p className="text-caption text-ink-tertiary">{e.descricao}</p>
            </div>
            <span className="shrink-0 text-caption text-ink-tertiary">{formatDateShort(e.data)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
