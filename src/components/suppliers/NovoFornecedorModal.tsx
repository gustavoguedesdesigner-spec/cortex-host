import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { SupplierRegistrationBadge } from './SupplierBadges'
import { categoryLabels } from '@/data/suppliers/supplierSummary'
import { cn } from '@/utils/cn'
import type { NovoFornecedorInput } from '@/hooks/useSuppliers'
import type { Supplier, SupplierCategoryId } from '@/types'

const steps = ['Identificação', 'Categorias', 'Contatos', 'Condições', 'Documentos', 'Homologação', 'Publicação']

const checklistItems = ['Cadastro completo', 'Documentos obrigatórios anexados', 'Capacidade de fornecimento avaliada', 'Referências de qualidade verificadas', 'Preço e prazo dentro do esperado']

interface FormState {
  razaoSocial: string
  nomeFantasia: string
  categoriaPrincipalId: SupplierCategoryId
  cidade: string
  contatoNome: string
  contatoEmail: string
  contatoTelefone: string
  condicaoPagamento: string
  pedidoMinimo: string
  prazoEntregaDias: string
}

const initialForm: FormState = {
  razaoSocial: '',
  nomeFantasia: '',
  categoriaPrincipalId: 'carnes',
  cidade: '',
  contatoNome: '',
  contatoEmail: '',
  contatoTelefone: '',
  condicaoPagamento: '15 dias',
  pedidoMinimo: '',
  prazoEntregaDias: '',
}

/** Fluxo guiado de novo fornecedor (secao 57-65) — resulta sempre em status "Em homologação". */
export function NovoFornecedorModal({
  isOpen,
  onClose,
  onCreated,
  createSupplier,
}: {
  isOpen: boolean
  onClose: () => void
  onCreated: (supplier: Supplier) => void
  createSupplier: (input: NovoFornecedorInput) => Supplier
}) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initialForm)
  const [checked, setChecked] = useState<boolean[]>(checklistItems.map(() => false))
  const [created, setCreated] = useState<Supplier | null>(null)

  function reset() {
    setStep(0)
    setForm(initialForm)
    setChecked(checklistItems.map(() => false))
    setCreated(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handlePublicar() {
    const supplier = createSupplier({ nome: form.nomeFantasia || form.razaoSocial, categoriaPrincipalId: form.categoriaPrincipalId, cidade: form.cidade })
    setCreated(supplier)
    setStep(steps.length - 1)
  }

  const podeAvancar = step === 0 ? form.razaoSocial.trim().length > 0 : step === 2 ? form.contatoNome.trim().length > 0 && form.contatoEmail.trim().length > 0 : true

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Novo fornecedor" description={created ? undefined : `Etapa ${step + 1} de ${steps.length} — ${steps[step]}`} size="lg">
      {!created && (
        <div className="mb-5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {steps.map((s, i) => (
            <span
              key={s}
              className={cn(
                'shrink-0 rounded-full px-2.5 py-1 text-caption font-medium',
                i === step ? 'bg-accent-soft text-accent' : i < step ? 'bg-success-soft text-success' : 'bg-surface-subtle text-ink-tertiary',
              )}
            >
              {i + 1}. {s}
            </span>
          ))}
        </div>
      )}

      {step === 0 && !created && (
        <div className="flex flex-col gap-4">
          <Input label="Razão social demonstrativa" placeholder="Ex.: Fornecedor Exemplo LTDA" value={form.razaoSocial} onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })} />
          <Input label="Nome fantasia" placeholder="Ex.: Fornecedor Exemplo" value={form.nomeFantasia} onChange={(e) => setForm({ ...form, nomeFantasia: e.target.value })} />
          <Input label="Cidade" placeholder="Ex.: Salvador/BA" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
          <p className="text-caption text-ink-tertiary">Documento fiscal, endereço e site seguem mascarados nesta etapa do protótipo — sem consulta real de CNPJ.</p>
        </div>
      )}

      {step === 1 && !created && (
        <div className="flex flex-col gap-4">
          <Select
            label="Categoria principal"
            value={form.categoriaPrincipalId}
            onChange={(e) => setForm({ ...form, categoriaPrincipalId: e.target.value as SupplierCategoryId })}
            options={Object.entries(categoryLabels).map(([value, label]) => ({ value, label }))}
          />
          <p className="text-caption text-ink-tertiary">Itens, unidade de medida, mínimo e frequência de compra são detalhados após a homologação, na ficha de produtos do fornecedor.</p>
        </div>
      )}

      {step === 2 && !created && (
        <div className="flex flex-col gap-4">
          <Input label="Nome do contato comercial" value={form.contatoNome} onChange={(e) => setForm({ ...form, contatoNome: e.target.value })} />
          <Input label="E-mail" type="email" value={form.contatoEmail} onChange={(e) => setForm({ ...form, contatoEmail: e.target.value })} />
          <Input label="Telefone" value={form.contatoTelefone} onChange={(e) => setForm({ ...form, contatoTelefone: e.target.value })} />
        </div>
      )}

      {step === 3 && !created && (
        <div className="flex flex-col gap-4">
          <Select
            label="Condição de pagamento"
            value={form.condicaoPagamento}
            onChange={(e) => setForm({ ...form, condicaoPagamento: e.target.value })}
            options={[
              { value: '15 dias', label: '15 dias' },
              { value: '30 dias', label: '30 dias' },
              { value: '45 dias', label: '45 dias' },
              { value: 'à vista', label: 'À vista' },
            ]}
          />
          <Input label="Pedido mínimo (opcional)" placeholder="Ex.: 50 kg" value={form.pedidoMinimo} onChange={(e) => setForm({ ...form, pedidoMinimo: e.target.value })} />
          <Input label="Prazo de entrega em dias" placeholder="Ex.: 3" value={form.prazoEntregaDias} onChange={(e) => setForm({ ...form, prazoEntregaDias: e.target.value })} />
        </div>
      )}

      {step === 4 && !created && (
        <div className="flex flex-col gap-3">
          <p className="text-support text-ink-secondary">Lista obrigatória — anexação simulada, sem upload real nesta etapa do protótipo.</p>
          {['Contrato de fornecimento', 'Regularidade fiscal', 'Licença sanitária ou equivalente', 'Dados bancários', 'Certificação de qualidade'].map((doc) => (
            <div key={doc} className="flex items-center justify-between rounded-md border border-border bg-surface-subtle px-3.5 py-2.5 text-support">
              {doc}
              <span className="text-caption text-ink-tertiary">Pendente</span>
            </div>
          ))}
        </div>
      )}

      {step === 5 && !created && (
        <div className="flex flex-col gap-3">
          <p className="text-support text-ink-secondary">Checklist de homologação demonstrativo — confirme os itens avaliados.</p>
          {checklistItems.map((item, i) => (
            <label key={item} className="flex items-center gap-2.5 rounded-md border border-border px-3.5 py-2.5 text-support text-ink-primary">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => setChecked((prev) => prev.map((c, idx) => (idx === i ? !c : c)))}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              {item}
            </label>
          ))}
          <p className="text-caption text-ink-tertiary">Fluxo de aprovação configurável: Compras → Operações → Financeiro → Qualidade → Administração.</p>
        </div>
      )}

      {step === 6 && created && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-success" strokeWidth={1.5} />
          <p className="text-card-title text-ink-primary">{created.nome} cadastrado</p>
          <SupplierRegistrationBadge status={created.status} />
          <p className="max-w-sm text-support text-ink-tertiary">
            O fornecedor não é ativado automaticamente. Ele fica em homologação até a conclusão da aprovação configurada.
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <Button variant="ghost" size="sm" onClick={step === 0 ? handleClose : () => setStep((s) => s - 1)} disabled={Boolean(created)}>
          {step === 0 ? 'Cancelar' : 'Voltar'}
        </Button>
        {created ? (
          <Button size="sm" onClick={() => onCreated(created)}>
            Ver fornecedor
          </Button>
        ) : step === 5 ? (
          <Button size="sm" onClick={handlePublicar}>
            Enviar para homologação
          </Button>
        ) : (
          <Button size="sm" onClick={() => setStep((s) => s + 1)} disabled={!podeAvancar}>
            Avançar
          </Button>
        )}
      </div>
    </Modal>
  )
}
