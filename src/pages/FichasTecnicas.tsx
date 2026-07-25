import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RecipeHeader } from '@/components/recipes/RecipeHeader'
import { RecipeInternalNav } from '@/components/recipes/RecipeInternalNav'
import { RecipeOverviewTab } from './recipes/RecipeOverviewTab'
import { RecipesListTab } from './recipes/RecipesListTab'

type FichasTab = 'visao-geral' | 'fichas'

const validTabs: FichasTab[] = ['visao-geral', 'fichas']

export default function FichasTecnicas() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('todas')

  const tabParam = searchParams.get('tab') as FichasTab | null
  const activeTab: FichasTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'visao-geral'

  return (
    <div className="flex flex-col gap-6">
      <RecipeHeader search={search} onSearchChange={setSearch} category={category} onCategoryChange={setCategory} />

      <RecipeInternalNav active={activeTab} />

      {activeTab === 'visao-geral' && <RecipeOverviewTab />}
      {activeTab === 'fichas' && <RecipesListTab search={search} />}
    </div>
  )
}
