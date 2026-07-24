import { cn } from '@/utils/cn'

/**
 * Marca abstrata do CORTEX: um "pulso operacional" — nucleo central
 * com ondas de sinal. Reaparece, com moderacao, em pontos de inteligencia
 * artificial da interface (logotipo, botao do assistente, insights).
 */
export function CortexMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={cn('shrink-0', className)} aria-hidden="true">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1" opacity="0.22" />
      <circle cx="16" cy="16" r="8.5" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
      <circle cx="16" cy="16" r="3.1" fill="currentColor" className={animated ? 'animate-pulse-dot' : undefined} />
    </svg>
  )
}
