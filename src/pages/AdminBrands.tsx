import { useNavigate } from 'react-router-dom'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataList } from '@/components/ui/DataList'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { brands } from '@/data/administration/organization'
import { units } from '@/data/units'
import { formatDateFull } from '@/utils/format'

export default function AdminBrands() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Marcas' }]} />

      <PageHeader
        eyebrow="Administração"
        title="Marcas"
        description="Estrutura preparada para múltiplas marcas — o protótipo demonstra apenas a marca Salvador, sem personalização visual profunda por marca nesta etapa."
      />

      <AdminInternalNav active="organizacao" />

      {brands.map((b) => (
        <section key={b.id} className="rounded-lg border border-border bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-section-title">{b.nome}</h2>
            <IndicatorBadge status="success">Ativa</IndicatorBadge>
          </div>
          <DataList
            className="mt-4"
            items={[
              { label: 'Responsável', value: b.responsavel },
              { label: 'Produtos vinculados', value: b.produtosVinculados },
              { label: 'Criada em', value: formatDateFull(b.criadaEmIso) },
            ]}
          />
          <p className="mb-2 mt-4 text-label text-ink-tertiary">Unidades</p>
          <div className="flex flex-wrap gap-1.5">
            {b.unidades.map((unitId) => {
              const unit = units.find((u) => u.id === unitId)
              return (
                <button
                  key={unitId}
                  onClick={() => navigate(`/configuracoes/unidades/${unitId}`)}
                  className="rounded-full border border-border bg-surface px-2.5 py-1 text-caption font-medium text-ink-secondary transition-colors hover:border-border-strong hover:text-ink-primary"
                >
                  {unit?.nomeCurto ?? unitId}
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
