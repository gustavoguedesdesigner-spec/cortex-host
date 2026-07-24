import { useEffect, useState } from 'react'

/**
 * Estado sincronizado com localStorage — usado para simular persistencia
 * de acoes criadas e status de ocorrencias sem depender de backend.
 * Falha silenciosamente (mantendo o valor em memoria) se o localStorage
 * nao estiver disponivel.
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

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ambiente sem localStorage disponivel — mantem apenas em memoria.
    }
  }, [key, value])

  return [value, setValue] as const
}
