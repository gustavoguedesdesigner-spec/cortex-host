import type { Integration, IntegrationErrorEntry } from '@/types'

/** Integrações demonstrativas (seções 60-65) — Estoque legado é a mais aprofundada, com o caso de Caxias Norte. */
export const integrations: Integration[] = [
  {
    id: 'pdv-salvador',
    nome: 'PDV Salvador',
    tipo: 'Ponto de venda',
    modulos: ['Central', 'CMV', 'Fichas Técnicas'],
    unidades: ['moinhos', 'caxias-centro', 'zona-norte', 'cidade-baixa', 'serra', 'caxias-norte'],
    status: 'ativa',
    frequencia: 'Tempo real',
    ultimaSincronizacaoIso: '2026-07-25T14:18:00-03:00',
    proximaSincronizacaoIso: '2026-07-25T14:23:00-03:00',
    registrosProcessados: 18420,
    errosCount: 0,
    responsavel: 'Leo',
    autenticacaoMascarada: 'pdv_sk_••••••4821',
    mapeamentos: [
      { campoOrigem: 'Código do produto PDV', campoExterno: 'SKU externo', campoCortex: 'Código PDV do produto', transformacao: 'Conversão de texto', status: 'mapeado' },
      { campoOrigem: 'Categoria PDV', campoExterno: 'category_id', campoCortex: 'Categoria do produto', transformacao: 'Mapeamento direto', status: 'mapeado' },
      { campoOrigem: 'Desconto aplicado', campoExterno: 'discount_pct', campoCortex: 'Percentual de desconto', transformacao: 'Conversão numérica', status: 'mapeado' },
    ],
    qualidade: { completude: 0.99, pontualidade: 0.98, consistencia: 0.97, confianca: 0.98 },
  },
  {
    id: 'estoque-legado',
    nome: 'Estoque legado',
    tipo: 'Estoque e recebimento',
    modulos: ['Estoque', 'Inventários', 'Recebimentos'],
    unidades: ['moinhos', 'caxias-centro', 'zona-norte', 'cidade-baixa', 'serra', 'caxias-norte'],
    status: 'atencao',
    frequencia: 'A cada 4 horas',
    ultimaSincronizacaoIso: '2026-07-24T19:40:00-03:00',
    proximaSincronizacaoIso: '2026-07-25T23:40:00-03:00',
    registrosProcessados: 3120,
    errosCount: 1,
    responsavel: 'Leo',
    autenticacaoMascarada: 'estoque_key_••••••1190',
    mapeamentos: [
      { campoOrigem: 'Código do insumo', campoExterno: 'item_code', campoCortex: 'Código do item', transformacao: 'Conversão de texto', status: 'mapeado' },
      { campoOrigem: 'Saldo do depósito', campoExterno: 'stock_qty', campoCortex: 'Saldo sistêmico', transformacao: 'Conversão numérica', status: 'mapeado' },
      { campoOrigem: 'Unidade de medida', campoExterno: 'uom', campoCortex: 'Unidade de medida', transformacao: 'Tabela de conversão', status: 'pendente' },
    ],
    qualidade: { completude: 0.87, pontualidade: 0.62, consistencia: 0.9, confianca: 0.72 },
  },
  {
    id: 'importacao-financeira',
    nome: 'Importação financeira',
    tipo: 'Financeiro',
    modulos: ['CMV', 'Fichas Técnicas'],
    unidades: ['moinhos', 'caxias-centro', 'zona-norte', 'cidade-baixa', 'serra', 'caxias-norte'],
    status: 'ativa',
    frequencia: 'Diária',
    ultimaSincronizacaoIso: '2026-07-25T05:00:00-03:00',
    proximaSincronizacaoIso: '2026-07-26T05:00:00-03:00',
    registrosProcessados: 860,
    errosCount: 14,
    responsavel: 'Roberta Salgado',
    autenticacaoMascarada: 'fin_token_••••••7734',
    qualidade: { completude: 0.94, pontualidade: 1, consistencia: 0.91, confianca: 0.9 },
  },
  {
    id: 'notas-fiscais',
    nome: 'Notas fiscais',
    tipo: 'Fiscal',
    modulos: ['Recebimentos', 'Fornecedores'],
    unidades: [],
    status: 'nao_configurada',
    frequencia: '—',
    errosCount: 0,
    responsavel: 'Leo',
  },
  {
    id: 'email-corporativo',
    nome: 'E-mail',
    tipo: 'Comunicação',
    modulos: ['Notificações'],
    unidades: [],
    status: 'nao_configurada',
    frequencia: '—',
    errosCount: 0,
    responsavel: 'Leo',
  },
]

export const integrationErrors: IntegrationErrorEntry[] = [
  {
    id: 'erro-estoque-legado-caxias-norte',
    integrationId: 'estoque-legado',
    codigo: 'SYNC-TIMEOUT-041',
    unidade: 'caxias-norte',
    dataIso: '2026-07-24T19:40:00-03:00',
    tipo: 'Tempo limite de conexão',
    registrosAfetados: 214,
    impacto: 'Redução da confiança nas análises de estoque e CMV de Caxias Norte',
    status: 'aberto',
    responsavel: 'Leo',
  },
  {
    id: 'erro-importacao-financeira-registros-rejeitados',
    integrationId: 'importacao-financeira',
    codigo: 'VALID-REJECT-014',
    dataIso: '2026-07-25T05:00:00-03:00',
    tipo: 'Registros rejeitados na validação',
    registrosAfetados: 14,
    impacto: 'Custos de 14 lançamentos não refletidos no fechamento do dia',
    status: 'aberto',
    responsavel: 'Roberta Salgado',
  },
]

export function getIntegrationById(id: string): Integration | undefined {
  return integrations.find((i) => i.id === id)
}

export function getIntegrationErrors(integrationId: string): IntegrationErrorEntry[] {
  return integrationErrors.filter((e) => e.integrationId === integrationId)
}
