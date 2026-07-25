import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download } from 'lucide-react'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { Input, SearchInput } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Table, type TableColumn } from '@/components/ui/Table'
import { Drawer } from '@/components/ui/Drawer'
import { DataList } from '@/components/ui/DataList'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAdminAuditLog } from '@/hooks/useAdminAuditLog'
import { auditEvents as staticAuditEvents, getRelatedAuditEvents } from '@/data/administration/auditEvents'
import { auditCriticalityLabel, auditCriticalityStatus, auditResultLabel, auditResultStatus } from '@/utils/auditFormatters'
import { formatDateFull } from '@/utils/format'
import { FileSearch } from 'lucide-react'
import type { AuditCriticality, AuditEvent, AuditResult } from '@/types'

export default function AdminAudit() {
  const [searchParams] = useSearchParams()
  const { auditLog, logEvent } = useAdminAuditLog()
  const [search, setSearch] = useState('')
  const [modulo, setModulo] = useState('todos')
  const [criticidade, setCriticidade] = useState<AuditCriticality | 'todas'>('todas')
  const [resultado, setResultado] = useState<AuditResult | 'todos'>('todos')
  const [selected, setSelected] = useState<AuditEvent | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [exportMotivo, setExportMotivo] = useState('')
  const [exportDone, setExportDone] = useState(false)

  const allEvents = useMemo(() => [...auditLog, ...staticAuditEvents].sort((a, b) => new Date(b.dataIso).getTime() - new Date(a.dataIso).getTime()), [auditLog])
  const modules = useMemo(() => [...new Set(allEvents.map((e) => e.modulo))].sort(), [allEvents])

  useEffect(() => {
    const eventoId = searchParams.get('evento')
    if (eventoId) {
      const found = allEvents.find((e) => e.id === eventoId)
      if (found) setSelected(found)
    }
    const usuario = searchParams.get('usuario')
    if (usuario) setSearch(usuario)
  }, [searchParams, allEvents])

  const filtered = allEvents.filter((e) => {
    if (modulo !== 'todos' && e.modulo !== modulo) return false
    if (criticidade !== 'todas' && e.criticidade !== criticidade) return false
    if (resultado !== 'todos' && e.resultado !== resultado) return false
    if (search && !e.usuario.toLowerCase().includes(search.toLowerCase()) && !e.recurso.toLowerCase().includes(search.toLowerCase()) && !e.acao.toLowerCase().includes(search.toLowerCase()))
      return false
    return true
  })

  const columns: TableColumn<AuditEvent>[] = [
    { key: 'data', header: 'Data', render: (e) => formatDateFull(e.dataIso) },
    { key: 'usuario', header: 'Usuário', render: (e) => e.usuario },
    { key: 'acao', header: 'Ação', render: (e) => <span className="font-medium">{e.acao}</span> },
    { key: 'modulo', header: 'Módulo', render: (e) => e.modulo },
    { key: 'recurso', header: 'Recurso', render: (e) => e.recurso },
    { key: 'unidade', header: 'Unidade', render: (e) => e.unidade ?? '—' },
    { key: 'criticidade', header: 'Criticidade', render: (e) => <IndicatorBadge status={auditCriticalityStatus[e.criticidade]}>{auditCriticalityLabel[e.criticidade]}</IndicatorBadge> },
    { key: 'resultado', header: 'Resultado', render: (e) => <IndicatorBadge status={auditResultStatus[e.resultado]}>{auditResultLabel[e.resultado]}</IndicatorBadge> },
  ]

  const relatedEvents = selected?.correlacaoId ? getRelatedAuditEvents(selected.correlacaoId).filter((e) => e.id !== selected.id) : []

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Auditoria' }]} />

      <PageHeader
        eyebrow="Administração"
        title="Auditoria"
        description="Amostra representativa dos eventos do período — quem, quando, onde e o que mudou."
        actions={
          <Button size="sm" variant="secondary" leftIcon={<Download className="h-3.5 w-3.5" strokeWidth={1.7} />} onClick={() => setExportOpen(true)}>
            Exportar
          </Button>
        }
      />

      <AdminInternalNav active="auditoria" />

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput aria-label="Buscar" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por usuário, recurso ou ação..." wrapperClassName="w-64" />
        <Select aria-label="Módulo" value={modulo} onChange={(e) => setModulo(e.target.value)} options={[{ value: 'todos', label: 'Todos os módulos' }, ...modules.map((m) => ({ value: m, label: m }))]} className="w-48" />
        <Select
          aria-label="Criticidade"
          value={criticidade}
          onChange={(e) => setCriticidade(e.target.value as AuditCriticality | 'todas')}
          options={[
            { value: 'todas', label: 'Todas as criticidades' },
            { value: 'critica', label: 'Crítica' },
            { value: 'alta', label: 'Alta' },
            { value: 'media', label: 'Média' },
            { value: 'baixa', label: 'Baixa' },
          ]}
          className="w-48"
        />
        <Select
          aria-label="Resultado"
          value={resultado}
          onChange={(e) => setResultado(e.target.value as AuditResult | 'todos')}
          options={[
            { value: 'todos', label: 'Todos os resultados' },
            { value: 'sucesso', label: 'Sucesso' },
            { value: 'falha', label: 'Falha' },
            { value: 'pendente', label: 'Pendente' },
          ]}
          className="w-48"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FileSearch className="h-5 w-5" strokeWidth={1.7} />} title="Nenhum evento encontrado" description="Ajuste os filtros ou a busca." />
      ) : (
        <Table columns={columns} data={filtered} getRowId={(e) => e.id} onRowClick={setSelected} />
      )}

      <Drawer isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.acao ?? ''} widthClassName="w-full max-w-lg">
        {selected && (
          <div className="flex flex-col gap-5">
            <DataList
              items={[
                { label: 'Usuário', value: selected.usuario },
                { label: 'Data', value: formatDateFull(selected.dataIso) },
                { label: 'Módulo', value: selected.modulo },
                { label: 'Recurso', value: selected.recurso },
                { label: 'Unidade', value: selected.unidade ?? '—' },
                { label: 'Criticidade', value: <IndicatorBadge status={auditCriticalityStatus[selected.criticidade]}>{auditCriticalityLabel[selected.criticidade]}</IndicatorBadge> },
                { label: 'Resultado', value: <IndicatorBadge status={auditResultStatus[selected.resultado]}>{auditResultLabel[selected.resultado]}</IndicatorBadge> },
                { label: 'Origem', value: selected.origem },
                { label: 'Dispositivo', value: selected.dispositivo ?? '—' },
              ]}
            />
            {(selected.antes || selected.depois) && (
              <div>
                <p className="mb-2 text-label text-ink-tertiary">Antes e depois</p>
                <DataList items={[{ label: 'Antes', value: selected.antes ?? '—' }, { label: 'Depois', value: selected.depois ?? '—' }]} />
              </div>
            )}
            {selected.justificativa && (
              <div>
                <p className="mb-1 text-label text-ink-tertiary">Justificativa</p>
                <p className="text-support text-ink-secondary">{selected.justificativa}</p>
              </div>
            )}
            {selected.aprovador && (
              <div>
                <p className="mb-1 text-label text-ink-tertiary">Aprovador</p>
                <p className="text-support text-ink-secondary">{selected.aprovador}</p>
              </div>
            )}
            <div>
              <p className="mb-1 text-label text-ink-tertiary">Descrição</p>
              <p className="text-support text-ink-secondary">{selected.descricao}</p>
            </div>
            {relatedEvents.length > 0 && (
              <div>
                <p className="mb-2 text-label text-ink-tertiary">Eventos relacionados</p>
                <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
                  {relatedEvents.map((e) => (
                    <button key={e.id} onClick={() => setSelected(e)} className="flex items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-surface-hover">
                      <span className="text-caption text-ink-primary">{e.acao}</span>
                      <span className="text-caption text-ink-tertiary">{formatDateFull(e.dataIso)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <Modal isOpen={exportOpen} onClose={() => setExportOpen(false)} title="Exportar auditoria" description="A exportação exige motivo e gera um novo evento de auditoria.">
        {exportDone ? (
          <p className="text-support text-success">Exportação simulada concluída — evento registrado na auditoria.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <Input label="Motivo" value={exportMotivo} onChange={(e) => setExportMotivo(e.target.value)} placeholder="Motivo da exportação" />
          </div>
        )}
        <div className="flex items-center justify-end gap-2 pt-5">
          <Button variant="secondary" onClick={() => setExportOpen(false)}>
            {exportDone ? 'Fechar' : 'Cancelar'}
          </Button>
          {!exportDone && (
            <Button
              variant="primary"
              disabled={!exportMotivo.trim()}
              onClick={() => {
                logEvent({
                  usuario: 'Leo',
                  acao: 'Exportação de dados',
                  modulo: 'Auditoria',
                  recurso: `${filtered.length} eventos filtrados`,
                  criticidade: 'alta',
                  resultado: 'sucesso',
                  origem: 'Aplicação web',
                  justificativa: exportMotivo.trim(),
                  descricao: `Exportação de ${filtered.length} eventos de auditoria — motivo: ${exportMotivo.trim()}.`,
                })
                setExportDone(true)
              }}
            >
              Confirmar exportação
            </Button>
          )}
        </div>
      </Modal>
    </div>
  )
}
