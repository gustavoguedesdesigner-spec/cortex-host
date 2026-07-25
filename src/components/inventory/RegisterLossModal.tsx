import { useEffect, useState } from 'react'
import { CircleCheckBig } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { inventoryItems } from '@/data/inventory/inventoryItems'
import { units } from '@/data/units'
import { getInventoryLocationsByUnit } from '@/data/inventory/inventoryLocations'
import { lossReasonLabel } from '@/data/inventory/inventoryMovementLabels'
import type { InventoryLoss, LossReason } from '@/types'

const reasonOptions = Object.entries(lossReasonLabel).map(([value, label]) => ({ value, label }))

export function RegisterLossModal({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (loss: Omit<InventoryLoss, 'id' | 'status'>) => void }) {
  const [unitId, setUnitId] = useState(units[0].id)
  const [itemId, setItemId] = useState(inventoryItems[0].id)
  const [quantidade, setQuantidade] = useState('')
  const [motivo, setMotivo] = useState<LossReason>('preparo')
  const [descricao, setDescricao] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setUnitId(units[0].id)
      setItemId(inventoryItems[0].id)
      setQuantidade('')
      setMotivo('preparo')
      setDescricao('')
      setSaved(false)
    }
  }, [isOpen])

  const item = inventoryItems.find((i) => i.id === itemId)
  const locations = getInventoryLocationsByUnit(unitId)

  function handleSave() {
    if (!item || !quantidade) return
    const qtd = Number(quantidade)
    onSave({
      itemId,
      unitId,
      localId: locations[0]?.id ?? `${unitId}-estoque_seco`,
      quantidade: qtd,
      unidadeMedida: item.unidadeMedida,
      custoUnitario: item.custoMedio,
      valor: qtd * item.custoMedio,
      motivo,
      descricao: descricao.trim() || 'Sem descrição adicional.',
      responsavel: 'Leo',
      data: new Date().toISOString(),
    })
    setSaved(true)
    window.setTimeout(onClose, 900)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar perda" description="Ao salvar, a saída atualiza o saldo, as perdas e o CMV desta unidade.">
      {saved ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <CircleCheckBig className="h-6 w-6 text-success" />
          <p className="text-body font-medium text-ink-primary">Perda registrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Unidade" value={unitId} onChange={(e) => setUnitId(e.target.value)} options={units.map((u) => ({ value: u.id, label: u.nomeCurto }))} />
            <Select label="Item" value={itemId} onChange={(e) => setItemId(e.target.value)} options={inventoryItems.map((i) => ({ value: i.id, label: i.nome }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label={`Quantidade (${item?.unidadeMedida ?? 'unidade'})`} type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="0" />
            <Select label="Motivo" value={motivo} onChange={(e) => setMotivo(e.target.value as LossReason)} options={reasonOptions} />
          </div>
          <Input label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Detalhe o que aconteceu" />
        </div>
      )}
      {!saved && (
        <div className="flex items-center justify-end gap-2 pt-5">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!quantidade}>
            Registrar perda
          </Button>
        </div>
      )}
    </Modal>
  )
}
