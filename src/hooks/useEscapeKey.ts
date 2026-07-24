import { useEffect } from 'react'

/** Dispara callback ao pressionar Escape — usado para fechar Modal/Drawer/Dropdown. */
export function useEscapeKey(onEscape: () => void, active = true) {
  useEffect(() => {
    if (!active) return
    function handler(event: KeyboardEvent) {
      if (event.key === 'Escape') onEscape()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onEscape, active])
}
