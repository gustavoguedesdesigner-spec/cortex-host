import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileWarning } from 'lucide-react'
import { PageHero } from '@/components/ui/PageHero'
import { SuppliersBreadcrumb } from '@/components/suppliers/SuppliersBreadcrumb'
import { SuppliersInternalNav } from '@/components/suppliers/SuppliersInternalNav'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { SupplierDocumentBadge } from '@/components/suppliers/SupplierBadges'
import { supplierDocuments } from '@/data/suppliers/supplierDocuments'
import { getSupplierById } from '@/data/suppliers/suppliers'
import { diasParaVencimento } from '@/utils/supplierDocuments'
import { formatDateFull } from '@/utils/format'

type Filtro = 'todos' | 'valido' | 'proximo_vencimento' | 'vencido' | 'pendente'

const filtros: { value: Filtro; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'proximo_vencimento', label: 'Próximos do vencimento' },
  { value: 'vencido', label: 'Vencidos' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'valido', label: 'Válidos' },
]

export default function FornecedoresDocumentos() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [feedback, setFeedback] = useState<string | null>(null)

  const filtrados = useMemo(() => (filtro === 'todos' ? supplierDocuments : supplierDocuments.filter((d) => d.status === filtro)), [filtro])

  function solicitarAtualizacao(nome: string) {
    setFeedback(`Solicitação de atualização enviada para "${nome}". Um lembrete foi registrado.`)
    window.setTimeout(() => setFeedback(null), 3600)
  }

  return (
    <div className="flex flex-col gap-8">
      <SuppliersBreadcrumb trail={[{ label: 'Documentos' }]} />
      <PageHero eyebrow="Fornecedores" title="Documentos" description="Contratos, certificações, licenças e dados cadastrais — validade e completude por fornecedor." />
      <SuppliersInternalNav active="documentos" />

      {feedback && <p className="rounded-xl border border-success-line bg-success-soft px-4 py-3 text-support text-success">{feedback}</p>}

      <SectionHeader title={`${filtrados.length} documentos`} actions={<SegmentedControl value={filtro} onChange={setFiltro} options={filtros} />} />

      {filtrados.length === 0 ? (
        <EmptyState icon={<FileWarning className="h-5 w-5" />} title="Nenhum documento encontrado" />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {filtrados.map((doc) => {
            const supplier = getSupplierById(doc.supplierId)
            const dias = doc.validade ? diasParaVencimento(doc.validade) : null
            return (
              <div key={doc.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <button onClick={() => supplier && navigate(`/fornecedores/${supplier.id}`)} className="min-w-0 text-left">
                  <p className="text-support font-medium text-ink-primary hover:text-accent">{doc.nome}</p>
                  <p className="text-caption text-ink-tertiary">
                    {supplier?.nome}
                    {doc.validade && ` · vence em ${formatDateFull(doc.validade)}${dias !== null ? ` (${dias >= 0 ? `${dias} dias` : 'vencido'})` : ''}`}
                  </p>
                </button>
                <div className="flex shrink-0 items-center gap-3">
                  <SupplierDocumentBadge status={doc.status} />
                  {(doc.status === 'proximo_vencimento' || doc.status === 'vencido' || doc.status === 'pendente') && (
                    <Button size="sm" variant="ghost" onClick={() => solicitarAtualizacao(doc.nome)}>
                      Solicitar atualização
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
