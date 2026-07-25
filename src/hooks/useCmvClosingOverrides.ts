import { useCallback, useMemo } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import { cmvClosingChecklist } from '@/data/cmv/cmvClosings'
import type { CmvClosingChecklistItem } from '@/types'

const RESOLVABLE_IDS = ['confirmar-inventarios', 'conciliar-transferencias', 'conferir-recebimentos', 'verificar-fichas-tecnicas']

/**
 * Simulação local de resolução de pendências do checklist de
 * fechamento — persistida em localStorage, sem efeito no restante da
 * aplicação. "Revisar divergências" e "Aprovar memória de cálculo"
 * dependem das etapas anteriores; "Fechar período" só libera quando
 * tudo estiver resolvido.
 */
export function useCmvClosingOverrides() {
  const [resolved, setResolved] = useLocalStorageState<string[]>('cortex-host:cmv-closing-overrides', [])

  const markResolved = useCallback(
    (id: string) => setResolved((prev) => (prev.includes(id) ? prev : [...prev, id])),
    [setResolved],
  )

  const reset = useCallback(() => setResolved([]), [setResolved])

  const checklist = useMemo<CmvClosingChecklistItem[]>(() => {
    const isDone = (id: string) => cmvClosingChecklist.find((i) => i.id === id)?.status === 'concluido' || resolved.includes(id)
    const inventariosOk = isDone('confirmar-inventarios')
    const transferenciasOk = isDone('conciliar-transferencias')
    const recebimentosOk = isDone('conferir-recebimentos')
    const fichasOk = isDone('verificar-fichas-tecnicas')
    const divergenciasOk = inventariosOk && transferenciasOk && recebimentosOk
    const memoriaOk = isDone('validar-vendas') && isDone('validar-compras') && inventariosOk && transferenciasOk && recebimentosOk && isDone('validar-perdas') && fichasOk && divergenciasOk

    return cmvClosingChecklist.map((item) => {
      if (item.status === 'concluido') return item
      if (RESOLVABLE_IDS.includes(item.id)) {
        return resolved.includes(item.id) ? { ...item, status: 'concluido' as const, pendencias: [], impacto: undefined } : item
      }
      if (item.id === 'revisar-divergencias') return divergenciasOk ? { ...item, status: 'concluido' as const, pendencias: [] } : item
      if (item.id === 'aprovar-memoria-calculo') return memoriaOk ? { ...item, status: 'concluido' as const, pendencias: [] } : { ...item, status: 'bloqueado' as const }
      if (item.id === 'fechar-periodo') return memoriaOk ? { ...item, status: 'pendente' as const, pendencias: [] } : { ...item, status: 'bloqueado' as const }
      return item
    })
  }, [resolved])

  const podeFechar = checklist.find((i) => i.id === 'fechar-periodo')?.status !== 'bloqueado'
  const resolvableItems = checklist.filter((i) => RESOLVABLE_IDS.includes(i.id))

  return { checklist, resolvableItems, podeFechar, markResolved, reset, isResolved: (id: string) => resolved.includes(id) }
}
