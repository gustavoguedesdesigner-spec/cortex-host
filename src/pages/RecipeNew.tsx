import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { RecipeBreadcrumb } from '@/components/recipes/RecipeBreadcrumb'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button, IconButton } from '@/components/ui/Button'
import { recipeCategorySummaries } from '@/data/recipes/recipeSummary'
import { units } from '@/data/units'
import { useCreatedRecipes } from '@/hooks/useCreatedRecipes'
import { computeRecipeFinancials } from '@/utils/recipeCalculations'
import { formatCurrencyPreciseBRL, formatPercent } from '@/utils/format'
import type { IngredientType, RecipeIngredientLine } from '@/types'

interface DraftIngredient {
  id: string
  nome: string
  tipo: IngredientType
  quantidade: string
  unidade: string
  custoUnitario: string
}

let draftCounter = 0
function nextDraftId() {
  draftCounter += 1
  return `draft-${draftCounter}`
}

const tipoOptions: { value: IngredientType; label: string }[] = [
  { value: 'insumo', label: 'Insumo' },
  { value: 'embalagem', label: 'Embalagem' },
]

function toIngredientLine(draft: DraftIngredient): RecipeIngredientLine {
  const quantidade = Number(draft.quantidade) || 0
  const custoUnitario = Number(draft.custoUnitario) || 0
  return {
    id: draft.id,
    nome: draft.nome || 'Ingrediente sem nome',
    tipo: draft.tipo,
    quantidadeBruta: quantidade,
    quantidadeLiquida: quantidade,
    unidade: draft.unidade || 'g',
    fatorCorrecao: 1,
    perdaPercentual: 0,
    custoUnitario,
    custoNaFicha: quantidade * custoUnitario,
    ultimaAtualizacao: new Date().toISOString(),
    confianca: 'media',
  }
}

export default function RecipeNew() {
  const navigate = useNavigate()
  const { createRecipe } = useCreatedRecipes()

  const [nome, setNome] = useState('')
  const [categoriaId, setCategoriaId] = useState(recipeCategorySummaries[0]?.id ?? '')
  const [codigoPdv, setCodigoPdv] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [unidadesAplicaveis, setUnidadesAplicaveis] = useState<string[]>(units.map((u) => u.id))
  const [porcoes, setPorcoes] = useState('1')
  const [pesoPorcaoG, setPesoPorcaoG] = useState('')
  const [precoVenda, setPrecoVenda] = useState('')
  const [custoEmbalagem, setCustoEmbalagem] = useState('0')
  const [ingredientes, setIngredientes] = useState<DraftIngredient[]>([
    { id: nextDraftId(), nome: '', tipo: 'insumo', quantidade: '', unidade: 'g', custoUnitario: '' },
  ])

  const categoria = recipeCategorySummaries.find((c) => c.id === categoriaId)
  const linhas = ingredientes.map(toIngredientLine)
  const financials = computeRecipeFinancials({
    ingredientes: linhas,
    porcoes: Number(porcoes) || 1,
    precoVenda: Number(precoVenda) || 0,
    descontoMedioPercentual: 0,
    custoEmbalagem: Number(custoEmbalagem) || 0,
  })

  const podeSalvar = nome.trim().length > 0 && codigoPdv.trim().length > 0 && responsavel.trim().length > 0 && ingredientes.some((i) => i.nome.trim().length > 0)

  function updateIngrediente(id: string, patch: Partial<DraftIngredient>) {
    setIngredientes((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }

  function toggleUnidade(unitId: string) {
    setUnidadesAplicaveis((prev) => (prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]))
  }

  function handleSalvar() {
    if (!podeSalvar || !categoria) return
    const entry = createRecipe({
      nome: nome.trim(),
      categoriaId,
      categoria: categoria.categoria,
      codigoPdv: codigoPdv.trim(),
      responsavel: responsavel.trim(),
      unidades: unidadesAplicaveis,
      ingredientes: linhas.filter((l) => l.nome.trim().length > 0 && l.nome !== 'Ingrediente sem nome'),
      porcoes: Number(porcoes) || 1,
      pesoPorcaoG: Number(pesoPorcaoG) || 0,
      precoVenda: Number(precoVenda) || 0,
      custoEmbalagem: Number(custoEmbalagem) || 0,
    })
    navigate(`/fichas-tecnicas/${entry.recipe.id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <RecipeBreadcrumb trail={[{ label: 'Nova ficha' }]} />

      <PageHeader
        eyebrow="Conhecimento"
        title="Nova ficha técnica"
        description="A ficha é criada como rascunho, com aprovação pendente do Chef Executivo e de Operações — não substitui a ficha vigente de nenhum produto existente."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section>
            <SectionHeader title="Identificação do produto" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input label="Nome do produto" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Burger Especial" />
              <Input label="Código PDV" value={codigoPdv} onChange={(e) => setCodigoPdv(e.target.value)} placeholder="Ex.: BUR-ESP-01" />
              <Select label="Categoria" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} options={recipeCategorySummaries.map((c) => ({ value: c.id, label: c.categoria }))} />
              <Input label="Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder="Ex.: Chef Executivo" />
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              <span className="text-label text-ink-secondary">Unidades aplicáveis</span>
              <div className="flex flex-wrap gap-2">
                {units.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleUnidade(u.id)}
                    className={`rounded-full border px-2.5 py-1 text-caption font-medium transition-colors ${
                      unidadesAplicaveis.includes(u.id) ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-surface text-ink-secondary hover:border-border-strong'
                    }`}
                  >
                    {u.nomeCurto}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section>
            <SectionHeader
              title="Ingredientes"
              description="Insumos e embalagens que compõem a ficha — sub-receitas podem ser vinculadas após a criação"
              actions={
                <Button size="sm" variant="secondary" leftIcon={<Plus className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setIngredientes((prev) => [...prev, { id: nextDraftId(), nome: '', tipo: 'insumo', quantidade: '', unidade: 'g', custoUnitario: '' }])}>
                  Adicionar ingrediente
                </Button>
              }
            />
            <div className="flex flex-col gap-3">
              {ingredientes.map((ing) => (
                <div key={ing.id} className="grid grid-cols-1 items-end gap-2 rounded-lg border border-border bg-surface p-3 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
                  <Input label="Ingrediente" value={ing.nome} onChange={(e) => updateIngrediente(ing.id, { nome: e.target.value })} placeholder="Nome" />
                  <Select label="Tipo" value={ing.tipo} onChange={(e) => updateIngrediente(ing.id, { tipo: e.target.value as IngredientType })} options={tipoOptions} />
                  <Input label="Quantidade" type="number" value={ing.quantidade} onChange={(e) => updateIngrediente(ing.id, { quantidade: e.target.value })} placeholder="0" />
                  <Input label="Unidade" value={ing.unidade} onChange={(e) => updateIngrediente(ing.id, { unidade: e.target.value })} placeholder="g" />
                  <Input label="Custo unitário" type="number" value={ing.custoUnitario} onChange={(e) => updateIngrediente(ing.id, { custoUnitario: e.target.value })} placeholder="0,00" step={0.01} />
                  <IconButton
                    icon={<Trash2 className="h-4 w-4" strokeWidth={1.7} />}
                    label="Remover ingrediente"
                    onClick={() => setIngredientes((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== ing.id) : prev))}
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionHeader title="Rendimento e preço" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Input label="Porções" type="number" value={porcoes} onChange={(e) => setPorcoes(e.target.value)} min={1} />
              <Input label="Peso por porção (g)" type="number" value={pesoPorcaoG} onChange={(e) => setPesoPorcaoG(e.target.value)} placeholder="0" />
              <Input label="Preço de venda" type="number" value={precoVenda} onChange={(e) => setPrecoVenda(e.target.value)} placeholder="0,00" step={0.5} />
              <Input label="Custo de embalagem" type="number" value={custoEmbalagem} onChange={(e) => setCustoEmbalagem(e.target.value)} placeholder="0,00" step={0.1} />
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-surface p-5">
            <p className="text-label text-ink-tertiary">Prévia financeira</p>
            <dl className="mt-3 flex flex-col divide-y divide-border">
              <div className="flex items-center justify-between py-2">
                <dt className="text-support text-ink-secondary">Custo por porção</dt>
                <dd className="text-support font-medium tabular text-ink-primary">{formatCurrencyPreciseBRL(financials.custoPorcao)}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-support text-ink-secondary">CMV teórico</dt>
                <dd className="text-support font-medium tabular text-ink-primary">{formatPercent(financials.cmvTeorico, 1)}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-support text-ink-secondary">Margem</dt>
                <dd className="text-support font-medium tabular text-ink-primary">{formatPercent(financials.margemPercentual, 1)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-caption text-ink-tertiary">Calculado automaticamente a partir dos ingredientes, porções e preço informados.</p>
          </div>

          <Button variant="navy" onClick={handleSalvar} disabled={!podeSalvar}>
            Salvar como rascunho
          </Button>
          <Button variant="ghost" onClick={() => navigate('/fichas-tecnicas')}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
