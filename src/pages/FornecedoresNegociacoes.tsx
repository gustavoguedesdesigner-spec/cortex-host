import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Handshake } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { SuppliersBreadcrumb } from '@/components/suppliers/SuppliersBreadcrumb'
import { SuppliersInternalNav } from '@/components/suppliers/SuppliersInternalNav'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { SupplierNegotiationBadge } from '@/components/suppliers/SupplierBadges'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { useSuppliers } from '@/hooks/useSuppliers'
import { formatCurrencyBRL, formatDateShort } from '@/utils/format'

export default function FornecedoresNegociacoes() {
  const navigate = useNavigate()
  const { allNegotiations, updateNegotiationStatus } = useSuppliers()
  const [feedback, setFeedback] = useState<string | null>(null)

  function mostrarFeedback(msg: string) {
    setFeedback(msg)
    window.setTimeout(() => setFeedback(null), 3600)
  }

  return (
    <div className="flex flex-col gap-8">
      <SuppliersBreadcrumb trail={[{ label: 'Negociações' }]} />
      <PageHero eyebrow="Fornecedores" title="Negociações" description="Rodadas comerciais em andamento — preço, prazo, volume e SLA — com histórico de propostas e cenários." />
      <SuppliersInternalNav active="negociacoes" />

      {feedback && <p className="rounded-xl border border-success-line bg-success-soft px-4 py-3 text-support text-success">{feedback}</p>}

      <SectionHeader title={`${allNegotiations.length} negociações`} />

      {allNegotiations.length === 0 ? (
        <EmptyState icon={<Handshake className="h-5 w-5" />} title="Nenhuma negociação em andamento" />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {allNegotiations.map((n) => {
            const supplier = getSupplierById(n.supplierId)
            return (
              <Card key={n.id} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <button onClick={() => supplier && navigate(`/fornecedores/${supplier.id}`)} className="text-card-title text-ink-primary hover:text-accent">
                      {n.titulo}
                    </button>
                    <p className="text-caption text-ink-tertiary">
                      {supplier?.nome} · {n.categoria}
                    </p>
                  </div>
                  <SupplierNegotiationBadge status={n.status} />
                </div>

                <DataList
                  items={[
                    { label: 'Responsável', value: n.responsavel },
                    { label: 'Valor anual relacionado', value: formatCurrencyBRL(n.valorAnualRelacionado) },
                    { label: 'Potencial estimado', value: formatCurrencyBRL(n.potencialEstimado) },
                    { label: 'Prazo', value: formatDateShort(n.prazo) },
                  ]}
                />
                <p className="text-caption text-ink-tertiary">Estimativa demonstrativa. Não representa economia garantida.</p>

                {n.objetivos.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {n.objetivos.map((o) => (
                      <li key={o} className="rounded-full bg-surface-subtle px-2.5 py-1 text-caption text-ink-secondary">
                        {o}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-1 flex flex-wrap gap-2 border-t border-border pt-3">
                  {supplier && (
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/fornecedores/${supplier.id}`)}>
                      Abrir fornecedor
                    </Button>
                  )}
                  {n.status !== 'concluida' && n.status !== 'cancelada' && (
                    <Button
                      size="sm"
                      leftIcon={<CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.7} />}
                      onClick={() => {
                        updateNegotiationStatus(n.id, 'concluida')
                        mostrarFeedback(`Negociação "${n.titulo}" marcada como concluída.`)
                      }}
                    >
                      Concluir negociação
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
