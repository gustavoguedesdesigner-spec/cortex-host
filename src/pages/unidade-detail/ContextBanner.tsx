import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, ArrowRight, Compass } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getUnitIdByName } from '@/data/units'

interface ContextBannerProps {
  fromOccurrenceTitulo: string
  outrasUnidades: string[]
  onCreateAction: () => void
}

/**
 * Faixa contextual exibida quando o usuario chega na unidade a partir de
 * uma ocorrencia da Central de Operacoes — preserva o fio da investigacao.
 */
export function ContextBanner({ fromOccurrenceTitulo, outrasUnidades, onCreateAction }: ContextBannerProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-cortex-900/25 border border-cortex-700/30 px-4 py-3">
      <p className="flex items-center gap-2 text-support text-cortex-200">
        <Compass className="h-4 w-4 shrink-0 text-cortex-400" />
        Você chegou aqui a partir da ocorrência: <span className="font-semibold text-content-primary">{fromOccurrenceTitulo}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="secondary" leftIcon={<CornerDownLeft className="h-3.5 w-3.5" />} onClick={() => navigate('/', { state: { scrollToOccurrence: true } })}>
          Voltar para a ocorrência
        </Button>
        {outrasUnidades.map((nome) => {
          const id = getUnitIdByName(nome)
          if (!id) return null
          return (
            <Button
              key={nome}
              size="sm"
              variant="secondary"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
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
