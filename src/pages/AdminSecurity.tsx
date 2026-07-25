import { AdminBreadcrumb } from '@/components/administration/AdminBreadcrumb'
import { AdminInternalNav } from '@/components/administration/AdminInternalNav'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { DataList } from '@/components/ui/DataList'
import { IndicatorBadge } from '@/components/ui/StatusBadge'
import { classifyScore, twoFactorCoverage } from '@/utils/securityScore'
import { securityConfig, securityEvents, securityScore, sessions, twoFactorStats } from '@/data/administration/securitySettings'
import { formatDateFull, formatPercent } from '@/utils/format'

export default function AdminSecurity() {
  const coverage = twoFactorCoverage(twoFactorStats.comDoisFatores, twoFactorStats.usuariosAtivos)
  const classification = classifyScore(securityScore.indice)

  return (
    <div className="flex flex-col gap-6">
      <AdminBreadcrumb trail={[{ label: 'Segurança' }]} />

      <PageHeader eyebrow="Administração" title="Segurança" description="Autenticação, política de senha, sessões e eventos de segurança." />

      <AdminInternalNav active="seguranca" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-4">
          <SectionHeader title="Índice de segurança" />
          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-baseline gap-2">
              <span className="text-metric tabular text-ink-primary">{securityScore.indice}</span>
              <span className="text-support text-ink-tertiary">de {securityScore.maximo}</span>
            </div>
            <IndicatorBadge status={classification.status} className="mt-2">
              {classification.label}
            </IndicatorBadge>
            <p className="mt-3 text-caption text-ink-tertiary">Indicador demonstrativo composto por controles administrativos configuráveis.</p>
            <ul className="mt-3 flex flex-col gap-1 text-caption text-ink-secondary">
              {securityScore.pontosDeAtencao.map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="xl:col-span-8">
          <SectionHeader title="Autenticação em dois fatores" />
          <DataList
            items={[
              { label: 'Usuários ativos', value: twoFactorStats.usuariosAtivos },
              { label: 'Com autenticação em dois fatores', value: twoFactorStats.comDoisFatores },
              { label: 'Pendentes', value: twoFactorStats.pendentes },
              { label: 'Cobertura', value: formatPercent(coverage, 0) },
              { label: 'Administradores protegidos', value: `${twoFactorStats.administradoresProtegidos} de ${twoFactorStats.administradoresTotal} (${formatPercent(1, 0)})` },
              { label: 'Obrigatoriedade', value: securityConfig.autenticacaoDoisFatoresObrigatoria },
            ]}
          />
        </section>
      </div>

      <section>
        <SectionHeader title="Política de senha" />
        <DataList
          items={[
            { label: 'Tamanho mínimo', value: `${securityConfig.politicaSenha.tamanhoMinimo} caracteres` },
            { label: 'Complexidade', value: securityConfig.politicaSenha.complexidade },
            { label: 'Bloqueio após tentativas', value: securityConfig.politicaSenha.bloqueioAposTentativas },
            { label: 'Histórico de senhas', value: securityConfig.politicaSenha.historicoSenhas },
            { label: 'Redefinição', value: securityConfig.politicaSenha.redefinicao },
            { label: 'Duração de sessão', value: securityConfig.duracaoSessao },
            { label: 'Dispositivos permitidos', value: securityConfig.dispositivosPermitidos },
            { label: 'Domínios permitidos', value: securityConfig.dominiosPermitidos.join(', ') },
            { label: 'Login suspeito', value: securityConfig.loginSuspeito },
            { label: 'Revisão de acessos', value: securityConfig.revisaoAcessos },
          ]}
        />
      </section>

      <section>
        <SectionHeader title="Sessões" description="Amostra demonstrativa — não utiliza localização precisa" />
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-support font-medium text-ink-primary">
                  {s.dispositivo} · {s.navegador}
                </p>
                <p className="text-caption text-ink-tertiary">
                  {s.localizacaoAproximada} · {formatDateFull(s.ultimoAcessoIso)}
                </p>
              </div>
              <IndicatorBadge status={s.status === 'ativa' ? 'success' : 'neutral'}>{s.status === 'ativa' ? 'Ativa' : 'Encerrada'}</IndicatorBadge>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Eventos de segurança" />
        <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
          {securityEvents.map((e) => (
            <div key={e.id} className="flex flex-col gap-1 px-4 py-3">
              <p className="text-support font-medium text-ink-primary">{e.tipo}</p>
              <p className="text-caption text-ink-tertiary">
                {e.usuario} · {formatDateFull(e.dataIso)}
              </p>
              <p className="text-caption text-ink-secondary">{e.detalhe}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
