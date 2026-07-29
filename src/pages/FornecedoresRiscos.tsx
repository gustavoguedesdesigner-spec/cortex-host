import { useNavigate } from 'react-router-dom'
import { PageHero } from '@/components/ui/PageHero'
import { SuppliersBreadcrumb } from '@/components/suppliers/SuppliersBreadcrumb'
import { SuppliersInternalNav } from '@/components/suppliers/SuppliersInternalNav'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { SupplierRiskBadge } from '@/components/suppliers/SupplierBadges'
import { supplierRisks } from '@/data/suppliers/supplierRisks'
import { dependencyRisks, dependencyRiskNote } from '@/data/suppliers/supplierSummary'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { combinarRisco, riskLevelLabels } from '@/utils/supplierRisk'
import { formatPercent } from '@/utils/format'
import type { SupplierRiskLevel, SupplierRiskType } from '@/types'

const taxonomyLabels: Record<SupplierRiskType, string> = {
  dependencia: 'Dependência',
  preco: 'Preço',
  qualidade: 'Qualidade',
  prazo: 'Prazo',
  quantidade: 'Quantidade',
  documentacao: 'Documentação',
  capacidade: 'Capacidade',
  logistica: 'Logística',
  financeiro: 'Financeiro',
  reputacional: 'Reputacional',
  continuidade: 'Continuidade',
  concentracao_geografica: 'Concentração geográfica',
}

const levels: SupplierRiskLevel[] = ['baixo', 'medio', 'alto']

export default function FornecedoresRiscos() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-8">
      <SuppliersBreadcrumb trail={[{ label: 'Riscos' }]} />
      <PageHero eyebrow="Fornecedores" title="Riscos" description="Dependência, preço, qualidade, prazo, documentação e continuidade — cada risco visto pela probabilidade e pelo impacto que representa." />
      <SuppliersInternalNav active="riscos" />

      <section>
        <SectionHeader title="Risco de dependência" description={dependencyRiskNote} />
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

      <section>
        <SectionHeader title="Matriz de risco" description="Fornecedores posicionados por probabilidade e impacto do risco mais crítico registrado" />
        <div className="overflow-x-auto">
          <div className="grid min-w-[560px] grid-cols-4 gap-2">
            <div />
            {levels.map((l) => (
              <div key={l} className="text-center text-label text-ink-tertiary">
                Impacto {riskLevelLabels[l].toLowerCase()}
              </div>
            ))}
            {levels
              .slice()
              .reverse()
              .map((prob) => (
                <div key={prob} className="contents">
                  <div className="flex items-center text-label text-ink-tertiary">Probabilidade {riskLevelLabels[prob].toLowerCase()}</div>
                  {levels.map((imp) => {
                    const cellRisks = supplierRisks.filter((r) => r.probabilidade === prob && r.impacto === imp)
                    const combinado = combinarRisco(prob, imp)
                    const bg = combinado === 'alto' ? 'bg-danger-soft' : combinado === 'medio' ? 'bg-warning-soft' : 'bg-success-soft'
                    return (
                      <div key={imp} className={`min-h-[84px] rounded-md border border-border p-2.5 ${bg}`}>
                        {cellRisks.map((r) => {
                          const supplier = getSupplierById(r.supplierId)
                          return (
                            <button key={r.id} onClick={() => navigate(`/fornecedores/${r.supplierId}`)} className="mb-1 block truncate text-left text-caption font-medium text-ink-primary hover:text-accent">
                              {supplier?.nome} — {r.titulo}
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader title="Riscos por fornecedor" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {supplierRisks.map((r) => {
            const supplier = getSupplierById(r.supplierId)
            return (
              <Card key={r.id} interactive onClick={() => navigate(`/fornecedores/${r.supplierId}`)}>
                <p className="text-label text-ink-tertiary">{taxonomyLabels[r.tipo]}</p>
                <p className="mt-1 text-card-title text-ink-primary">{r.titulo}</p>
                <p className="mt-1 text-support leading-relaxed text-ink-secondary">{r.descricao}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-caption text-ink-tertiary">{supplier?.nome}</span>
                  <span className="text-caption text-ink-tertiary">·</span>
                  <span className="text-caption text-ink-tertiary">
                    Probabilidade {riskLevelLabels[r.probabilidade].toLowerCase()} · Impacto {riskLevelLabels[r.impacto].toLowerCase()}
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
