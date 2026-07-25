import { Table, type TableColumn } from '@/components/ui/Table'
import { CmvConfidenceBadge } from '@/components/cmv/CmvConfidenceBadge'
import { formatCurrencyPreciseBRL, formatPercent } from '@/utils/format'
import { calcularCustoReceita } from '@/utils/recipeCalculations'
import type { RecipeIngredientLine } from '@/types'

const tipoLabel = { insumo: 'Insumo', sub_receita: 'Sub-receita', embalagem: 'Embalagem' }

/** Tabela de ingredientes (seção 24) — somente leitura em versão vigente; edição acontece numa revisão. */
export function RecipeIngredientTable({ ingredientes, onOpenIngredient, editable }: { ingredientes: RecipeIngredientLine[]; onOpenIngredient?: (line: RecipeIngredientLine) => void; editable?: boolean }) {
  const custoTotal = calcularCustoReceita(ingredientes)

  const columns: TableColumn<RecipeIngredientLine>[] = [
    { key: 'nome', header: 'Ingrediente', render: (i) => <span className="font-medium">{i.nome}</span> },
    { key: 'tipo', header: 'Tipo', render: (i) => tipoLabel[i.tipo] },
    { key: 'bruta', header: 'Qtd. bruta', align: 'right', render: (i) => `${i.quantidadeBruta.toLocaleString('pt-BR')} ${i.unidade}` },
    { key: 'liquida', header: 'Qtd. líquida', align: 'right', render: (i) => `${i.quantidadeLiquida.toLocaleString('pt-BR')} ${i.unidade}` },
    { key: 'fator', header: 'Fator de correção', align: 'right', render: (i) => i.fatorCorrecao.toFixed(3) },
    { key: 'perda', header: 'Perda', align: 'right', render: (i) => (i.perdaPercentual > 0 ? formatPercent(i.perdaPercentual, 1) : '—') },
    { key: 'custoUnitario', header: 'Custo unitário', align: 'right', render: (i) => formatCurrencyPreciseBRL(i.custoUnitario) },
    { key: 'custoFicha', header: 'Custo na ficha', align: 'right', render: (i) => <span className="font-medium">{formatCurrencyPreciseBRL(i.custoNaFicha)}</span> },
    { key: 'participacao', header: 'Participação', align: 'right', render: (i) => formatPercent(custoTotal === 0 ? 0 : i.custoNaFicha / custoTotal, 1) },
    { key: 'confianca', header: 'Confiança', render: (i) => <CmvConfidenceBadge nivel={i.confianca} /> },
  ]

  return (
    <div className="flex flex-col gap-2">
      <Table columns={columns} data={ingredientes} getRowId={(i) => i.id} onRowClick={onOpenIngredient} />
      {!editable && <p className="text-caption text-ink-tertiary">Versão vigente — não editável diretamente. Crie uma revisão para alterar ingredientes.</p>}
      <div className="flex items-center justify-end gap-2 border-t border-border pt-2 text-support">
        <span className="text-ink-tertiary">Custo total da receita</span>
        <span className="font-medium tabular text-ink-primary">{formatCurrencyPreciseBRL(custoTotal)}</span>
      </div>
    </div>
  )
}
