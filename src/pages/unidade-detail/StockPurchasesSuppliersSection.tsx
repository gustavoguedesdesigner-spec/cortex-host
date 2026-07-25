import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { formatCurrencyBRL } from '@/utils/format'
import type { Unit, UnitProfile } from '@/types'

export function StockPurchasesSuppliersSection({ unit, profile }: { unit: Unit; profile: UnitProfile }) {
  const navigate = useNavigate()
  return (
    <section className="flex flex-col gap-4">
      <SectionHeader title="Estoque, compras e fornecedores" description="Panorama resumido da unidade — detalhes completos nos módulos dedicados" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-card-title text-ink-primary mb-3">Estoque e inventários</p>
          <DataList
            items={[
              { label: 'Valor em estoque', value: formatCurrencyBRL(unit.valorEstoque) },
              { label: 'Acuracidade estimada', value: `${(profile.estoque.acuraciadeEstimada * 100).toFixed(1)}%` },
              { label: 'Itens críticos', value: profile.estoque.itensCriticos },
              { label: 'Itens em excesso', value: profile.estoque.itensExcesso },
              { label: 'Transferências pendentes', value: profile.estoque.transferenciasPendentes },
            ]}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <Button size="sm" variant="secondary">Iniciar contagem</Button>
            <Button size="sm" variant="ghost">Ver estoque</Button>
          </div>
        </Card>

        <Card>
          <p className="text-card-title text-ink-primary mb-3">Compras e recebimentos</p>
          <DataList
            items={[
              { label: 'Compras no período', value: formatCurrencyBRL(unit.compras) },
              { label: 'Pedidos em aberto', value: profile.compras.pedidosEmAberto },
              { label: 'Compras emergenciais', value: profile.compras.comprasEmergenciais },
              { label: 'Divergências', value: profile.compras.divergencias },
              { label: 'Valor em divergência', value: formatCurrencyBRL(profile.compras.valorDivergencias) },
            ]}
          />
          {profile.compras.registros.length > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              {profile.compras.registros.map((r) => (
                <div key={r.identificador} className="rounded-md bg-surface-subtle border border-border px-3 py-2 text-support">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink-primary">{r.identificador} · {r.fornecedor}</span>
                    {r.impacto && <span className="text-danger font-medium">{formatCurrencyBRL(r.impacto)}</span>}
                  </div>
                  <p className="text-caption text-ink-tertiary mt-0.5">{r.status} — {r.detalhe}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <Button size="sm" variant="secondary" onClick={() => navigate(`/compras/requisicoes?unidade=${unit.id}`)}>Ver requisições</Button>
            <Button size="sm" variant="ghost" onClick={() => navigate('/recebimentos')}>Conferir recebimentos</Button>
          </div>
        </Card>

        <Card>
          <p className="text-card-title text-ink-primary mb-3">Fornecedores da unidade</p>
          <div className="flex flex-col gap-2">
            {profile.fornecedores.map((f) => (
              <div key={f.nome} className="rounded-md bg-surface-subtle border border-border px-3 py-2">
                <div className="flex items-center justify-between text-support">
                  <span className="font-medium text-ink-primary">{f.nome}</span>
                  <span
                    className={cn(
                      'text-badge font-semibold rounded-full border px-2 py-0.5',
                      f.status === 'critico'
                        ? 'bg-danger-soft text-danger border-danger/30'
                        : f.status === 'atencao'
                          ? 'bg-warning-soft text-warning border-warning/30'
                          : 'bg-success-soft text-success border-success/30',
                    )}
                  >
                    {f.status === 'critico' ? 'Crítico' : f.status === 'atencao' ? 'Atenção' : 'Ok'}
                  </span>
                </div>
                <p className="text-caption text-ink-tertiary mt-1">
                  {formatCurrencyBRL(f.totalComprado)} comprado
                  {f.variacaoPreco !== undefined && ` · +${(f.variacaoPreco * 100).toFixed(1)}% preço`}
                  {f.divergenciasUnidade > 0 && ` · ${f.divergenciasUnidade} divergência(s) aqui`}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  )
}
