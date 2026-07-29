import { FilePlus2, ListChecks, Sparkles, UserPlus } from 'lucide-react'
import { PageBanner, PageFilters, PageHero } from '@/components/ui/PageHero'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { SearchInput } from '@/components/ui/Input'
import { useAppState, useUnitOptions } from '@/context/AppStateContext'
import { areaLabels, knowledgeSummary } from '@/data/knowledge/knowledgeSummary'

const tipoOptions = [
  { value: 'todos', label: 'Todos os tipos' },
  { value: 'procedimento', label: 'Procedimento' },
  { value: 'politica', label: 'Política' },
  { value: 'instrucao_trabalho', label: 'Instrução de trabalho' },
  { value: 'guia_rapido', label: 'Guia rápido' },
  { value: 'comunicado', label: 'Comunicado' },
  { value: 'auditoria', label: 'Auditoria' },
]

const statusOptions = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'em_revisao', label: 'Em revisão' },
  { value: 'revisao_recomendada', label: 'Revisão recomendada' },
  { value: 'expirado', label: 'Expirado' },
]

const obrigatoriedadeOptions = [
  { value: 'todas', label: 'Todas as obrigatoriedades' },
  { value: 'obrigatorio', label: 'Obrigatório' },
  { value: 'recomendado', label: 'Recomendado' },
  { value: 'referencia', label: 'Referência' },
  { value: 'restrito', label: 'Restrito' },
]

const areaOptions = [{ value: 'todas', label: 'Todas as áreas' }, ...Object.entries(areaLabels).map(([value, label]) => ({ value, label }))]

export interface BibliotecaFilters {
  busca: string
  area: string
  tipo: string
  status: string
  unidade: string
  obrigatoriedade: string
}

export function BibliotecaHeader({
  filters,
  onChange,
  onNovoConteudo,
  onCriarChecklist,
  onAtribuirTreinamento,
}: {
  filters: BibliotecaFilters
  onChange: (patch: Partial<BibliotecaFilters>) => void
  onNovoConteudo: () => void
  onCriarChecklist: () => void
  onAtribuirTreinamento: () => void
}) {
  const { askCortex } = useAppState()
  const unitOptions = useUnitOptions()

  return (
    <div className="flex flex-col gap-5">
      <PageHero
        divider={false}
        eyebrow="Conhecimento"
        title="Biblioteca Operacional"
        description="Centralize procedimentos, treinamentos e checklists para garantir que cada unidade execute o padrão correto."
        banner={<PageBanner slot="banner-biblioteca" rotulo="Imagem do banner da Biblioteca" className="min-h-[172px]" />}
        meta={<p className="text-caption text-ink-tertiary">Atualizado {knowledgeSummary.ultimaAtualizacaoLabel}</p>}
        actions={
          <>
            <Button size="sm" variant="secondary" leftIcon={<FilePlus2 className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onNovoConteudo}>
              Novo conteúdo
            </Button>
            <Button size="sm" variant="secondary" leftIcon={<ListChecks className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onCriarChecklist}>
              Criar checklist
            </Button>
            <Button size="sm" variant="navy" leftIcon={<UserPlus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={onAtribuirTreinamento}>
              Atribuir treinamento
            </Button>
            <Button size="sm" variant="primary" leftIcon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => askCortex('Quais checklists devo realizar hoje?', 'Biblioteca consolidada')}>
              Pergunte ao CORTEX
            </Button>
          </>
        }
      />

      <PageFilters>
        <SearchInput
          aria-label="Buscar na biblioteca"
          value={filters.busca}
          onChange={(e) => onChange({ busca: e.target.value })}
          placeholder="Buscar procedimento, treinamento, checklist..."
          wrapperClassName="w-full sm:w-80"
        />
        <Select aria-label="Área" value={filters.area} onChange={(e) => onChange({ area: e.target.value })} options={areaOptions} className="w-48" />
        <Select aria-label="Tipo" value={filters.tipo} onChange={(e) => onChange({ tipo: e.target.value })} options={tipoOptions} className="w-48" />
        <Select aria-label="Status" value={filters.status} onChange={(e) => onChange({ status: e.target.value })} options={statusOptions} className="w-48" />
        <Select aria-label="Unidade" value={filters.unidade} onChange={(e) => onChange({ unidade: e.target.value })} options={unitOptions.map((u) => ({ value: u.id, label: u.nome }))} className="w-48" />
        <Select aria-label="Obrigatoriedade" value={filters.obrigatoriedade} onChange={(e) => onChange({ obrigatoriedade: e.target.value })} options={obrigatoriedadeOptions} className="w-56" />
      </PageFilters>
    </div>
  )
}
