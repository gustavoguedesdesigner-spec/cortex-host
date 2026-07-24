import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import CentralOperacoes from '@/pages/CentralOperacoes'
import Unidades from '@/pages/Unidades'
import UnitDetail from '@/pages/UnitDetail'
import CMV from '@/pages/CMV'
import Estoque from '@/pages/Estoque'
import Compras from '@/pages/Compras'
import Recebimentos from '@/pages/Recebimentos'
import Fornecedores from '@/pages/Fornecedores'
import FichasTecnicas from '@/pages/FichasTecnicas'
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
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/recebimentos" element={<Recebimentos />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/fichas-tecnicas" element={<FichasTecnicas />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/assistente" element={<AssistenteCortex />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
