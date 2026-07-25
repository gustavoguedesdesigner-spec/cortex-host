import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminHeader } from '@/components/administration/AdminHeader'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { AdminExecutiveSection } from './settings/AdminExecutiveSection'
import { AdminIndicatorsStrip } from './settings/AdminIndicatorsStrip'
import { AdminHealthSection } from './settings/AdminHealthSection'
import { AdminPrioritiesSection } from './settings/AdminPrioritiesSection'
import { useAppState } from '@/context/AppStateContext'

export default function Configuracoes() {
  const navigate = useNavigate()
  const { askCortex } = useAppState()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('todos')

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />

      <AdminInternalNav active="visao-geral" />

      <div className="flex flex-col gap-8">
        <AdminExecutiveSection
          onRevisarAcessos={() => navigate('/configuracoes/usuarios?status=aguardando_revisao')}
          onVerIntegracoes={() => navigate('/configuracoes/integracoes')}
          onAbrirAuditoria={() => navigate('/configuracoes/auditoria')}
          onAskCortex={() => askCortex('Quais acessos precisam ser revisados?', 'Administração consolidada')}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-12">
            <AdminIndicatorsStrip
              onSelect={(filtro) => {
                if (filtro === 'integracoes') navigate('/configuracoes/integracoes')
                else if (filtro === 'perfis') navigate('/configuracoes/perfis')
                else if (filtro === 'criticas') navigate('/configuracoes/permissoes')
                else navigate(`/configuracoes/usuarios?status=${filtro}`)
              }}
            />
          </div>
        </div>

        <AdminPrioritiesSection />

        <AdminHealthSection />
      </div>
    </div>
  )
}
