import { useState } from 'react'
import { CircleCheckBig, Clock, RefreshCw } from 'lucide-react'
import { PageBanner, PageHero } from '@/components/ui/PageHero'
import { IconButton } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
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
    <PageHero
      title={`Bom dia, ${demoUser.nome}.`}
      titleSize="display"
      description={`Veja o que exige sua atenção nas operações da ${demoUser.empresa}.`}
      banner={<PageBanner slot="banner-central" rotulo="Imagem do banner da Central de Operações" className="min-h-[200px]" />}
      meta={
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-caption text-ink-tertiary">
          <span>{formatDateFull(networkSummary.dataSimulada)}</span>
          <span aria-hidden="true">·</span>
          <span>{periodoLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{unidadeLabel}</span>
          <span aria-hidden="true">·</span>
          <span>Ambiente demonstrativo — dados simulados</span>
        </div>
      }
      actions={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5 text-caption">
            {justUpdated ? (
              <span className="flex items-center gap-1.5 text-success">
                <CircleCheckBig className="h-3.5 w-3.5" strokeWidth={1.7} />
                Dados atualizados com sucesso
              </span>
            ) : (
              <span className="text-ink-tertiary">Dados atualizados {updatedLabel}</span>
            )}
            <IconButton
              icon={<RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} strokeWidth={1.7} />}
              label="Atualizar dados"
              size="sm"
              onClick={handleRefresh}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {integrationStatus.map((item) => {
              const ok = item.estado === 'atualizado'
              return (
                <span key={item.nome} className="inline-flex items-center gap-1.5 text-caption text-ink-secondary">
                  {ok ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                  ) : (
                    <Clock className="h-3 w-3 text-warning" strokeWidth={1.7} />
                  )}
                  {item.nome}
                  {item.detalhe && <span className="text-ink-tertiary">· {item.detalhe}</span>}
                </span>
              )
            })}
          </div>
        </div>
      }
    />
  )
}
