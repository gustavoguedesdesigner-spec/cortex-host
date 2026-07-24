import { useCallback, useState } from 'react'

/**
 * Hook simples para controlar estado de abertura/fechamento
 * (modais, drawers, dropdowns, paineis laterais).
 */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  return { isOpen, open, close, toggle }
}
