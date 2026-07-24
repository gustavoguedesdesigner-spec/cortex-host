import { cn } from '@/utils/cn'

/**
 * Marca do CORTEX: quatro módulos convergindo para um núcleo — leitura
 * de "central que consolida sinais da operação". Geométrica e estável,
 * deliberadamente sem metáforas de IA (cérebro, sparkle, robô).
 */
export function CortexMark({ className }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={cn('shrink-0', className)} aria-hidden="true">
      <rect x="3" y="3" width="6.5" height="6.5" rx="1.6" fill="currentColor" opacity="0.28" />
      <rect x="14.5" y="3" width="6.5" height="6.5" rx="1.6" fill="currentColor" opacity="0.28" />
      <rect x="3" y="14.5" width="6.5" height="6.5" rx="1.6" fill="currentColor" opacity="0.28" />
      <rect x="14.5" y="14.5" width="6.5" height="6.5" rx="1.6" fill="currentColor" />
    </svg>
  )
}
