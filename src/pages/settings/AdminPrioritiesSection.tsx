import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { IndicatorBadge } from '@/components/ui/StatusBadge'

interface PriorityCase {
  id: string
  titulo: string
  linhas: { label: string; value: string }[]
  situacao: string
  recomendacao?: string
  severidade: 'critical' | 'attention'
  acoes: { label: string; onClick: () => void; variant?: 'navy' | 'secondary' | 'ghost' }[]
}

/** Prioridades administrativas (seção 14) — quatro casos demonstrativos com ações próprias, não uma lista genérica. */
export function AdminPrioritiesSection() {
  const navigate = useNavigate()

  const cases: PriorityCase[] = [
    {
      id: 'mariana-financeiro',
      titulo: 'Acesso financeiro acima do necessário',
      linhas: [
        { label: 'Usuário', value: 'Mariana Costa' },
        { label: 'Perfil', value: 'Gerente de Unidade' },
      ],
      situacao: 'Possui permissão para visualizar margens consolidadas da rede.',
      recomendacao: 'Restringir à própria unidade.',
      severidade: 'critical',
      acoes: [
        { label: 'Revisar acesso', onClick: () => navigate('/configuracoes/usuarios/mariana-costa'), variant: 'navy' },
        { label: 'Manter com justificativa', onClick: () => navigate('/configuracoes/usuarios/mariana-costa'), variant: 'secondary' },
        { label: 'Ver histórico', onClick: () => navigate('/configuracoes/auditoria?usuario=Mariana+Costa'), variant: 'ghost' },
      ],
    },
    {
      id: 'carlos-temporario',
      titulo: 'Acesso temporário próximo do vencimento',
      linhas: [
        { label: 'Usuário', value: 'Carlos Mendes' },
        { label: 'Função', value: 'Consultor de implantação' },
        { label: 'Vencimento', value: 'Em dois dias' },
      ],
      situacao: 'Acesso temporário a compras em Moinhos vence em 27/07/2026.',
      severidade: 'attention',
      acoes: [
        { label: 'Encerrar', onClick: () => navigate('/configuracoes/usuarios/carlos-mendes'), variant: 'secondary' },
        { label: 'Prorrogar', onClick: () => navigate('/configuracoes/usuarios/carlos-mendes'), variant: 'navy' },
        { label: 'Revisar permissões', onClick: () => navigate('/configuracoes/usuarios/carlos-mendes'), variant: 'ghost' },
      ],
    },
    {
      id: 'integracao-caxias-norte',
      titulo: 'Integração de estoque desatualizada',
      linhas: [
        { label: 'Unidade', value: 'Caxias Norte' },
        { label: 'Última sincronização', value: 'Há 19 horas' },
      ],
      situacao: 'Redução da confiança nas análises de estoque e CMV.',
      severidade: 'critical',
      acoes: [
        { label: 'Abrir integração', onClick: () => navigate('/configuracoes/integracoes/estoque-legado'), variant: 'navy' },
        { label: 'Tentar atualizar', onClick: () => navigate('/configuracoes/integracoes/estoque-legado'), variant: 'secondary' },
        { label: 'Criar ocorrência', onClick: () => navigate('/estoque/unidades/caxias-norte'), variant: 'ghost' },
      ],
    },
    {
      id: 'perfil-critico',
      titulo: 'Perfil com permissões críticas',
      linhas: [{ label: 'Perfil', value: 'Gerente de Unidade' }],
      situacao: 'Possui permissão condicionada para reabrir inventários fechados.',
      recomendacao: 'Exigir aprovação corporativa.',
      severidade: 'attention',
      acoes: [{ label: 'Abrir perfil', onClick: () => navigate('/configuracoes/perfis/gerente-unidade'), variant: 'navy' }],
    },
  ]

  return (
    <section>
      <SectionHeader title="Exigem atenção" description="Casos administrativos que precisam de decisão" />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {cases.map((c) => (
          <div key={c.id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-support font-medium text-ink-primary">{c.titulo}</p>
              <IndicatorBadge status={c.severidade}>{c.severidade === 'critical' ? 'Crítico' : 'Atenção'}</IndicatorBadge>
            </div>
            <dl className="flex flex-col gap-1">
              {c.linhas.map((l) => (
                <div key={l.label} className="flex items-center justify-between text-caption">
                  <dt className="text-ink-tertiary">{l.label}</dt>
                  <dd className="font-medium text-ink-primary">{l.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-support text-ink-secondary">{c.situacao}</p>
            {c.recomendacao && <p className="text-caption text-ink-tertiary">Recomendação: {c.recomendacao}</p>}
            <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-3">
              {c.acoes.map((a) => (
                <Button key={a.label} size="sm" variant={a.variant ?? 'secondary'} onClick={a.onClick}>
                  {a.label}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
