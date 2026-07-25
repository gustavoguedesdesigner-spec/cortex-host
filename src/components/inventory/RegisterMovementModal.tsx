import { useEffect, useState } from 'react'
import { CircleCheckBig } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { inventoryItems } from '@/data/inventory/inventoryItems'
import { units } from '@/data/units'
import { getInventoryLocationsByUnit } from '@/data/inventory/inventoryLocations'
import type { InventoryMovement, MovementType } from '@/types'

const manualTypes: { value: MovementType; label: string }[] = [
  { value: 'perda', label: 'Perda' },
  { value: 'consumo_interno', label: 'Consumo interno' },
  { value: 'ajuste_positivo', label: 'Ajuste positivo' },
  { value: 'ajuste_negativo', label: 'Ajuste negativo' },
  { value: 'bloqueio', label: 'Bloqueio' },
  { value: 'desbloqueio', label: 'Desbloqueio' },
]

export function RegisterMovementModal({ isOpen, onClose, onSave }: { isOpen: boolean; onClose: () => void; onSave: (movement: Omit<InventoryMovement, 'id'>) => void }) {
  const [tipo, setTipo] = useState<MovementType>('perda')
  const [unitId, setUnitId] = useState(units[0].id)
  const [itemId, setItemId] = useState(inventoryItems[0].id)
  const [quantidade, setQuantidade] = useState('')
  const [motivo, setMotivo] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTipo('perda')
      setUnitId(units[0].id)
      setItemId(inventoryItems[0].id)
      setQuantidade('')
      setMotivo('')
      setSaved(false)
    }
  }, [isOpen])

  const locations = getInventoryLocationsByUnit(unitId)
  const item = inventoryItems.find((i) => i.id === itemId)

  function handleSave() {
    if (!item || !quantidade) return
    const qtd = Number(quantidade)
    onSave({
      itemId,
      quantidade: qtd,
      unidadeMedida: item.unidadeMedida,
      custoUnitario: item.custoMedio,
      valorTotal: qtd * item.custoMedio,
      tipo,
      unitId,
      localId: locations[0]?.id ?? `${unitId}-estoque_seco`,
      data: new Date().toISOString(),
      usuario: 'Leo',
      origem: 'Registro manual',
      motivo: motivo.trim() || undefined,
      status: tipo === 'ajuste_positivo' || tipo === 'ajuste_negativo' ? 'aguardando_aprovacao' : 'confirmado',
    })
    setSaved(true)
    window.setTimeout(onClose, 900)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar movimentação" description="Entradas de recebimento devem vir do módulo de Recebimentos.">
      {saved ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <CircleCheckBig className="h-6 w-6 text-success" />
          <p className="text-body font-medium text-ink-primary">Movimentação registrada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Select label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value as MovementType)} options={manualTypes} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Unidade" value={unitId} onChange={(e) => setUnitId(e.target.value)} options={units.map((u) => ({ value: u.id, label: u.nomeCurto }))} />
            <Select label="Item" value={itemId} onChange={(e) => setItemId(e.target.value)} options={inventoryItems.map((i) => ({ value: i.id, label: i.nome }))} />
          </div>
          <Input label={`Quantidade (${item?.unidadeMedida ?? 'unidade'})`} type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="0" />
          <Input label="Motivo / observação" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: quebra no transporte interno" />
          {(tipo === 'ajuste_positivo' || tipo === 'ajuste_negativo') && (
            <p className="text-caption text-ink-tertiary">Ajustes de saldo exigem aprovação antes de impactar o estoque disponível.</p>
          )}
        </div>
      )}
      {!saved && (
        <div className="flex items-center justify-end gap-2 pt-5">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!quantidade}>
            Salvar movimentação
          </Button>
        </div>
      )}
    </Modal>
  )
}
