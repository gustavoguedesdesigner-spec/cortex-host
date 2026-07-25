/**
 * Funcoes de formatacao usadas em toda a aplicacao.
 * Centralizadas para manter consistencia (moeda, percentual, datas).
 */

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Para custos unitários fracionários (ex.: R$/grama) — R$ 0 seria enganoso com a formatação padrão sem casas decimais. */
export function formatCurrencyPreciseBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: Math.abs(value) < 1 ? 4 : 2,
  }).format(value)
}

export function formatCurrencyCompactBRL(value: number): string {
  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }
  return formatCurrencyBRL(value)
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${(value * 100).toFixed(fractionDigits).replace('.', ',')}%`
}

export function formatPercentPoints(value: number): string {
  const points = value * 100
  const sign = points > 0 ? '+' : ''
  return `${sign}${points.toFixed(1).replace('.', ',')} p.p.`
}

export function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(new Date(iso))
}

export function formatDateFull(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(iso))
}

export function formatRelativeShort(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return 'agora ha pouco'
  if (diffHours < 24) return `ha ${diffHours}h`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays === 1) return 'ha 1 dia'
  return `ha ${diffDays} dias`
}
