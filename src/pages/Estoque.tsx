import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { InventoryHeader } from '@/components/inventory/InventoryHeader'
import { InventoryInternalNav, type InventoryTab } from '@/components/inventory/InventoryInternalNav'
import { InventoryOverviewTab } from './inventory/InventoryOverviewTab'
import { InventoryPositionTab } from './inventory/InventoryPositionTab'
import { inventoryCategorySummaries } from '@/data/inventory/inventorySummary'

const validTabs: InventoryTab[] = ['visao-geral', 'posicao']

export default function Estoque() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('todas')

  const tabParam = searchParams.get('tab') as InventoryTab | null
  const activeTab: InventoryTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'visao-geral'

  const categoryOptions = [{ value: 'todas', label: 'Todas as categorias' }, ...inventoryCategorySummaries.map((c) => ({ value: c.id, label: c.categoria }))]

  return (
    <div className="flex flex-col gap-6">
      <InventoryHeader
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        categoryOptions={categoryOptions}
        onStartCount={() => navigate('/estoque/inventarios')}
        onRegisterMovement={() => navigate('/estoque/movimentacoes?novo=1')}
      />

      <InventoryInternalNav active={activeTab} />

      {activeTab === 'visao-geral' && <InventoryOverviewTab />}
      {activeTab === 'posicao' && <InventoryPositionTab search={search} />}
    </div>
  )
}
