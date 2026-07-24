import { useState } from 'react'
import { RefreshCw, CircleCheckBig } from 'lucide-react'
import { IconButton } from '@/components/ui/Button'
import { IntegrationStatusRow } from '@/components/data-display/IntegrationStatusRow'
import { useAppState, useUnitOptions } from '@/context/AppStateContext'
import { periodOptions } from '@/data/periods'
import { integrationStatus, networkSummary } from '@/data/network-summary'
import { demoUser } from '@/data/user'
import { formatDateFull } from '@/utils/format'

export function ContextualHeader() {
  const { periodo, unidadeSelecionada } = useAppState()
  const unitOptions = useUnitOptions()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [updatedLabel, setUpdatedLabel] = useState(networkSummary.ultimaAtualizacaoLabel)
  const [justUpdated, setJustUpdated] = useState(false)

  const periodoLabel = periodOptions.find((p) => p.id === periodo)?.label ?? periodOptions[1].label
  const unidadeLabel = unitOptions.find((u) => u.id === unidadeSelecionada)?.nome ?? 'Todas as unidades'

  function handleRefresh() {
    setIsRefreshing(true)
    window.setTimeout(() => {
      setIsRefreshing(false)
      setUpdatedLabel('agora mesmo')
      setJustUpdated(true)
      window.setTimeout(() => setJustUpdated(false), 3000)
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-caption text-content-tertiary mb-1">
            {formatDateFull(networkSummary.dataSimulada)} · Ambiente demonstrativo — dados simulados
          </p>
          <h1 className="text-page-title">Bom dia, {demoUser.nome}.</h1>
          <p className="text-body text-content-secondary mt-1">
            Veja o que exige sua atenção nas operações da {demoUser.empresa}.
          </p>
        </div>

        <div className="flex flex-col items-start gap-1.5 sm:items-end shrink-0">
          <div className="flex items-center gap-1.5 text-support text-content-tertiary">
            <IconButton
              icon={<RefreshCw className={isRefreshing ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />}
              label="Atualizar dados"
              size="sm"
              onClick={handleRefresh}
            />
            {justUpdated ? (
              <span className="flex items-center gap-1 text-status-success">
                <CircleCheckBig className="h-3.5 w-3.5" />
                Dados atualizados com sucesso
              </span>
            ) : (
              <span>Dados atualizados {updatedLabel}</span>
            )}
          </div>
          <span className="text-caption text-content-tertiary">
            Período: <span className="text-content-secondary">{periodoLabel}</span> · Unidade:{' '}
            <span className="text-content-secondary">{unidadeLabel}</span>
          </span>
        </div>
      </div>

      <IntegrationStatusRow items={integrationStatus} />
    </div>
  )
}
