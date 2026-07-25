import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Copy } from 'lucide-react'
import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { DataList } from '@/components/ui/DataList'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { roles, getRoleById } from '@/data/administration/roles'
import { getAccessConflictsByRole } from '@/data/administration/permissions'
import { units } from '@/data/units'
import { notificationCategories } from '@/data/administration/notificationSettings'
import { formatDateFull } from '@/utils/format'
import { cn } from '@/utils/cn'

const steps = ['Identificação', 'Escopo', 'Perfil', 'Segurança', 'Notificações', 'Revisão']

export default function AdminUserNew() {
  const navigate = useNavigate()
  const { createUser } = useAdminUsers()

  const [step, setStep] = useState(0)
  const [invited, setInvited] = useState<{ nome: string; email: string; validoAte: string } | null>(null)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [cargo, setCargo] = useState('')
  const [area, setArea] = useState('')
  const [responsavel, setResponsavel] = useState('Leo')

  const [unidades, setUnidades] = useState<string[]>([])

  const [roleId, setRoleId] = useState(roles[3]?.id ?? roles[0].id)

  const [doisFatores, setDoisFatores] = useState(true)
  const [temporario, setTemporario] = useState(false)
  const [dataExpiracao, setDataExpiracao] = useState('2026-08-31')

  const [canaisSelecionados, setCanaisSelecionados] = useState<string[]>(['sistema', 'email'])
  const [categoriaNotif, setCategoriaNotif] = useState(notificationCategories[0])

  const role = getRoleById(roleId)
  const conflicts = getAccessConflictsByRole(roleId)

  function toggleUnidade(id: string) {
    setUnidades((prev) => (prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]))
  }

  function toggleCanal(id: string) {
    setCanaisSelecionados((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const podeAvancar =
    (step === 0 && nome.trim().length > 0 && email.trim().length > 0 && cargo.trim().length > 0) ||
    (step === 1 && unidades.length > 0) ||
    step === 2 ||
    step === 3 ||
    step === 4

  function handleEnviarConvite() {
    const novoUsuario = createUser({
      nome: nome.trim(),
      email: email.trim(),
      cargo: cargo.trim(),
      area: area.trim() || undefined,
      roleId,
      unidades,
      autenticacaoDoisFatores: doisFatores,
      acessoTemporario: temporario ? { inicioIso: new Date().toISOString(), fimIso: `${dataExpiracao}T23:59:00-03:00`, escopo: role?.nome ?? roleId } : undefined,
    })
    setInvited({ nome: novoUsuario.nome, email: novoUsuario.email, validoAte: `${dataExpiracao}T23:59:00-03:00` })
  }

  if (invited) {
    return (
      <div className="flex flex-col gap-6">
        <AdminBreadcrumb trail={[{ label: 'Usuários', path: '/configuracoes/usuarios' }, { label: 'Novo usuário' }]} />
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-soft text-success">
            <Check className="h-5 w-5" strokeWidth={1.7} />
          </div>
          <h2 className="text-section-title">Convite enviado</h2>
          <p className="max-w-md text-support text-ink-secondary">
            {invited.nome} foi cadastrado(a) e um convite simulado foi enviado para {invited.email}, válido até {formatDateFull(invited.validoAte)}.
          </p>
          <div className="flex items-center gap-2 rounded-md border border-border bg-surface-subtle px-3 py-2 text-caption text-ink-tertiary">
            <span>https://app.cortexhost.com.br/convite/{invited.email.split('@')[0]}-••••••</span>
            <Copy className="h-3.5 w-3.5" strokeWidth={1.7} />
          </div>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setInvited(null)}>
              Cadastrar outro usuário
            </Button>
            <Button size="sm" variant="navy" onClick={() => navigate('/configuracoes/usuarios')}>
              Ver usuários
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Usuários', path: '/configuracoes/usuarios' }, { label: 'Novo usuário' }]} />

      <PageHeader eyebrow="Administração" title="Adicionar usuário" description="Fluxo guiado — identificação, escopo, perfil, segurança, notificações e revisão." />

      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-border" role="tablist">
        {steps.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={i === step}
            onClick={() => i < step && setStep(i)}
            className={cn(
              'relative shrink-0 whitespace-nowrap px-3.5 py-2.5 text-support font-medium transition-colors',
              i === step ? 'text-ink-primary' : i < step ? 'text-ink-secondary hover:text-ink-primary' : 'text-ink-tertiary',
            )}
          >
            {i + 1}. {label}
            {i === step && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent" />}
          </button>
        ))}
      </div>

      {step === 0 && (
        <section>
          <SectionHeader title="Identificação" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" />
            <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@salvadorbrewing.com.br" />
            <Input label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(71) 90000-0000" />
            <Input label="Cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Ex.: Estoquista" />
            <Input label="Área" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ex.: Estoque seco" />
            <Input label="Responsável" value={responsavel} onChange={(e) => setResponsavel(e.target.value)} />
          </div>
        </section>
      )}

      {step === 1 && (
        <section>
          <SectionHeader title="Escopo" description="Organização Salvador Brewing Co. · Marca Salvador" />
          <p className="mb-2 text-label text-ink-secondary">Unidades</p>
          <div className="flex flex-wrap gap-2">
            {units.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => toggleUnidade(u.id)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-caption font-medium transition-colors',
                  unidades.includes(u.id) ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-surface text-ink-secondary hover:border-border-strong',
                )}
              >
                {u.nomeCurto}
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section>
          <SectionHeader title="Perfil" description="Perfil recomendado, permissões e alçadas herdadas" />
          <Select label="Perfil" value={roleId} onChange={(e) => setRoleId(e.target.value)} options={roles.map((r) => ({ value: r.id, label: r.nome }))} className="max-w-sm" />
          {role && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-label text-ink-tertiary">Pode</p>
                <ul className="flex flex-col gap-1 text-support text-ink-secondary">
                  {role.podeLista.map((p) => (
                    <li key={p}>· {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-1 text-label text-ink-tertiary">Não pode</p>
                <ul className="flex flex-col gap-1 text-support text-ink-secondary">
                  {role.naoPodeLista.length === 0 ? <li>—</li> : role.naoPodeLista.map((p) => <li key={p}>· {p}</li>)}
                </ul>
              </div>
            </div>
          )}
        </section>
      )}

      {step === 3 && (
        <section>
          <SectionHeader title="Segurança" />
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-support text-ink-primary">
              <input type="checkbox" checked={doisFatores} onChange={(e) => setDoisFatores(e.target.checked)} />
              Exigir autenticação em dois fatores
            </label>
            <label className="flex items-center gap-2 text-support text-ink-primary">
              <input type="checkbox" checked={temporario} onChange={(e) => setTemporario(e.target.checked)} />
              Acesso temporário
            </label>
            {temporario && <Input label="Data de expiração" type="date" value={dataExpiracao} onChange={(e) => setDataExpiracao(e.target.value)} className="max-w-xs" />}
          </div>
        </section>
      )}

      {step === 4 && (
        <section>
          <SectionHeader title="Notificações" />
          <p className="mb-2 text-label text-ink-secondary">Canais</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { id: 'sistema', label: 'Dentro do sistema' },
              { id: 'email', label: 'E-mail' },
              { id: 'push', label: 'Push' },
              { id: 'resumo_diario', label: 'Resumo diário' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCanal(c.id)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-caption font-medium transition-colors',
                  canaisSelecionados.includes(c.id) ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-surface text-ink-secondary hover:border-border-strong',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <Select label="Categoria de referência" value={categoriaNotif} onChange={(e) => setCategoriaNotif(e.target.value)} options={notificationCategories.map((c) => ({ value: c, label: c }))} className="max-w-sm" />
        </section>
      )}

      {step === 5 && (
        <section>
          <SectionHeader title="Revisão" />
          <DataList
            items={[
              { label: 'Nome', value: nome || '—' },
              { label: 'E-mail', value: email || '—' },
              { label: 'Cargo', value: cargo || '—' },
              { label: 'Perfil', value: role?.nome ?? '—' },
              { label: 'Unidades', value: unidades.map((id) => units.find((u) => u.id === id)?.nomeCurto ?? id).join(', ') || '—' },
              { label: 'Autenticação em dois fatores', value: doisFatores ? 'Exigida' : 'Não exigida' },
              { label: 'Acesso temporário', value: temporario ? `Até ${formatDateFull(`${dataExpiracao}T23:59:00-03:00`)}` : 'Não' },
              { label: 'Aprovador', value: 'Leo' },
            ]}
          />
          {conflicts.length > 0 && (
            <div className="mt-4 rounded-md bg-warning-soft p-3">
              <p className="text-support font-medium text-warning">Riscos do perfil selecionado</p>
              <ul className="mt-1 flex flex-col gap-1 text-caption text-ink-secondary">
                {conflicts.map((c) => (
                  <li key={c.id}>· {c.titulo}</li>
                ))}
              </ul>
            </div>
          )}
          {role?.critico && (
            <div className="mt-3">
              <IndicatorBadge status="attention">Perfil com permissões críticas — revisão trimestral obrigatória</IndicatorBadge>
            </div>
          )}
        </section>
      )}

      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button variant="ghost" onClick={() => (step === 0 ? navigate('/configuracoes/usuarios') : setStep((s) => s - 1))}>
          {step === 0 ? 'Cancelar' : 'Voltar'}
        </Button>
        {step < steps.length - 1 ? (
          <Button variant="navy" disabled={!podeAvancar} onClick={() => setStep((s) => s + 1)}>
            Avançar
          </Button>
        ) : (
          <Button variant="primary" onClick={handleEnviarConvite}>
            Enviar convite
          </Button>
        )}
      </div>
    </div>
  )
}
