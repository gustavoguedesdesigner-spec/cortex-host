import type { SupplierDocument } from '@/types'

/**
 * Documentos por fornecedor (secao 46-47). Serra Alimentos aprofundado com
 * os 8 documentos obrigatorios; os demais tem amostra suficiente para
 * alimentar o total de rede (8 documentos proximos do vencimento).
 */
export const supplierDocuments: SupplierDocument[] = [
  { id: 'doc-sa-1', supplierId: 'serra-alimentos', tipo: 'contrato', nome: 'Contrato de fornecimento', obrigatorio: true, status: 'valido', validade: '2027-03-10', responsavel: 'Juliana Serra' },
  { id: 'doc-sa-2', supplierId: 'serra-alimentos', tipo: 'cadastro', nome: 'Dados cadastrais', obrigatorio: true, status: 'valido' },
  { id: 'doc-sa-3', supplierId: 'serra-alimentos', tipo: 'fiscal', nome: 'Regularidade fiscal', obrigatorio: true, status: 'valido', validade: '2026-12-01' },
  { id: 'doc-sa-4', supplierId: 'serra-alimentos', tipo: 'licenca', nome: 'Licença Sanitária demonstrativa', obrigatorio: true, status: 'proximo_vencimento', validade: '2026-08-10', responsavel: 'Eduardo Serra' },
  { id: 'doc-sa-5', supplierId: 'serra-alimentos', tipo: 'certificacao', nome: 'Certificação de boas práticas', obrigatorio: true, status: 'valido', validade: '2027-01-20' },
  { id: 'doc-sa-6', supplierId: 'serra-alimentos', tipo: 'dados_bancarios', nome: 'Dados bancários', obrigatorio: true, status: 'valido' },
  { id: 'doc-sa-7', supplierId: 'serra-alimentos', tipo: 'politica_qualidade', nome: 'Política de qualidade', obrigatorio: true, status: 'valido' },
  { id: 'doc-sa-8', supplierId: 'serra-alimentos', tipo: 'tabela_precos', nome: 'Tabela de preços vigente', obrigatorio: true, status: 'valido', validade: '2026-10-01' },

  { id: 'doc-dg-1', supplierId: 'distribuidora-gaucha', tipo: 'licenca', nome: 'Licença Sanitária', obrigatorio: true, status: 'proximo_vencimento', validade: '2026-08-05' },
  { id: 'doc-dg-2', supplierId: 'distribuidora-gaucha', tipo: 'seguro', nome: 'Seguro de transporte', obrigatorio: true, status: 'proximo_vencimento', validade: '2026-08-15' },
  { id: 'doc-hb-1', supplierId: 'hortifruti-bahia', tipo: 'certificacao', nome: 'Certificação de origem', obrigatorio: true, status: 'proximo_vencimento', validade: '2026-08-12' },
  { id: 'doc-ac-1', supplierId: 'atacado-central', tipo: 'transporte', nome: 'Documentos de transporte', obrigatorio: true, status: 'proximo_vencimento', validade: '2026-08-20' },
  { id: 'doc-lv-1', supplierId: 'laticinios-do-vale', tipo: 'licenca', nome: 'Licença Sanitária', obrigatorio: true, status: 'proximo_vencimento', validade: '2026-08-18' },
  { id: 'doc-le-1', supplierId: 'limpeza-express', tipo: 'seguro', nome: 'Seguro de responsabilidade civil', obrigatorio: true, status: 'proximo_vencimento', validade: '2026-08-09' },
  { id: 'doc-mp-1', supplierId: 'manutencao-predial-bahia', tipo: 'certificacao', nome: 'Certificação de segurança do trabalho', obrigatorio: true, status: 'proximo_vencimento', validade: '2026-08-22' },
]

export function getDocumentsBySupplier(supplierId: string): SupplierDocument[] {
  return supplierDocuments.filter((d) => d.supplierId === supplierId)
}

export function getDocumentsNearExpiry(): SupplierDocument[] {
  return supplierDocuments.filter((d) => d.status === 'proximo_vencimento' || d.status === 'vencido')
}
