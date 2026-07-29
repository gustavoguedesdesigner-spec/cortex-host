import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { DocumentConfidenceBadge } from './ReceivingBadges'
import { suppliers } from '@/data/suppliers/suppliers'
import { units } from '@/data/units'
import { cn } from '@/utils/cn'
import type { NovoRecebimentoInput } from '@/hooks/useReceiving'
import type { Receipt } from '@/types'

const steps = ['Identificação', 'Leitura do documento', 'Conferência física', 'Qualidade, lote e validade', 'Decisão']

interface FormState {
  supplierId: string
  unitId: string
  nfNumero: string
  responsavel: string
}

const initialForm: FormState = { supplierId: suppliers[0]?.id ?? '', unitId: units[0]?.id ?? '', nfNumero: '', responsavel: '' }

/**
 * Fluxo guiado de novo recebimento — espelha o checklist do POP-REC-002:
 * identificar pedido, conferir documento, conferir fisico, verificar
 * qualidade/lote/validade, decidir. Nunca entra em estoque sem passar pelas
 * cinco etapas.
 */
export function NovoRecebimentoModal({
  isOpen,
  onClose,
  onCreated,
  createReceipt,
}: {
  isOpen: boolean
  onClose: () => void
  onCreated: (receipt: Receipt) => void
  createReceipt: (input: NovoRecebimentoInput) => Receipt
}) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initialForm)
  const [created, setCreated] = useState<Receipt | null>(null)

  function reset() {
    setStep(0)
    setForm(initialForm)
    setCreated(null)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleConcluir() {
    const receipt = createReceipt(form)
    setCreated(receipt)
    setStep(steps.length)
  }

  const podeAvancar = step === 0 ? form.nfNumero.trim().length > 0 && form.responsavel.trim().length > 0 : true

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Novo recebimento" description={created ? undefined : `Etapa ${step + 1} de ${steps.length} — ${steps[step]}`} size="lg">
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
          <Select label="Fornecedor" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} options={suppliers.map((s) => ({ value: s.id, label: s.nome }))} />
          <Select label="Unidade" value={form.unitId} onChange={(e) => setForm({ ...form, unitId: e.target.value })} options={units.map((u) => ({ value: u.id, label: u.nome }))} />
          <Input label="Número da nota fiscal" placeholder="Ex.: 9930" value={form.nfNumero} onChange={(e) => setForm({ ...form, nfNumero: e.target.value })} />
          <Input label="Responsável pela conferência" placeholder="Ex.: Rafael Martins" value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} />
          <p className="text-caption text-ink-tertiary">O pedido de origem é identificado automaticamente pelo CORTEX a partir do fornecedor e da unidade, quando existir um pedido em aberto.</p>
        </div>
      )}

      {step === 1 && !created && (
        <div className="flex flex-col gap-4">
          <p className="text-support text-ink-secondary">Leitura assistida simulada da NF {form.nfNumero || '—'} — sem OCR real neste protótipo.</p>
          <div className="rounded-md border border-border bg-surface-subtle p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-label text-ink-tertiary">Resultado da leitura</span>
              <DocumentConfidenceBadge nivel="media" />
            </div>
            <ul className="flex flex-col gap-1 text-support text-ink-secondary">
              <li>· Fornecedor identificado</li>
              <li>· Número da NF identificado</li>
              <li>· Itens e quantidades identificados</li>
              <li>· Valor total identificado</li>
            </ul>
            <p className="mt-2 text-caption text-ink-tertiary">Confiança média — confirme os campos manualmente antes de prosseguir.</p>
          </div>
        </div>
      )}

      {step === 2 && !created && (
        <div className="flex flex-col gap-3">
          <p className="text-support text-ink-secondary">Registre a contagem física comparando com o pedido e o documento.</p>
          <div className="rounded-md border border-border bg-surface-subtle p-4 text-support text-ink-secondary">
            Itens, quantidades pedidas, quantidades do documento e quantidades físicas são detalhados na tela de conferência do recebimento após a criação — este fluxo guiado registra apenas a chegada e a leitura inicial.
          </div>
        </div>
      )}

      {step === 3 && !created && (
        <div className="flex flex-col gap-3">
          <p className="text-support text-ink-secondary">Padrões de qualidade aplicados automaticamente pelo CORTEX:</p>
          <ul className="flex flex-col gap-1.5 text-support text-ink-secondary">
            <li>· Temperatura de recebimento: padrão 0°C a 4°C, tolerância máxima 6°C</li>
            <li>· Validade mínima na entrada: padrão 70% da vida útil, tolerância mínima 60%</li>
            <li>· Lote obrigatório para itens perecíveis</li>
          </ul>
          <p className="text-caption text-ink-tertiary">Itens fora do padrão são enviados automaticamente para quarentena — nunca liberados sem decisão explícita.</p>
        </div>
      )}

      {step === 4 && !created && (
        <div className="flex flex-col gap-3">
          <p className="text-support text-ink-secondary">Ao concluir, o recebimento é registrado com status "Em conferência" — a decisão final (aceitar, aceitar parcialmente, recusar ou enviar para quarentena) é tomada na tela de detalhe, item a item.</p>
        </div>
      )}

      {step === steps.length && created && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-success" strokeWidth={1.5} />
          <p className="text-card-title text-ink-primary">Recebimento registrado</p>
          <p className="max-w-sm text-support text-ink-tertiary">NF {created.nfNumero} está em conferência. Continue a conferência item a item na tela de detalhe.</p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <Button variant="ghost" size="sm" onClick={step === 0 ? handleClose : () => setStep((s) => s - 1)} disabled={Boolean(created)}>
          {step === 0 ? 'Cancelar' : 'Voltar'}
        </Button>
        {created ? (
          <Button size="sm" onClick={() => onCreated(created)}>
            Continuar conferência
          </Button>
        ) : step === steps.length - 1 ? (
          <Button size="sm" onClick={handleConcluir}>
            Registrar recebimento
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
