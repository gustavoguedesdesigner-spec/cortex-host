import { useEffect, type RefObject } from 'react'

/**
 * Dispara um callback quando ha clique/toque fora do elemento referenciado.
 * Usado por Dropdown, Modal, Drawer e paineis laterais.
 */
export function useClickOutside<T extends HTMLElement>(ref: RefObject<T>, onOutside: () => void, active = true) {
  useEffect(() => {
    if (!active) return

    function handler(event: MouseEvent | TouchEvent) {
      const target = event.target as Node
      if (ref.current && !ref.current.contains(target)) {
        onOutside()
      }
    }

    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [ref, onOutside, active])
}
