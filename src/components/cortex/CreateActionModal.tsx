import { useEffect, useState } from 'react'
import { CircleCheckBig } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { units } from '@/data/units'
import type { CreatedAction } from '@/types'

const unidadeOptions = [{ value: 'Todas as unidades', label: 'Todas as unidades' }, ...units.map((u) => ({ value: u.nome, label: u.nome }))]
const responsavelOptions = [{ value: 'Leo', label: 'Leo' }, ...units.map((u) => ({ value: u.gerente, label: u.gerente }))]
const prioridadeOptions = [
  { value: 'critica', label: 'Crítica' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
]

export interface CreateActionDefaults {
  titulo?: string
  unidade?: string
  prioridade?: CreatedAction['prioridade']
  ocorrenciaId?: string
}

interface CreateActionModalProps {
  isOpen: boolean
  onClose: () => void
  defaults?: CreateActionDefaults
  onSave: (action: Omit<CreatedAction, 'id' | 'criadoEm'>) => void
}

export function CreateActionModal({ isOpen, onClose, defaults, onSave }: CreateActionModalProps) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [unidade, setUnidade] = useState('Todas as unidades')
  const [responsavel, setResponsavel] = useState('Leo')
  const [prazo, setPrazo] = useState('')
  const [prioridade, setPrioridade] = useState<CreatedAction['prioridade']>('alta')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTitulo(defaults?.titulo ?? '')
      setDescricao('')
      setUnidade(defaults?.unidade ?? 'Todas as unidades')
      setResponsavel('Leo')
      setPrazo('')
      setPrioridade(defaults?.prioridade ?? 'alta')
      setSaved(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  function handleSave() {
    if (!titulo.trim()) return
    onSave({
      titulo: titulo.trim(),
      descricao: descricao.trim() || 'Sem descrição adicional.',
      unidade,
      responsavel,
      prazo: prazo.trim() || 'A definir',
      prioridade,
      ocorrenciaId: defaults?.ocorrenciaId,
    })
    setSaved(true)
    window.setTimeout(() => {
      onClose()
    }, 900)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar ação" description="A ação será incluída em Pendências operacionais.">
      {saved ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <CircleCheckBig className="h-6 w-6 text-success" />
          <p className="text-body text-ink-primary font-medium">Ação criada com sucesso.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Input label="Título da ação" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Revisar porcionamento de carne" />
          <Input
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Detalhe o que precisa ser feito"
          />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Unidade" value={unidade} onChange={(e) => setUnidade(e.target.value)} options={unidadeOptions} />
            <Select label="Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} options={responsavelOptions} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prazo" value={prazo} onChange={(e) => setPrazo(e.target.value)} placeholder="Ex.: Hoje, 18h" />
            <Select
              label="Prioridade"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value as CreatedAction['prioridade'])}
              options={prioridadeOptions}
            />
          </div>
        </div>
      )}
      {!saved && (
        <div className="flex items-center justify-end gap-2 pt-5">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!titulo.trim()}>
            Salvar ação
          </Button>
        </div>
      )}
    </Modal>
  )
}
