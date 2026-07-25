import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import CentralOperacoes from '@/pages/CentralOperacoes'
import Unidades from '@/pages/Unidades'
import UnitDetail from '@/pages/UnitDetail'
import CMV from '@/pages/CMV'
import CmvUnitDetail from '@/pages/CmvUnitDetail'
import CmvCategoryDetail from '@/pages/CmvCategoryDetail'
import CmvProductDetail from '@/pages/CmvProductDetail'
import CmvClosing from '@/pages/CmvClosing'
import CmvClosingPeriodDetail from '@/pages/CmvClosingPeriodDetail'
import Estoque from '@/pages/Estoque'
import InventoryUnitDetail from '@/pages/InventoryUnitDetail'
import InventoryItemDetail from '@/pages/InventoryItemDetail'
import InventoryCounts from '@/pages/InventoryCounts'
import InventoryCountDetail from '@/pages/InventoryCountDetail'
import InventoryMovements from '@/pages/InventoryMovements'
import InventoryTransfers from '@/pages/InventoryTransfers'
import InventoryLosses from '@/pages/InventoryLosses'
import Compras from '@/pages/Compras'
import Recebimentos from '@/pages/Recebimentos'
import Fornecedores from '@/pages/Fornecedores'
import FichasTecnicas from '@/pages/FichasTecnicas'
import RecipeNew from '@/pages/RecipeNew'
import RecipeRevisions from '@/pages/RecipeRevisions'
import RecipeInconsistencies from '@/pages/RecipeInconsistencies'
import RecipeSubRecipes from '@/pages/RecipeSubRecipes'
import RecipeDetail from '@/pages/RecipeDetail'
import Biblioteca from '@/pages/Biblioteca'
import AssistenteCortex from '@/pages/AssistenteCortex'
import Configuracoes from '@/pages/Configuracoes'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<CentralOperacoes />} />
        <Route path="/unidades" element={<Unidades />} />
        <Route path="/unidades/:unitId" element={<UnitDetail />} />
        <Route path="/cmv" element={<CMV />} />
        <Route path="/cmv/unidades/:unitId" element={<CmvUnitDetail />} />
        <Route path="/cmv/categorias/:categoryId" element={<CmvCategoryDetail />} />
        <Route path="/cmv/produtos/:productId" element={<CmvProductDetail />} />
        <Route path="/cmv/fechamentos" element={<CmvClosing />} />
        <Route path="/cmv/fechamentos/:periodId" element={<CmvClosingPeriodDetail />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/estoque/unidades/:unitId" element={<InventoryUnitDetail />} />
        <Route path="/estoque/itens/:itemId" element={<InventoryItemDetail />} />
        <Route path="/estoque/inventarios" element={<InventoryCounts />} />
        <Route path="/estoque/inventarios/:inventoryId" element={<InventoryCountDetail />} />
        <Route path="/estoque/movimentacoes" element={<InventoryMovements />} />
        <Route path="/estoque/transferencias" element={<InventoryTransfers />} />
        <Route path="/estoque/perdas" element={<InventoryLosses />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/recebimentos" element={<Recebimentos />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/fichas-tecnicas" element={<FichasTecnicas />} />
        <Route path="/fichas-tecnicas/nova" element={<RecipeNew />} />
        <Route path="/fichas-tecnicas/revisoes" element={<RecipeRevisions />} />
        <Route path="/fichas-tecnicas/inconsistencias" element={<RecipeInconsistencies />} />
        <Route path="/fichas-tecnicas/subreceitas" element={<RecipeSubRecipes />} />
        <Route path="/fichas-tecnicas/:recipeId" element={<RecipeDetail />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/assistente" element={<AssistenteCortex />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
