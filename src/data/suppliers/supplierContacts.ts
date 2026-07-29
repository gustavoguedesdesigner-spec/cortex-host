import type { SupplierContact } from '@/types'

/**
 * Contatos por fornecedor (secao 32). Serra Alimentos e aprofundado com tres
 * contatos (comercial, logistica, financeiro); os demais tem ao menos o
 * contato principal usado nos cards da base visual.
 */
export const supplierContacts: SupplierContact[] = [
  { id: 'ct-sa-1', supplierId: 'serra-alimentos', nome: 'Juliana Serra', funcao: 'Comercial', area: 'comercial', email: 'comercial@serraalimentos.com.br', telefone: '+55 51 3333-1840', whatsapp: '+55 51 99333-1840', horario: '8h às 18h', principal: true, responsavelInterno: 'Rafael Martins' },
  { id: 'ct-sa-2', supplierId: 'serra-alimentos', nome: 'Eduardo Serra', funcao: 'Logística', area: 'logistica', email: 'logistica@serraalimentos.com.br', telefone: '+55 51 3333-1841', horario: '7h às 17h', responsavelInterno: 'Rafael Martins' },
  { id: 'ct-sa-3', supplierId: 'serra-alimentos', nome: 'Financeiro Serra', funcao: 'Cobranças e créditos', area: 'financeiro', email: 'financeiro@serraalimentos.com.br', telefone: '+55 51 3333-1842', responsavelInterno: 'Leo' },

  { id: 'ct-bs-1', supplierId: 'bebidas-sul', nome: 'Paulo Nunes', funcao: 'Comercial', area: 'comercial', email: 'pedidos@bebidassul.com.br', telefone: '+55 51 3222-9060', principal: true, responsavelInterno: 'Rafael Martins' },
  { id: 'ct-sf-1', supplierId: 'sul-foodservice', nome: 'Renata Dias', funcao: 'Atendimento', area: 'comercial', email: 'atendimento@sulfoodservice.com.br', telefone: '+55 51 3444-8270', principal: true, responsavelInterno: 'Leo' },
  { id: 'ct-dg-1', supplierId: 'distribuidora-gaucha', nome: 'Marcelo Gomes', funcao: 'Vendas', area: 'comercial', email: 'vendas@distribuidoragaucha.com.br', telefone: '+55 51 3555-1240', principal: true, responsavelInterno: 'Leo' },
  { id: 'ct-hb-1', supplierId: 'hortifruti-bahia', nome: 'Carolina Vale', funcao: 'Pedidos', area: 'comercial', email: 'pedidos@valehortifruti.com.br', telefone: '+55 51 3666-7130', principal: true, responsavelInterno: 'Patricia Lins' },
  { id: 'ct-ac-1', supplierId: 'atacado-central', nome: 'Rogério Lima', funcao: 'Corporativo', area: 'comercial', email: 'corporativo@atacadocentral.com.br', telefone: '+55 51 3777-4420', principal: true, responsavelInterno: 'Bruno Teles' },
  { id: 'ct-lv-1', supplierId: 'laticinios-do-vale', nome: 'Fernanda Vale', funcao: 'Comercial', area: 'comercial', email: 'comercial@laticiniosdovale.com.br', telefone: '+55 71 3288-4410', principal: true, responsavelInterno: 'Diego Andrade' },
  { id: 'ct-eb-1', supplierId: 'embalagens-bahia', nome: 'Marcos Feitosa', funcao: 'Comercial', area: 'comercial', email: 'comercial@embalagensbahia.com.br', telefone: '+55 75 3221-9040', principal: true, responsavelInterno: 'Leo' },
  { id: 'ct-le-1', supplierId: 'limpeza-express', nome: 'Sandra Oliveira', funcao: 'Atendimento', area: 'comercial', email: 'atendimento@limpezaexpress.com.br', telefone: '+55 71 3244-5510', principal: true, responsavelInterno: 'Leo' },
  { id: 'ct-mp-1', supplierId: 'manutencao-predial-bahia', nome: 'Cláudio Reis', funcao: 'Coordenação', area: 'comercial', email: 'contato@manutencaopredialbahia.com.br', telefone: '+55 71 3255-6620', principal: true, responsavelInterno: 'Bruno Teles' },
  { id: 'ct-ts-1', supplierId: 'techsolutions-ba', nome: 'André Farias', funcao: 'Suporte técnico', area: 'comercial', email: 'suporte@techsolutionsba.com.br', telefone: '+55 71 3299-1010', principal: true, responsavelInterno: 'Leo' },
  { id: 'ct-ss-1', supplierId: 'servicos-salvador', nome: 'Beatriz Sousa', funcao: 'Operações', area: 'comercial', email: 'operacoes@servicossalvador.com.br', telefone: '+55 71 3211-8080', principal: true, responsavelInterno: 'Leo' },
]

export function getContactsBySupplier(supplierId: string): SupplierContact[] {
  return supplierContacts.filter((c) => c.supplierId === supplierId)
}
