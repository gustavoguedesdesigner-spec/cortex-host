import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DocumentConfidenceBadge, ReceiptFieldBadge, QuarantineStatusBadge } from '@/components/receiving/ReceivingBadges'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { getQuarantineByReceipt } from '@/data/receiving/quarantine'
import { diasParaVencimento } from '@/utils/receivingConference'
import { formatCurrencyBRL, formatCurrencyPreciseBRL, formatDateFull, formatDateShort } from '@/utils/format'
import { useAppState } from '@/context/AppStateContext'
import type { Receipt } from '@/types'

export function ReceiptCortexSection({ receipt }: { receipt: Receipt }) {
  const { askCortex } = useAppState()
  const supplier = getSupplierById(receipt.supplierId)

  const texto =
    receipt.id === 'rec-9821'
      ? `Este recebimento está divergente. A ${supplier?.nome} entregou 520 kg de carne bovina — 30 kg a menos que o pedido de 550 kg — a R$ 37,50/kg, R$ 3,14 acima do preço acordado. O impacto financeiro é de ${formatCurrencyBRL(receipt.impactoFinanceiro)}. O recebimento foi aceito parcialmente e o fornecedor já foi cobrado formalmente.`
      : receipt.id === 'rec-9860'
        ? `Recebimento parcial do pedido PO-4532. A ${supplier?.nome} entregou 320L de chope IPA de um pedido de 400L — o saldo de 80L (${formatCurrencyBRL(receipt.impactoFinanceiro)}) já está confirmado para entrega complementar no mesmo dia.`
        : receipt.status === 'quarentena'
          ? `Item retido em quarentena por divergência de qualidade. Nenhuma decisão de liberação foi tomada — o item permanece fora do estoque disponível até avaliação.`
          : receipt.impactoFinanceiro > 0
            ? `Recebimento com divergência registrada, impacto de ${formatCurrencyBRL(receipt.impactoFinanceiro)}. ${receipt.motivoDecisao ?? ''}`
            : `Recebimento conferido sem divergências — pedido, documento, quantidade física e qualidade conferem integralmente.`

  return (
    <Card elevation="raised" className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-label uppercase tracking-[0.06em] text-accent">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />
        Resumo do CORTEX
      </div>
      <p className="text-body leading-relaxed text-ink-secondary">{texto}</p>
      <div>
        <Button size="sm" variant="ghost" onClick={() => askCortex('Existe alternativa para este fornecedor?', supplier?.nome ?? receipt.supplierId)}>
          Perguntar ao CORTEX
        </Button>
      </div>
    </Card>
  )
}

export function DocumentReadingSection({ receipt }: { receipt: Receipt }) {
  if (!receipt.leituraDocumento) return null
  const l = receipt.leituraDocumento

  return (
    <section>
      <SectionHeader title="Leitura do documento" description="Leitura assistida da nota fiscal — simulada, sempre sujeita a conferência manual" />
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-support font-medium text-ink-primary">NF {receipt.nfNumero}</span>
          <DocumentConfidenceBadge nivel={l.confianca} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-label text-ink-tertiary">Campos lidos</p>
            <ul className="flex flex-col gap-1 text-support text-ink-secondary">
              {l.camposLidos.map((c) => (
                <li key={c}>· {c}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1.5 text-label text-ink-tertiary">Campos divergentes do pedido</p>
            {l.camposDivergentes.length === 0 ? (
              <p className="text-support text-success">Nenhum campo divergente identificado.</p>
            ) : (
              <ul className="flex flex-col gap-1 text-support text-danger">
                {l.camposDivergentes.map((c) => (
                  <li key={c}>· {c}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {l.observacao && <p className="mt-3 border-t border-border pt-3 text-caption text-ink-tertiary">{l.observacao}</p>}
      </Card>
    </section>
  )
}

export function ConferenceItemsSection({ receipt }: { receipt: Receipt }) {
  if (receipt.itens.length === 0) return null

  return (
    <section>
      <SectionHeader title="Conferência" description="Pedido × documento × físico × preço × qualidade × lote × validade" />
      <div className="flex flex-col gap-4">
        {receipt.itens.map((item) => {
          const dias = diasParaVencimento(item.validade)
          return (
            <Card key={item.itemId} className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-card-title text-ink-primary">{item.nome}</p>
                {item.observacao && <span className="max-w-xs text-right text-caption text-ink-tertiary">{item.observacao}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-label text-ink-tertiary">Quantidade pedida</p>
                  <p className="tabular text-ink-primary">
                    {item.quantidadePedida} {item.unidadeMedida}
                  </p>
                </div>
                <div>
                  <p className="text-label text-ink-tertiary">Quantidade no documento</p>
                  <p className="tabular text-ink-primary">
                    {item.quantidadeDocumento} {item.unidadeMedida}
                  </p>
                </div>
                <div>
                  <p className="text-label text-ink-tertiary">Quantidade física</p>
                  <p className="tabular text-ink-primary">
                    {item.quantidadeFisica} {item.unidadeMedida}
                  </p>
                </div>
                <div>
                  <p className="text-label text-ink-tertiary">Preço acordado</p>
                  <p className="tabular text-ink-primary">{formatCurrencyPreciseBRL(item.precoAcordado)}</p>
                </div>
                <div>
                  <p className="text-label text-ink-tertiary">Preço no documento</p>
                  <p className="tabular text-ink-primary">{formatCurrencyPreciseBRL(item.precoDocumento)}</p>
                </div>
                {item.temperaturaC !== undefined && (
                  <div>
                    <p className="text-label text-ink-tertiary">Temperatura de recebimento</p>
                    <p className="tabular text-ink-primary">{item.temperaturaC}°C</p>
                  </div>
                )}
                {item.lote && (
                  <div>
                    <p className="text-label text-ink-tertiary">Lote</p>
                    <p className="text-ink-primary">{item.lote}</p>
                  </div>
                )}
                {item.validade && (
                  <div>
                    <p className="text-label text-ink-tertiary">Validade</p>
                    <p className="text-ink-primary">
                      {formatDateShort(item.validade)}
                      {dias !== null && <span className="text-caption text-ink-tertiary"> · {dias >= 0 ? `${dias} dias` : 'vencido'}</span>}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                <ReceiptFieldBadge status={item.quantidadeStatus} />
                <ReceiptFieldBadge status={item.precoStatus} />
                <ReceiptFieldBadge status={item.qualidadeStatus} />
                <ReceiptFieldBadge status={item.loteValidadeStatus} />
                {item.temperaturaStatus && item.temperaturaStatus !== 'nao_aplicavel' && <ReceiptFieldBadge status={item.temperaturaStatus} />}
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export function ReceiptDecisionSection({ receipt, updateReceiptStatus }: { receipt: Receipt; updateReceiptStatus: (id: string, status: Receipt['status']) => void }) {
  const [feedback, setFeedback] = useState<string | null>(null)

  function decidir(status: Receipt['status'], msg: string) {
    updateReceiptStatus(receipt.id, status)
    setFeedback(msg)
    window.setTimeout(() => setFeedback(null), 3600)
  }

  return (
    <section>
      <SectionHeader title="Decisão" />
      {feedback && <p className="mb-3 rounded-xl border border-success-line bg-success-soft px-4 py-3 text-support text-success">{feedback}</p>}
      <Card className="flex flex-col gap-3">
        {receipt.motivoDecisao && <p className="text-support leading-relaxed text-ink-secondary">{receipt.motivoDecisao}</p>}
        {(receipt.status === 'em_conferencia' || receipt.status === 'aguardando') && (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => decidir('conforme', 'Recebimento aceito integralmente. Estoque atualizado.')}>
              Aceitar integralmente
            </Button>
            <Button size="sm" variant="secondary" onClick={() => decidir('divergente', 'Recebimento aceito parcialmente — divergência registrada.')}>
              Aceitar parcialmente
            </Button>
            <Button size="sm" variant="secondary" onClick={() => decidir('quarentena', 'Item enviado para quarentena até nova avaliação.')}>
              Enviar para quarentena
            </Button>
            <Button size="sm" variant="danger" onClick={() => decidir('recusado', 'Recebimento recusado — nenhum item entrou em estoque.')}>
              Recusar
            </Button>
          </div>
        )}
      </Card>
    </section>
  )
}

export function ReceiptQuarantineSection({ receipt }: { receipt: Receipt }) {
  const registros = getQuarantineByReceipt(receipt.id)
  if (registros.length === 0) return null

  return (
    <section>
      <SectionHeader title="Quarentena" />
      <div className="flex flex-col gap-3">
        {registros.map((q) => (
          <Card key={q.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-card-title text-ink-primary">{q.itemNome}</p>
                <p className="mt-1 text-support leading-relaxed text-ink-secondary">{q.motivo}</p>
              </div>
              <QuarantineStatusBadge status={q.status} />
            </div>
            <p className="mt-2 text-caption text-ink-tertiary">
              Em quarentena desde {formatDateFull(q.dataInicio)} · Responsável {q.responsavel}
            </p>
            {q.decisaoFinal && <p className="mt-2 border-t border-border pt-2 text-support text-ink-secondary">{q.decisaoFinal}</p>}
          </Card>
        ))}
      </div>
    </section>
  )
}

export function ReceiptTimelineSection({ receipt }: { receipt: Receipt }) {
  const navigate = useNavigate()

  return (
    <section>
      <SectionHeader title="Histórico do recebimento" />
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
        {receipt.timeline.map((e, i) => (
          <div
            key={i}
            role={e.link ? 'button' : undefined}
            onClick={() => e.link && navigate(e.link.path)}
            className={`flex items-center justify-between gap-4 px-5 py-3.5 ${e.link ? 'cursor-pointer transition-colors hover:bg-surface-hover' : ''}`}
          >
            <div className="min-w-0">
              <p className="text-support font-medium text-ink-primary">{e.descricao}</p>
              <p className="text-caption text-ink-tertiary">Responsável {e.responsavel}</p>
            </div>
            <span className="shrink-0 text-caption text-ink-tertiary">{formatDateFull(e.data)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
