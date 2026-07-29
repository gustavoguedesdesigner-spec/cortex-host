import type { SupplierEvent } from '@/types'

/** Eventos de historico (secao 76) — trilha consolidada por fornecedor. */
export const supplierHistory: SupplierEvent[] = [
  { id: 'ev-1', supplierId: 'serra-alimentos', data: '2026-07-24T09:00:00-03:00', tipo: 'negociacao_iniciada', titulo: 'Divergência anexada à negociação', descricao: 'REC-9821 anexada como evidência do plano corretivo em discussão.', link: { label: 'Ver negociação', path: '/fornecedores/negociacoes' } },
  { id: 'ev-2', supplierId: 'serra-alimentos', data: '2026-07-23T10:35:00-03:00', tipo: 'divergencia_registrada', titulo: 'Divergência registrada — REC-9821', descricao: 'Diferença de quantidade e preço no recebimento de carne bovina, R$ 3.780 envolvidos.', link: { label: 'Ver divergência', path: '/fornecedores/divergencias' } },
  { id: 'ev-3', supplierId: 'serra-alimentos', data: '2026-07-15T09:00:00-03:00', tipo: 'negociacao_iniciada', titulo: 'Negociação de carnes iniciada', descricao: 'Revisão comercial de carnes — 3º trimestre — proposta inicial enviada.', link: { label: 'Ver negociação', path: '/fornecedores/negociacoes' } },
  { id: 'ev-4', supplierId: 'serra-alimentos', data: '2026-07-10T09:55:00-03:00', tipo: 'divergencia_registrada', titulo: 'Divergência registrada — REC-9764', descricao: 'Quantidade recebida abaixo do pedido em Caxias Centro, R$ 1.940 envolvidos.' },
  { id: 'ev-5', supplierId: 'serra-alimentos', data: '2026-06-28T14:30:00-03:00', tipo: 'divergencia_resolvida', titulo: 'Divergência resolvida — REC-9698', descricao: 'Atraso de entrega em Zona Norte resolvido sem impacto adicional.' },
  { id: 'ev-6', supplierId: 'serra-alimentos', data: '2026-06-15T11:50:00-03:00', tipo: 'divergencia_registrada', titulo: 'Divergência registrada — REC-9642', descricao: 'Preço acima do acordado em Cidade Baixa — crédito solicitado.' },
  { id: 'ev-7', supplierId: 'serra-alimentos', data: '2026-05-25T10:00:00-03:00', tipo: 'documento_vencendo', titulo: 'Licença Sanitária próxima do vencimento', descricao: 'Renovação necessária em até 18 dias.' },
  { id: 'ev-8', supplierId: 'serra-alimentos', data: '2016-03-10T00:00:00-03:00', tipo: 'fornecedor_homologado', titulo: 'Fornecedor homologado', descricao: 'Serra Alimentos homologada como fornecedora estratégica de carnes e laticínios.' },
]

export function getHistoryBySupplier(supplierId: string): SupplierEvent[] {
  return supplierHistory.filter((e) => e.supplierId === supplierId).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
}
