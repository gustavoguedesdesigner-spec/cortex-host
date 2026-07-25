import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { ComprasBreadcrumb } from '@/components/purchasing/ComprasBreadcrumb'
import { ComprasInternalNav } from '@/components/purchasing/ComprasInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Table, type TableColumn } from '@/components/ui/Table'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { RequisitionStatusBadge } from '@/components/purchasing/RequisitionStatusBadge'
import { UrgencyBadge } from '@/components/purchasing/UrgencyBadge'
import { usePurchasing } from '@/hooks/usePurchasing'
import { units, getUnitById } from '@/data/units'
import { purchaseCategories } from '@/data/purchasing/categories'
import { resolverAlcadaCompra } from '@/utils/purchasingCalculations'
import { formatCurrencyBRL, formatDateShort } from '@/utils/format'
import type { PurchaseRequisition, RequisitionStatus } from '@/types'

const statusFilters: { value: RequisitionStatus | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'aguardando_aprovacao', label: 'Aguardando aprovação' },
  { value: 'aprovada', label: 'Aprovada' },
  { value: 'em_cotacao', label: 'Em cotação' },
  { value: 'devolvida', label: 'Devolvida' },
  { value: 'rascunho', label: 'Rascunho' },
]

const steps = ['Unidade e contexto', 'Itens', 'Alternativas', 'Aprovação', 'Revisão e envio']

export default function ComprasRequisicoes() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { allRequisitions, createRequisition } = usePurchasing()
  const [filtro, setFiltro] = useState<RequisitionStatus | 'todas'>('todas')

  const wizardOpen = searchParams.get('nova') === '1'
  const closeWizard = () => setSearchParams((prev) => { const p = new URLSearchParams(prev); p.delete('nova'); return p })
  const unidadeFiltro = searchParams.get('unidade')

  const [step, setStep] = useState(0)
  const [unitId, setUnitId] = useState(units[0].id)
  const [categoria, setCategoria] = useState(purchaseCategories[0].categoria)
  const [motivo, setMotivo] = useState('')
  const [itemNome, setItemNome] = useState('')
  const [quantidade, setQuantidade] = useState(10)
  const [custoUnitario, setCustoUnitario] = useState(10)

  const valorEstimado = quantidade * custoUnitario
  const alcada = resolverAlcadaCompra(valorEstimado, false)

  const filtered = useMemo(
    () => allRequisitions.filter((r) => (filtro === 'todas' || r.status === filtro) && (!unidadeFiltro || r.unitId === unidadeFiltro)),
    [allRequisitions, filtro, unidadeFiltro],
  )

  const columns: TableColumn<PurchaseRequisition>[] = [
    { key: 'id', header: 'Requisição', render: (r) => <span className="font-medium uppercase">{r.id}</span> },
    { key: 'unidade', header: 'Unidade', render: (r) => getUnitById(r.unitId)?.nomeCurto ?? r.unitId },
    { key: 'categoria', header: 'Categoria', render: (r) => r.categoria },
    { key: 'solicitante', header: 'Solicitante', render: (r) => r.solicitante },
    { key: 'prioridade', header: 'Prioridade', render: (r) => <UrgencyBadge urgencia={r.prioridade} /> },
    { key: 'valor', header: 'Valor estimado', align: 'right', render: (r) => formatCurrencyBRL(r.valorEstimado) },
    { key: 'necessaria', header: 'Data necessária', align: 'right', render: (r) => formatDateShort(r.dataNecessaria) },
    { key: 'status', header: 'Status', render: (r) => <RequisitionStatusBadge status={r.status} /> },
  ]

  function resetWizard() {
    setStep(0)
    setUnitId(units[0].id)
    setCategoria(purchaseCategories[0].categoria)
    setMotivo('')
    setItemNome('')
    setQuantidade(10)
    setCustoUnitario(10)
  }

  function handleSubmit() {
    const req = createRequisition({
      unitId,
      solicitante: 'Leo',
      categoria,
      itens: [{ itemId: `item-${Date.now()}`, nome: itemNome || 'Item sem nome', quantidade, unidadeMedida: 'unidade', custoEstimadoUnitario: custoUnitario }],
      motivo: motivo || 'Reposição solicitada manualmente.',
      prioridade: 'media',
      dataNecessaria: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    })
    resetWizard()
    closeWizard()
    navigate(`/compras/requisicoes/${req.id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <ComprasBreadcrumb trail={[{ label: 'Requisições' }]} />
      <PageHeader
        eyebrow="Suprimentos"
        title="Requisições de compra"
        description="Pedidos internos de compra, com motivo, alternativas avaliadas e histórico completo de decisão."
        actions={
          <Button variant="primary" onClick={() => setSearchParams((prev) => { const p = new URLSearchParams(prev); p.set('nova', '1'); return p })}>
            Nova requisição
          </Button>
        }
      />
      <ComprasInternalNav active="requisicoes" />

      <SectionHeader title="Todas as requisições" actions={<SegmentedControl value={filtro} onChange={setFiltro} options={statusFilters} />} />

      {filtered.length === 0 ? (
        <EmptyState icon={<SlidersHorizontal className="h-5 w-5" />} title="Nenhuma requisição encontrada" description="Ajuste os filtros para ver outras requisições." />
      ) : (
        <Table columns={columns} data={filtered} getRowId={(r) => r.id} onRowClick={(r) => navigate(`/compras/requisicoes/${r.id}`)} />
      )}

      <Modal
        isOpen={wizardOpen}
        onClose={() => { resetWizard(); closeWizard() }}
        title="Nova requisição"
        description={`Etapa ${step + 1} de ${steps.length} — ${steps[step]}`}
        size="lg"
        footer={
          <>
            {step > 0 && (
              <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
                Voltar
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button variant="primary" onClick={() => setStep((s) => s + 1)}>
                Avançar
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit}>
                Enviar requisição
              </Button>
            )}
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {step === 0 && (
            <>
              <Select label="Unidade" options={units.map((u) => ({ value: u.id, label: u.nome }))} value={unitId} onChange={(e) => setUnitId(e.target.value)} />
              <Select label="Categoria" options={purchaseCategories.map((c) => ({ value: c.categoria, label: c.categoria }))} value={categoria} onChange={(e) => setCategoria(e.target.value)} />
              <Input label="Motivo da requisição" placeholder="Ex.: reposição programada, risco de ruptura..." value={motivo} onChange={(e) => setMotivo(e.target.value)} />
            </>
          )}
          {step === 1 && (
            <>
              <Input label="Item" placeholder="Nome do item" value={itemNome} onChange={(e) => setItemNome(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Quantidade" type="number" min={1} value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
                <Input label="Custo estimado por unidade (R$)" type="number" min={0} step="0.01" value={custoUnitario} onChange={(e) => setCustoUnitario(Number(e.target.value))} />
              </div>
              <p className="text-caption text-ink-tertiary">Valor estimado total: {formatCurrencyBRL(valorEstimado)}</p>
            </>
          )}
          {step === 2 && (
            <div className="rounded-md border border-border bg-surface-subtle p-4 text-support text-ink-secondary">
              O CORTEX verificou o saldo desta categoria em todas as unidades. Nenhuma unidade com saldo suficiente para transferência foi encontrada para este item — a requisição seguirá como
              compra direta.
            </div>
          )}
          {step === 3 && (
            <div className="rounded-md border border-border bg-surface-subtle p-4 text-support text-ink-secondary">
              {alcada ? (
                <p>
                  Para {formatCurrencyBRL(valorEstimado)}, a alçada exige aprovação de <strong className="text-ink-primary">{alcada.aprovadorPerfil}</strong>.
                </p>
              ) : (
                <p>Nenhuma regra de alçada encontrada para este valor — será encaminhada para aprovação padrão.</p>
              )}
            </div>
          )}
          {step === 4 && (
            <div className="flex flex-col gap-2 text-support">
              <p>
                <span className="text-ink-tertiary">Unidade: </span>
                {getUnitById(unitId)?.nome}
              </p>
              <p>
                <span className="text-ink-tertiary">Categoria: </span>
                {categoria}
              </p>
              <p>
                <span className="text-ink-tertiary">Item: </span>
                {itemNome || 'Item sem nome'} — {quantidade} unidades
              </p>
              <p>
                <span className="text-ink-tertiary">Valor estimado: </span>
                {formatCurrencyBRL(valorEstimado)}
              </p>
              <p>
                <span className="text-ink-tertiary">Motivo: </span>
                {motivo || 'Reposição solicitada manualmente.'}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
