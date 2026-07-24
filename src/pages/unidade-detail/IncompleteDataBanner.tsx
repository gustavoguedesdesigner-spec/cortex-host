import { OctagonAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { IncompleteDataInfo } from '@/types'

export function IncompleteDataBanner({ info, onCreateAction }: { info: IncompleteDataInfo; onCreateAction: () => void }) {
  return (
    <div className="rounded-lg border border-status-attention/30 bg-status-attentionBg/40 p-4 flex flex-col gap-3">
      <div className="flex items-start gap-2.5">
        <OctagonAlert className="h-4 w-4 text-status-attention shrink-0 mt-0.5" />
        <p className="text-support text-content-primary font-medium">{info.mensagem}</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className="text-caption text-content-tertiary mb-1">Dados disponíveis</p>
          <ul className="text-support text-content-secondary list-disc list-inside">
            {info.dadosDisponiveis.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
        <div>
          <p className="text-caption text-content-tertiary mb-1">Dados faltantes</p>
          <ul className="text-support text-content-secondary list-disc list-inside">
            {info.dadosFaltantes.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      </div>
      <p className="text-support text-content-secondary">{info.impacto}</p>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-support text-content-tertiary">
          Ação necessária: <span className="text-content-primary font-medium">{info.acaoNecessaria}</span> · {info.prazoLabel} · {info.responsavel}
        </p>
        <Button size="sm" variant="primary" onClick={onCreateAction}>Criar ação</Button>
      </div>
    </div>
  )
}
