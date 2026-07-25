import { useMemo, useState } from 'react'
import { Eye, SlidersHorizontal } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { EmptyState } from '@/components/ui/EmptyState'
import { CmvConfidenceBadge } from '@/components/cmv/CmvConfidenceBadge'
import { cmvCauses, cmvCauseTaxonomy } from '@/data/cmv/cmvCauses'
import { cmvEvidences } from '@/data/cmv/cmvEvidence'
import { units } from '@/data/units'
import { cmvCategories } from '@/data/cmv/cmvCategories'
import { formatCurrencyBRL } from '@/utils/format'
import type { CmvCause, CmvConfidenceLevel } from '@/types'

const statusLabel = { em_investigacao: 'Em investigação', confirmada: 'Confirmada', descartada: 'Descartada' }
const confidenceOptions: { value: CmvConfidenceLevel | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Toda confiança' },
  { value: 'alta', label: 'Confiança alta' },
  { value: 'media', label: 'Confiança média' },
  { value: 'baixa', label: 'Confiança baixa' },
  { value: 'insuficiente', label: 'Dados insuficientes' },
]

export function CmvCausesTab() {
  const [unidadeFiltro, setUnidadeFiltro] = useState('todas')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  const [confiancaFiltro, setConfiancaFiltro] = useState<CmvConfidenceLevel | 'todas'>('todas')
  const [selected, setSelected] = useState<CmvCause | null>(null)

  const filtradas = useMemo(() => {
    return cmvCauses.filter((c) => {
      if (unidadeFiltro !== 'todas' && !c.unidades.some((u) => u === unidadeFiltro)) return false
      if (categoriaFiltro !== 'todas' && !c.categorias.some((cat) => cat === categoriaFiltro)) return false
      if (confiancaFiltro !== 'todas' && c.confianca !== confiancaFiltro) return false
      return true
    })
  }, [unidadeFiltro, categoriaFiltro, confiancaFiltro])

  const unidadeOptions = [{ value: 'todas', label: 'Todas as unidades' }, ...units.map((u) => ({ value: u.nomeCurto, label: u.nomeCurto }))]
  const categoriaOptions = [{ value: 'todas', label: 'Todas as categorias' }, ...cmvCategories.filter((c) => c.destacada).map((c) => ({ value: c.categoria, label: c.categoria }))]

  return (
    <div className="flex flex-col gap-8">
      <section>
        <SectionHeader title="Causas priorizadas" description="Ordenadas por impacto financeiro estimado — a soma reconcilia exatamente com a ponte do CMV" />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-ink-tertiary" strokeWidth={1.7} />
          <Select aria-label="Filtrar por unidade" value={unidadeFiltro} onChange={(e) => setUnidadeFiltro(e.target.value)} options={unidadeOptions} className="w-44" />
          <Select aria-label="Filtrar por categoria" value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} options={categoriaOptions} className="w-48" />
          <Select
            aria-label="Filtrar por confiança"
            value={confiancaFiltro}
            onChange={(e) => setConfiancaFiltro(e.target.value as CmvConfidenceLevel | 'todas')}
            options={confidenceOptions}
            className="w-48"
          />
        </div>

        {filtradas.length === 0 ? (
          <EmptyState icon={<SlidersHorizontal className="h-5 w-5" />} title="Nenhuma causa encontrada" description="Ajuste os filtros para ver outras causas do período." />
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
            {filtradas
              .sort((a, b) => b.impacto - a.impacto)
              .map((causa) => (
                <div key={causa.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-support font-medium text-ink-primary">{causa.titulo}</p>
                      <CmvConfidenceBadge nivel={causa.confianca} />
                      <span className="text-caption text-ink-tertiary">{statusLabel[causa.status]}</span>
                    </div>
                    <p className="mt-1 text-caption text-ink-tertiary">
                      {causa.unidades.join(', ') || 'Sem unidade específica'} · {causa.categorias.join(', ') || 'Sem categoria específica'}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="tabular text-support font-medium text-danger">{formatCurrencyBRL(causa.impacto)}</span>
                    <Button size="sm" variant="secondary" leftIcon={<Eye className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setSelected(causa)}>
                      Ver evidências
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Taxonomia de causas" description="Categorias de causas possíveis de desvio de CMV — referência para classificação" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cmvCauseTaxonomy.map((grupo) => (
            <Card key={grupo.id} className="flex flex-col gap-2">
              <p className="text-card-title text-ink-primary">{grupo.label}</p>
              <ul className="flex flex-col gap-1 text-support text-ink-secondary list-disc list-inside">
                {grupo.itens.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <Drawer isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `Evidências — ${selected.titulo}` : ''} widthClassName="w-full max-w-lg">
        {selected && (
          <div className="flex flex-col gap-4">
            <p className="rounded-md bg-surface-subtle p-3 text-support text-ink-tertiary">
              As conclusões do CORTEX apoiam a investigação, mas devem ser validadas pelos responsáveis antes de qualquer ajuste definitivo.
            </p>

            {selected.pendencias.length > 0 && (
              <div className="rounded-md border border-warning/30 bg-warning-soft/40 p-3">
                <p className="text-caption text-ink-tertiary mb-1">Evidências ainda ausentes</p>
                <ul className="list-disc list-inside text-support text-ink-secondary">
                  {selected.pendencias.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {selected.evidenciaIds.map((id) => {
              const ev = cmvEvidences.find((e) => e.id === id)
              if (!ev) return null
              return (
                <div key={ev.id} className="flex flex-col gap-2 rounded-md border border-border bg-surface p-3.5">
                  <div className="flex items-center justify-between">
                    <CmvConfidenceBadge nivel={ev.confianca} />
                    <span className="text-caption text-ink-tertiary">{ev.data}</span>
                  </div>
                  <p className="text-support font-medium text-ink-primary">{ev.titulo}</p>
                  <p className="text-support text-ink-secondary">{ev.descricao}</p>
                  <div className="grid grid-cols-2 gap-2 text-support">
                    <div>
                      <p className="text-caption text-ink-tertiary">Observado</p>
                      <p className="text-ink-primary">{ev.valorObservado}</p>
                    </div>
                    <div>
                      <p className="text-caption text-ink-tertiary">Esperado</p>
                      <p className="text-ink-primary">{ev.valorEsperado}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-caption text-ink-tertiary">
                    <span>Origem: {ev.origem}</span>
                    <span>Responsável: {ev.responsavel}</span>
                  </div>
                </div>
              )
            })}

            {selected.cadeiaEvidencias && (
              <div>
                <p className="mb-2 text-label text-ink-tertiary">Cadeia de evidências</p>
                <ol className="flex flex-col gap-2">
                  {selected.cadeiaEvidencias.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-support text-ink-secondary">
                      <span className="mt-0.5 tabular text-caption text-ink-tertiary">{String(i + 1).padStart(2, '0')}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="rounded-md bg-surface-subtle p-3">
              <p className="text-caption text-ink-tertiary mb-0.5">Ação recomendada</p>
              <p className="text-support text-ink-primary">{selected.acaoRecomendada}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
