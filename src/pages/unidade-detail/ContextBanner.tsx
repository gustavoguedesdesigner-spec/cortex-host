import { useNavigate } from 'react-router-dom'
import { ArrowRight, CornerDownLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getUnitIdByName } from '@/data/units'

export function ContextBanner({
  fromOccurrenceTitulo,
  outrasUnidades,
  onCreateAction,
}: {
  fromOccurrenceTitulo: string
  outrasUnidades: string[]
  onCreateAction: () => void
}) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent/25 bg-accent-soft px-4 py-3">
      <p className="flex items-center gap-2 text-support text-ink-secondary">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        Você chegou aqui a partir da ocorrência: <span className="font-medium text-ink-primary">{fromOccurrenceTitulo}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<CornerDownLeft className="h-3.5 w-3.5" strokeWidth={1.7} />}
          onClick={() => navigate('/', { state: { scrollToOccurrence: true } })}
        >
          Voltar para a ocorrência
        </Button>
        {outrasUnidades.map((nome) => {
          const id = getUnitIdByName(nome)
          if (!id) return null
          return (
            <Button
              key={nome}
              size="sm"
              variant="ghost"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />}
              onClick={() => navigate(`/unidades/${id}`, { state: { fromOccurrenceTitulo, outrasUnidades: [] } })}
            >
              Ver {nome}
            </Button>
          )
        })}
        <Button size="sm" variant="primary" onClick={onCreateAction}>
          Criar ação
        </Button>
      </div>
    </div>
  )
}
