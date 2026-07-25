import { useCallback, useMemo } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import { recountTolerance } from '@/data/inventory/inventoryCounts'
import type { CountItemStatus, InventoryCountItem } from '@/types'

export interface CountItemProgress {
  primeiraContagem: number | null
  segundaContagem: number | null
  status: CountItemStatus
  justificativa?: string
  observacao?: string
}

type ProgressMap = Record<string, CountItemProgress>

function excedeTolerancia(saldoSistemico: number, contagem: number, custo: number): boolean {
  const diferenca = Math.abs(contagem - saldoSistemico)
  const percentual = saldoSistemico === 0 ? 1 : diferenca / saldoSistemico
  const valor = diferenca * custo
  return percentual > recountTolerance.percentual || valor > recountTolerance.valor
}

/**
 * Progresso da contagem — persistido localmente por inventário
 * (contagem cega: o saldo sistêmico só é exibido depois da primeira
 * contagem registrada). Nunca ajusta o saldo automaticamente; toda
 * divergência acima da tolerância exige recontagem e justificativa.
 */
export function useInventoryCountProgress(countId: string, baseItems: InventoryCountItem[]) {
  const [progress, setProgress] = useLocalStorageState<ProgressMap>(`cortex-host:inventory-count:${countId}`, {})
  const [closing, setClosing] = useLocalStorageState<{ fechadoPor: string; dataFechamento: string; observacao?: string } | null>(
    `cortex-host:inventory-count-closing:${countId}`,
    null,
  )

  const items = useMemo(
    () =>
      baseItems.map((item) => {
        const p = progress[item.itemId]
        return {
          ...item,
          primeiraContagem: p?.primeiraContagem ?? item.primeiraContagem,
          segundaContagem: p?.segundaContagem ?? item.segundaContagem,
          status: p?.status ?? item.status,
          justificativa: p?.justificativa ?? item.justificativa,
          observacao: p?.observacao ?? item.observacao,
        }
      }),
    [baseItems, progress],
  )

  /**
   * `statusAtual`/`primeiraContagemAtual` vêm do item já mesclado (base +
   * override) — nunca apenas do mapa de overrides, que começa vazio
   * mesmo quando o dado base já nasce como "recontagem_solicitada".
   */
  const registrarContagem = useCallback(
    (itemId: string, quantidade: number, saldoSistemico: number, custo: number, statusAtual: CountItemStatus, primeiraContagemAtual: number | null) => {
      setProgress((prev) => {
        if (statusAtual === 'recontagem_solicitada') {
          return { ...prev, [itemId]: { primeiraContagem: primeiraContagemAtual, segundaContagem: quantidade, status: 'justificado' } }
        }
        const precisaRecontagem = excedeTolerancia(saldoSistemico, quantidade, custo)
        return {
          ...prev,
          [itemId]: { primeiraContagem: quantidade, segundaContagem: null, status: precisaRecontagem ? 'recontagem_solicitada' : 'contado' },
        }
      })
    },
    [setProgress],
  )

  const marcarStatus = useCallback(
    (itemId: string, status: CountItemStatus) => {
      setProgress((prev) => ({ ...prev, [itemId]: { primeiraContagem: prev[itemId]?.primeiraContagem ?? null, segundaContagem: prev[itemId]?.segundaContagem ?? null, status } }))
    },
    [setProgress],
  )

  const justificar = useCallback(
    (itemId: string, justificativa: string, observacao?: string) => {
      setProgress((prev) => ({ ...prev, [itemId]: { ...prev[itemId], primeiraContagem: prev[itemId]?.primeiraContagem ?? null, segundaContagem: prev[itemId]?.segundaContagem ?? null, status: 'aprovado', justificativa, observacao } }))
    },
    [setProgress],
  )

  const podeConcluir = items.every((i) => i.status !== 'pendente' && i.status !== 'recontagem_solicitada')

  const fechar = useCallback(
    (fechadoPor: string, observacao?: string) => {
      setClosing({ fechadoPor, dataFechamento: new Date().toISOString(), observacao })
    },
    [setClosing],
  )

  const reabrir = useCallback(() => setClosing(null), [setClosing])

  return { items, registrarContagem, marcarStatus, justificar, podeConcluir, closing, fechar, reabrir }
}
