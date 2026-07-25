import type { NotificationRule } from '@/types'

/** Canais e categorias (seções 54-55). WhatsApp e e-mail apenas como canais futuros — sem envio real. */
export const notificationChannels = [
  { id: 'sistema', label: 'Dentro do sistema', disponivel: true },
  { id: 'email', label: 'E-mail', disponivel: true },
  { id: 'push', label: 'Push', disponivel: true },
  { id: 'whatsapp', label: 'WhatsApp', disponivel: false },
  { id: 'resumo_diario', label: 'Resumo diário', disponivel: true },
  { id: 'resumo_semanal', label: 'Resumo semanal', disponivel: true },
]

export const notificationCategories = [
  'CMV',
  'Estoque',
  'Inventários',
  'Compras',
  'Aprovações',
  'Recebimentos',
  'Fornecedores',
  'Fichas Técnicas',
  'Treinamentos',
  'Checklists',
  'Não conformidades',
  'Segurança',
  'Administração',
  'Integrações',
]

export const notificationRules: NotificationRule[] = [
  { id: 'notif-aprovacao-pendente', evento: 'Aprovação pendente há mais de 24h', categoria: 'Aprovações', criticidade: 'alta', canal: 'Dentro do sistema + e-mail', frequencia: 'Imediata', escalonamento: 'Gestor Regional após 48h' },
  { id: 'notif-cmv-acima-meta', evento: 'CMV real acima da meta', categoria: 'CMV', criticidade: 'media', canal: 'Resumo diário', frequencia: 'Diária' },
  { id: 'notif-inventario-pendente', evento: 'Inventário pendente de fechamento', categoria: 'Inventários', criticidade: 'media', canal: 'Dentro do sistema', frequencia: 'Imediata' },
  { id: 'notif-divergencia-recebimento', evento: 'Divergência de recebimento acima da tolerância', categoria: 'Recebimentos', criticidade: 'alta', canal: 'Dentro do sistema + push', frequencia: 'Imediata' },
  { id: 'notif-integracao-atencao', evento: 'Integração sem sincronizar há mais de 12h', categoria: 'Integrações', criticidade: 'alta', canal: 'Dentro do sistema + e-mail', frequencia: 'Imediata', perfil: 'Administrador Corporativo' },
  { id: 'notif-acesso-temporario-vencendo', evento: 'Acesso temporário vence em até 3 dias', categoria: 'Segurança', criticidade: 'media', canal: 'Dentro do sistema + e-mail', frequencia: 'Imediata', perfil: 'Administrador Corporativo' },
  { id: 'notif-treinamento-atrasado', evento: 'Treinamento obrigatório atrasado', categoria: 'Treinamentos', criticidade: 'baixa', canal: 'Resumo semanal', frequencia: 'Semanal' },
  { id: 'notif-checklist-nao-executado', evento: 'Checklist não executado no horário previsto', categoria: 'Checklists', criticidade: 'media', canal: 'Dentro do sistema', frequencia: 'Imediata' },
]

/** Preferências de exemplo do usuário Leo (seção 57). */
export const userNotificationPreferences = {
  userId: 'leo',
  imediatas: true,
  resumoDiario: true,
  resumoSemanal: false,
  categoriasSilenciadas: [] as string[],
  horarioSilencio: '22h às 7h',
  criticidadeMinima: 'media' as const,
}

/** Insight de fadiga de alertas (seção 58). */
export const alertFatigueInsight = {
  perfil: 'Gerente de Unidade',
  mediaNotificacoesPorDia: 42,
  baixaPrioridade: 16,
  recomendacao: 'Consolidar as dezesseis notificações de baixa prioridade em um resumo diário único.',
}

export function getNotificationRulesByCategory(categoria: string): NotificationRule[] {
  return notificationRules.filter((r) => r.categoria === categoria)
}
