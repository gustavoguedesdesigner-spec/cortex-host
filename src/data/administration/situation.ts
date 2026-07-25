/**
 * Situação consolidada de Administração (seção 7) — mesmo padrão de constantes
 * de referência usado em recipeSituation/cmvNetworkPeriod: números fixos e
 * coerentes em toda a aplicação, não recalculados a partir da amostra parcial
 * de usuários/permissões/eventos representada nos demais arquivos deste módulo.
 */
export const administrationSituation = {
  usuariosCadastrados: 74,
  usuariosAtivos: 61,
  convitesPendentes: 8,
  usuariosInativos: 5,
  perfis: 9,
  permissoesConfiguradas: 146,
  permissoesCriticas: 12,
  acessosParaRevisar: 7,
  acessosTemporarios: 4,
  integracoesAtivas: 3,
  integracoesAtencao: 2,
  eventosAuditoriaPeriodo: 428,
  acoesAdministrativasCriticas: 6,
  conformidadeAcessos: 0.92,
  metaConformidade: 0.98,
}

export const administrativeHealth = {
  indice: 86,
  maximo: 100,
  classificacao: 'Boa, com pontos de atenção',
  componentes: [
    { label: 'Conformidade de acessos', valor: 0.92 },
    { label: 'Segurança', valor: 0.88 },
    { label: 'Integrações', valor: 0.8 },
    { label: 'Qualidade das configurações', valor: 0.91 },
    { label: 'Revisão de usuários', valor: 0.83 },
    { label: 'Auditoria', valor: 0.95 },
    { label: 'Políticas vigentes', valor: 0.78 },
  ],
}

export const administrationLastUpdate = '2026-07-25T08:10:00-03:00'

export const administrationExecutiveSummaryText =
  'A organização possui 74 usuários cadastrados, sendo 61 ativos. Sete acessos precisam de revisão e quatro usuários possuem permissões temporárias próximas do vencimento. Duas integrações exigem atenção. A conformidade geral de acessos está em 92%, abaixo da meta de 98%.'

export const administrationExecutiveRecommendations: string[] = [
  'Revisar os sete acessos sinalizados',
  'Remover permissões temporárias vencidas',
  'Validar perfis com acesso financeiro',
  'Revisar a integração de estoque de Caxias Norte',
  'Concluir a revisão trimestral de permissões',
]
