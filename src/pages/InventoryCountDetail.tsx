import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertTriangle, Check, CircleCheckBig, Eye, EyeOff, Lock, PackageX, Ban } from 'lucide-react'
import { InventoryBreadcrumb } from '@/components/inventory/InventoryBreadcrumb'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataList } from '@/components/ui/DataList'
import { getInventoryCountById, recountTolerance } from '@/data/inventory/inventoryCounts'
import { getInventoryItemById } from '@/data/inventory/inventoryItems'
import { getInventoryLocationById } from '@/data/inventory/inventoryLocations'
import { countStatusLabel, countItemStatusLabel } from '@/data/inventory/inventoryMovementLabels'
import { units } from '@/data/units'
import { useInventoryCountProgress, type CountItemProgress } from '@/hooks/useInventoryCountProgress'
import { formatCurrencyBRL, formatDateFull } from '@/utils/format'
import NotFound from './NotFound'

const justificativaOptions = [
  { value: 'perda_nao_registrada', label: 'Perda não registrada' },
  { value: 'recebimento_nao_lancado', label: 'Recebimento não lançado' },
  { value: 'saida_nao_registrada', label: 'Saída não registrada' },
  { value: 'conversao_incorreta', label: 'Conversão incorreta' },
  { value: 'transferencia_pendente', label: 'Transferência pendente' },
  { value: 'erro_contagem', label: 'Erro de contagem' },
  { value: 'cadastro_incorreto', label: 'Cadastro incorreto' },
  { value: 'consumo_interno', label: 'Consumo interno' },
  { value: 'validade', label: 'Validade' },
  { value: 'quebra', label: 'Quebra' },
  { value: 'causa_desconhecida', label: 'Causa desconhecida' },
]

function CountItemRow({
  itemId,
  saldoSistemico,
  custo,
  progress,
  onRegistrar,
  onMarcarStatus,
  onJustificar,
}: {
  itemId: string
  saldoSistemico: number
  custo: number
  progress: CountItemProgress
  onRegistrar: (quantidade: number) => void
  onMarcarStatus: (status: CountItemProgress['status']) => void
  onJustificar: (justificativa: string) => void
}) {
  const item = getInventoryItemById(itemId)
  const [input, setInput] = useState('')
  const [justificativa, setJustificativa] = useState(justificativaOptions[0].value)

  useEffect(() => {
    setInput('')
  }, [progress.status])

  if (!item) return null

  const diferenca =
    progress.status === 'justificado' || progress.status === 'aprovado'
      ? (progress.segundaContagem ?? progress.primeiraContagem ?? 0) - saldoSistemico
      : progress.primeiraContagem !== null
        ? progress.primeiraContagem - saldoSistemico
        : null
  const impacto = diferenca !== null ? diferenca * custo : null

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-support font-medium text-ink-primary">{item.nome}</p>
          <p className="text-caption text-ink-tertiary">
            {item.categoria} · unidade: {item.unidadeMedida}
          </p>
        </div>
        <IndicatorBadge status={progress.status === 'aprovado' ? 'success' : progress.status === 'pendente' ? 'neutral' : 'attention'}>
          {countItemStatusLabel[progress.status]}
        </IndicatorBadge>
      </div>

      {progress.status === 'pendente' && (
        <div className="flex flex-wrap items-end gap-2">
          <Input
            label="Quantidade contada"
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="0"
            className="w-40"
            hint="Contagem cega — o saldo sistêmico só é exibido após o registro"
          />
          <Button size="sm" variant="primary" leftIcon={<Check className="h-3.5 w-3.5" strokeWidth={1.7} />} disabled={!input} onClick={() => input && onRegistrar(Number(input))}>
            Salvar e avançar
          </Button>
          <Button size="sm" variant="secondary" leftIcon={<AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => onMarcarStatus('nao_encontrado')}>
            Não encontrado
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Ban className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => onMarcarStatus('inacessivel')}>
            Inacessível
          </Button>
        </div>
      )}

      {progress.status === 'contado' && diferenca !== null && (
        <DataList
          items={[
            { label: 'Saldo sistêmico', value: `${saldoSistemico.toLocaleString('pt-BR')} ${item.unidadeMedida}` },
            { label: 'Quantidade contada', value: `${progress.primeiraContagem?.toLocaleString('pt-BR')} ${item.unidadeMedida}` },
            { label: 'Diferença', value: <span className={diferenca === 0 ? 'text-success' : 'text-ink-primary'}>{diferenca > 0 ? '+' : ''}{diferenca} {item.unidadeMedida}</span> },
          ]}
        />
      )}

      {progress.status === 'recontagem_solicitada' && (
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-caption text-warning">
            <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.7} />
            Diferença acima da tolerância ({formatCurrencyBRL(recountTolerance.valor)} ou {(recountTolerance.percentual * 100).toFixed(0)}%) — recontagem obrigatória
          </p>
          <p className="text-caption text-ink-tertiary">
            Primeira contagem: {progress.primeiraContagem?.toLocaleString('pt-BR')} {item.unidadeMedida} · Saldo sistêmico: {saldoSistemico.toLocaleString('pt-BR')} {item.unidadeMedida}
          </p>
          <div className="flex flex-wrap items-end gap-2">
            <Input label="Segunda contagem" type="number" value={input} onChange={(e) => setInput(e.target.value)} placeholder="0" className="w-40" />
            <Button size="sm" variant="primary" leftIcon={<Eye className="h-3.5 w-3.5" strokeWidth={1.7} />} disabled={!input} onClick={() => input && onRegistrar(Number(input))}>
              Registrar recontagem
            </Button>
          </div>
        </div>
      )}

      {progress.status === 'justificado' && diferenca !== null && (
        <div className="flex flex-col gap-3 rounded-md bg-surface-subtle p-3">
          <DataList
            items={[
              { label: 'Saldo sistêmico', value: `${saldoSistemico.toLocaleString('pt-BR')} ${item.unidadeMedida}` },
              { label: 'Primeira contagem', value: `${progress.primeiraContagem?.toLocaleString('pt-BR')} ${item.unidadeMedida}` },
              { label: 'Segunda contagem', value: `${progress.segundaContagem?.toLocaleString('pt-BR')} ${item.unidadeMedida}` },
              { label: 'Diferença', value: <span className="text-danger">{diferenca > 0 ? '+' : ''}{diferenca} {item.unidadeMedida}</span> },
              { label: 'Impacto estimado', value: impacto !== null ? formatCurrencyBRL(impacto) : '—' },
            ]}
          />
          <div className="flex flex-wrap items-end gap-2">
            <Select label="Justificativa" value={justificativa} onChange={(e) => setJustificativa(e.target.value)} options={justificativaOptions} className="w-56" />
            <Button size="sm" variant="primary" leftIcon={<Check className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => onJustificar(justificativa)}>
              Aprovar ajuste
            </Button>
          </div>
        </div>
      )}

      {progress.status === 'aprovado' && (
        <p className="flex items-center gap-1.5 text-caption text-success">
          <CircleCheckBig className="h-3.5 w-3.5" strokeWidth={1.7} />
          Ajuste aprovado{progress.justificativa && ` — ${justificativaOptions.find((j) => j.value === progress.justificativa)?.label ?? progress.justificativa}`}
        </p>
      )}

      {(progress.status === 'nao_encontrado' || progress.status === 'inacessivel') && (
        <p className="flex items-center gap-1.5 text-caption text-ink-tertiary">
          <PackageX className="h-3.5 w-3.5" strokeWidth={1.7} />
          {progress.status === 'nao_encontrado' ? 'Item não encontrado — requer investigação' : 'Local inacessível no momento da contagem'}
        </p>
      )}
    </div>
  )
}

export default function InventoryCountDetail() {
  const { inventoryId } = useParams<{ inventoryId: string }>()
  const base = inventoryId ? getInventoryCountById(inventoryId) : undefined
  const [responsavelFechamento, setResponsavelFechamento] = useState('Leo')
  const [observacaoFechamento, setObservacaoFechamento] = useState('')

  const progressHook = useInventoryCountProgress(inventoryId ?? '', base?.itens ?? [])

  if (!base) return <NotFound />

  const local = getInventoryLocationById(base.localId)
  const unit = units.find((u) => u.id === base.unitId)
  const { items, registrarContagem, marcarStatus, justificar, podeConcluir, closing, fechar, reabrir } = progressHook

  const contados = items.filter((i) => i.status !== 'pendente').length

  return (
    <div className="flex flex-col gap-6">
      <InventoryBreadcrumb trail={[{ label: 'Inventários', path: '/estoque/inventarios' }, { label: base.titulo }]} />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-page-title">{base.titulo}</h1>
          <IndicatorBadge status={closing ? 'success' : base.status === 'em_contagem' ? 'attention' : 'neutral'}>{closing ? 'Fechado' : countStatusLabel[base.status]}</IndicatorBadge>
          {base.contagemCega && (
            <span className="flex items-center gap-1 text-caption text-ink-tertiary">
              <EyeOff className="h-3.5 w-3.5" strokeWidth={1.7} /> Contagem cega ativada
            </span>
          )}
        </div>
        <p className="text-support text-ink-secondary">
          {unit?.nome} · {local?.nome} · Responsável {base.responsavel} · Contadores: {base.contadores.join(', ')}
        </p>
        <p className="text-caption text-ink-tertiary">
          Início {base.inicio ? formatDateFull(base.inicio) : '—'} · Prazo {formatDateFull(base.prazo)}
        </p>
      </div>

      <ProgressBar
        label="Progresso da contagem"
        valueLabel={`${base.itensContados}/${base.itensPrevistos} itens (${Math.round((base.itensContados / base.itensPrevistos) * 100)}%)`}
        value={base.itensPrevistos > 0 ? base.itensContados / base.itensPrevistos : 0}
        status="info"
      />

      {base.divergenciaProvisoria > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning-soft/40 p-4">
          <p className="text-support font-medium text-ink-primary">Divergência provisória: {formatCurrencyBRL(base.divergenciaProvisoria)}</p>
          <p className="text-caption text-ink-tertiary">{base.itensRecontagem} itens exigem recontagem — amostra abaixo, sujeita a atualização conforme a contagem avança.</p>
        </div>
      )}

      <section>
        <SectionHeader title="Itens da contagem" description={`Amostra demonstrativa (${contados}/${items.length} desta amostra já registrados)`} />
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CountItemRow
              key={item.itemId}
              itemId={item.itemId}
              saldoSistemico={item.saldoSistemico}
              custo={item.custo}
              progress={{ primeiraContagem: item.primeiraContagem, segundaContagem: item.segundaContagem, status: item.status, justificativa: item.justificativa, observacao: item.observacao }}
              onRegistrar={(q) => registrarContagem(item.itemId, q, item.saldoSistemico, item.custo, item.status, item.primeiraContagem)}
              onMarcarStatus={(status) => marcarStatus(item.itemId, status)}
              onJustificar={(j) => justificar(item.itemId, j)}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Fechamento do inventário" description="Fechamento demonstrativo — sem movimentação real de estoque" />
        {closing ? (
          <div className="flex flex-col gap-3 rounded-lg border border-success/30 bg-success-soft/40 p-5">
            <div className="flex items-center gap-2">
              <CircleCheckBig className="h-4 w-4 text-success" />
              <p className="text-support font-medium text-ink-primary">Inventário fechado por {closing.fechadoPor}</p>
            </div>
            <p className="text-support text-ink-secondary">{formatDateFull(closing.dataFechamento)}</p>
            {closing.observacao && <p className="text-support text-ink-secondary">{closing.observacao}</p>}
            <Button size="sm" variant="secondary" onClick={reabrir} className="self-start">
              Reabrir com justificativa
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Select label="Responsável" value={responsavelFechamento} onChange={(e) => setResponsavelFechamento(e.target.value)} options={[{ value: 'Leo', label: 'Leo' }, { value: base.responsavel, label: base.responsavel }]} />
              <Input label="Observação (opcional)" value={observacaoFechamento} onChange={(e) => setObservacaoFechamento(e.target.value)} placeholder="Ex.: fechado após conferência final" />
            </div>
            <Button size="sm" variant="navy" leftIcon={<Lock className="h-3.5 w-3.5" strokeWidth={1.7} />} disabled={!podeConcluir} onClick={() => fechar(responsavelFechamento, observacaoFechamento)} className="self-start">
              Fechar inventário
            </Button>
            {!podeConcluir && <p className="text-caption text-ink-tertiary">Todos os itens da amostra precisam estar contados, justificados ou marcados como não encontrado/inacessível.</p>}
          </div>
        )}
      </section>
    </div>
  )
}
