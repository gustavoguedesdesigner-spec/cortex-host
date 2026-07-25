import type { SecurityEvent, UserSession } from '@/types'

/** Configurações de segurança demonstrativas (seções 66-71) — nenhuma credencial real. */
export const securityConfig = {
  autenticacaoDoisFatoresObrigatoria: 'Obrigatória para perfis críticos (Administrador, Diretor, Financeiro)',
  politicaSenha: {
    tamanhoMinimo: 10,
    complexidade: 'Letras maiúsculas, minúsculas, números e símbolo',
    bloqueioAposTentativas: 5,
    historicoSenhas: 5,
    redefinicao: 'A cada 180 dias para perfis críticos',
    expiracaoOpcional: true,
  },
  duracaoSessao: '12 horas de inatividade',
  dispositivosPermitidos: 'Até 3 dispositivos por usuário',
  dominiosPermitidos: ['salvadorbrewing.com.br'],
  exportacao: 'Exige justificativa e gera evento de auditoria',
  loginSuspeito: 'Bloqueio automático + notificação ao Administrador Corporativo',
  revisaoAcessos: 'Trimestral, obrigatória para perfis críticos',
}

export const twoFactorStats = {
  usuariosAtivos: 61,
  comDoisFatores: 46,
  pendentes: 15,
  administradoresProtegidos: 1,
  administradoresTotal: 1,
}

export const sessions: UserSession[] = [
  { id: 'sessao-leo-1', dispositivo: 'MacBook Pro', navegador: 'Chrome 126', localizacaoAproximada: 'Salvador, BA', ultimoAcessoIso: '2026-07-25T14:32:00-03:00', status: 'ativa' },
  { id: 'sessao-leo-2', dispositivo: 'iPhone 15', navegador: 'Safari Mobile', localizacaoAproximada: 'Salvador, BA', ultimoAcessoIso: '2026-07-25T08:10:00-03:00', status: 'ativa' },
  { id: 'sessao-mariana-1', dispositivo: 'Windows 11', navegador: 'Edge 125', localizacaoAproximada: 'Salvador, BA', ultimoAcessoIso: '2026-07-25T09:30:00-03:00', status: 'ativa' },
  { id: 'sessao-carlos-1', dispositivo: 'Windows 11', navegador: 'Chrome 126', localizacaoAproximada: 'Salvador, BA', ultimoAcessoIso: '2026-07-24T16:00:00-03:00', status: 'ativa' },
]

export const securityEvents: SecurityEvent[] = [
  { id: 'sec-evt-1', tipo: 'Múltiplas tentativas de login', usuario: 'Henrique Dias', dataIso: '2026-07-19T22:05:00-03:00', detalhe: 'Cinco tentativas malsucedidas em sequência — conta bloqueada automaticamente.' },
  { id: 'sec-evt-2', tipo: 'Acesso de novo dispositivo', usuario: 'Mariana Costa', dataIso: '2026-07-22T08:15:00-03:00', detalhe: 'Login a partir de um dispositivo não reconhecido — confirmado pelo usuário.' },
  { id: 'sec-evt-3', tipo: 'Alteração de permissão', usuario: 'Leo', dataIso: '2026-07-20T11:00:00-03:00', detalhe: 'Concedida exceção de visualização de margens consolidadas a Mariana Costa.' },
  { id: 'sec-evt-4', tipo: 'Integração desconectada', usuario: 'Sistema', dataIso: '2026-07-24T19:40:00-03:00', detalhe: 'Estoque legado — Caxias Norte sem sincronizar.' },
]

export const securityScore = {
  indice: 88,
  maximo: 100,
  pontosDeAtencao: ['15 usuários sem autenticação em dois fatores', 'Quatro acessos temporários ativos', 'Sete acessos aguardando revisão'],
}
