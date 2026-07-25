import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, CheckSquare, Undo2, XCircle } from 'lucide-react'
import { ComprasBreadcrumb } from '@/components/purchasing/ComprasBreadcrumb'
import { ComprasInternalNav } from '@/components/purchasing/ComprasInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { Drawer } from '@/components/ui/Drawer'
import { DataList } from '@/components/ui/DataList'
import { UrgencyBadge } from '@/components/purchasing/UrgencyBadge'
import { requisitionAlertLabels } from '@/components/purchasing/requisitionAlertLabels'
import { usePurchasing } from '@/hooks/usePurchasing'
import { getUnitById, units } from '@/data/units'
import { getPurchaseNeedById } from '@/data/purchasing/purchaseNeeds'
import { resolverAlcadaCompra } from '@/utils/purchasingCalculations'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'
import type { PurchaseRequisition } from '@/types'

export default function ComprasAprovacoes() {
  const navigate = useNavigate()
  const { allRequisitions, approveRequisition, rejectRequisition, returnRequisition } = usePurchasing()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [justificativa, setJustificativa] = useState('')

  const pendentes = allRequisitions.filter((r) => r.status === 'aguardando_aprovacao')
  const selected = selectedId ? allRequisitions.find((r) => r.id === selectedId) : undefined
  const necessidade = selected?.necessidadeOrigemId ? getPurchaseNeedById(selected.necessidadeOrigemId) : undefined
  const alcada = selected ? resolverAlcadaCompra(selected.valorEstimado, selected.alertas.includes('compra_emergencial')) : undefined
  const outrasUnidades = selected ? units.filter((u) => u.id !== selected.unitId).map((u) => u.nomeCurto) : []

  const columns: TableColumn<PurchaseRequisition>[] = [
    { key: 'id', header: 'Requisição', render: (r) => <span className="font-medium uppercase">{r.id}</span> },
    { key: 'unidade', header: 'Unidade', render: (r) => getUnitById(r.unitId)?.nomeCurto ?? r.unitId },
    { key: 'solicitante', header: 'Solicitante', render: (r) => r.solicitante },
    { key: 'valor', header: 'Valor estimado', align: 'right', render: (r) => formatCurrencyBRL(r.valorEstimado) },
    { key: 'alcada', header: 'Alçada exigida', render: (r) => resolverAlcadaCompra(r.valorEstimado, r.alertas.includes('compra_emergencial'))?.aprovadorPerfil ?? '—' },
    { key: 'prioridade', header: 'Prioridade', render: (r) => <UrgencyBadge urgencia={r.prioridade} /> },
    {
      key: 'alertas',
      header: 'Alertas',
      render: (r) => (r.alertas.length > 0 ? <span className="text-caption text-warning">{r.alertas.length} alerta{r.alertas.length > 1 ? 's' : ''}</span> : '—'),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <ComprasBreadcrumb trail={[{ label: 'Aprovações' }]} />
      <PageHeader eyebrow="Suprimentos" title="Central de aprovações" description="Todo o contexto antes de decidir — nenhuma aprovação acontece às cegas." />
      <ComprasInternalNav active="aprovacoes" />

      <SectionHeader title={`${pendentes.length} requisições aguardando aprovação`} />

      {pendentes.length === 0 ? (
        <EmptyState icon={<CheckSquare className="h-5 w-5" />} title="Nenhuma aprovação pendente" description="Todas as requisições foram decididas." />
      ) : (
        <Table columns={columns} data={pendentes} getRowId={(r) => r.id} onRowClick={(r) => { setSelectedId(r.id); setJustificativa('') }} />
      )}

      <Drawer isOpen={!!selected} onClose={() => setSelectedId(null)} title={selected ? selected.id.toUpperCase() : ''} subtitle={selected ? getUnitById(selected.unitId)?.nome : undefined}>
        {selected && (
          <div className="flex flex-col gap-5">
            <p className="text-support leading-relaxed text-ink-secondary">{selected.motivo}</p>

            <DataList
              items={[
                { label: 'Itens', value: selected.itens.map((i) => `${i.nome} (${i.quantidade} ${i.unidadeMedida})`).join(', ') },
                { label: 'Valor estimado', value: formatCurrencyBRL(selected.valorEstimado) },
                { label: 'Data necessária', value: formatDateFull(selected.dataNecessaria) },
                { label: 'Alçada exigida', value: alcada?.aprovadorPerfil ?? '—' },
                { label: 'Orçamento', value: alcada?.condicao ?? '—' },
              ]}
            />

            {necessidade && (
              <div className="rounded-md border border-border bg-surface-subtle p-3">
                <p className="mb-2 text-label text-ink-tertiary">Contexto de estoque</p>
                <DataList
                  items={[
                    { label: 'Saldo disponível', value: `${necessidade.saldoDisponivel} ${necessidade.unidadeMedida}` },
                    { label: 'Cobertura atual', value: necessidade.cobertura !== null ? `${necessidade.cobertura.toFixed(1)} dias` : '—' },
                    { label: 'Consumo médio diário', value: `${necessidade.consumoMedioDiario} ${necessidade.unidadeMedida}` },
                    { label: 'Pedido existente', value: necessidade.pedidosEmAbertoQuantidade > 0 ? `${necessidade.pedidosEmAbertoQuantidade} ${necessidade.unidadeMedida}` : 'Nenhum' },
                    { label: 'Estoque em trânsito', value: `${necessidade.estoqueEmTransito} ${necessidade.unidadeMedida}` },
                    { label: 'Transferência disponível', value: necessidade.transferenciaPossivelUnitId ? `${necessidade.transferenciaPossivelQuantidade} de ${getUnitById(necessidade.transferenciaPossivelUnitId)?.nomeCurto}` : 'Nenhuma' },
                  ]}
                />
              </div>
            )}

            {selected.alertas.length > 0 && (
              <div>
                <p className="mb-1 text-label text-ink-tertiary">Alertas</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.alertas.map((a) => (
                    <span key={a} className="rounded-full bg-warning-soft px-2 py-0.5 text-badge text-warning">
                      {requisitionAlertLabels[a]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-caption text-ink-tertiary">Outras unidades da rede: {outrasUnidades.join(', ')}</p>

            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate(`/compras/requisicoes/${selected.id}`)}>
              Ver detalhe completo da requisição
            </Button>

            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <Button
                variant="primary"
                leftIcon={<CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.7} />}
                onClick={() => { approveRequisition(selected.id, 'Leo'); setSelectedId(null) }}
              >
                Aprovar
              </Button>
              <Input placeholder="Justificativa (para devolver ou rejeitar)" value={justificativa} onChange={(e) => setJustificativa(e.target.value)} />
              <Button
                variant="secondary"
                leftIcon={<Undo2 className="h-3.5 w-3.5" strokeWidth={1.7} />}
                onClick={() => { returnRequisition(selected.id, 'Leo', justificativa || 'Devolvida para revisão.'); setSelectedId(null) }}
              >
                Devolver para o solicitante
              </Button>
              <Button
                variant="ghost"
                leftIcon={<XCircle className="h-3.5 w-3.5" strokeWidth={1.7} />}
                onClick={() => { rejectRequisition(selected.id, 'Leo', justificativa || 'Rejeitada.'); setSelectedId(null) }}
              >
                Rejeitar
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
