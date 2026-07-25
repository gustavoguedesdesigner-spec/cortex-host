import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { approvalDelegations, approvalLimitRules } from '@/data/administration/approvalLimits'
import { approvalChainLabel } from '@/utils/approvalLimits'
import { formatDateFull } from '@/utils/format'

const modules = ['Compras', 'Estoque', 'Fichas Técnicas', 'Biblioteca']

export default function AdminApprovalLimits() {
  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Alçadas' }]} />

      <PageHeader eyebrow="Administração" title="Alçadas" description="Regras de aprovação por módulo, cadeias de aprovação e substituições temporárias." />

      <AdminInternalNav active="alcadas" />

      {modules.map((modulo) => {
        const rules = approvalLimitRules.filter((r) => r.modulo === modulo)
        if (rules.length === 0) return null
        return (
          <section key={modulo}>
            <SectionHeader title={`Alçadas de ${modulo}`} />
            <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
              {rules.map((r) => (
                <div key={r.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-support font-medium text-ink-primary">{r.evento}</p>
                    <p className="text-caption text-ink-tertiary">
                      {r.condicao} · Aprovador: {r.aprovadorPerfil} · {approvalChainLabel[r.cadeia]}
                      {r.etapas > 1 && ` · ${r.etapas} etapas`}
                    </p>
                    {r.excecao && <p className="text-caption text-warning">{r.excecao}</p>}
                  </div>
                  <IndicatorBadge status={r.status === 'ativa' ? 'success' : 'neutral'}>{r.status === 'ativa' ? 'Ativa' : 'Inativa'}</IndicatorBadge>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      <section>
        <SectionHeader title="Construtor de regras" description="Simulação da configuração — não representa automação técnica real (seção 44)" />
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-support text-ink-secondary">
            <span className="font-medium text-ink-primary">Quando:</span> Pedido acima de R$ 10.000
          </p>
          <p className="mt-1 text-support text-ink-secondary">
            <span className="font-medium text-ink-primary">Então:</span> Solicitar aprovação do Diretor de Operações
          </p>
          <p className="mt-1 text-support text-ink-secondary">
            <span className="font-medium text-ink-primary">E:</span> Impedir emissão antes da aprovação
          </p>
        </div>
      </section>

      <section>
        <SectionHeader title="Substituições" description="Configuração para férias e ausências — não transfere permissões além do escopo definido" />
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
          {approvalDelegations.map((d) => (
            <div key={d.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-support font-medium text-ink-primary">
                  {d.aprovadorPrincipal} → {d.substituto}
                </p>
                <p className="text-caption text-ink-tertiary">
                  {formatDateFull(d.inicioIso)} a {formatDateFull(d.fimIso)} · Escopo: {d.escopo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
