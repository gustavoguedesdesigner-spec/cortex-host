import { useCallback } from 'react'
import { useLocalStorageState } from './useLocalStorageState'

export interface CmvPeriodClosingRecord {
  fechadoPor: string
  observacao: string
  dataFechamento: string
}

/**
 * Fechamento demonstrativo do período atual — sem efeito contábil,
 * persistido apenas em localStorage. Permite reabertura com
 * justificativa, conforme o briefing.
 */
export function useCmvPeriodClosing() {
  const [record, setRecord] = useLocalStorageState<CmvPeriodClosingRecord | null>('cortex-host:cmv-period-closing', null)

  const fechar = useCallback(
    (fechadoPor: string, observacao: string) => {
      setRecord({ fechadoPor, observacao, dataFechamento: new Date().toISOString() })
    },
    [setRecord],
  )

  const reabrir = useCallback(() => setRecord(null), [setRecord])

  return { record, fechar, reabrir }
}
