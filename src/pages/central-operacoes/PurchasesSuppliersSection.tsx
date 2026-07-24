import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { DataList } from '@/components/ui/DataList'
import { purchaseSummary, supplierAlerts } from '@/data/suppliers'
import { formatCurrencyBRL } from '@/utils/format'
import { cn } from '@/utils/cn'

export function PurchasesSuppliersSection() {
  const navigate = useNavigate()

  return (
    <section>
      <SectionHeader
        title="Compras e fornecedores"
        description="Panorama do período e fornecedores que exigem atenção"
        actions={
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => navigate('/fornecedores')}>
            Ver todos os fornecedores
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="mb-3 text-card-title text-ink-secondary">Compras</p>
          <DataList
            items={[
              { label: 'Total comprado no período', value: formatCurrencyBRL(purchaseSummary.totalComprado) },
              { label: 'Pedidos em aberto', value: purchaseSummary.pedidosEmAberto },
              { label: 'Requisições aguardando aprovação', value: purchaseSummary.requisicoesAguardandoAprovacao },
              { label: 'Compras emergenciais', value: purchaseSummary.comprasEmergenciais },
              { label: 'Valor em pedidos com divergência', value: formatCurrencyBRL(purchaseSummary.valorEmDivergencia) },
            ]}
          />
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="mb-3 text-card-title text-ink-secondary">Fornecedores em atenção</p>
          <ul className="flex flex-col divide-y divide-border border-t border-border">
            {supplierAlerts.map((s) => (
              <li key={s.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-support font-medium text-ink-primary">{s.nome}</p>
                  <p className="mt-0.5 flex flex-wrap gap-x-3 text-caption text-ink-tertiary">
                    {s.aumentoPreco !== undefined && <span>Preço +{(s.aumentoPreco * 100).toFixed(1)}%</span>}
                    {s.divergencias !== undefined && <span>{s.divergencias} divergências</span>}
                    {s.atrasoMedioDias !== undefined && <span>Atraso {s.atrasoMedioDias} dia</span>}
                    {s.atrasoRecorrente && <span>Atraso recorrente</span>}
                    {s.entregasIncompletas !== undefined && <span>{s.entregasIncompletas} entregas incompletas</span>}
                  </p>
                </div>
                <span
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-badge',
                    s.status === 'critico' ? 'bg-danger-soft text-danger' : 'bg-warning-soft text-warning',
                  )}
                >
                  <span className={cn('h-1.5 w-1.5 rounded-full', s.status === 'critico' ? 'bg-danger' : 'bg-warning')} aria-hidden="true" />
                  {s.status === 'critico' ? 'Crítico' : 'Atenção'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
