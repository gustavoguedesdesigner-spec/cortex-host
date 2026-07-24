import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
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
      <SectionHeader title="Compras e fornecedores" description="Panorama do período e fornecedores que exigem atenção" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-card-title text-content-primary mb-3">Compras</p>
          <DataList
            items={[
              { label: 'Total comprado no período', value: formatCurrencyBRL(purchaseSummary.totalComprado) },
              { label: 'Pedidos em aberto', value: purchaseSummary.pedidosEmAberto },
              { label: 'Requisições aguardando aprovação', value: purchaseSummary.requisicoesAguardandoAprovacao },
              { label: 'Compras emergenciais', value: purchaseSummary.comprasEmergenciais },
              { label: 'Valor em pedidos com divergência', value: formatCurrencyBRL(purchaseSummary.valorEmDivergencia) },
            ]}
          />
        </Card>
        <Card className="flex flex-col">
          <p className="text-card-title text-content-primary mb-3">Fornecedores que exigem atenção</p>
          <div className="flex flex-col gap-2.5 flex-1">
            {supplierAlerts.map((s) => (
              <div key={s.id} className="rounded-md bg-surface-3/60 border border-border-subtle px-3.5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-support font-semibold text-content-primary">{s.nome}</span>
                  <span
                    className={cn(
                      'text-badge font-semibold rounded-full border px-2 py-0.5',
                      s.status === 'critico'
                        ? 'bg-status-criticalBg text-status-critical border-status-critical/30'
                        : 'bg-status-attentionBg text-status-attention border-status-attention/30',
                    )}
                  >
                    {s.status === 'critico' ? 'Crítico' : 'Atenção'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-caption text-content-tertiary">
                  {s.aumentoPreco !== undefined && <span>Aumento de preço: {(s.aumentoPreco * 100).toFixed(1)}%</span>}
                  {s.divergencias !== undefined && <span>Divergências: {s.divergencias}</span>}
                  {s.atrasoMedioDias !== undefined && <span>Atraso médio: {s.atrasoMedioDias} dia</span>}
                  {s.atrasoRecorrente && <span>Atraso recorrente</span>}
                  {s.entregasIncompletas !== undefined && <span>{s.entregasIncompletas} entregas incompletas</span>}
                </div>
              </div>
            ))}
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="mt-3 self-start"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            onClick={() => navigate('/fornecedores')}
          >
            Ver todos os fornecedores
          </Button>
        </Card>
      </div>
    </section>
  )
}
