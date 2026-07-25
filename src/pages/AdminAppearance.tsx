import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataList } from '@/components/ui/DataList'
import { IndicatorBadge } from '@/components/ui/StatusBadge'

export default function AdminAppearance() {
  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Organização', path: '/configuracoes/organizacao' }, { label: 'Aparência' }]} />

      <PageHeader eyebrow="Administração" title="Aparência" description="Identidade visual do CORTEX HOST — tema único, sem personalização por usuário nesta etapa." />

      <section>
        <SectionHeader title="Tema" />
        <DataList
          items={[
            { label: 'Tema', value: <IndicatorBadge status="info">Claro (único)</IndicatorBadge> },
            { label: 'Cor de assinatura', value: 'Laranja — pontuação visual, nunca decoração' },
            { label: 'Estrutura', value: 'Azul-marinho — ações estruturais e painel de login' },
            { label: 'Densidade', value: 'Padrão — trilho lateral compacto (72px, expande no hover)' },
          ]}
        />
        <p className="mt-3 text-caption text-ink-tertiary">
          O CORTEX HOST utiliza um tema claro único por padrão de produto — não há alternância para tema escuro nesta etapa do protótipo.
        </p>
      </section>
    </div>
  )
}
