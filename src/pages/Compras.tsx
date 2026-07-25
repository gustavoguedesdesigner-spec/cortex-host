import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ComprasHeader } from '@/components/purchasing/ComprasHeader'
import { ComprasInternalNav } from '@/components/purchasing/ComprasInternalNav'
import { ComprasExecutiveSection } from './purchasing/ComprasExecutiveSection'
import { ComprasIndicatorsStrip } from './purchasing/ComprasIndicatorsStrip'
import { PurchaseFlowBar } from '@/components/purchasing/PurchaseFlowBar'
import { ComprasPrioritiesSection } from './purchasing/ComprasPrioritiesSection'
import { ComprasCategorySection } from './purchasing/ComprasCategorySection'
import { ComprasSavingsSection } from './purchasing/ComprasSavingsSection'
import { purchaseCategories } from '@/data/purchasing/categories'

const statusOptions = [
  { value: 'todos', label: 'Todos os status' },
  { value: 'aguardando_aprovacao', label: 'Aguardando aprovação' },
  { value: 'em_cotacao', label: 'Em cotação' },
  { value: 'aguardando_entrega', label: 'Aguardando entrega' },
  { value: 'divergente', label: 'Divergente' },
]

export default function Compras() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [status, setStatus] = useState('todos')

  const categoriaOptions = [{ value: 'todas', label: 'Todas as categorias' }, ...purchaseCategories.map((c) => ({ value: c.id, label: c.categoria }))]

  return (
    <div className="flex flex-col gap-6">
      <ComprasHeader
        search={search}
        onSearchChange={setSearch}
        categoria={categoria}
        onCategoriaChange={setCategoria}
        categoriaOptions={categoriaOptions}
        status={status}
        onStatusChange={setStatus}
        statusOptions={statusOptions}
        onNovaRequisicao={() => navigate('/compras/requisicoes?nova=1')}
        onCriarCotacao={() => navigate('/compras/cotacoes?nova=1')}
      />

      <ComprasInternalNav active="visao-geral" />

      <div className="flex flex-col gap-8">
        <ComprasExecutiveSection
          onVerPrioridades={() => document.getElementById('prioridades')?.scrollIntoView({ behavior: 'smooth' })}
          onAbrirAprovacoes={() => navigate('/compras/aprovacoes')}
          onCriarRequisicao={() => navigate('/compras/requisicoes?nova=1')}
        />

        <ComprasIndicatorsStrip />

        <PurchaseFlowBar />

        <ComprasPrioritiesSection />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ComprasCategorySection />
          </div>
          <div className="lg:col-span-5">
            <ComprasSavingsSection />
          </div>
        </div>
      </div>
    </div>
  )
}
