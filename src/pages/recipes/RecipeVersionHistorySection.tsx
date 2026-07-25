import { useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Select } from '@/components/ui/Select'
import { RecipeStatusBadge } from '@/components/recipes/RecipeStatusBadge'
import { compararVersoes } from '@/utils/recipeCosting'
import { formatDateFull } from '@/utils/format'
import type { RecipeVersion } from '@/types'

/** Histórico de versões e comparação (seção 27) — diff de ingredientes, preço, custo, CMV e rendimento entre duas versões. */
export function RecipeVersionHistorySection({ versions }: { versions: RecipeVersion[] }) {
  const [anteriorId, setAnteriorId] = useState(versions[1]?.id ?? versions[0]?.id ?? '')
  const [novaId, setNovaId] = useState(versions[0]?.id ?? '')

  const anterior = versions.find((v) => v.id === anteriorId)
  const nova = versions.find((v) => v.id === novaId)
  const diffs = anterior && nova && anterior.id !== nova.id ? compararVersoes(anterior, nova) : []

  const options = versions.map((v) => ({ value: v.id, label: `Versão ${v.versao} — ${formatDateFull(v.criadoEm)}` }))

  return (
    <div className="flex flex-col gap-6">
      <section>
        <SectionHeader title="Versões da ficha" description="Todas as revisões registradas, da mais recente à mais antiga" />
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
          {versions.map((v) => (
            <div key={v.id} className="flex flex-col gap-1.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-support font-medium text-ink-primary">Versão {v.versao}</p>
                  <RecipeStatusBadge status={v.status} />
                </div>
                <p className="mt-0.5 text-caption text-ink-tertiary">
                  Criada por {v.criadoPor} em {formatDateFull(v.criadoEm)}
                  {v.vigenciaFim && ` · vigente até ${formatDateFull(v.vigenciaFim)}`}
                </p>
                {v.changeSummary && v.changeSummary.length > 0 && (
                  <ul className="mt-1.5 flex flex-col gap-0.5">
                    {v.changeSummary.map((c, i) => (
                      <li key={i} className="text-caption text-ink-secondary">
                        · {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {versions.length > 1 && (
        <section>
          <SectionHeader title="Comparar versões" description="Selecione duas versões para ver o que mudou" />
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end gap-3">
              <Select label="Versão anterior" value={anteriorId} onChange={(e) => setAnteriorId(e.target.value)} options={options} className="w-64" />
              <Select label="Versão nova" value={novaId} onChange={(e) => setNovaId(e.target.value)} options={options} className="w-64" />
            </div>

            {anterior && nova && anterior.id === nova.id ? (
              <p className="text-support text-ink-tertiary">Selecione duas versões diferentes para comparar.</p>
            ) : diffs.length === 0 ? (
              <p className="text-support text-ink-tertiary">Nenhuma diferença encontrada entre as versões selecionadas.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border bg-surface">
                <table className="w-full border-collapse text-support">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Campo</th>
                      <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Anterior</th>
                      <th className="px-4 py-2.5 text-left text-label font-medium text-ink-tertiary">Novo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diffs.map((d, i) => (
                      <tr key={i} className="border-b border-border last:border-b-0">
                        <td className="h-12 px-4 text-ink-primary">{d.campo}</td>
                        <td className="h-12 px-4 tabular text-ink-tertiary">{d.anterior}</td>
                        <td className="h-12 px-4 tabular font-medium text-ink-primary">{d.novo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
