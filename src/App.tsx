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
import ComprasNecessidades from '@/pages/ComprasNecessidades'
import ComprasRequisicoes from '@/pages/ComprasRequisicoes'
import ComprasRequisicaoDetail from '@/pages/ComprasRequisicaoDetail'
import ComprasAprovacoes from '@/pages/ComprasAprovacoes'
import ComprasCotacoes from '@/pages/ComprasCotacoes'
import ComprasCotacaoDetail from '@/pages/ComprasCotacaoDetail'
import ComprasPedidos from '@/pages/ComprasPedidos'
import ComprasPedidoDetail from '@/pages/ComprasPedidoDetail'
import Recebimentos from '@/pages/Recebimentos'
import Fornecedores from '@/pages/Fornecedores'
import FichasTecnicas from '@/pages/FichasTecnicas'
import RecipeNew from '@/pages/RecipeNew'
import RecipeRevisions from '@/pages/RecipeRevisions'
import RecipeInconsistencies from '@/pages/RecipeInconsistencies'
import RecipeSubRecipes from '@/pages/RecipeSubRecipes'
import RecipeCosts from '@/pages/RecipeCosts'
import MenuEngineering from '@/pages/MenuEngineering'
import RecipeDetail from '@/pages/RecipeDetail'
import Biblioteca from '@/pages/Biblioteca'
import BibliotecaDocumentos from '@/pages/BibliotecaDocumentos'
import BibliotecaDocumentoDetail from '@/pages/BibliotecaDocumentoDetail'
import BibliotecaProcedimentos from '@/pages/BibliotecaProcedimentos'
import BibliotecaProcedimentoDetail from '@/pages/BibliotecaProcedimentoDetail'
import BibliotecaTreinamentos from '@/pages/BibliotecaTreinamentos'
import BibliotecaTreinamentoDetail from '@/pages/BibliotecaTreinamentoDetail'
import BibliotecaChecklists from '@/pages/BibliotecaChecklists'
import BibliotecaChecklistDetail from '@/pages/BibliotecaChecklistDetail'
import BibliotecaExecucoes from '@/pages/BibliotecaExecucoes'
import BibliotecaConformidade from '@/pages/BibliotecaConformidade'
import BibliotecaRevisoes from '@/pages/BibliotecaRevisoes'
import BibliotecaHistorico from '@/pages/BibliotecaHistorico'
import BibliotecaFavoritos from '@/pages/BibliotecaFavoritos'
import AssistenteCortex from '@/pages/AssistenteCortex'
import Configuracoes from '@/pages/Configuracoes'
import AdminOrganization from '@/pages/AdminOrganization'
import AdminBrands from '@/pages/AdminBrands'
import AdminUnitsList from '@/pages/AdminUnitsList'
import AdminUnitDetail from '@/pages/AdminUnitDetail'
import AdminUsersList from '@/pages/AdminUsersList'
import AdminUserNew from '@/pages/AdminUserNew'
import AdminUserDetail from '@/pages/AdminUserDetail'
import AdminRolesList from '@/pages/AdminRolesList'
import AdminRoleDetail from '@/pages/AdminRoleDetail'
import AdminPermissionsMatrix from '@/pages/AdminPermissionsMatrix'
import AdminApprovalLimits from '@/pages/AdminApprovalLimits'
import AdminModules from '@/pages/AdminModules'
import AdminNotifications from '@/pages/AdminNotifications'
import AdminIntegrationsList from '@/pages/AdminIntegrationsList'
import AdminIntegrationDetail from '@/pages/AdminIntegrationDetail'
import AdminSecurity from '@/pages/AdminSecurity'
import AdminAudit from '@/pages/AdminAudit'
import AdminData from '@/pages/AdminData'
import AdminPolicies from '@/pages/AdminPolicies'
import AdminAppearance from '@/pages/AdminAppearance'
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
        <Route path="/compras/necessidades" element={<ComprasNecessidades />} />
        <Route path="/compras/requisicoes" element={<ComprasRequisicoes />} />
        <Route path="/compras/requisicoes/:requestId" element={<ComprasRequisicaoDetail />} />
        <Route path="/compras/aprovacoes" element={<ComprasAprovacoes />} />
        <Route path="/compras/cotacoes" element={<ComprasCotacoes />} />
        <Route path="/compras/cotacoes/:quotationId" element={<ComprasCotacaoDetail />} />
        <Route path="/compras/pedidos" element={<ComprasPedidos />} />
        <Route path="/compras/pedidos/:orderId" element={<ComprasPedidoDetail />} />
        <Route path="/recebimentos" element={<Recebimentos />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/fichas-tecnicas" element={<FichasTecnicas />} />
        <Route path="/fichas-tecnicas/nova" element={<RecipeNew />} />
        <Route path="/fichas-tecnicas/revisoes" element={<RecipeRevisions />} />
        <Route path="/fichas-tecnicas/inconsistencias" element={<RecipeInconsistencies />} />
        <Route path="/fichas-tecnicas/subreceitas" element={<RecipeSubRecipes />} />
        <Route path="/fichas-tecnicas/custos" element={<RecipeCosts />} />
        <Route path="/fichas-tecnicas/engenharia" element={<MenuEngineering />} />
        <Route path="/fichas-tecnicas/:recipeId" element={<RecipeDetail />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/biblioteca/documentos" element={<BibliotecaDocumentos />} />
        <Route path="/biblioteca/documentos/:documentId" element={<BibliotecaDocumentoDetail />} />
        <Route path="/biblioteca/procedimentos" element={<BibliotecaProcedimentos />} />
        <Route path="/biblioteca/procedimentos/:procedureId" element={<BibliotecaProcedimentoDetail />} />
        <Route path="/biblioteca/treinamentos" element={<BibliotecaTreinamentos />} />
        <Route path="/biblioteca/treinamentos/:trainingId" element={<BibliotecaTreinamentoDetail />} />
        <Route path="/biblioteca/checklists" element={<BibliotecaChecklists />} />
        <Route path="/biblioteca/checklists/:checklistId" element={<BibliotecaChecklistDetail />} />
        <Route path="/biblioteca/execucoes" element={<BibliotecaExecucoes />} />
        <Route path="/biblioteca/conformidade" element={<BibliotecaConformidade />} />
        <Route path="/biblioteca/revisoes" element={<BibliotecaRevisoes />} />
        <Route path="/biblioteca/historico" element={<BibliotecaHistorico />} />
        <Route path="/biblioteca/favoritos" element={<BibliotecaFavoritos />} />
        <Route path="/assistente" element={<AssistenteCortex />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/configuracoes/organizacao" element={<AdminOrganization />} />
        <Route path="/configuracoes/marcas" element={<AdminBrands />} />
        <Route path="/configuracoes/unidades" element={<AdminUnitsList />} />
        <Route path="/configuracoes/unidades/:unitId" element={<AdminUnitDetail />} />
        <Route path="/configuracoes/usuarios" element={<AdminUsersList />} />
        <Route path="/configuracoes/usuarios/novo" element={<AdminUserNew />} />
        <Route path="/configuracoes/usuarios/:userId" element={<AdminUserDetail />} />
        <Route path="/configuracoes/perfis" element={<AdminRolesList />} />
        <Route path="/configuracoes/perfis/:roleId" element={<AdminRoleDetail />} />
        <Route path="/configuracoes/permissoes" element={<AdminPermissionsMatrix />} />
        <Route path="/configuracoes/alcadas" element={<AdminApprovalLimits />} />
        <Route path="/configuracoes/modulos" element={<AdminModules />} />
        <Route path="/configuracoes/notificacoes" element={<AdminNotifications />} />
        <Route path="/configuracoes/integracoes" element={<AdminIntegrationsList />} />
        <Route path="/configuracoes/integracoes/:integrationId" element={<AdminIntegrationDetail />} />
        <Route path="/configuracoes/seguranca" element={<AdminSecurity />} />
        <Route path="/configuracoes/auditoria" element={<AdminAudit />} />
        <Route path="/configuracoes/dados" element={<AdminData />} />
        <Route path="/configuracoes/politicas" element={<AdminPolicies />} />
        <Route path="/configuracoes/aparencia" element={<AdminAppearance />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
