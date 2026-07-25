import { useEffect, useMemo, useState } from 'react'
import { CircleCheckBig } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { inventoryItems } from '@/data/inventory/inventoryItems'
import { getPosition } from '@/data/inventory/inventoryPositions'
import { units } from '@/data/units'
import { calcularCobertura, calcularSaldoDisponivel } from '@/utils/inventoryCalculations'
import type { InventoryTransfer } from '@/types'

export function CreateTransferModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (transfer: Omit<InventoryTransfer, 'id' | 'criadaEm' | 'status' | 'quantidadeRecebida'>) => void
}) {
  const [itemId, setItemId] = useState(inventoryItems[0].id)
  const [origemId, setOrigemId] = useState(units[0].id)
  const [destinoId, setDestinoId] = useState(units[1].id)
  const [quantidade, setQuantidade] = useState('')
  const [motivo, setMotivo] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setItemId(inventoryItems[0].id)
      setOrigemId(units[0].id)
      setDestinoId(units[1].id)
      setQuantidade('')
      setMotivo('')
      setSaved(false)
    }
  }, [isOpen])

  const item = inventoryItems.find((i) => i.id === itemId)
  const posicaoOrigem = getPosition(itemId, origemId)
  const posicaoDestino = getPosition(itemId, destinoId)

  const impacto = useMemo(() => {
    if (!posicaoOrigem || !quantidade) return null
    const qtd = Number(quantidade)
    const saldoOrigemAtual = calcularSaldoDisponivel(posicaoOrigem.saldoSistemico, posicaoOrigem.quantidadeReservada, posicaoOrigem.quantidadeBloqueada)
    const coberturaAtual = calcularCobertura(saldoOrigemAtual, posicaoOrigem.consumoMedioDiario)
    const coberturaAposEnvio = calcularCobertura(saldoOrigemAtual - qtd, posicaoOrigem.consumoMedioDiario)
    return { coberturaAtual, coberturaAposEnvio, saldoInsuficiente: qtd > saldoOrigemAtual }
  }, [posicaoOrigem, quantidade])

  function handleSave() {
    if (!item || !quantidade) return
    onSave({
      itemId,
      origemUnitId: origemId,
      destinoUnitId: destinoId,
      quantidadeEnviada: Number(quantidade),
      unidadeMedida: item.unidadeMedida,
      valor: Number(quantidade) * item.custoMedio,
      solicitante: 'Leo',
      prioridade: 'media',
      prazoLabel: 'A definir',
      motivo: motivo.trim() || 'Reposição entre unidades',
    })
    setSaved(true)
    window.setTimeout(onClose, 900)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar transferência" size="md">
      {saved ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <CircleCheckBig className="h-6 w-6 text-success" />
          <p className="text-body font-medium text-ink-primary">Transferência criada.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Select label="Item" value={itemId} onChange={(e) => setItemId(e.target.value)} options={inventoryItems.map((i) => ({ value: i.id, label: i.nome }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Origem" value={origemId} onChange={(e) => setOrigemId(e.target.value)} options={units.map((u) => ({ value: u.id, label: u.nomeCurto }))} />
            <Select label="Destino" value={destinoId} onChange={(e) => setDestinoId(e.target.value)} options={units.filter((u) => u.id !== origemId).map((u) => ({ value: u.id, label: u.nomeCurto }))} />
          </div>
          <Input label={`Quantidade (${item?.unidadeMedida ?? 'unidade'})`} type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="0" />
          <Input label="Motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: risco de ruptura na unidade de destino" />

          {impacto && (
            <div className="rounded-md bg-surface-subtle p-3 text-support text-ink-secondary">
              <p className="mb-1 text-label text-ink-tertiary">Impacto estimado</p>
              <p>
                Cobertura da origem: {impacto.coberturaAtual !== null ? `${impacto.coberturaAtual.toFixed(1)} dias` : '—'} → {impacto.coberturaAposEnvio !== null ? `${impacto.coberturaAposEnvio.toFixed(1)} dias` : '—'} após o envio
              </p>
              {impacto.saldoInsuficiente && <p className="mt-1 text-danger">Saldo disponível na origem é menor que a quantidade solicitada — a transferência resolveria a ruptura no destino, mas criaria ruptura na origem.</p>}
              {posicaoDestino && <p className="mt-1 text-ink-tertiary">Reduz o risco de ruptura em {units.find((u) => u.id === destinoId)?.nomeCurto}.</p>}
            </div>
          )}
        </div>
      )}
      {!saved && (
        <div className="flex items-center justify-end gap-2 pt-5">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!quantidade || origemId === destinoId}>
            Criar transferência
          </Button>
        </div>
      )}
    </Modal>
  )
}
