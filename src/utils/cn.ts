/**
 * Combina classes condicionalmente, ignorando valores falsy.
 * Utilitario leve — evita dependencia externa (clsx) nesta etapa.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
