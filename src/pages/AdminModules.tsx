import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataList } from '@/components/ui/DataList'
import {
  assistenteModuleSettings,
  bibliotecaModuleSettings,
  cmvModuleSettings,
  comprasModuleSettings,
  estoqueModuleSettings,
  fichasModuleSettings,
  recebimentoModuleSettings,
} from '@/data/administration/moduleSettings'
import { formatPercent } from '@/utils/format'

function toDataListItems(obj: Record<string, unknown>) {
  const labelMap: Record<string, string> = {
    metaConsolidada: 'Meta consolidada',
    metaPorUnidade: 'Meta por unidade',
    regraDeCusto: 'Regra de custo',
    periodoFechamento: 'Período de fechamento',
    tolerancia: 'Tolerância',
    qualidadeMinima: 'Qualidade mínima',
    bloqueios: 'Bloqueios',
    aprovadores: 'Aprovadores',
    alertas: 'Alertas',
    estoqueMinimoPadrao: 'Estoque mínimo padrão',
    estoqueMaximoPadrao: 'Estoque máximo padrão',
    toleranciaInventario: 'Tolerância de inventário',
    contagemCega: 'Contagem cega',
    frequenciaContagem: 'Frequência de contagem',
    necessidadeRecontagem: 'Necessidade de recontagem',
    aprovacaoAjustes: 'Aprovação de ajustes',
    saldoNegativo: 'Saldo negativo',
    transferencias: 'Transferências',
    perdas: 'Perdas',
    alcadas: 'Alçadas',
    cotacaoObrigatoria: 'Cotação obrigatória',
    numeroMinimoFornecedores: 'Número mínimo de fornecedores',
    variacaoPrecoMaxima: 'Variação de preço máxima',
    compraEmergencial: 'Compra emergencial',
    fornecedorBloqueado: 'Fornecedor bloqueado',
    pedidosDuplicados: 'Pedidos duplicados',
    estoqueEmTransito: 'Estoque em trânsito',
    orcamento: 'Orçamento',
    checklistObrigatorio: 'Checklist obrigatório',
    toleranciaQuantidade: 'Tolerância de quantidade',
    toleranciaPreco: 'Tolerância de preço',
    validadeMinima: 'Validade mínima',
    temperatura: 'Temperatura',
    documentos: 'Documentos',
    aprovacaoDivergencias: 'Aprovação de divergências',
    quarentena: 'Quarentena',
    recebimentoParcial: 'Recebimento parcial',
    origemCusto: 'Origem de custo',
    vigencia: 'Vigência',
    tolerancias: 'Tolerâncias',
    revisaoPeriodica: 'Revisão periódica',
    fichaObrigatoria: 'Ficha obrigatória',
    excecaoPorUnidade: 'Exceção por unidade',
    publicacao: 'Publicação',
    revisaoObrigatoria: 'Revisão obrigatória',
    validade: 'Validade',
    confirmacaoLeitura: 'Confirmação de leitura',
    treinamentosVinculados: 'Treinamentos vinculados',
    checklistsVinculados: 'Checklists vinculados',
    evidencias: 'Evidências',
    responsaveis: 'Responsáveis',
    aprovacoes: 'Aprovações',
    modulosAcessiveis: 'Módulos acessíveis',
    escopoDados: 'Escopo de dados',
    perguntasPermitidas: 'Perguntas permitidas',
    exibicaoCustos: 'Exibição de custos',
    exibicaoMargens: 'Exibição de margens',
    acoesQuePodeSugerir: 'Ações que pode sugerir',
    acoesQueExigemConfirmacao: 'Ações que exigem confirmação',
    retencaoHistorico: 'Retenção do histórico',
    nivelDetalhamento: 'Nível de detalhamento',
  }

  return Object.entries(obj).map(([key, value]) => {
    let display: string
    if (typeof value === 'boolean') display = value ? 'Sim' : 'Não'
    else if (typeof value === 'number') display = key.toLowerCase().includes('percentual') || value < 1 ? formatPercent(value, 1) : String(value)
    else if (Array.isArray(value)) display = value.join(', ')
    else display = String(value)
    return { label: labelMap[key] ?? key, value: display }
  })
}

export default function AdminModules() {
  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Módulos' }]} />

      <PageHeader eyebrow="Administração" title="Módulos" description="Parâmetros configuráveis de cada módulo operacional — valores demonstrativos." />

      <AdminInternalNav active="modulos" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section>
          <SectionHeader title="CMV" />
          <DataList items={toDataListItems(cmvModuleSettings)} />
        </section>
        <section>
          <SectionHeader title="Estoque" />
          <DataList items={toDataListItems(estoqueModuleSettings)} />
        </section>
        <section>
          <SectionHeader title="Compras" />
          <DataList items={toDataListItems(comprasModuleSettings)} />
        </section>
        <section>
          <SectionHeader title="Recebimento" />
          <DataList items={toDataListItems(recebimentoModuleSettings)} />
        </section>
        <section>
          <SectionHeader title="Fichas Técnicas" />
          <DataList items={toDataListItems(fichasModuleSettings)} />
        </section>
        <section>
          <SectionHeader title="Biblioteca" />
          <DataList items={toDataListItems(bibliotecaModuleSettings)} />
        </section>
        <section className="xl:col-span-2">
          <SectionHeader title="Assistente CORTEX" description="A IA nunca acessa dados que o perfil do usuário não pode visualizar" />
          <DataList items={toDataListItems(assistenteModuleSettings)} />
        </section>
      </div>
    </div>
  )
}
