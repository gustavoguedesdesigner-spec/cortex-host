import { useNavigate } from 'react-router-dom'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataList } from '@/components/ui/DataList'
import { Button } from '@/components/ui/Button'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { organization, tenantLabel, brands } from '@/data/administration/organization'
import { integrations } from '@/data/administration/integrations'
import { formatDateFull } from '@/utils/format'

export default function AdminOrganization() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Organização' }]} />

      <PageHeader eyebrow="Administração" title="Organização" description="Estrutura, dados gerais e configurações regionais da conta." />

      <AdminInternalNav active="organizacao" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-7">
          <SectionHeader title="Dados gerais" description={`Tenant: ${tenantLabel}`} />
          <DataList
            items={[
              { label: 'Razão social', value: organization.razaoSocial },
              { label: 'Nome fantasia', value: organization.nomeFantasia },
              { label: 'CNPJ', value: organization.cnpj ?? 'Não preenchido — aguardando confirmação do cliente' },
              { label: 'Setor', value: organization.setor },
              { label: 'Responsável administrativo', value: organization.responsavelAdministrativo },
              { label: 'Endereço', value: organization.endereco },
              { label: 'Status', value: <IndicatorBadge status="success">{organization.status === 'ativa' ? 'Ativa' : 'Suspensa'}</IndicatorBadge> },
              { label: 'Plano', value: organization.plano },
              { label: 'E-mail de contato', value: organization.contatoEmail },
              { label: 'Telefone de contato', value: organization.contatoTelefone },
              { label: 'Criada em', value: formatDateFull(organization.criadaEmIso) },
            ]}
          />
        </section>

        <section className="xl:col-span-5">
          <SectionHeader title="Configurações gerais" description="Parâmetros regionais e operacionais (seção 17)" />
          <DataList
            items={[
              { label: 'Moeda', value: organization.moeda },
              { label: 'Idioma', value: organization.idioma },
              { label: 'Fuso horário', value: organization.fusoHorario },
              { label: 'Calendário fiscal', value: organization.calendarioFiscal },
              { label: 'Início da semana', value: organization.inicioSemana },
              { label: 'Unidade de peso', value: organization.unidadePeso },
              { label: 'Unidade de volume', value: organization.unidadeVolume },
              { label: 'Separador decimal', value: organization.separadorDecimal },
              { label: 'Horário de fechamento', value: organization.horarioFechamento },
              { label: 'Dias úteis', value: organization.diasUteis },
            ]}
          />
        </section>
      </div>

      <section>
        <SectionHeader
          title="Marcas"
          description="Preparado para múltiplas marcas — este protótipo demonstra apenas Salvador"
          actions={
            <Button size="sm" variant="ghost" onClick={() => navigate('/configuracoes/marcas')}>
              Ver marcas
            </Button>
          }
        />
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate('/configuracoes/marcas')}
              className="flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover"
            >
              <div>
                <p className="text-support font-medium text-ink-primary">{b.nome}</p>
                <p className="mt-0.5 text-caption text-ink-tertiary">
                  {b.unidades.length} unidades · {b.produtosVinculados} produtos · Responsável: {b.responsavel}
                </p>
              </div>
              <IndicatorBadge status="success">Ativa</IndicatorBadge>
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Integrações da organização"
          actions={
            <Button size="sm" variant="ghost" onClick={() => navigate('/configuracoes/integracoes')}>
              Ver todas
            </Button>
          }
        />
        <div className="flex flex-wrap gap-2">
          {integrations.map((i) => (
            <button
              key={i.id}
              onClick={() => navigate(`/configuracoes/integracoes/${i.id}`)}
              className="rounded-full border border-border bg-surface px-2.5 py-1 text-caption font-medium text-ink-secondary transition-colors hover:border-border-strong hover:text-ink-primary"
            >
              {i.nome}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
