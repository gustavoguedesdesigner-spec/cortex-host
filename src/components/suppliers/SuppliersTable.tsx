import { useNavigate } from 'react-router-dom'
import { Table, type TableColumn } from '@/components/ui/Table'
import { SupplierOperationalBadge, SupplierScorePill } from './SupplierBadges'
import { categoryLabels } from '@/data/suppliers/supplierSummary'
import { formatCurrencyBRL, formatPercent } from '@/utils/format'
import type { Supplier } from '@/types'

/** Tabela comparativa de fornecedores (secao 19) — ordenacao e feita pela pagina que a usa. */
export function SuppliersTable({ suppliers, selected, onToggleSelect }: { suppliers: Supplier[]; selected?: string[]; onToggleSelect?: (id: string) => void }) {
  const navigate = useNavigate()

  const columns: TableColumn<Supplier>[] = [
    ...(onToggleSelect
      ? [
          {
            key: 'select',
            header: '',
            render: (s: Supplier) => (
              <input
                type="checkbox"
                checked={selected?.includes(s.id) ?? false}
                onChange={(e) => {
                  e.stopPropagation()
                  onToggleSelect(s.id)
                }}
                onClick={(e) => e.stopPropagation()}
                className="h-4 w-4 cursor-pointer rounded border-border accent-accent"
                aria-label={`Selecionar ${s.nome}`}
              />
            ),
          } as TableColumn<Supplier>,
        ]
      : []),
    { key: 'nome', header: 'Fornecedor', render: (s) => <span className="font-medium text-ink-primary">{s.nome}</span> },
    { key: 'categoria', header: 'Categoria', render: (s) => categoryLabels[s.categoriaPrincipalId] },
    { key: 'status', header: 'Status', render: (s) => <SupplierOperationalBadge status={s.statusOperacional} /> },
    { key: 'valor', header: 'Valor comprado', align: 'right', render: (s) => formatCurrencyBRL(s.valorCompradoPeriodo) },
    { key: 'participacao', header: 'Participação categoria', align: 'right', render: (s) => formatPercent(s.participacaoCategoriaPrincipal, 0) },
    { key: 'score', header: 'Score', align: 'right', render: (s) => <SupplierScorePill score={s.scoreGeral} /> },
    { key: 'pontualidade', header: 'Pontualidade', align: 'right', render: (s) => formatPercent(s.pontualidade, 0) },
    { key: 'qtd', header: 'Conf. quantidade', align: 'right', render: (s) => formatPercent(s.conformidadeQuantidade, 0) },
    { key: 'preco', header: 'Conf. preço', align: 'right', render: (s) => formatPercent(s.conformidadePreco, 0) },
    { key: 'qualidade', header: 'Conf. qualidade', align: 'right', render: (s) => formatPercent(s.conformidadeQualidade, 0) },
    { key: 'divergencias', header: 'Divergências', align: 'right', render: (s) => <span className={s.divergenciasAbertas > 0 ? 'text-danger' : undefined}>{s.divergenciasAbertas}</span> },
    { key: 'documentos', header: 'Documentos', align: 'right', render: (s) => `${s.documentosValidos}/${s.documentosObrigatorios}` },
    { key: 'unidades', header: 'Unidades', align: 'right', render: (s) => s.unidadesAtendidas.length },
  ]

  return <Table columns={columns} data={suppliers} getRowId={(s) => s.id} onRowClick={(s) => navigate(`/fornecedores/${s.id}`)} stickyFirstColumn />
}
