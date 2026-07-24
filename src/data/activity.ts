import { CircleCheckBig, ClipboardCheck, FilePen, PackageSearch, TriangleAlert, DollarSign, ArrowLeftRight } from 'lucide-react'
import type { ActivityEvent } from '@/types'

export const activityEvents: ActivityEvent[] = [
  { id: 'a1', icon: CircleCheckBig, usuario: 'Rafael Nunes', acao: 'concluiu a contagem de estoque', unidade: 'Salvador Serra', horario: '2026-07-23T12:20:00-03:00' },
  { id: 'a2', icon: DollarSign, usuario: 'Leo', acao: 'aprovou um pedido de compra', unidade: 'Salvador Cidade Baixa', horario: '2026-07-23T11:05:00-03:00' },
  { id: 'a3', icon: TriangleAlert, usuario: 'CORTEX', acao: 'registrou divergência no recebimento da NF 9821', unidade: 'Salvador Moinhos', horario: '2026-07-23T10:40:00-03:00' },
  { id: 'a4', icon: PackageSearch, usuario: 'CORTEX', acao: 'atualizou o preço do óleo de soja', horario: '2026-07-23T09:15:00-03:00' },
  { id: 'a5', icon: FilePen, usuario: 'Juliana Prado', acao: 'revisou a ficha técnica do Tomahawk Burger', horario: '2026-07-22T17:50:00-03:00' },
  { id: 'a6', icon: ArrowLeftRight, usuario: 'Diego Andrade', acao: 'transferiu chope entre unidades', unidade: 'Salvador Cidade Baixa', horario: '2026-07-22T15:30:00-03:00' },
  { id: 'a7', icon: ClipboardCheck, usuario: 'Marina Costa', acao: 'registrou perda de carne no estoque refrigerado', unidade: 'Salvador Moinhos', horario: '2026-07-22T14:10:00-03:00' },
]
