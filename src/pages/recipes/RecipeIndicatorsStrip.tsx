import { MetricCard, MetricStrip } from '@/components/ui/MetricCard'
import { formatPercent } from '@/utils/format'
import { recipeQualityOverall, recipeSituation } from '@/data/recipes/recipeSummary'

export function RecipeIndicatorsStrip({ onSelect }: { onSelect: (filtro: string) => void }) {
  return (
    <MetricStrip className="xl:grid-cols-4">
      <MetricCard titulo="Produtos vendáveis" valor={String(recipeSituation.produtosVendaveis)} status="neutral" onClick={() => onSelect('todas')} />
      <MetricCard titulo="Fichas vigentes" valor={String(recipeSituation.fichasVigentes)} status="success" onClick={() => onSelect('vigentes')} />
      <MetricCard titulo="Em revisão" valor={String(recipeSituation.emRevisao)} status="attention" onClick={() => onSelect('em_revisao')} />
      <MetricCard titulo="Sem ficha completa" valor={String(recipeSituation.semFichaCompleta)} status="critical" onClick={() => onSelect('sem_ficha')} />
      <MetricCard titulo="Custos desatualizados" valor={String(recipeSituation.custosDesatualizados)} status="attention" onClick={() => onSelect('custo_desatualizado')} />
      <MetricCard titulo="Conversões inconsistentes" valor={String(recipeSituation.conversoesInconsistentes)} status="attention" onClick={() => onSelect('conversao_inconsistente')} />
      <MetricCard titulo="Desvios relevantes" valor={String(recipeSituation.desviosRelevantes)} status="critical" onClick={() => onSelect('desvio_operacional')} />
      <MetricCard titulo="Qualidade geral" valor={formatPercent(recipeQualityOverall.percentual, 0)} status="attention" comparacao={`Meta: ${formatPercent(recipeQualityOverall.meta, 0)}`} />
    </MetricStrip>
  )
}
