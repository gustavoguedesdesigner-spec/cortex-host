import { useCallback, useRef, useState } from 'react'

/**
 * Estado sincronizado com localStorage — usado para simular persistencia
 * de acoes criadas e status de ocorrencias sem depender de backend.
 * Falha silenciosamente (mantendo o valor em memoria) se o localStorage
 * nao estiver disponivel.
 *
 * A escrita em localStorage acontece de forma sincrona no corpo do
 * proprio setter — nunca dentro do updater passado a setState nem em
 * useEffect. Ambos rodam apenas se o React decidir processar aquele
 * commit, e quando quem chama o setter navega para outra rota logo em
 * seguida (criar registro e redirecionar), o componente pode desmontar
 * antes disso, perdendo a escrita silenciosamente. Um ref mantem o
 * valor atual disponivel fora do ciclo de render para computar o
 * proximo valor de forma imediata.
 */
export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initialValue
    } catch {
      return initialValue
    }
  })
  const valueRef = useRef(value)
  valueRef.current = value

  const setPersistedValue = useCallback(
    (update: T | ((prev: T) => T)) => {
      const next = typeof update === 'function' ? (update as (prev: T) => T)(valueRef.current) : update
      valueRef.current = next
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch {
        // Ambiente sem localStorage disponivel — mantem apenas em memoria.
      }
      setValue(next)
    },
    [key],
  )

  return [value, setPersistedValue] as const
}
