import { useMemo } from 'react'
import { useLocalStorageState } from './useLocalStorageState'
import { suppliers } from '@/data/suppliers/suppliers'
import { supplierNegotiations } from '@/data/suppliers/supplierNegotiations'
import { supplierDivergences } from '@/data/suppliers/supplierDivergences'
import { calcularScoreGeral } from '@/utils/supplierScoring'
import type { Supplier, SupplierDivergenceStatus, SupplierNegotiation, SupplierNegotiationStatus } from '@/types'

export interface NovoFornecedorInput {
  nome: string
  categoriaPrincipalId: Supplier['categoriaPrincipalId']
  cidade: string
}

/**
 * Combina a base estatica de fornecedores com fornecedores criados pelo
 * fluxo guiado e com alteracoes de status de negociacoes/divergencias —
 * mesmo padrao de useKnowledge/usePurchasing (uma unica instancia por
 * pagina, tudo via useLocalStorageState, nunca recalculado em componente).
 */
export function useSuppliers() {
  const [createdSuppliers, setCreatedSuppliers] = useLocalStorageState<Supplier[]>('cortex-host:suppliers-created', [])
  const [negotiationOverrides, setNegotiationOverrides] = useLocalStorageState<Record<string, SupplierNegotiationStatus>>('cortex-host:supplier-negotiation-status', {})
  const [divergenceOverrides, setDivergenceOverrides] = useLocalStorageState<Record<string, SupplierDivergenceStatus>>('cortex-host:supplier-divergence-status', {})

  const allSuppliers = useMemo<Supplier[]>(() => [...suppliers, ...createdSuppliers], [createdSuppliers])

  const allNegotiations = useMemo<SupplierNegotiation[]>(
    () => supplierNegotiations.map((n) => (negotiationOverrides[n.id] ? { ...n, status: negotiationOverrides[n.id] } : n)),
    [negotiationOverrides],
  )

  const allDivergences = useMemo(
    () => supplierDivergences.map((d) => (divergenceOverrides[d.id] ? { ...d, status: divergenceOverrides[d.id] } : d)),
    [divergenceOverrides],
  )

  function createSupplier(input: NovoFornecedorInput) {
    const seq = 41 + createdSuppliers.length
    const pesos = { preco: 0.2, prazo: 0.2, quantidade: 0.15, precoConforme: 0.15, qualidade: 0.15, resposta: 0.1, documentacao: 0.05 }
    const scoreBreakdown = { precoCompetitivo: 70, pontualidade: 70, quantidade: 70, precoConformePedido: 70, qualidade: 70, capacidadeResposta: 70, documentacao: 40 }
    const penalidades = [{ motivo: 'Homologação em andamento — documentação e histórico ainda incompletos', pontos: 15 }]
    const novo: Supplier = {
      id: `sup-created-${Date.now()}`,
      codigo: `FOR-00${seq}`,
      nome: input.nome,
      iniciais: input.nome
        .split(' ')
        .filter((w) => w.length > 2)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase(),
      categoriaPrincipalId: input.categoriaPrincipalId,
      categoriasIds: [input.categoriaPrincipalId],
      status: 'em_homologacao',
      statusOperacional: 'em_atencao',
      estrategico: false,
      homologado: false,
      scoreBreakdown,
      pesos,
      penalidades,
      scoreGeral: calcularScoreGeral(scoreBreakdown, pesos, penalidades),
      valorCompradoPeriodo: 0,
      valorComprado12Meses: 0,
      participacaoCategoriaPrincipal: 0,
      unidadesAtendidas: [],
      pedidosEmAberto: 0,
      recebimentosNoPeriodo: 0,
      divergenciasAbertas: 0,
      atrasoMedioDias: 0,
      pontualidade: 0,
      conformidadeQuantidade: 0,
      conformidadePreco: 0,
      conformidadeQualidade: 0,
      documentosObrigatorios: 6,
      documentosValidos: 0,
      negociacoesAbertas: 0,
      riscoDependencia: 'baixo',
      riscoDocumental: 'alto',
      riscoOperacional: 'medio',
      riscoFinanceiro: 'baixo',
      desde: new Date().toISOString(),
      cidade: input.cidade,
    }
    setCreatedSuppliers((prev) => [...prev, novo])
    return novo
  }

  function updateNegotiationStatus(id: string, status: SupplierNegotiationStatus) {
    setNegotiationOverrides((prev) => ({ ...prev, [id]: status }))
  }

  function updateDivergenceStatus(id: string, status: SupplierDivergenceStatus) {
    setDivergenceOverrides((prev) => ({ ...prev, [id]: status }))
  }

  return { allSuppliers, allNegotiations, allDivergences, createSupplier, updateNegotiationStatus, updateDivergenceStatus }
}
