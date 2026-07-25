import type { CmvQuickAnswer } from '@/types'

/** Perguntas rápidas do módulo de Administração (seção 88-89) — respostas simuladas, texto fixo. */
export const adminQuickQuestions: CmvQuickAnswer[] = [
  {
    pergunta: 'Quem possui acesso financeiro?',
    resposta:
      'Doze usuários possuem acesso a valores financeiros. Três visualizam dados consolidados da rede e nove estão restritos às próprias unidades.\n\nMariana Costa possui acesso consolidado acima do padrão esperado para o perfil Gerente de Unidade.',
    links: [{ label: 'Abrir Mariana Costa', path: '/configuracoes/usuarios/mariana-costa' }, { label: 'Ver usuários', path: '/configuracoes/usuarios' }],
  },
  {
    pergunta: 'Quais acessos precisam ser revisados?',
    resposta: 'Sete acessos estão sinalizados para revisão, incluindo permissões financeiras acima do perfil, exceções de aprovação de compras e contas sem uso há mais de 60 dias.',
    links: [{ label: 'Ver usuários aguardando revisão', path: '/configuracoes/usuarios?status=aguardando_revisao' }],
  },
  {
    pergunta: 'Existe conflito de permissões?',
    resposta:
      'Existem três conflitos potenciais:\n\n1. dois usuários podem criar e aprovar a própria compra;\n2. um gerente pode reabrir o próprio inventário;\n3. um editor de fichas também possui permissão de publicação.\n\nRecomendo revisar esses acessos antes do próximo fechamento.',
    links: [{ label: 'Ver permissões e conflitos', path: '/configuracoes/permissoes' }],
  },
  {
    pergunta: 'Quem pode aprovar esta compra?',
    resposta: 'Para uma compra de R$ 12.640, a alçada exige aprovação do Diretor de Operações. Se a compra for emergencial, um segundo aprovador também será necessário.',
    links: [{ label: 'Ver alçadas de compras', path: '/configuracoes/alcadas' }],
  },
  {
    pergunta: 'Quem pode reabrir inventários?',
    resposta: 'Apenas o perfil Administrador Corporativo pode reabrir inventários fechados, e a ação sempre exige uma segunda aprovação registrada em auditoria.',
    links: [{ label: 'Ver alçadas de estoque', path: '/configuracoes/alcadas' }],
  },
  {
    pergunta: 'Quais usuários estão inativos?',
    resposta: 'Cinco usuários estão sem acesso há mais de 60 dias. Antonio Ramos e Cristina Alves estão na amostra detalhada — ambos aguardando revisão.',
    links: [{ label: 'Ver usuários inativos', path: '/configuracoes/usuarios?status=inativo' }],
  },
  {
    pergunta: 'Quais integrações estão com erro?',
    resposta:
      'Duas integrações exigem atenção. A integração de estoque de Caxias Norte não sincroniza há 19 horas. A importação financeira apresentou 14 registros rejeitados no último processamento.',
    links: [{ label: 'Ver integrações', path: '/configuracoes/integracoes' }],
  },
  {
    pergunta: 'Quem alterou esta configuração?',
    resposta: 'A tolerância de inventário foi alterada de 5% para 3% por Leo, em 23 de julho de 2026, às 17h14. A alteração entrou em vigor imediatamente.',
    links: [{ label: 'Ver auditoria', path: '/configuracoes/auditoria' }],
  },
  {
    pergunta: 'Quais ações críticas ocorreram hoje?',
    resposta: 'Seis ações administrativas críticas foram registradas no período, incluindo a reabertura do inventário de Moinhos e a concessão de acesso financeiro a Mariana Costa.',
    links: [{ label: 'Ver auditoria', path: '/configuracoes/auditoria' }],
  },
  {
    pergunta: 'Quais usuários não possuem 2FA?',
    resposta: 'Quinze usuários ativos ainda não possuem autenticação em dois fatores. Nenhum deles possui perfil de Administrador Corporativo, mas três possuem acesso a aprovações de compras.',
    links: [{ label: 'Ver segurança', path: '/configuracoes/seguranca' }],
  },
  {
    pergunta: 'O perfil de gerente está adequado?',
    resposta:
      'O perfil Gerente de Unidade está majoritariamente adequado ao princípio de privilégio mínimo, mas dois usuários — Mariana Costa e o próprio conflito de reabertura de inventário — precisam de ajuste.',
    links: [{ label: 'Abrir perfil Gerente de Unidade', path: '/configuracoes/perfis/gerente-unidade' }],
  },
  {
    pergunta: 'Qual política rege esta ação?',
    resposta: 'Reaberturas de inventário são regidas pela Política de estoque (versão 1.3) e pela Política de auditoria (versão 1.2), que exigem aprovação corporativa e registro completo do evento.',
    links: [{ label: 'Ver políticas', path: '/configuracoes/politicas' }],
  },
]

export function findAdminQuickAnswer(question: string): CmvQuickAnswer | undefined {
  return adminQuickQuestions.find((q) => q.pergunta.trim().toLowerCase() === question.trim().toLowerCase())
}
