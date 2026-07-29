import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { SupplierRiskBadge } from './SupplierBadges'
import { categoryLabels } from '@/data/suppliers/supplierSummary'
import { formatCurrencyBRL, formatPercent } from '@/utils/format'
import type { Supplier } from '@/types'

/** Interpretação simulada do CORTEX (secao 67) — sempre destaca o melhor score e a maior capacidade/cobertura. */
function buildInterpretation(selected: Supplier[]): string {
  if (selected.length < 2) return ''
  const melhorScore = [...selected].sort((a, b) => b.scoreGeral - a.scoreGeral)[0]
  const maiorCobertura = [...selected].sort((a, b) => b.unidadesAtendidas.length - a.unidadesAtendidas.length)[0]
  const outros = selected.filter((s) => s.id !== melhorScore.id)
  const nomesOutros = outros.map((s) => s.nome).join(', ')
  if (melhorScore.id === maiorCobertura.id) {
    return `${melhorScore.nome} apresenta o melhor score entre os fornecedores selecionados, com boa cobertura de unidades. ${nomesOutros ? `Vale acompanhar ${nomesOutros} como alternativa em itens específicos.` : ''}`
  }
  return `${melhorScore.nome} apresenta score superior e menor incidência de divergências. ${maiorCobertura.nome} possui maior capacidade e cobertura de itens, mas pode exigir melhoria operacional para equiparar o desempenho.`
}

export function SupplierComparisonModal({ isOpen, onClose, selected }: { isOpen: boolean; onClose: () => void; selected: Supplier[] }) {
  const navigate = useNavigate()

  const rows: { label: string; render: (s: Supplier) => string }[] = [
    { label: 'Categoria principal', render: (s) => categoryLabels[s.categoriaPrincipalId] },
    { label: 'Score geral', render: (s) => `${s.scoreGeral}/100` },
    { label: 'Valor comprado no período', render: (s) => formatCurrencyBRL(s.valorCompradoPeriodo) },
    { label: 'Pontualidade', render: (s) => formatPercent(s.pontualidade, 0) },
    { label: 'Conformidade de quantidade', render: (s) => formatPercent(s.conformidadeQuantidade, 0) },
    { label: 'Conformidade de preço', render: (s) => formatPercent(s.conformidadePreco, 0) },
    { label: 'Conformidade de qualidade', render: (s) => formatPercent(s.conformidadeQualidade, 0) },
    { label: 'Divergências abertas', render: (s) => String(s.divergenciasAbertas) },
    { label: 'Documentos válidos', render: (s) => `${s.documentosValidos}/${s.documentosObrigatorios}` },
    { label: 'Unidades atendidas', render: (s) => String(s.unidadesAtendidas.length) },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comparar fornecedores" description={`${selected.length} fornecedores selecionados`} size="lg">
      <div className="flex flex-col gap-5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-support">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-2 text-left text-label font-medium text-ink-tertiary">Critério</th>
                {selected.map((s) => (
                  <th key={s.id} className="px-3 py-2 text-left text-label font-medium text-ink-primary">
                    {s.nome}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2.5 text-ink-secondary">{row.label}</td>
                  {selected.map((s) => (
                    <td key={s.id} className="px-3 py-2.5 tabular text-ink-primary">
                      {row.render(s)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-3 py-2.5 text-ink-secondary">Risco de dependência</td>
                {selected.map((s) => (
                  <td key={s.id} className="px-3 py-2.5">
                    <SupplierRiskBadge nivel={s.riscoDependencia} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {selected.length >= 2 && (
          <div className="rounded-md border border-border bg-surface-subtle p-4">
            <p className="text-label text-ink-tertiary">Interpretação do CORTEX</p>
            <p className="mt-1.5 text-support leading-relaxed text-ink-secondary">{buildInterpretation(selected)}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => navigate('/compras/cotacoes')}>
            Abrir cotação
          </Button>
          <Button size="sm" variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
